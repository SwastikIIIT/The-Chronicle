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

  // Animation variants (Dashboard reference)
  const containerVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-10 text-white">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVars}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Decentralized Vault
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-purple-500" />
              Securely store your documents on the blockchain
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gray-900/50 p-1 rounded-lg border border-white/5">
             <div className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-md border border-purple-500/30 flex items-center gap-2">
                <HardDrive size={18} />
                <span>1.2 GB Used</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload size={20} className="text-purple-500" />
                  Upload Document
                </CardTitle>
                <CardDescription>Files will be encrypted before storage</CardDescription>
              </CardHeader>
              <CardContent>
                <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-4 bg-purple-500/10 rounded-full group-hover:scale-110 transition-transform">
                      <Plus size={32} className="text-purple-500" />
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      <span className="font-semibold text-white">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG (Max 10MB)</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
                <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20">
                  Upload to Blockchain
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: File List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Your Documents</CardTitle>
                  <CardDescription>Stored securely via IPFS & Smart Contracts</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search vault..." 
                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </CardHeader>
              <CardContent>
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
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Vault;