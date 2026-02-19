import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Info } from 'lucide-react';
import { Copy } from 'lucide-react';
import { FileCode2 } from 'lucide-react';
import { Check } from 'lucide-react';
import { ExternalLink } from 'lucide-react';


const Table = ({history,chainId}) => {
  const [page, setPage] = useState(1);
  const PAGES_SIZE = 5;
  const totalPages = Math.ceil(history.length/PAGES_SIZE);
  const start = (page-1)*PAGES_SIZE;
  const end = start+PAGES_SIZE;
  const currentHistory = history.slice(start,end);

  const getExplorerUrl = (hash) => {
    if (chainId === "11155111") return `https://sepolia.etherscan.io/tx/${hash}`;
    if (chainId === "1") return `https://etherscan.io/tx/${hash}`;
    return null;
  };

  return (
     <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-4 py-2">Type & Block</th>
            <th className="px-4 py-2">Fee & Gas Paid</th>
            <th className="px-4 py-2">Transaction Hash</th>
            <th className="px-4 py-2">From</th>
            <th className="px-4 py-2">To</th>
            <th className="px-4 py-2">Gas Details</th>
            <th className="px-4 py-2 text-right">Status</th>
            </tr>
        </thead>
        <tbody className="text-sm">
          {currentHistory.length > 0 ? currentHistory.map((tx, idx) => {
            return (
            <tr key={idx} className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg">
                <td className="px-4 py-4 rounded-l-xl align-text-top">
                    <div className="flex flex-col gap-1">
                        <span className={cn("font-bold text-xs uppercase w-max px-2 py-0.5 rounded-md", 
                          tx.type === "Sent" ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
                          )}>{tx.type}</span>
                        <div className="flex flex-col mt-1">
                            <span className="text-[11px] text-gray-400 gap-1">
                                Block <span className="text-purple-400">#{tx.blockNumber}</span>
                                <span className="text-gray-600 mx-1">|</span> 
                                <CopyableHash fullText={tx.blockHash} isBlock={true} />
                            </span>
                            <span className="text-[10px] text-gray-500">{tx.blocksAhead || '0'} Confirmations</span>
                        </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                    <div className="flex flex-col">
                        <span className="text-white font-mono">Fee: {tx.fee} ETH</span>
                        <span className="text-[10px] text-purple-400">Gas Price: {tx.gasPrice} ETH</span>
                    </div>
                </td>
                <td className="px-4 py-4">
                    <div className='flex flex-col gap-1'>
                        <CopyableHash fullText={tx.transactionHash} />
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Info size={10} className='text-white/45'/> Nonce: {tx.nonce}
                        </span>
                    </div>
                </td>
                <td className="px-4 py-4">
                    <span className="text-gray-400 font-mono text-xs">
                       <CopyableHash fullText={tx.from} />
                    </span>
                </td>
                <td className="px-4 py-4">
                    <span className="text-gray-400 font-mono text-xs">
                       {tx.to ? 
                           <CopyableHash fullText={tx.to} />:
                           <div 
                                className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md w-max border border-purple-500/20" 
                                title="Smart Contract Creation"
                            >
                                <FileCode2 size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Contract Created</span>
                            </div>
                       }
                    </span>
                </td>
                <td className="px-4 py-4">
                    <div className="flex flex-col">
                        <span className="text-white font-mono">Gas Limit: {tx.gasLimit} </span>
                        <span className="text-[10px] text-purple-400">Gas Price: {tx.gasPrice} Gwei</span>
                    </div>
                </td>
                <td className="px-4 py-4 text-right rounded-r-xl">
                  <div className='flex gap-2'>
                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                        tx.status === "Success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      )}>
                    { tx.status}
                    </span>
                    {getExplorerUrl(tx.transactionHash) ? (
                        <a 
                            href={getExplorerUrl(tx.transactionHash)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-purple-400 transition-colors p-1"
                            title="View on Etherscan"
                        >
                            <ExternalLink size={16} />
                        </a>
                    ) : (
                        <div className="w-5"></div> 
                    )}
                  </div>
                </td>
            </tr>)
            }) :
            (
            <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500 italic">
                  No transactions found on this account.
                </td>
            </tr>
            )}
        </tbody>
        </table>
        {history.length > PAGES_SIZE && (
            <div className="flex items-center justify-between mt-4 px-2">
                <span className="text-xs text-gray-400"> Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className='cursor-pointer'
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    > Previous
                    </Button>

                    <Button variant="outline"
                        size="sm"
                        className='cursor-pointer'
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </Button>
                </div>
            </div>
            )}
    </div>
  )
}

export default Table

const CopyableHash = ({ fullText, isBlock = false }) => {
  const [copied, setCopied] = useState(false);

  if (!fullText) return <span className="text-gray-400 font-mono text-xs">null</span>;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="relative group inline-flex items-center cursor-pointer" 
      onClick={handleCopy}
    >
      <span className="text-gray-400 font-mono text-xs hover:text-purple-300 transition-colors">
        {isBlock ? "Block Hash" : `${fullText.slice(0, 5)}...${fullText.slice(-5)}`}
      </span>
      
      {/* The "Real" Tooltip that pops up above */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex items-center gap-2 bg-zinc-900 border border-purple-900/50 text-gray-200 text-xs font-mono px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50">
        {fullText}
        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
        
        {/* Little triangle arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-purple-900/50"></div>
        <div className="absolute top-[calc(100%-1.5px)] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-900"></div>
      </div>
    </div>
  );
};