"use client";

import React, { useState } from "react";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#EDEDED] font-sans flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#888888] hover:text-white transition-colors text-sm font-medium">
          <Logo className="h-5 text-white" />
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Log in to your account</h1>
          <p className="text-[#888888] text-sm">Enter your details to proceed further</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-[#888888] uppercase tracking-wider">Password</label>
              <Link href="#" className="text-xs text-[#888888] hover:text-white transition-colors">Forgot password?</Link>
            </div>
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
            className="w-full bg-white text-black hover:bg-[#E5E5E5] font-medium rounded-lg py-2.5 mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                Continue <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#888888]">
            Don't have an account?{" "}
            <Link href="/register" className="text-white hover:underline transition-all">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
