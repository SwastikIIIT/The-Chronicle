"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MoveRightIcon } from "lucide-react";
import Image from "next/image";

const GrainOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.13] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: "128px 128px",
    }}
  />
);

// Animated scanning line over the image
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent pointer-events-none z-20"
    initial={{ top: "0%" }}
    animate={{ top: "100%" }}
    transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
  />
);

const CTA = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.3"],
  });
  const imageX = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#070707] py-28 px-6 sm:px-10 overflow-hidden"
    >
      <GrainOverlay />

      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

      {/* Faint diagonal background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
        aria-hidden
      >
        <span
          className="text-[20vw] font-black text-stone-950 leading-none tracking-tighter whitespace-nowrap -rotate-12"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          LENS
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-600/70">
            Companion Tool
          </span>
          <div className="h-[1px] w-24 bg-gradient-to-r from-amber-600/40 to-transparent" />
        </motion.div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0 items-stretch">

          {/* LEFT — Image panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.2, 0.8, 0.3, 1] }}
            className="relative overflow-hidden border border-stone-800 lg:border-r-0"
            style={{ minHeight: "360px" }}
          >
            {/* Corner brackets */}
            {[
              { pos: "top-2 left-2", d: "M14 2 L2 2 L2 14" },
              { pos: "top-2 right-2", d: "M2 2 L14 2 L14 14" },
              { pos: "bottom-2 left-2", d: "M14 14 L2 14 L2 2" },
              { pos: "bottom-2 right-2", d: "M2 14 L14 14 L14 2" },
            ].map(({ pos, d }, i) => (
              <div key={i} className={`absolute w-4 h-4 z-20 pointer-events-none ${pos}`}>
                <svg viewBox="0 0 16 16" fill="none">
                  <path d={d} stroke="#c8a86b" strokeWidth="0.8" opacity="0.5" />
                </svg>
              </div>
            ))}

            {/* Scan line animation */}
            <ScanLine />

            {/* Parallax image */}
              <motion.div
                style={{ x: imageX }}
                className="absolute inset-0 scale-105"
              >
                <Image
                  src="/crypto.png"
                  alt="CryptoLens Dashboard"
                  fill
                  className="object-cover object-left-top" 
                />
              </motion.div>

            {/* Image overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#070707]/60 z-10 hidden lg:block" />

            {/* Bottom-left image label */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-widest uppercase text-stone-500">
                DASHBOARD PREVIEW — v1.4.2
              </span>
            </div>

            {/* Live badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 border border-amber-900/40 bg-[#070707]/80 px-2.5 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
              </span>
              <span className="font-mono text-[9px] tracking-widest uppercase text-amber-500/80">
                Live Data
              </span>
            </div>
          </motion.div>

          {/* RIGHT — Content panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.2, 0.8, 0.3, 1], delay: 0.1 }}
            className="relative border border-stone-800 p-8 sm:p-12 flex flex-col justify-between gap-10 bg-[#0a0a0a]"
          >
            {/* Top-right corner bracket */}
            <div className="absolute top-2 right-2 w-4 h-4 pointer-events-none">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M2 2 L14 2 L14 14" stroke="#c8a86b" strokeWidth="0.8" opacity="0.3" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6">
              {/* Overline */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="font-mono text-[10px] tracking-[0.45em] uppercase text-amber-600/60"
              >
                ◈ Market Intelligence Suite
              </motion.p>

              {/* Thin separator */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-[1px] w-32 bg-gradient-to-r from-amber-600/50 to-transparent origin-left"
              />

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.55 }}
                className="text-3xl sm:text-4xl font-bold text-stone-100 leading-[1.1] tracking-tight"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                Track the Markets
                <br />
                with{" "}
                <span className="text-amber-500">CryptoLens</span>
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-stone-400 text-sm leading-relaxed font-light max-w-sm"
              >
                Real-time data, news-feed, deep market insights, and interactive
                graphs for any cryptocurrency — unified in one dashboard.
              </motion.p>

              {/* Spec list */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="flex flex-col gap-2.5 pt-1"
              >
                {[
                  ["Live Feeds", "500+ assets tracked"],
                  ["Latency", "<80ms refresh"],
                  ["Charts", "Interactive, multi-frame"],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center gap-4">
                    <span className="font-mono text-[9px] tracking-widest uppercase text-stone-600 w-20 shrink-0">
                      {label}
                    </span>
                    <div className="h-[1px] flex-1 bg-stone-800" />
                    <span className="font-mono text-[10px] text-stone-400">
                      {val}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              <a
                href="http://crypto-app-rose-mu.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-4 px-7 py-4 overflow-hidden border border-amber-600/60 text-amber-500 hover:text-[#0a0a0a] font-mono text-[11px] tracking-widest uppercase transition-colors duration-300"
              >
                <span className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 flex items-center gap-3">
                  Visit CryptoLens
                  <MoveRightIcon
                    size={14}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </span>
              </a>

              {/* Sub-note */}
              <p className="mt-4 font-mono text-[9px] tracking-widest uppercase text-stone-700">
                External link — opens in new tab
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom footer strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 flex items-center justify-between border border-stone-900 border-t-0 px-5 py-3 bg-[#0a0a0a]"
        >
          <span className="font-mono text-[9px] tracking-widest uppercase text-stone-700">
            CryptoLens — Companion to Vault
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-amber-600/50" />
            <span className="font-mono text-[9px] tracking-widest uppercase text-stone-700">
              Hosted on Vercel
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default CTA;