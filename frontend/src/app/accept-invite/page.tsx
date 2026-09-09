"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !error) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6 selection:bg-white/20 font-sans">
      <div className="w-full max-w-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-[#0a0a0a] border border-white/[0.04] p-8 rounded-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold text-xl mb-6">
              B
            </div>
            <h1 className="text-[18px] font-medium tracking-tight mb-2 text-center text-[#EDEDED]">Complete Your Profile</h1>
            <p className="text-[#888] text-center text-[13px] leading-relaxed">
              You've been invited to join a workspace on BREXAL.
            </p>
          </div>

          {error ? (
            <div className="bg-[#111] border border-red-500/20 text-red-400 p-4 rounded-xl text-[13px] mb-6 text-center">
              {error}
              <div className="mt-4">
                <Link href="/login" className="text-[#EDEDED] underline hover:text-white transition-colors">
                  Go to Login
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 bg-[#111] border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-[15px] font-medium text-[#EDEDED] mb-2">Profile Created</h2>
              <p className="text-[#888] text-[13px]">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={14} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#111] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 text-[#EDEDED] text-[14px] placeholder-[#555] focus:outline-none focus:border-white/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={14} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 text-[#EDEDED] text-[14px] placeholder-[#555] focus:outline-none focus:border-white/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black py-2.5 rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#e5e5e5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? "Saving..." : "Create Profile & Continue"}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
