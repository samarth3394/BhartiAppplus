"use client";

import Link from "next/link";
import { ArrowRight, Command, Zap, Layers, Lock, GitBranch, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#EDEDED] font-sans overflow-x-hidden selection:bg-white/20 selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 h-14 bg-[#080808]/70 backdrop-blur-md border-b border-white/[0.08] z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white font-medium">
            <div className="w-5 h-5 rounded-[4px] bg-white text-black flex items-center justify-center text-[10px] font-bold">B</div>
            <span className="tracking-tight">BhartiAppPlus</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-[#888888] font-medium">
            <Link href="#" className="hover:text-white transition-colors">Features</Link>
            <Link href="#" className="hover:text-white transition-colors">Method</Link>
            <Link href="#" className="hover:text-white transition-colors">Customers</Link>
            <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-[#888888] hover:text-white transition-colors">Log in</Link>
          <Link href="/register" className="bg-white text-black px-3 py-1.5 rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Sign up
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
          
          {/* Subtle Background Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-[100%] pointer-events-none opacity-50"></div>

          <motion.div initial="hidden" animate={mounted ? "visible" : "hidden"} variants={staggerContainer} className="relative z-10 flex flex-col items-center">
            
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-medium text-[#888888] mb-8 hover:bg-white/[0.05] transition-colors cursor-pointer">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              </span>
              BhartiAppPlus 2.0 is here <ArrowRight size={12} />
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-6xl md:text-[80px] leading-[1.05] font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-[#888888] text-transparent bg-clip-text max-w-4xl">
              Linear perfection for your software operations.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-[#888888] max-w-2xl mb-10 font-light tracking-tight">
              Meet the new standard for modern software teams. Streamline issues, monitor infrastructure, and run your startup with magic.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link href="/register" className="w-full sm:w-auto bg-[#EEEEEE] text-[#000000] px-6 py-3 rounded-full font-medium hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                Get Started <ArrowRight size={16} />
              </Link>
              <Link href="#" className="w-full sm:w-auto bg-transparent border border-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-2">
                Press <span className="font-mono text-xs text-[#888888] bg-white/10 px-1.5 py-0.5 rounded ml-1 border border-white/10">C</span>
              </Link>
            </motion.div>

          </motion.div>
        </section>

        {/* Mockup Section */}
        <section className="w-full max-w-6xl mx-auto px-6 mt-24 relative perspective-1000">
          <motion.div 
            initial={{ opacity: 0, rotateX: 20, y: 100 }}
            animate={mounted ? { opacity: 1, rotateX: 0, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-full aspect-video bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05),_0_-20px_40px_rgba(0,0,0,1)] flex flex-col overflow-hidden relative"
          >
            {/* Mockup Header */}
            <div className="h-10 w-full border-b border-white/[0.06] bg-[#0c0c0c] flex items-center px-4 justify-between">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
              </div>
              <div className="flex items-center gap-2 bg-[#141414] px-3 py-1 rounded-md border border-white/[0.04]">
                <Command size={12} className="text-[#888]" />
                <span className="text-[#888] text-xs font-mono">BhartiAppPlus / Dashboard</span>
              </div>
              <div></div>
            </div>
            
            {/* Mockup Body */}
            <div className="flex-1 flex">
              {/* Sidebar */}
              <div className="w-48 border-r border-white/[0.06] bg-[#0c0c0c] p-3 flex flex-col gap-1">
                <div className="h-6 w-full rounded bg-white/[0.03] mb-4"></div>
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-5 w-full rounded ${i===1 ? 'bg-white/[0.08]' : 'bg-transparent'} flex items-center px-2`}>
                    <div className="w-2/3 h-2 bg-[#333] rounded-sm"></div>
                  </div>
                ))}
              </div>
              {/* Main Content */}
              <div className="flex-1 p-6 bg-[#0a0a0a]">
                <div className="w-1/3 h-6 bg-[#222] rounded mb-6"></div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-24 rounded-lg bg-white/[0.02] border border-white/[0.04] p-4 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-full bg-[#222]"></div>
                      <div className="w-1/2 h-3 bg-[#333] rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="w-full h-48 rounded-lg border border-white/[0.04] bg-gradient-to-t from-white/[0.01] to-transparent p-4 flex items-end">
                   <div className="w-full h-32 border-b border-l border-[#333] relative">
                     {/* Abstract Line Chart */}
                     <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,80 L20,60 L40,70 L60,30 L80,50 L100,10" fill="none" stroke="#555" strokeWidth="2" />
                     </svg>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Bento Grid Features */}
        <section className="w-full max-w-5xl mx-auto px-6 mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Built for speed. Designed for power.</h2>
            <p className="text-xl text-[#888888] font-light max-w-2xl mx-auto">Everything you need to build faster, all in one seamlessly integrated platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            
            {/* Feature 1 - Large */}
            <div className="md:col-span-4 rounded-2xl bg-[#111] border border-white/10 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                  <Zap size={20} className="text-[#EDEDED]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Synchronization</h3>
                <p className="text-[#888888] mb-8 max-w-sm">Every change syncs instantly across your entire team. No refreshing, no waiting, just pure speed.</p>
                
                {/* Visual */}
                <div className="flex-1 rounded-xl bg-[#0a0a0a] border border-white/[0.05] mt-auto p-4 flex flex-col gap-2 relative overflow-hidden">
                   <div className="absolute inset-y-0 left-12 w-px bg-white/[0.05]"></div>
                   {[1,2,3].map(i => (
                     <div key={i} className="flex items-center gap-4 z-10">
                       <div className="w-6 h-6 rounded-full bg-[#222] border-2 border-[#0a0a0a] z-10"></div>
                       <div className="flex-1 h-8 rounded-md bg-white/[0.03] border border-white/[0.02]"></div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Feature 2 - Small */}
            <div className="md:col-span-2 rounded-2xl bg-[#111] border border-white/10 p-8 flex flex-col relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                <Terminal size={20} className="text-[#EDEDED]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Command K</h3>
              <p className="text-[#888888] mb-8">Navigate the entire app, take actions, and run commands without your hands ever leaving the keyboard.</p>
              
              <div className="mt-auto h-24 rounded-xl bg-[#0a0a0a] border border-white/[0.05] flex items-center justify-center">
                 <div className="bg-[#1a1a1a] border border-[#333] rounded px-3 py-1.5 flex items-center gap-2">
                   <span className="font-mono text-xs text-[#888]">⌘</span>
                   <span className="font-mono text-xs text-[#888]">K</span>
                 </div>
              </div>
            </div>

            {/* Feature 3 - Small */}
            <div className="md:col-span-2 rounded-2xl bg-[#111] border border-white/10 p-8 flex flex-col relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                <Lock size={20} className="text-[#EDEDED]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-[#888888]">Granular permissions to ensure the right people have the right access across Workspaces and Apps.</p>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-4 rounded-2xl bg-[#111] border border-white/10 p-8 flex flex-col relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                <GitBranch size={20} className="text-[#EDEDED]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Copilot</h3>
              <p className="text-[#888888]">Let AI analyze your codebase, predict failures, and automate bug reports before they even happen.</p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-[#080808] py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-medium">
            <div className="w-5 h-5 rounded-[4px] bg-white text-black flex items-center justify-center text-[10px] font-bold">B</div>
            <span className="tracking-tight text-sm">BhartiAppPlus</span>
          </div>
          <p className="text-xs text-[#666]">© {new Date().getFullYear()} Bharti Nexus. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-[#666]">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-white transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
