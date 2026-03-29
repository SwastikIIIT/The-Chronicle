"use client";
import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Noise texture SVG as data URI
const noiseDataUri = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

const GridLines = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path
          d="M 60 0 L 0 0 0 60"
          fill="none"
          stroke="#c8a86b"
          strokeWidth="0.5"
        />
      </pattern>
      <pattern id="grid-cross" width="300" height="300" patternUnits="userSpaceOnUse">
        <rect width="300" height="300" fill="url(#grid)" />
        <path
          d="M 300 0 L 0 0 0 300"
          fill="none"
          stroke="#c8a86b"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-cross)" />
  </svg>
);

const ScanlineOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-10"
    style={{
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
    }}
  />
);

const GrainOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-10 opacity-[0.18] mix-blend-overlay"
    style={{
      backgroundImage: noiseDataUri,
      backgroundRepeat: "repeat",
      backgroundSize: "128px 128px",
    }}
  />
);

// Animated classification tag
const ClassificationTag = ({ text, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-amber-500/80"
  >
    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
    {text}
  </motion.div>
);

// Animated counter line
const DataLine = ({ label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-3 font-mono text-[11px] text-stone-500"
  >
    <span className="text-amber-600/60">{label}</span>
    <span className="text-stone-400">{value}</span>
  </motion.div>
);

// Corner bracket decoration
const CornerBracket = ({ position = "tl", className }) => {
  const posClass = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 rotate-90",
    bl: "bottom-0 left-0 -rotate-90",
    br: "bottom-0 right-0 rotate-180",
  }[position];

  return (
    <div className={cn("absolute w-6 h-6 pointer-events-none", posClass, className)}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 22 L2 2 L22 2" stroke="#c8a86b" strokeWidth="1" opacity="0.5" />
      </svg>
    </div>
  );
};

// Vertical side text
const SideText = ({ text, side = "left" }) => (
  <div
    className={cn(
      "absolute top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-[0.5em] uppercase text-stone-600 pointer-events-none z-20",
      side === "left" ? "left-4 -rotate-90 origin-center" : "right-4 rotate-90 origin-center"
    )}
  >
    {text}
  </div>
);

export const Hero = React.forwardRef((props, ref) => {
  const {
    className,
    title,
    subtitle,
    actions,
    titleClassName,
    subtitleClassName,
    actionsClassName,
    ...rest
  } = props;

  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Split title for staggered word animation
  const titleWords = (title || "").split(" ");

  return (
    <section
      ref={ref}
      className={cn(
        "relative z-0 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#070707]",
        className
      )}
      {...rest}
    >
      {/* Background layers */}
      <GridLines />
      <GrainOverlay />
      <ScanlineOverlay />

      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 30%, rgba(7,7,7,0.8) 100%)"
        }}
      />

      {/* Ambient gold glow - subtle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-amber-600/20 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-40 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, rgba(180, 130, 50, 0.07) 0%, transparent 70%)"
        }}
      />

      {/* Decorative side texts */}
      <SideText text="secure — encrypted — immutable" side="left" />
      <SideText text="vault protocol v2.4.1" side="right" />

      {/* Main content */}
      <motion.div
        ref={containerRef}
        style={{ y, opacity }}
        className="relative z-30 w-full max-w-5xl mx-auto px-8 md:px-16 flex flex-col gap-8"
      >
        {/* Top classification row */}
        <div className="flex items-center justify-between">
          <ClassificationTag text="SYSTEM ACTIVE" delay={0.1} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="hidden md:flex items-center gap-6"
          >
            <DataLine label="NODES" value="14,291" delay={0.3} />
            <DataLine label="SHARDS" value="∞ encrypted" delay={0.4} />
            <DataLine label="UPTIME" value="99.998%" delay={0.5} />
          </motion.div>
        </div>

        {/* Thin separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
          className="h-[1px] w-full bg-gradient-to-r from-amber-600/60 via-amber-500/20 to-transparent origin-left"
        />

        {/* Title block */}
        <div className="flex flex-col gap-4">
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="font-mono text-[11px] tracking-[0.4em] uppercase text-amber-600/70"
          >
            ◈ Next-Generation Security Infrastructure
          </motion.p>

          {/* Main headline - staggered words */}
          <h1
            className={cn(
              "font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-stone-100",
              titleClassName
            )}
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.4 + i * 0.07,
                  duration: 0.55,
                  ease: [0.2, 0.8, 0.3, 1],
                }}
                className={cn(
                  "inline-block mr-[0.25em]",
                  // Highlight key words in gold
                  ["Vault", "Security", "Decentralized"].includes(word) &&
                    "text-amber-500"
                )}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className={cn(
                "max-w-2xl text-base md:text-lg text-stone-400 leading-relaxed font-light",
                subtitleClassName
              )}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Bottom row: CTA + stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
          {/* Actions */}
          {actions && actions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.5 }}
              className={cn("flex gap-3", actionsClassName)}
            >
              {actions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <button
                    className={cn(
                      "group relative px-6 py-3 text-sm font-mono tracking-widest uppercase overflow-hidden",
                      "border border-amber-600/60 text-amber-500",
                      "hover:text-[#070707] transition-colors duration-300",
                      "cursor-pointer"
                    )}
                  >
                    {/* Fill animation on hover */}
                    <span className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <span className="relative z-10 flex items-center gap-3">
                      {action.label}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M5 12h14m-6-6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>
                </Link>
              ))}
            </motion.div>
          )}

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="hidden sm:block w-[1px] h-8 bg-stone-700"
          />

          {/* Mini trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.5 }}
            className="flex gap-5"
          >
            {[
              { label: "AES-256", sub: "Encryption" },
              { label: "ZK-Proof", sub: "Privacy" },
              { label: "Multi-sig", sub: "Auth" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <span className="font-mono text-[10px] text-amber-500/80 tracking-widest uppercase">
                  {item.label}
                </span>
                <span className="font-mono text-[9px] text-stone-600 tracking-wider uppercase">
                  {item.sub}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.8, ease: "easeInOut" }}
          className="h-[1px] w-full bg-gradient-to-r from-transparent via-stone-700/50 to-transparent origin-center"
        />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex items-center gap-3 self-start"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-amber-600/80 to-transparent ml-1"
          />
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-stone-600">
            Scroll to explore
          </span>
        </motion.div>
      </motion.div>

      {/* Bottom-right coordinates decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute bottom-6 right-8 font-mono text-[9px] text-stone-700 tracking-widest pointer-events-none z-20"
      >
        28.6139°N 77.2090°E — VAULT://SECURE
      </motion.div>
    </section>
  );
});

Hero.displayName = "Hero";