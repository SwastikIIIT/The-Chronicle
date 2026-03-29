"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Github, Linkedin, Instagram, Phone } from "lucide-react";
import Link from "next/link";

// ─── Noise texture (matches Hero) ───────────────────────────────────────────
const noiseDataUri = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

// ─── Shared micro-components ─────────────────────────────────────────────────
const GrainOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-10 opacity-[0.14] mix-blend-overlay"
    style={{
      backgroundImage: noiseDataUri,
      backgroundRepeat: "repeat",
      backgroundSize: "128px 128px",
    }}
  />
);

const GridLines = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="fg" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#c8a86b" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#fg)" />
  </svg>
);

const ClassificationTag = ({ text, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.35em] uppercase text-amber-500/70"
  >
    <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
    {text}
  </motion.div>
);

// ─── Data ────────────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/SwastikIIIT",
    Icon: Github,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/ghost_swastik",
    Icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/swastik-sharma-943615290",
    Icon: Linkedin,
  },
];

const RESOURCES = [
  { label: "Source Code", href: "https://github.com/SwastikIIIT/The-Chronicle" },
  { label: "System Architecture", href: "https://github.com/SwastikIIIT/Backend-chronicle" },
  { label: "CryptoLens", href: "https://crypto-app-rose-mu.vercel.app/" },
];

const CONTACT = [
  {
    Icon: Mail,
    label: "swastikiiit.05@gmail.com",
    href: "mailto:swastikiiit.05@gmail.com",
  },
  {
    Icon: Phone,
    label: "+91 63949423336",
    href: "tel:+916394942336",
  },
];

const TRUST_BADGES = [
  { label: "AES-256", sub: "Encryption" },
  { label: "ZK-Proof", sub: "Privacy" },
  { label: "Multi-sig", sub: "Auth" },
];

// ─── Footer ──────────────────────────────────────────────────────────────────
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <footer
      ref={ref}
      className="relative w-full overflow-hidden bg-[#070707]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Decorative top border beam */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        className="absolute top-0 left-0 right-0 h-[1px] origin-left"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(200,168,107,0.7) 25%, rgba(200,168,107,0.35) 60%, transparent)",
        }}
      />

      {/* Ambient glow from top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-32 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(180,130,50,0.06) 0%, transparent 70%)",
        }}
      />

      <GridLines />
      <GrainOverlay />

      {/* Main content */}
      <div className="relative z-20 max-w-5xl mx-auto px-8 md:px-16 pt-14 pb-10">

        {/* Classification row
        <div className="flex items-center justify-between mb-6">
          <ClassificationTag text="VAULT FOOTER — ENCRYPTED" delay={0.05} />
          <motion.span
            {...fadeUp(0.1)}
            className="hidden md:block font-mono text-[9px] tracking-[0.35em] uppercase text-stone-700"
          >
            NODE 14,291 · UPTIME 99.998%
          </motion.span>
        </div> */}

        {/* Separator */}
        {/* <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.9, ease: "easeInOut" }}
          className="h-[1px] mb-10 origin-left"
          style={{
            background:
              "linear-gradient(90deg, rgba(200,168,107,0.5), rgba(200,168,107,0.1) 50%, transparent)",
          }}
        /> */}

        {/* Four-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

          {/* ── Brand ── */}
          <motion.div {...fadeUp(0.2)} className="md:col-span-2 flex flex-col gap-5">
            <div>
              <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-amber-600/60 mb-1">
                ◈ Secure Infrastructure
              </p>
              <h3
                className="text-2xl font-bold text-stone-100 tracking-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                The Chronicle
              </h3>
            </div>

            <p className="font-mono text-[11px] text-stone-500 leading-relaxed max-w-xs">
              Secure, scalable, and immutable asset management infrastructure.{" "}
              <span className="text-amber-600/70">Built by Swastik Sharma.</span>
            </p>

            {/* Social icons */}
            <div className="flex gap-4">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-8 h-8 border border-stone-800 flex items-center justify-center overflow-hidden transition-colors duration-300 hover:border-amber-600/60"
                  aria-label={label}
                >
                  <span className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Icon className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-500 transition-colors duration-200 relative z-10" />
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex gap-5 pt-1">
              {TRUST_BADGES.map(({ label, sub }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[9px] text-amber-500/70 tracking-widest uppercase">
                    {label}
                  </span>
                  <span className="font-mono text-[8px] text-stone-700 tracking-wider uppercase">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Resources ── */}
          <motion.div {...fadeUp(0.3)} className="flex flex-col gap-4">
            <h4 className="font-mono text-[9px] tracking-[0.4em] uppercase text-amber-600/70">
              Resources
            </h4>
            <ul className="flex flex-col gap-3">
              {RESOURCES.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 font-mono text-[11px] text-stone-500 hover:text-amber-400 transition-colors duration-200"
                  >
                    <span className="w-3 h-[1px] bg-stone-700 group-hover:bg-amber-500/60 group-hover:w-4 transition-all duration-200" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Contact ── */}
          <motion.div {...fadeUp(0.4)} className="flex flex-col gap-4">
            <h4 className="font-mono text-[9px] tracking-[0.4em] uppercase text-amber-600/70">
              Contact
            </h4>
            <ul className="flex flex-col gap-4">
              {CONTACT.map(({ Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-start gap-3 font-mono text-[11px] text-stone-500 hover:text-amber-400 transition-colors duration-200"
                  >
                    <span className="mt-0.5 w-5 h-5 border border-stone-800 flex items-center justify-center flex-shrink-0 group-hover:border-amber-600/50 transition-colors duration-200">
                      <Icon className="w-2.5 h-2.5 text-amber-600/60 group-hover:text-amber-500 transition-colors duration-200" />
                    </span>
                    <span className="leading-relaxed break-all">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
          className="h-[1px] mt-10 mb-6 origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(120,100,60,0.3) 50%, transparent)",
          }}
        />

        <motion.div
          {...fadeUp(0.55)}
          className="flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-stone-700">
            © {currentYear} The Chronicle · All rights reserved
          </p>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] tracking-widest text-stone-800 uppercase">
              Vault://secure
            </span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-amber-600/50"
            />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;