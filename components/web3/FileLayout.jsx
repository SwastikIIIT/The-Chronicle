import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Search } from 'lucide-react'
import { FileIcon } from 'lucide-react'
import { ExternalLink } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { calcSize, timeAgo } from '@/lib/utils'
import { ShieldCheck } from 'lucide-react'
import blockchain from '@/services/blockchain'
import { getFileIPFS } from '@/server/web3.api'
import Encryption from '@/services/encryption'


const FileLayout = ({fileMetadata,handleDelete,chainId,account}) => {
  const [filtered,setFiltered]=useState(fileMetadata);

  const handleSearch=(e)=>{
    const input=e.target.value.toLowerCase();
    setFiltered(()=>{
        const filtered=fileMetadata.filter((data)=>
            data.type.toLowerCase().includes(input) || 
            data.name.toLowerCase().includes(input) ||
            data.size.toString().toLowerCase().includes(input)
        )
        return filtered;
     })
  }

  const handleViewFile=async(metaData)=>{
     try {
        console.log("Metadata:",metaData);
        const blockchainData=await blockchain.getFileFromBlockchain(metaData.fileDBId);
        console.log("Blockchain Data:",blockchainData);
        // const files=await blockchain.getFilesFromBlockchain();
        
        if(blockchainData){
            const blob=await getFileIPFS(blockchainData.cid);
            const secretKey=await Encryption.decryptAESKeyWithLit(blockchainData.cipher,blockchainData.digest,chainId,account);
            console.log("Secret Key:",secretKey);
            
            const decryptedBuffer=await Encryption.decryptWithAES(blob,metaData.iv,metaData.authTag,secretKey);
            const decryptedBlob=new Blob([decryptedBuffer],{type: metaData.type || "application/octet-stream"});
            
            const a=document.createElement('a');
            const url=URL.createObjectURL(decryptedBlob);
            document.body.appendChild(a);
            a.href=url;
            a.download=metaData.name || `Decentralized-Vault_${Math.random()*100}`;
            a.click();
            document.body.removeChild(a);
            // window.open(url, '_blank');
            window.URL.revokeObjectURL(url);
        }
     }
     catch(err) {
        console.log("Component Error:", err);
     }
  }

  return (
    <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all h-full">
        <CardHeader className="border-b border-purple-900/30">
            <div className="flex items-center gap-4 mb-3">
                <ShieldCheck size={22} className="text-purple-500" />
                <div>
                    <CardTitle className="text-white mb-1">Your Documents</CardTitle>
                    <CardDescription className="text-gray-400 ">Stored securely via IPFS & Smart Contracts</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="relative mb-4">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-50"
                    size={18}
                />
                <input
                    type="text"
                    onChange={handleSearch}
                    placeholder="Search by type / name / size"
                    className="w-full bg-white/5 border border-white/25 text-white rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50"
                />
            </div>
            <div className="space-y-4">
              {filtered.length>0 ?
               (filtered.map((item,_) => (
                <div
                    key={item.fileDBId}
                    className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all"
                >
                   <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                            <FileIcon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{item.name}</p>
                            <p className="text-xs text-gray-500">
                               Uploaded {timeAgo(item.uploadedAt)=="NaN seconds ago"?'1s ago':timeAgo(item.uploadedAt)} • {calcSize([item])}
                            </p>
                        </div>
                   </div>
                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            title="View on Browser"
                            onClick={async()=>await handleViewFile(item)}
                            className="cursor-pointer p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white"
                        >
                            <ExternalLink size={18} />
                        </button>
                        <button
                            onClick={()=>handleDelete(item)}
                            title="Delete"
                            className="cursor-pointer p-2 hover:bg-red-500/10 rounded-md text-gray-400 hover:text-red-500"
                        >
                            <Trash2 size={18} />
                        </button>
                   </div>
                </div>
                ))):
                <>
                    <div className="h-[300px] flex flex-col items-center justify-center text-center border border-dashed border-purple-900/40 rounded-xl ">
                        <FileIcon size={40} className="text-purple-500 mb-3 opacity-70" />
                        <p className="text-sm text-gray-400">No files uploaded yet</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Upload your first document to the vault
                        </p>
                    </div> 
                </>
              }
            </div>
        </CardContent>
    </Card>
  )
}

export default FileLayout