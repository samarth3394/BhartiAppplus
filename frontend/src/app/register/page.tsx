"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        router.push("/dashboard"); // Redirect to Next.js dashboard after successful registration
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
    <div className="auth-container min-h-screen flex items-center justify-center p-8 bg-black relative">
      <div className="auth-wrapper flex w-full max-w-sm mx-auto z-10 relative">
        <div className="auth-card w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative">
          <Link href="/login" className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <h2 className="text-white text-2xl font-bold mt-4 mb-2 text-center">Create Account</h2>
          <p className="text-zinc-400 text-sm text-center mb-6">Join BNexora and start monitoring your apps.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-zinc-400 text-sm">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-black/50 border border-white/10 text-white rounded-lg p-3 outline-none focus:border-[#00e5ff] transition" 
                placeholder="John Doe" 
                required 
              />
            </div>
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
                placeholder="At least 6 characters" 
                required 
                minLength={6}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-[#00e5ff] to-[#0077ff] text-black font-semibold rounded-lg p-3 mt-4 hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
