"use client";

import React, { useState } from "react";
import { ArrowRight, Mail, Lock, Eye, EyeOff, User, Zap, Terminal, GitBranch, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, full_name: fullName }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || data.detail || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#EDEDED] font-sans flex">
      
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative border-r border-white/[0.02]">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#888888] hover:text-white transition-colors text-sm font-medium z-20">
            <Logo className="h-5 text-white" />
        </Link>

        <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 relative">
          {/* Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[380px] relative z-10"
          >
            <div className="mb-10 text-left">
              <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Create your account</h1>
              <p className="text-[#888888] text-sm">Join BREXAL to orchestrate your app.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#888888] uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555] group-focus-within:text-[#EDEDED] transition-colors" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 text-white rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-white/20 focus:bg-[#1a1a1a] transition-all placeholder:text-[#555] text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#888888] uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555] group-focus-within:text-[#EDEDED] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 text-white rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-white/20 focus:bg-[#1a1a1a] transition-all placeholder:text-[#555] text-sm"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#888888] uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555] group-focus-within:text-[#EDEDED] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#111111] border border-white/10 text-white rounded-lg py-2.5 pl-10 pr-10 outline-none focus:border-white/20 focus:bg-[#1a1a1a] transition-all placeholder:text-[#555] text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#EDEDED] transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-[#E5E5E5] font-medium rounded-lg py-2.5 mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Create account <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-left">
              <p className="text-sm text-[#888888]">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:underline transition-all">
                  Log in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Feature Highlight */}
      <div className="hidden lg:flex w-1/2 bg-[#050505] flex-col justify-center relative overflow-hidden px-16 xl:px-24">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-900/10 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-medium text-[#888888] mb-6">
            <Zap size={12} className="text-purple-400" /> Seamless orchestration
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-8">Build unbreakable software, faster.</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                 <Terminal size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Command everything</h3>
                <p className="text-[#888] text-sm leading-relaxed">Use the keyboard-first command palette to navigate your entire workspace instantly without touching the mouse.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                 <GitBranch size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">AI Copilot</h3>
                <p className="text-[#888] text-sm leading-relaxed">Predict bugs before they happen with advanced AI static analysis and automated runtime anomaly detection.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                 <Activity size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Zero-latency metrics</h3>
                <p className="text-[#888] text-sm leading-relaxed">Monitor production systems in real-time with sub-millisecond precision and high-throughput ingestion.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-16 bg-[#0a0a0a] border border-white/[0.05] p-6 rounded-2xl max-w-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner border border-white/10">AS</div>
            <div>
              <div className="text-sm font-medium text-white">Alice Smith</div>
              <div className="text-xs text-[#888]">CTO at TechFlow</div>
            </div>
          </div>
          <p className="text-[#888] text-sm italic leading-relaxed">"BREXAL completely transformed our engineering velocity. We catch bugs instantly and our uptime has never been better."</p>
        </div>
      </div>
    </div>
  );
}
