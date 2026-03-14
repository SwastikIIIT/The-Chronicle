"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { handleLogin } from "@/server/providers/handleLogin";
import { handleAuth } from "@/server/providers/handleAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, Key, ArrowRight } from "lucide-react";
import { EyeOff } from "lucide-react";
import { EyeIcon } from "lucide-react";
import { biometricVerify } from "@/server/api";
import { Fingerprint } from "lucide-react";
import { startAuthentication } from "@simplewebauthn/browser";
import { handleBiometric } from "@/server/providers/handleBiometricLogin";


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [show2faField, set2faField] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleCredentialLogin = async (formData) => {
    const toastID = toast.loading("Logging in...", {
      description: "Verifying your credentials",
    });

    try {
      const result = await handleLogin(formData, show2faField);

      if (result.success) {
        toast.success(result.message, {
          id: toastID,
          description: "Welcome back! You've been securely logged in.",
        });
        router.push("/home");
      } else {
        if (result.twoFactorField) set2faField(true);
        toast.error("Login failed", {
          id: toastID,
          description: result.message,
        });
      }
    } catch (err) {
      if (err.message !== "NEXT_REDIRECT")
        toast.error("Failed to login", {
          id: toastID,
          description: err.message,
        });
    } finally {
      setTimeout(() => {
        toast.dismiss(toastID);
      }, 5000);
    }
  };

  const handleAuthLogin = async () => {
    const toastID = toast.loading("Logging in with Google...");
    try {
      await handleAuth();
    } catch (err) {
      console.log(err);
      toast.error(err.message, { id: toastID });
    } finally {
      setTimeout(() => {
        toast.dismiss(toastID);
      }, 3000);
    }
  };

  const handleBiometricLogin = async () => {
    if(!email) toast.error("Email is required.");
    
    try {
      const biometricOptions=await biometricVerify(email);
      console.log(biometricOptions)
      if(biometricOptions.error) throw new Error(biometricOptions.error);
      const authResp=await startAuthentication(biometricOptions);
      console.log(authResp);
    
      const res=await handleBiometric(authResp,email);

      if (res) {
        toast.success("Biometric login successful!");
        router.push("/home");
      } else {
        toast.error("Biometric verification failed");
      }
    }
    catch(err) {
       console.log("Biometric login error:", err);
       toast.error(err.message || "Biometrics cancelled or failed");
    }
};

  return (
    <div className="flex flex-col gap-6">
      <form action={handleCredentialLogin}>
        <div className="flex flex-col items-center gap-2 text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm max-w-xs">
            Sign in to your account to continue your journey
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label
              htmlFor="email"
              className="text-gray-300 flex items-center gap-2"
            >
              <Mail size={16} className="text-purple-400" />
              Email
            </Label>
            <div className="relative">
              <Input
                name="email"
                type="email"
                placeholder="vasu@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-gray-300 flex items-center gap-2"
              >
                <Lock size={16} className="text-purple-400" />
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="*********"
                required
                className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          {show2faField && (
            <div className="grid gap-3 animate-fadeIn">
              <Label
                htmlFor="2fa"
                className="text-gray-300 flex items-center gap-2"
              >
                <Key size={16} className="text-purple-400" />
                Two Factor Code{" "}
                <span className="text-gray-500 text-xs ml-1">(Optional)</span>
              </Label>
              <div className="relative">
                <Input
                  name="2fa"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-2 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300"
          >
            <span>Sign In</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Button>

          <Button
            type="button"
            onClick={handleBiometricLogin}
            variant="outline"
            className="cursor-pointer w-full border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Fingerprint size={18} />
            <span>Login with Biometrics</span>
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-purple-900/40"></div>
            <span className="flex-shrink mx-3 text-xs text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="flex-grow border-t border-purple-900/40"></div>
          </div>
        </div>
      </form>

      <form action={handleAuthLogin}>
        <Button
          variant="outline"
          className="w-full border-purple-900/60 cursor-pointer hover:border-purple-500 text-black hover:bg-purple-900/20 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5  hover:text-white"
          >
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          <span>Login with Google</span>
        </Button>
      </form>

      <div className="text-center text-gray-400 text-sm mt-2">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
