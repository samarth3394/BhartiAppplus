"use client";

import React, { useState } from "react";
import { Activity, Bug, Map, ShieldCheck, ArrowRight, Sparkles, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  const features = [
    { icon: Activity, title: "Real-time Monitoring", desc: "Track uptime, response times, and server health 24/7" },
    { icon: Bug, title: "Smart Bug Tracking", desc: "Auto-capture errors with JS SDK integration" },
    { icon: Map, title: "Feature Roadmaps", desc: "Plan and visualize your product development pipeline" },
    { icon: ShieldCheck, title: "Enterprise Security", desc: "RBAC, API keys, and audit logs built-in" },
  ];

  return (
    <div className="min-h-screen bg-black flex text-zinc-300 font-sans">
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden border-r border-white/5">
        
        {/* Minimal Noise / Grid overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
        }} />

        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-zinc-950/50" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Sparkles size={20} className="text-black" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">BNexora</span>
          </div>

          {/* Hero Text */}
          <div className="space-y-8 max-w-lg">
            <div>
              <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
                Built for the <br/>
                <span className="text-zinc-500">future.</span>
              </h1>
              <p className="text-lg text-zinc-400 leading-relaxed font-light">
                The All-in-One Intelligent App Platform for modern engineering teams.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-5">
              {features.map((f, i) => (
                <div key={i} className="group p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300">
                  <f.icon size={22} className="text-zinc-300 mb-3 group-hover:text-white transition-colors" />
                  <h3 className="text-zinc-100 text-sm font-semibold mb-1 tracking-wide">{f.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="flex gap-12 border-t border-white/5 pt-8">
            <div>
              <p className="text-3xl font-medium text-white tracking-tight">99.9%</p>
              <p className="text-zinc-500 text-sm mt-1">Uptime SLA</p>
            </div>
            <div>
              <p className="text-3xl font-medium text-white tracking-tight">50ms</p>
              <p className="text-zinc-500 text-sm mt-1">Avg Response</p>
            </div>
            <div>
              <p className="text-3xl font-medium text-white tracking-tight">10K+</p>
              <p className="text-zinc-500 text-sm mt-1">Apps Monitored</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative bg-black">
        <div className="w-full max-w-[400px] relative z-10">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-12 justify-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-black" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">BNexora</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-zinc-500 font-light">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all placeholder:text-zinc-600 font-light"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-zinc-400">Password</label>
                <button type="button" className="text-xs text-zinc-500 hover:text-white transition">Forgot password?</button>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all placeholder:text-zinc-600 font-light"
                  placeholder="Enter your password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-200 font-medium rounded-xl py-3.5 mt-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-70" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-zinc-500 text-xs tracking-wider">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-all text-sm font-medium">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-all text-sm font-medium">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-zinc-500 text-sm mt-10">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-white hover:underline font-medium transition">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
