"use client";
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
import { ArrowRight, TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const AuthBackend = () => {
  const search = useSearchParams();
  const auth = search.get("auth");

  const handleCancel = () => (window.location.href = "/home");

  const handleContinue = () => (window.location.href = "/login");

  return (
    <>
      {auth == "required" && (
        <AlertDialog open={`${auth}==required?open:close`}>
          <AlertDialogContent className="bg-black border border-purple-900/40 text-white shadow-lg shadow-purple-900/20">
            <AlertDialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <TriangleAlert className="text-purple-600" size={24} />
                <AlertDialogTitle className="text-white text-xl font-bold">
                  Authentication Required
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-gray-300 text-base">
                You need to be logged in to access this page. Please
                authenticate to continue to the dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex space-x-4">
              <AlertDialogCancel
                className="cursor-pointer bg-black border border-purple-600/60 text-white hover:bg-purple-900/30 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                onClick={handleCancel}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                onClick={handleContinue}
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Hero
        title="Advanced Access Control & Security Suite"
        subtitle="Secure your digital assets with end-to-end encrypted verification, and secure recovery flows. Modern security, simplified"
        actions={[
          {
            label: "Get Started",
            href: "/",
            variant: "primary",
          },
        ]}
      />
      <Features />
      <Testimonials />
    </>
  );
};

export default AuthBackend;
