"use client";
import React, { useState, useEffect } from "react";
import {
  Home, LayoutDashboard, Settings, HardDrive,
  LogIn, UserPlus, LogOut, Menu, X, ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { handleSignout } from "@/server/providers/handleSignout";

const tabs = [
  { id: "",          label: "Home",      Icon: Home },
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "settings",  label: "Settings",  Icon: Settings },
  { id: "vault",     label: "Storage",   Icon: HardDrive },
];

function useScrolled(t = 12) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const fn = () => setS(window.scrollY > t);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [t]);
  return s;
}

function useActiveTab() {
  const p = usePathname() ?? "";
  return tabs.find((t) => t.id !== "" && p.includes(`/home/${t.id}`))?.id ?? "";
}

const OrangePill = ({ children, onClick, className = "", style = {} }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 ${className}`}
    style={{
      background: "linear-gradient(135deg,#f97316 0%,#ea580c 100%)",
      boxShadow: "0 1px 8px rgba(249,115,22,0.3)",
      ...style,
    }}
  >
    {children}
  </button>
);

const OutlinePill = ({ children, href }) => (
  <Link href={href}>
    <button
      className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
      style={{ color: "#f97316", border: "1px solid rgba(249,115,22,0.4)" }}
    >
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "rgba(249,115,22,0.1)" }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  </Link>
);

const Navbar = ({ session }) => {
  const [open, setOpen] = useState(false);
  const activeTab = useActiveTab();
  const scrolled = useScrolled();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  const signout = async () => {
    const id = toast.loading("Logging out…");
    try {
      await handleSignout();
      toast.success("Signed out", { id });
      setTimeout(() => toast.dismiss(id), 1000);
      router.refresh();
    } catch (e) {
      toast.error("Error signing out", { id });
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full px-4 pt-3 pb-2">
      <nav
        aria-label="Main navigation"
        className="relative max-w-5xl mx-auto rounded-2xl transition-all duration-300"
        style={{
          background: "rgba(13,13,13,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: scrolled
            ? "0 10px 40px rgba(0,0,0,0.6),0 1px 0 rgba(255,255,255,0.04) inset"
            : "0 4px 20px rgba(0,0,0,0.4),0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Top orange glow line */}
        <div
          className="absolute top-0 left-10 right-10 h-px pointer-events-none rounded-full"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(249,115,22,0.5) 35%,rgba(249,115,22,0.5) 65%,transparent)",
          }}
        />

        {/* ─── Desktop row ─────────────────────────────── */}
        <div className="flex items-center justify-between h-14 px-5">

          {/* Brand */}
          <Link
            href="/"
            aria-label="The Chronicle home"
            className="flex items-center gap-3 group flex-shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#f97316 0%,#ea580c 100%)",
                boxShadow: "0 0 0 2px rgba(249,115,22,0.25),0 2px 10px rgba(249,115,22,0.3)",
              }}
            >
              <ShieldCheck size={17} className="text-white" strokeWidth={2.2} />
            </div>
            <span
              className="text-[15px] font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors duration-200"
              style={{ fontFamily: "'Inter',system-ui,sans-serif" }}
            >
              The Chronicle
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5" role="menubar">
            {tabs.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <Link href={`/home/${id}`} key={id}>
                  <button
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                    style={{ color: active ? "#f97316" : "#71717a" }}
                  >
                    {/* bg fill */}
                    <span
                      className="absolute inset-0 rounded-xl transition-opacity duration-200"
                      style={{
                        background: "linear-gradient(135deg,rgba(249,115,22,0.11) 0%,rgba(234,88,12,0.06) 100%)",
                        opacity: active ? 1 : 0,
                      }}
                    />
                    <span
                      className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                    <Icon
                      size={14}
                      strokeWidth={active ? 2.2 : 1.8}
                      className="relative z-10 transition-colors duration-200"
                    />
                    <span className="relative z-10 group-hover:text-zinc-200 transition-colors duration-200">
                      {label}
                    </span>
                    {active && (
                      <motion.span
                        layoutId="underline"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full"
                        style={{ background: "linear-gradient(90deg,#f97316,#ea580c)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {session?.user ? (
              <OrangePill onClick={signout}>
                <LogOut size={14} /> Sign Out
              </OrangePill>
            ) : (
              <>
                <Link href="/login">
                  <OrangePill>
                    <LogIn size={14} /> Login
                  </OrangePill>
                </Link>
                <OutlinePill href="/signup">
                  <UserPlus size={14} /> Sign Up
                </OutlinePill>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
            style={{
              background: open ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.13 }}>
                  <X size={15} className="text-orange-400" />
                </motion.span>
              ) : (
                <motion.span key="m" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.13 }}>
                  <Menu size={15} className="text-zinc-400" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ─── Mobile drawer ─────────────────────────────── */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              key="mob"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden md:hidden"
              role="menu"
            >
              <div className="px-4 pb-5 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>

                {/* Links */}
                <div className="flex flex-col gap-0.5 mb-3">
                  {tabs.map(({ id, label, Icon }, i) => {
                    const active = activeTab === id;
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.045, duration: 0.18 }}
                      >
                        <Link href={`/home/${id}`}>
                          <button
                            role="menuitem"
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                            style={{
                              color: active ? "#f97316" : "#71717a",
                              background: active ? "rgba(249,115,22,0.1)" : "transparent",
                              borderLeft: `2px solid ${active ? "#f97316" : "transparent"}`,
                            }}
                          >
                            <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
                            {label}
                          </button>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Auth */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="flex flex-col gap-2 pt-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {session?.user ? (
                    <button
                      onClick={() => { signout(); setOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                      style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  ) : (
                    <>
                      <Link href="/login" className="w-full" onClick={() => setOpen(false)}>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                          style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}
                        >
                          <LogIn size={14} /> Login
                        </button>
                      </Link>
                      <Link href="/signup" className="w-full" onClick={() => setOpen(false)}>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                          style={{ color: "#f97316", border: "1px solid rgba(249,115,22,0.38)", background: "transparent" }}
                        >
                          <UserPlus size={14} /> Sign Up
                        </button>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;