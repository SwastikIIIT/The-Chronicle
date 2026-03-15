"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect} from "react";
import { toast } from "sonner";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordContent  = () => {
  const search = useSearchParams();
  const token = search.get("token");
  const email = search.get("email");
  const router = useRouter();

  useEffect(() => {
    if(!token) {
      toast.error("Invalid request", {description: "No reset token",});
      router.push("/forgot-password");
     }
  }, [token, router]);
  
  if(!token) 
  {
      router.push('/forgot-password');
      return null;
  }

  return (
    <div className="container mx-auto py-8">
      <ResetPasswordForm token={token} email={email}/>
    </div>
  );
};

export default ResetPasswordContent ;