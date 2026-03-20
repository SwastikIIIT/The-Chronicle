"use client";
import { motion } from "framer-motion";
import { ShieldCheck, ExternalLink, RefreshCw } from "lucide-react";

const steps = [
  { n: "1", label: "Download MetaMask" },
  { n: "2", label: "Create or import your wallet" },
  { n: "3", label: "Return here and refresh the page" },
];

const PromptScreen = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-purple-700/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 h-48 w-48 rounded-full bg-purple-900/15 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-zinc-950/80 border border-purple-900/40 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-purple-950/30">

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: "backOut" }}
            className="flex items-center justify-center mb-6"
          >
            <div className="relative flex items-center justify-center h-24 w-24 rounded-full bg-[#F6851B]/5 border border-[#F6851B]/20 shadow-[0_0_30px_rgba(246,133,27,0.15)]">
              <img 
                src="/metamask3.png" 
                alt="MetaMask Logo" 
                className="w-17 h-17 drop-shadow-md"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-center mb-2"
          >
            <h1 className="text-2xl font-bold text-white tracking-tight">
              MetaMask Required
            </h1>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              The Decentralized Vault uses MetaMask to sign transactions and
              protect your encrypted files on-chain.
            </p>
          </motion.div>

          <div className="border-t border-purple-900/30 my-6" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="flex flex-col gap-3 mb-6"
          >
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.35 }}
                className="flex items-center gap-3"
              >
                <span className="flex-shrink-0 h-7 w-7 rounded-full bg-[#F6851B]/10 border border-[#F6851B]/30 flex items-center justify-center text-[#F6851B] font-mono text-xs font-bold shadow-sm shadow-[#F6851B]/10">{s.n}</span>
                <span className="text-gray-300 text-sm font-medium">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.a
            href="https://metamask.io/download"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.35 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            <ExternalLink size={16} />
            Install MetaMask
          </motion.a>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.35 }}
            className="mt-3"
          >
            <button
              onClick={() => window.location.reload()}
              className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-purple-900/40 text-purple-400 hover:bg-purple-950/40 hover:border-purple-700/50 transition-all text-sm font-medium"
            >
              <RefreshCw size={14} />
              Already installed — Refresh
            </button>
          </motion.div>

        
        </div>
      </motion.div>
    </div>
  );
};

export default PromptScreen;