"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, Lock, Mail, User, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  const benefits = [
    "Unlimited app monitoring",
    "AI-powered CTO reports",
    "Team collaboration tools",
    "Real-time uptime alerts",
  ];

  return (
    <div className="min-h-screen bg-black flex text-zinc-300 font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden border-r border-white/5">
        
        {/* Minimal Noise / Grid overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
        }} />

        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/50 via-black to-black" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Sparkles size={20} className="text-black" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">BNexora</span>
          </div>

          {/* Hero Text */}
          <div className="space-y-10 max-w-lg">
            <div>
              <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
                Start building <br/>
                <span className="text-zinc-500">something great.</span>
              </h1>
              <p className="text-lg text-zinc-400 leading-relaxed font-light">
                Join thousands of developers who trust BNexora to keep their applications healthy and performant.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                  <span className="text-zinc-300 text-sm font-medium tracking-wide">{b}</span>
                </div>
              ))}
            </div>

            {/* Testimonial Card */}
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <p className="text-zinc-400 text-sm leading-relaxed italic mb-5 font-light">
                &quot;BNexora completely transformed how our team monitors and manages our production apps. The AI insights are incredible.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white text-sm font-medium">SB</div>
                <div>
                  <p className="text-white text-sm font-medium">Samarth B.</p>
                  <p className="text-zinc-500 text-xs">CTO, Bharti Nexus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom text */}
          <p className="text-zinc-600 text-xs tracking-wider uppercase">
            Trusted by 500+ engineering teams worldwide
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
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
            <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Create your account</h2>
            <p className="text-zinc-500 font-light">Get started free — no credit card required</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all placeholder:text-zinc-600 font-light"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
              <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all placeholder:text-zinc-600 font-light"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="flex items-center gap-3 pt-2 pl-1">
                  <div className="flex gap-1.5 flex-1">
                    {[1, 2, 3].map((level) => (
                      <div key={level} className={`h-1 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-zinc-800'}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength === 3 ? 'text-emerald-400' : passwordStrength === 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
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
                  Create Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-70" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-zinc-500 text-xs tracking-wider uppercase">OR</span>
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


          {/* Login link */}
          <p className="text-center text-zinc-500 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
