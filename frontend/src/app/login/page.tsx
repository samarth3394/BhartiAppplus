"use client";

import React, { useState } from "react";
import { Activity, Bug, Map, ShieldCheck, Zap, Figma, Github, ArrowLeft, Twitch } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        router.push("/dashboard"); // Redirect to Next.js dashboard later
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
    <div className="auth-container min-h-screen flex items-center justify-center p-8 bg-black relative">
      {/* Top Navbar */}
      <nav className="absolute top-0 w-full flex justify-between items-center px-10 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md z-[100]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white text-lg">BNexora</span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-zinc-400 font-medium">
          <a href="#" className="hover:text-white transition">Why Nexvora</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={() => setShowLogin(true)} className="text-zinc-400 hover:text-white transition font-medium">Log in</button>
          <a href="/register" className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:scale-105 transition">Sign up</a>
        </div>
      </nav>

      <div className="auth-wrapper flex w-full max-w-6xl mx-auto mt-20 gap-16 z-10 relative">
        {/* Left Side Info */}
        <div className="auth-left flex-1 flex flex-col">
          <div className="auth-info mb-12 text-center md:text-left">
            <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-4">Built for the future.<br/>Available today.</h1>
            <p className="text-white/80 text-xl mb-12">The All-in-One Intelligent App Platform built for Modern Developers</p>
            
            {/* Bento Box Layout */}
            {!showLogin && (
              <div className="auth-features-list grid grid-cols-3 gap-5 w-full">
                <div className="auth-feature col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl hover:-translate-y-2 hover:border-white/20 transition backdrop-blur-lg">
                  <Activity className="w-8 h-8 text-white mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">Real-time Uptime & Server Monitoring</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Continuously monitor your application's health, API endpoints, and server response times.</p>
                </div>
                <div className="auth-feature col-span-1 bg-white/5 border border-white/10 p-6 rounded-2xl hover:-translate-y-2 hover:border-white/20 transition backdrop-blur-lg">
                  <Bug className="w-8 h-8 text-white mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">Automated JS SDK</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Automatically capture client-side errors.</p>
                </div>
                <div className="auth-feature col-span-1 bg-white/5 border border-white/10 p-6 rounded-2xl hover:-translate-y-2 hover:border-white/20 transition backdrop-blur-lg">
                  <Map className="w-8 h-8 text-white mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">Feature Roadmaps</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Visually plan your upcoming releases.</p>
                </div>
                <div className="auth-feature col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl hover:-translate-y-2 hover:border-white/20 transition backdrop-blur-lg">
                  <ShieldCheck className="w-8 h-8 text-white mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">Maintenance & RBAC Security</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Schedule routine database backups and dependency updates.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="w-full max-w-sm">
          {!showLogin ? (
            <div className="hero-card flex flex-col">
                <div className="hero-buttons flex gap-4 mt-8">
                    <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 w-full" onClick={() => setShowLogin(true)}>Get started</button>
                </div>
            </div>
          ) : (
            <div className="auth-card bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative">
              <button className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-white transition" onClick={() => setShowLogin(false)}>
                  <ArrowLeft className="w-5 h-5" />
              </button>
              
              <h2 className="text-white text-2xl font-bold mt-4 mb-6 text-center">Welcome Back</h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 text-sm">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white rounded-lg p-3 outline-none focus:border-[#00e5ff] transition" 
                    placeholder="you@example.com" 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 text-sm">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/50 border border-white/10 text-white rounded-lg p-3 outline-none focus:border-[#00e5ff] transition" 
                    placeholder="Enter your password" 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-[#00e5ff] to-[#0077ff] text-black font-semibold rounded-lg p-3 mt-4 hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
