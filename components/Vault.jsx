"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  ShieldCheck, 
  HardDrive, 
  Plus, 
  Search,
  FileIcon,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Vault = () => {
  const [files, setFiles] = useState([]);


  return (
    <div className="min-h-screen bg-black pb-16">
      <div className="relative z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 h-36 w-96 rounded-full bg-purple-600/40 opacity-70 blur-3xl" />
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto pt-12 px-4 relative z-10"
      >
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-purple-900/30 pb-6 gap-4'>
          <div>
            <h1 className="text-4xl md:text-5xl text-white font-bold">
                Decentralized <span className="text-purple-500">Vault</span>
            </h1>
            <p className="text-gray-400 mt-2">Secure, encrypted, and permanent file storage.</p>
          </div>
          <div className="px-4 py-2 bg-purple-950/30 text-purple-400 rounded-lg border border-purple-500/20 flex items-center gap-3 w-fit">
              <HardDrive size={18} className="animate-pulse" />
              <span className="font-mono text-sm">1.2 GB / 10 GB Used</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Upload Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-zinc-950/50 border-purple-900/40 backdrop-blur-sm shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload size={20} className="text-purple-500" />
                    Store New Asset
                  </CardTitle>
                  <CardDescription>Files are fragmented and encrypted via AES-256</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <label className="group relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="p-4 bg-purple-500/10 rounded-full group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                        <Plus size={32} className="text-purple-500" />
                      </div>
                      <p className="mt-4 text-sm text-zinc-300">
                        <span className="font-semibold text-purple-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-zinc-500 mt-2">Max file size: 100MB per transaction</p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]">
                    Upload to Blockchain
                  </button>
                </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: File List */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
           >
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-50" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search in vault..." 
                    className="bg-white/5 border border-white/25 text-white rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="space-y-4">
                  {/* Sample File Row */}
                  {[1, 2, 3].map((item) => (
                    <div 
                      key={item}
                      className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                          <FileIcon size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">identity_proof_v{item}.pdf</p>
                          <p className="text-xs text-gray-500">Uploaded 2 days ago • 1.4 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="View on IPFS" className="p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white">
                          <ExternalLink size={18} />
                        </button>
                        <button title="Delete" className="p-2 hover:bg-red-500/10 rounded-md text-gray-400 hover:text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default Vault;