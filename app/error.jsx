"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-black overflow-hidden">
      <div className="absolute h-64 w-64 rounded-full bg-purple-600/10 blur-[120px]" />
      
      <div className="relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-bold text-white tracking-tighter"
        >
          500
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-purple-500 font-mono text-sm tracking-[0.3em] uppercase mt-2"
        >
          SOMETHING WENT WRONG
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Link 
            href="/" 
            className="text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-widest border-b border-zinc-800 pb-1"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}