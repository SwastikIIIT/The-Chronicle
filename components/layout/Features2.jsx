"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Key, Network, Boxes, Fingerprint, Activity } from "lucide-react";

const featuresList = [
  {
    icon: Network,
    index: "01",
    title: "Decentralized IPFS Vault",
    description:
      "Ensures highly available and tamper-resistant file hosting across the distributed InterPlanetary File System network.",
    tag: "Storage",
    stat: { label: "Redundancy", value: "∞ nodes" },
  },
  {
    icon: Key,
    index: "02",
    title: "Lit Protocol & AES-256",
    description:
      "Files are secured via AES-256, while private keys are managed via DKG to eliminate any single point of failure.",
    tag: "Cryptography",
    stat: { label: "Key length", value: "256-bit" },
  },
  {
    icon: Boxes,
    index: "03",
    title: "Ethereum Blockchain",
    description:
      "Provides extremely secure and immutable storage integrity via custom smart contracts written in Solidity.",
    tag: "Chain",
    stat: { label: "Contract type", value: "Solidity EVM" },
  },
  {
    icon: Fingerprint,
    index: "04",
    title: "Multi-Layered Auth",
    description:
      "Identity verification through OAuth, Biometrics, and 2FA, securing application routes with JWT bridge cookies.",
    tag: "Identity",
    stat: { label: "Auth layers", value: "03 active" },
  },
  {
    icon: Activity,
    index: "05",
    title: "Real-Time Threat Logging",
    description:
      "Tracks active sessions and utilizes Redis for instant blacklisting of suspicious IPs and account locking.",
    tag: "Monitor",
    stat: { label: "Response", value: "<12ms" },
  },
  {
    icon: Shield,
    index: "06",
    title: "Automated Defense",
    description:
      "Server-side rate-limiting neutralizes brute-force attacks, while scheduled cron jobs run continuous security scans.",
    tag: "Defense",
    stat: { label: "Scan cycle", value: "Every 6h" },
  },
];

// Animated vertical progress spine
const Spine = ({ containerRef }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="absolute left-[2.6rem] top-0 bottom-0 w-[1px] bg-stone-900 hidden md:block">
      <motion.div
        style={{ scaleY, originY: 0 }}
        className="absolute inset-0 bg-gradient-to-b from-amber-600/80 via-amber-500/50 to-amber-600/20"
      />
    </div>
  );
};

const FeatureRow = ({ feature, index: idx }) => {
  const Icon = feature.icon;
  const rowRef = useRef(null);

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.2, 0.8, 0.3, 1] }}
      className="group relative flex gap-0 md:gap-10 items-start py-9 border-b border-stone-900 last:border-b-0 cursor-default"
    >
      {/* Hover row highlight */}
      <div className="absolute inset-0 -mx-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(90deg, rgba(180,130,50,0.03) 0%, transparent 60%)" }}
      />

      {/* Left: spine dot + index */}
      <div className="hidden md:flex flex-col items-center gap-2 w-20 shrink-0 pt-1">
        {/* Spine dot */}
        <div className="relative w-[9px] h-[9px] shrink-0">
          <div className="absolute inset-0 border border-stone-700 group-hover:border-amber-600/60 transition-colors duration-300" />
          <div className="absolute inset-[3px] bg-stone-800 group-hover:bg-amber-600 transition-colors duration-300" />
        </div>
        {/* Ghost index number */}
        <span
          className="font-mono text-[11px] tracking-widest text-stone-700 group-hover:text-amber-800/60 transition-colors duration-300 -mt-1"
        >
          {feature.index}
        </span>
      </div>

      {/* Giant ghost index — background */}
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[7rem] leading-none font-black text-stone-900/40 group-hover:text-stone-900/70 transition-colors duration-500 select-none pointer-events-none"
        style={{ fontVariantNumeric: "tabular-nums" }}
        aria-hidden
      >
        {feature.index}
      </div>

      {/* Center: icon box */}
      <div className="shrink-0 mt-0.5">
        <div className="relative w-10 h-10 border border-stone-800 group-hover:border-amber-600/40 transition-colors duration-300 flex items-center justify-center overflow-hidden">
          {/* Sweep animation */}
          <div className="absolute inset-0 bg-amber-600/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          <Icon
            className="w-4 h-4 text-stone-600 group-hover:text-amber-500 transition-colors duration-300 relative z-10"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Right: content */}
      <div className="flex flex-1 flex-col md:flex-row md:items-start gap-4 md:gap-12 min-w-0 ml-5 md:ml-0">

        {/* Title + desc block */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Tag + title row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[8px] tracking-[0.45em] uppercase text-amber-700/60 border border-amber-900/40 px-1.5 py-0.5">
              {feature.tag}
            </span>
            <h3
              className="text-stone-200 text-xl font-semibold leading-tight group-hover:text-white transition-colors duration-300"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              {feature.title}
            </h3>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed font-light max-w-xl">
            {feature.description}
          </p>
        </div>

        {/* Stat block — right aligned */}
        <div className="flex flex-col gap-1 shrink-0 md:text-right md:min-w-[120px]">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-stone-700">
            {feature.stat.label}
          </span>
          <span
            className="font-mono text-base text-stone-400 group-hover:text-amber-500/80 transition-colors duration-300"
          >
            {feature.stat.value}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Features2 = () => {
  const containerRef = useRef(null);

  return (
    <section className="relative w-full bg-[#070707] py-28 overflow-hidden">
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <div className="mb-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-600/70">
                Security Manifest
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-stone-100 leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Core Security
              <br />
              <span className="text-amber-500">Architecture</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xs text-stone-500 text-sm leading-relaxed font-light md:text-right"
          >
            A zero-trust system incorporating cryptographic algorithms, Ethereum
            smart contracts, and decentralized IPFS storage.
          </motion.p>
        </div>

        {/* Column labels */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center gap-10 pb-3 border-b border-stone-800 mb-0"
        >
          <div className="hidden md:block w-20 shrink-0" />
          <div className="w-10 shrink-0" />
          <div className="flex flex-1 gap-12 ml-5 md:ml-0">
            <span className="font-mono text-[9px] tracking-widest uppercase text-stone-700 flex-1">
              Module
            </span>
            <span className="font-mono text-[9px] tracking-widest uppercase text-stone-700 hidden md:block min-w-[120px] text-right">
              Metric
            </span>
          </div>
        </motion.div>

        {/* Feature rows with animated spine */}
        <div ref={containerRef} className="relative">
          <Spine containerRef={containerRef} />
          {featuresList.map((feature, i) => (
            <FeatureRow key={i} feature={feature} index={i} />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 flex items-center justify-between pt-6"
        >
          <span className="font-mono text-[9px] tracking-widest uppercase text-stone-700">
            VAULT://SYS — 06/06 modules operational
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
            <span className="font-mono text-[9px] tracking-widest uppercase text-amber-700/50">
              All systems nominal
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features2;