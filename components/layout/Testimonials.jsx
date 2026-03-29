"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const roadmap = [
  {
    index: "01",
    tag: "Blockchain",
    status: "Done",
    statusColor: "text-emerald-500 border-emerald-800/60",
    dotColor: "bg-emerald-500",
    title: "Immutable Decentralized Storage",
    quote:
      "Integrating blockchain technology to create an immutable, decentralized storage layer. This architecture ensures zero-knowledge verification and provides a tamper-proof audit trail for enterprise compliance, preventing centralized data manipulation.",
    metric: { label: "Integrity", value: "100% tamper-proof" },
  },
  {
    index: "02",
    tag: "Artificial Intelligence",
    status: "In Progress",
    statusColor: "text-amber-500 border-amber-800/60",
    dotColor: "bg-amber-500",
    title: "RAG-Powered Support Intelligence",
    quote:
      "A context-aware support bot built on Retrieval-Augmented Generation (RAG). Unlike standard chatbots, the system securely indexes documentation to instantly resolve complex authentication queries and guide users through recovery flows without human intervention.",
    metric: { label: "Resolution rate", value: "~94% est." },
  },
];

const GrainOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: "128px 128px",
    }}
  />
);

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = roadmap.length;

  const go = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setCurrent((p) => (p + 1) % total);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const item = roadmap[current];

  const variants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d < 0 ? 60 : -60, opacity: 0 }),
  };

  return (
    <section className="relative w-full bg-[#070707] py-28 px-6 sm:px-10 overflow-hidden">
      <GrainOverlay />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

      {/* Ghost background word */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none" aria-hidden>
        <span
          className="text-[18vw] font-black text-stone-950 leading-none tracking-tighter whitespace-nowrap rotate-6"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          ROAD
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-16 flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-600/70">
              Future Roadmap
            </span>
            <div className="h-[1px] w-20 bg-gradient-to-r from-amber-600/40 to-transparent" />
            <span className="font-mono text-[10px] text-stone-700">{String(total).padStart(2,"0")} milestones</span>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="h-[1px] w-48 bg-gradient-to-r from-amber-600/50 to-transparent origin-left"
          />

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-stone-100 leading-tight tracking-tight"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            What's Being
            <br />
            <span className="text-amber-500">Built Next</span>
          </motion.h2>
        </div>

        {/* Progress rail */}
        <div className="flex items-center gap-0 mb-10 border border-stone-800 bg-[#0a0a0a]">
          {roadmap.map((r, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={cn(
                "group flex-1 flex items-center gap-4 px-5 py-4 transition-colors duration-300 cursor-pointer text-left",
                "border-r border-stone-800 last:border-r-0",
                current === i ? "bg-stone-900/60" : "hover:bg-stone-900/30"
              )}
            >
              {/* Active indicator bar on top */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-[2px] bg-amber-500 transition-all duration-500",
                current === i ? "opacity-100" : "opacity-0"
              )} style={{ position: "relative", height: 0 }} />

              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] tracking-widest text-stone-600">{r.index}</span>
                  <span className={cn(
                    "font-mono text-[8px] tracking-widest uppercase border px-1.5 py-0.5 transition-colors duration-300",
                    current === i ? r.statusColor : "text-stone-700 border-stone-800"
                  )}>
                    {r.status}
                  </span>
                </div>
                <span className={cn(
                  "font-mono text-[10px] tracking-wide truncate transition-colors duration-300",
                  current === i ? "text-stone-300" : "text-stone-600"
                )}>
                  {r.tag}
                </span>
              </div>

              {/* Active dot */}
              <div className="ml-auto shrink-0">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  current === i ? r.dotColor : "bg-stone-800"
                )} />
              </div>
            </button>
          ))}
        </div>

        {/* Main card */}
        <div className="relative overflow-hidden border border-stone-800 bg-[#0a0a0a]" style={{ minHeight: "280px" }}>

          {/* Animated top accent */}
          <motion.div
            key={current}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-amber-600/70 via-amber-500/30 to-transparent origin-left"
          />

          {/* Corner brackets */}
          <div className="absolute top-2 right-2 w-4 h-4 pointer-events-none opacity-30">
            <svg viewBox="0 0 16 16" fill="none"><path d="M2 2 L14 2 L14 14" stroke="#c8a86b" strokeWidth="0.8" /></svg>
          </div>
          <div className="absolute bottom-2 left-2 w-4 h-4 pointer-events-none opacity-30">
            <svg viewBox="0 0 16 16" fill="none"><path d="M14 14 L2 14 L2 2" stroke="#c8a86b" strokeWidth="0.8" /></svg>
          </div>

          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.3, 1] }}
              className="p-8 sm:p-12 flex flex-col gap-7"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[9px] tracking-[0.45em] uppercase text-stone-500">
                    {item.index} / {String(total).padStart(2,"0")}
                  </span>
                  <h3
                    className="text-xl sm:text-2xl font-semibold text-stone-100 leading-snug tracking-tight"
                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                  >
                    {item.title}
                  </h3>
                </div>
                <span className={cn(
                  "font-mono text-[9px] tracking-widest uppercase border px-2.5 py-1.5 shrink-0",
                  item.statusColor
                )}>
                  {item.status}
                </span>
              </div>

              {/* Separator */}
              <div className="h-[1px] bg-stone-900" />

              {/* Quote body */}
              <div className="flex gap-5">
                {/* Left amber pipe */}
                <div className="w-[2px] bg-gradient-to-b from-amber-600/60 to-transparent shrink-0 rounded-full" />
                <p className="text-stone-400 text-sm sm:text-base leading-relaxed font-light">
                  {item.quote}
                </p>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-900 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    item.dotColor,
                    item.status === "In Progress" ? "animate-pulse" : ""
                  )} />
                  <span className="font-mono text-[10px] tracking-widest uppercase text-stone-500">
                    {item.tag}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] tracking-widest uppercase text-stone-700">
                    {item.metric.label}
                  </span>
                  <div className="h-[1px] w-10 bg-stone-800" />
                  <span className="font-mono text-[10px] text-stone-400">
                    {item.metric.value}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-5 flex items-center justify-between"
        >
          <div className="flex gap-2">
            {roadmap.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={cn(
                  "h-[2px] transition-all duration-400 cursor-pointer",
                  current === i
                    ? "w-8 bg-amber-500"
                    : "w-4 bg-stone-800 hover:bg-stone-700"
                )}
                aria-label={`Go to milestone ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => go((current - 1 + total) % total)}
              className="group w-8 h-8 border border-stone-800 hover:border-amber-600/40 flex items-center justify-center transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-3 h-3 text-stone-600 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="square" d="M8 2L4 6l4 4" />
              </svg>
            </button>
            <button
              onClick={() => go((current + 1) % total)}
              className="group w-8 h-8 border border-stone-800 hover:border-amber-600/40 flex items-center justify-center transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-3 h-3 text-stone-600 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="square" d="M4 2l4 4-4 4" />
              </svg>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;