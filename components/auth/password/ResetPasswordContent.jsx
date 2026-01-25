"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect} from "react";
import { toast } from "sonner";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordContent  = () => {
  const search = useSearchParams();
  const token = search.get("token");
  const router = useRouter();
  
  useEffect(() => {
    if(!token) {
      toast.error("Invalid request", {
        description: "No reset token",
      });
      
      setTimeout(() => {
        router.push("/forgot-password");
      }, 1000);
    }
  }, [token, router]);
  
  if(!token) {
    return null;
  }
  
  return (
    <div className="container mx-auto py-8">
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordContent ;