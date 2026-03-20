"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import {
  Shield,
  QrCode,
  Key,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  PencilLine,
} from "lucide-react";
import Link from "next/link";
import {
  disable2FA,
  fetchUserInfo,
  handleVerify2FA,
  startSetup,
} from "@/server/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import { Check } from "lucide-react";
import { Copy } from "lucide-react";
import { useSession } from "next-auth/react";

const TwoFactorComponent = ({session}) => {
  const [step, setStep] = useState("initial");
  const [secret, setSecret] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [qrcode, setQrcode] = useState("");
  const [hasTwoFactor, setHasTwoFactor] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await fetchUserInfo();
        if (result?.error) throw new Error(result?.message);
        if (result?.userData?.twoFactor?.enabled) setHasTwoFactor(true);
      } catch (err) {
        console.log(err);
        toast.error("Error", {
          description: err?.message || "Failed to load user details",
        });
      }
    };
    fetchUser();
  }, [session]);

  const handleVerify = async (formData) => {
    const toastID = toast.loading("Processing request...", {
      description: "Verifying your authentication code",
    });
    try {
      const result = await handleVerify2FA(formData);
      if (result?.recoveryCodes) {
        toast.success("Verification successful", {
          id: toastID,
          description: result.message,
        });
        setRecoveryCodes(result.recoveryCodes || []);
        setHasTwoFactor(true);
        setStep("success");
      } else throw new Error(result?.error);
    } catch (err) {
      toast.error("Verification failed", {
        id: toastID,
        description: err.message,
      });
    } finally {
      setTimeout(() => toast.dismiss(toastID), 5000);
    }
  };

  const disableTwoFactor = async () => {
    const toastID = toast.loading("Processing request...", {
      description: "Disabling two-factor authentication",
    });
    try {
      const result = await disable2FA();
      if (result.error) throw new Error(result?.error);

      toast.success("Success", { id: toastID, description: result.message });
      setHasTwoFactor(false);
    } catch (err) {
      toast.error("Error", { id: toastID, description: err.message });
    } finally {
      setTimeout(() => toast.dismiss(toastID), 5000);
    }
  };

  const setup2FA = async () => {
    const toastID = toast.loading("Processing request...", {
      description: "Setting up two-factor authentication",
    });
    try {
      const result = await startSetup();
      if (result.qr) {
        setQrcode(result.qr);
        setSecret(result.secret);
        setStep("setup");
        toast.success("Setup initiated", {
          id: toastID,
          description: "Scan the QR code with your authenticator app",
        });
      } else
        toast.error("Setup Failed", {
          id: toastID,
          description: result?.error,
        });
    } catch (err) {
      console.log(err);
      toast.error("Setup Failed", { id: toastID });
    } finally {
      setTimeout(() => {
        toast.dismiss(toastID);
      }, 5000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    toast.info("Information", { description: "Copied to clipboard" });
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2 text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
          Two-Factor Authentication
        </h1>

        <p className="text-gray-400 text-sm max-w-xs text-balance">
          Add an extra layer of security to your account
        </p>
      </div>

      {step === "initial" && (
        <div className="grid gap-6">
          <div className="bg-black/40 p-4 rounded-lg border border-purple-900/40">
            <h3 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Shield size={16} className="text-purple-400" />
              Why enable 2FA?
            </h3>
            <p className="text-gray-400 text-sm">
              Two-factor authentication adds an extra security layer to your
              account. Even if someone knows your password, they won't be able
              to access your account without the verification code from your
              authenticator app.
            </p>
          </div>
          {hasTwoFactor ? (
            <>
              <div className="flex items-center gap-2 justify-center bg-black/30 p-3 rounded-lg border border-purple-900/30">
                <CheckCircle size={18} className="text-green-400" />
                <p className="text-gray-300 font-medium">
                  Two-factor authentication is enabled
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger>
                  <Button className="cursor-pointer w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300">
                    <span>Disable Two-Factor Authentication</span>
                    <AlertCircle size={16} className="mt-0.5" />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-black border border-purple-900/40 text-white shadow-lg shadow-purple-900/20">
                  <AlertDialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <TriangleAlert className="text-red-500" size={24} />
                      <AlertDialogTitle className="text-white text-xl font-bold">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-gray-300 text-base">
                      This will disable two-factor authentication for your
                      account, making it less secure. You will no longer need a
                      verification code to log in.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="flex space-x-4 mt-6">
                    <AlertDialogCancel className="cursor-pointer bg-black border border-purple-600/60 text-white hover:bg-purple-900/30 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={disableTwoFactor}
                      className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowRight size={18} />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button
                onClick={setup2FA}
                className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300"
              >
                <span>Set Up Two-Factor Authentication</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Button>
            </>
          )}
        </div>
      )}

      {step === "setup" && (
        <div className="grid gap-6 animate-fadeIn">
          <div className="bg-black/40 p-5 rounded-lg border border-purple-900/40">
            <h3 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
              <QrCode size={16} className="text-purple-400" />
              Step 1: Scan QR Code
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Scan this QR code with your authenticator app
            </p>

            <div className="flex justify-center mb-4 bg-white p-3 rounded-lg">
              {qrcode && (
                <Image
                  src={qrcode}
                  alt="QR code for 2FA"
                  height={200}
                  width={200}
                  className="rounded"
                />
              )}
            </div>

            <h3 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
              <PencilLine size={16} className="text-purple-400" />
              No QR scanner?
            </h3>
            <p className="text-gray-400 text-sm">
              You can manually enter this secret key in your authenticator app:
            </p>
            <div className="relative bg-black/60 p-3 rounded-md border border-purple-900/40 mt-2 font-mono text-sm text-center break-all text-gray-300">
              {secret}
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-3.5 right-3.5 cursor-pointer"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <form action={handleVerify} className="space-y-4">
            <div className="grid gap-3">
              <Label
                htmlFor="verificationCode"
                className="text-gray-300 flex items-center gap-2"
              >
                <Key size={16} className="text-purple-400" />
                Verification Code
              </Label>
              <div className="relative">
                <Input
                  name="token"
                  type="password"
                  placeholder="Enter 6-digit code"
                  className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="cursor-pointer w-full mt-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300"
            >
              <span>Verify and Enable</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Button>
          </form>
        </div>
      )}

      {step === "success" && (
        <div className="grid gap-6 animate-fadeIn">
          <div className="bg-black/40 p-5 rounded-lg border border-green-900/40">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600/20 to-green-800/20 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-400" />
              </div>
            </div>
            <h3 className="font-medium text-gray-300 mb-2 text-center text-lg">
              Success!
            </h3>
            <p className="text-gray-400 text-sm text-center">
              Two-factor authentication has been successfully enabled on your
              account. From now on, you'll need to provide a verification code
              from your authenticator app when logging in.
            </p>
          </div>

          {recoveryCodes.length > 0 && (
            <div className="bg-orange-500/5 p-5 rounded-xl border border-orange-500/20">
              <div className="flex items-center gap-2 mb-3 text-orange-400">
                <AlertCircle size={18} />
                <span className="font-semibold text-sm">
                  Save your recovery codes!
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                If you lose access to your authenticator app, you'll need to use
                the recovery codes to regain access to your account.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {recoveryCodes.map((code, i) => (
                  <div
                    key={i}
                    className="bg-black/40 p-2 rounded border border-white/5 font-mono text-xs text-center text-gray-200"
                  >
                    {code}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 text-xs border-orange-500/30 text-orange-400 "
                onClick={() => window.print()}
              >
                Print or Save Codes
              </Button>
            </div>
          )}

          <Link href="/home/settings">
            <Button className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300">
              <span>Return to Account</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TwoFactorComponent;
