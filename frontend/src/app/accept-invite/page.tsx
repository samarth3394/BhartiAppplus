"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getApiUrl } from "@/lib/api";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const error = submitError || (!token ? "No invite token provided in the URL." : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsLoading(true);

    try {
      const res = await fetch(getApiUrl("/api/auth/accept-invite"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, full_name: fullName, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to accept invite");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred while accepting invite");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !error) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#FAFBFD] font-sans">
      {/* ── FULL SCREEN LUMINOUS ARCHITECTURAL BACKGROUND (white.png) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-0">
        <img
          src="/white.png"
          alt="Architectural Wave Background"
          className="w-full h-full object-cover object-[center_right] sm:object-center pointer-events-none"
        />
        {/* Subtle Ambient Contrast Layer */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_25px_70px_rgba(79,70,229,0.12),0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100/90 text-left"
        >
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <Logo className="text-[#101114] text-xl" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[#101114] font-['Sora',sans-serif] mb-1">Complete your profile</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              You&apos;ve been invited to join a collaborative engineering cluster on BREXAL.
            </p>
          </div>

          {error ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs sm:text-sm mb-6 text-center">
              <p className="font-semibold">{error}</p>
              <div className="mt-4">
                <Link href="/login" className="font-bold text-[#635BFF] hover:underline transition-colors">
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-base font-bold text-[#0A2540] mb-1">Profile Activated</h2>
              <p className="text-xs text-[#425466]">Redirecting to your telemetry dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0A2540] mb-1.5 ml-0.5">Full name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-[#0A2540] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#635BFF] focus:ring-3 focus:ring-[#635BFF]/15 transition-all shadow-2xs"
                    placeholder="Samarth Choudhar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2540] mb-1.5 ml-0.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-[#0A2540] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#635BFF] focus:ring-3 focus:ring-[#635BFF]/15 transition-all shadow-2xs"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4338CA] hover:from-[#5558E6] hover:to-[#3730A3] text-white font-semibold text-sm transition-all shadow-[0_4px_16px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_22px_rgba(99,102,241,0.45)] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isLoading ? "Setting up..." : "Activate & Continue"}
                {!isLoading && <ArrowRight size={15} />}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] font-mono text-[#425466]">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Encrypted Workspace Verification</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFBFD]" />}>
      <AcceptInviteContent />
    </Suspense>
  );
}
