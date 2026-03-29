"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Key, Network, Boxes, Fingerprint, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const featuresList = [
  {
    icon: Network,
    code: "MOD-01",
    title: "Decentralized IPFS Vault",
    description:
      "Ensures highly available and tamper-resistant file hosting across the distributed InterPlanetary File System network.",
    tag: "Storage Layer",
  },
  {
    icon: Key,
    code: "MOD-02",
    title: "Lit Protocol & AES-256",
    description:
      "Files are secured via AES-256, while private keys are managed via DKG to eliminate any single point of failure.",
    tag: "Cryptography",
  },
  {
    icon: Boxes,
    code: "MOD-03",
    title: "Ethereum Blockchain",
    description:
      "Provides extremely secure and immutable storage integrity via custom smart contracts written in Solidity.",
    tag: "Chain Layer",
  },
  {
    icon: Fingerprint,
    code: "MOD-04",
    title: "Multi-Layered Auth",
    description:
      "Identity verification through OAuth, Biometrics, and 2FA, securing application routes with JWT bridge cookies.",
    tag: "Identity",
  },
  {
    icon: Activity,
    code: "MOD-05",
    title: "Real-Time Threat Logging",
    description:
      "Tracks active sessions and utilizes Redis for instant blacklisting of suspicious IPs and account locking.",
    tag: "Monitoring",
  },
  {
    icon: Shield,
    code: "MOD-06",
    title: "Automated Defense",
    description:
      "Server-side rate-limiting neutralizes brute-force attacks, while scheduled cron jobs run continuous security scans.",
    tag: "Defense",
  },
];

// Reuse grain overlay
const GrainOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-0 opacity-[0.12] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px 128px",
    }}
  />
);

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.08,
        duration: 0.55,
        ease: [0.2, 0.8, 0.3, 1],
      }}
      className="group relative bg-[#0a0a0a] border border-stone-800/80 p-7 flex flex-col gap-5 overflow-hidden hover:border-amber-600/40 transition-colors duration-500"
    >
      {/* Hover fill glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(180,130,50,0.05) 0%, transparent 70%)"
        }}
      />

      {/* Top-left accent line on hover */}
      <div className="absolute top-0 left-0 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-amber-600/60 to-transparent transition-all duration-500 ease-out" />

      {/* Corner marker — top right */}
      <div className="absolute top-2 right-2 w-3 h-3 opacity-30 group-hover:opacity-70 transition-opacity duration-300">
        <svg viewBox="0 0 12 12" fill="none">
          <path d="M2 2 L10 2 L10 10" stroke="#c8a86b" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Module code */}
      <span className="font-mono text-[9px] tracking-[0.45em] uppercase text-stone-400 group-hover:text-amber-500 transition-colors duration-300">
        {feature.code}
      </span>

      {/* Icon + tag row */}
      <div className="flex items-start justify-between">
        <div className="relative w-11 h-11 flex items-center justify-center border border-stone-800 group-hover:border-amber-600/30 transition-colors duration-300">
          {/* Icon background crosshair */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-600/20" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-amber-600/20" />
          </div>
          <Icon
            className="w-5 h-5 text-stone-500 group-hover:text-amber-500 transition-colors duration-300 relative z-10"
            strokeWidth={1.5}
          />
        </div>

        <span className="font-mono text-[9px] tracking-widest uppercase text-stone-300 group-hover:text-amber-400 border border-stone-600 group-hover:border-amber-700/60 px-2 py-1 transition-all duration-300">
          {feature.tag}
        </span>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <h3
          className="text-stone-200 text-lg font-semibold leading-snug tracking-tight group-hover:text-stone-100 transition-colors duration-300"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          {feature.title}
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed font-light">
          {feature.description}
        </p>
      </div>

      {/* Bottom status line */}
      <div className="mt-auto pt-4 border-t border-stone-900 flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-amber-600/50 group-hover:bg-amber-500 transition-colors duration-300" />
        <span className="font-mono text-[9px] tracking-widest uppercase text-stone-400 group-hover:text-stone-300 transition-colors duration-300">
          ACTIVE
        </span>
      </div>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section className="relative w-full bg-[#070707] py-28 px-6 sm:px-10 overflow-hidden">
      <GrainOverlay />

      {/* Subtle horizontal rule at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

      {/* Faint vertical center line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-stone-900/60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Section header */}
        <div className="mb-16 flex flex-col gap-5">
          {/* Classification row */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-600/70">
              Architecture Overview
            </span>
            <span className="font-mono text-[10px] text-stone-700">—— 06 modules</span>
          </motion.div>

          {/* Separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="h-[1px] w-48 bg-gradient-to-r from-amber-600/50 to-transparent origin-left"
          />

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 leading-tight tracking-tight max-w-xl"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Core Security
              <br />
              <span className="text-amber-500">Architecture</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="max-w-sm text-stone-500 text-sm leading-relaxed font-light md:text-right"
            >
              A zero-trust system incorporating cryptographic algorithms, Ethereum
              smart contracts, and decentralized IPFS storage.
            </motion.p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuresList.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Footer row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex items-center justify-between"
        >
          <div className="h-[1px] flex-1 bg-gradient-to-r from-stone-800 to-transparent" />
          <span className="font-mono text-[9px] tracking-widest uppercase text-stone-700 px-6">
            All modules operational
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-stone-800 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default Features;