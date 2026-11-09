"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No invite token provided in the URL.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/accept-invite", {
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
    } catch (err: any) {
      setError(err.message || "An error occurred while accepting invite");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !error) return null;

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#0A2540] flex items-center justify-center p-4 selection:bg-[#635BFF]/15 font-sans relative overflow-hidden">
      {/* Background Subtle Gradient & Grid */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-br from-[#635BFF]/10 via-[#00D4FF]/10 to-transparent rounded-full blur-[90px] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0A2540 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="w-full max-w-[420px] z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-200/90 p-6 sm:p-8 rounded-2xl shadow-[0_16px_48px_rgba(10,37,64,0.06)]"
        >
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <Logo className="h-5 text-[#0A2540] group-hover:text-[#635BFF] transition-colors" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-[#0A2540] mb-1">Complete your profile</h1>
            <p className="text-xs sm:text-sm text-[#425466]">
              You've been invited to join a collaborative engineering cluster on BREXAL.
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
                className="w-full bg-[#0A2540] hover:bg-[#635BFF] text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-4 min-h-[44px]"
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
