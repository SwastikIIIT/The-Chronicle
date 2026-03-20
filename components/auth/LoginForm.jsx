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
import { biometricVerify, handleTest } from "@/server/api";
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

  const handleOAuthLogin = async (formData)=>{
    const toastID = toast.loading("Logging via Oauth...");
    const provider=formData.get('provider');
    try {
      await handleAuth(provider);
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
          <Button
            type="button"
            onClick={handleTest}
            variant="outline"
            className="cursor-pointer w-full border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Fingerprint size={18} />
            <span>Testing Ips in prod</span>
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

    <form action={handleOAuthLogin}>
      <div className="flex gap-4">
        <Button
          type="submit"
          name="provider"
          value="google"
          variant="outline"
          className="w-full border-purple-900/60 cursor-pointer hover:border-purple-500 text-black hover:bg-purple-900/20 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 py-2 group"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Login with Google</span>
        </Button>

        <Button
          type="submit"
          name="provider"
          value="github"
          variant="outline"
          className="w-full border-purple-900/60 cursor-pointer hover:border-purple-500 text-black hover:bg-purple-900/20 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 py-2 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-black group-hover:fill-white transition-colors duration-300"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>Login with GitHub</span>
        </Button>
      </div>
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
