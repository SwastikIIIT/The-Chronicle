"use client";
import CTA from "@/components/layout/CTA";
import Features2 from "@/components/layout/Features2";
import Features from "@/components/layout/Features";
import { Hero } from "@/components/layout/Hero";
import Testimonials from "@/components/layout/Testimonials";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const AuthBackend = () => {
  const search = useSearchParams();
  const auth = search.get("auth");

  const handleCancel = () => (window.location.href = "/home");
  const handleContinue = () => (window.location.href = "/login");

  return (
    <>
      {auth === "required" && (
        <AlertDialog open>
          <AlertDialogContent
            className="
              bg-[#090909] border border-amber-600/25 text-stone-100 shadow-2xl shadow-black/80
              max-w-md font-mono
            "
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />

            {/* Corner markers */}
            {["tl", "tr", "bl", "br"].map((pos) => (
              <div
                key={pos}
                className={`absolute w-4 h-4 pointer-events-none
                  ${pos.includes("t") ? "top-2" : "bottom-2"}
                  ${pos.includes("l") ? "left-2" : "right-2"}
                `}
              >
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d={
                      pos === "tl"
                        ? "M14 2 L2 2 L2 14"
                        : pos === "tr"
                        ? "M2 2 L14 2 L14 14"
                        : pos === "bl"
                        ? "M14 14 L2 14 L2 2"
                        : "M2 14 L14 14 L14 2"
                    }
                    stroke="#c8a86b"
                    strokeWidth="0.8"
                    opacity="0.5"
                  />
                </svg>
              </div>
            ))}

            <AlertDialogHeader className="mt-2">
              {/* Classification tag */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] tracking-[0.4em] uppercase text-amber-600/70">
                  Access Intercepted
                </span>
              </div>

              <div className="flex items-start gap-3 mb-1">
                <ShieldAlert
                  className="text-amber-500 mt-0.5 shrink-0"
                  size={20}
                  strokeWidth={1.5}
                />
                <AlertDialogTitle className="text-stone-100 text-lg font-serif font-semibold leading-snug tracking-tight"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                  Authentication Required
                </AlertDialogTitle>
              </div>

              {/* Thin separator */}
              <div className="h-[1px] bg-gradient-to-r from-amber-600/40 via-amber-600/10 to-transparent my-3" />

              <AlertDialogDescription className="text-stone-400 text-sm leading-relaxed font-mono font-light">
                Vault access is restricted to authenticated identities.
                Verify your credentials to proceed to the secure dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex gap-3 mt-4">
              <AlertDialogCancel
                className="
                  cursor-pointer bg-transparent border border-stone-700 text-stone-400
                  hover:bg-stone-900 hover:text-stone-300 hover:border-stone-600
                  px-5 py-2.5 text-[11px] font-mono tracking-widest uppercase
                  transition-all duration-200 rounded-none
                "
                onClick={handleCancel}
              >
                Abort
              </AlertDialogCancel>

              <AlertDialogAction
                className="
                  group relative cursor-pointer overflow-hidden
                  bg-transparent border border-amber-600/60 text-amber-500
                  hover:text-[#090909]
                  px-5 py-2.5 text-[11px] font-mono tracking-widest uppercase
                  transition-colors duration-300 rounded-none
                "
                onClick={handleContinue}
              >
                <span className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 flex items-center gap-2">
                  Authenticate
                  <ArrowRight size={14} />
                </span>
              </AlertDialogAction>
            </AlertDialogFooter>

            {/* Bottom code line */}
            <div className="mt-3 pt-3 border-t border-stone-900">
              <p className="font-mono text-[9px] text-stone-700 tracking-widest">
                ERR::401 — VAULT://AUTH_REQUIRED — SESSION: NULL
              </p>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Hero
        title="The Next-Generation Decentralized Vault & Security Suite"
        subtitle="Protect your digital assets with military-grade encryption, immutable blockchain storage, and intelligent threat monitoring. Total control, zero compromises."
        actions={[
          {
            label: "Enter Vault",
            href: "/home/vault",
            variant: "primary",
          },
        ]}
      />
      {/* <Features2 /> */}
      <Features/>
      <CTA />
      <Testimonials />
    </>
  );
};

export default AuthBackend;