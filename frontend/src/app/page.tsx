"use client";

import Link from "next/link";
import { ArrowRight, Command, Zap, Layers, Lock, GitBranch, Terminal, User } from "lucide-react";
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
              <div className="w-48 border-r border-white/[0.06] bg-[#0c0c0c] p-4 flex flex-col gap-3 font-sans">
                <div className="text-[10px] font-semibold text-[#555] tracking-widest uppercase mb-1">Favorites</div>
                {['Overview', 'Issues', 'Roadmap'].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 text-[13px] ${i===0 ? 'text-white font-medium bg-white/[0.05] -mx-2 px-2 py-1.5 rounded-md' : 'text-[#888] hover:text-white -mx-2 px-2 py-1.5 transition-colors'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i===0 ? 'bg-purple-500' : 'bg-transparent'}`}></div>
                    {item}
                  </div>
                ))}
                <div className="text-[10px] font-semibold text-[#555] tracking-widest uppercase mt-4 mb-1">Your Teams</div>
                {['Frontend', 'Backend', 'Design'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[13px] text-[#888] hover:text-white transition-colors cursor-pointer py-1">
                    <div className="w-4 h-4 rounded border border-white/[0.1] flex items-center justify-center text-[9px] font-bold text-white bg-white/[0.02]">
                      {item.charAt(0)}
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-8 bg-[#0a0a0a] font-sans flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold text-white tracking-tight">Overview</h2>
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold">JD</div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold">AS</div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold">MK</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-28 rounded-xl bg-white/[0.02] border border-white/[0.04] p-5 flex flex-col justify-between hover:bg-white/[0.03] transition-colors cursor-pointer">
                    <div className="text-[#888] text-[13px] font-medium">Active Issues</div>
                    <div className="text-3xl font-semibold text-white">124</div>
                  </div>
                  <div className="h-28 rounded-xl bg-white/[0.02] border border-white/[0.04] p-5 flex flex-col justify-between hover:bg-white/[0.03] transition-colors cursor-pointer">
                    <div className="text-[#888] text-[13px] font-medium">Resolved (7d)</div>
                    <div className="text-3xl font-semibold text-white">48</div>
                  </div>
                  <div className="h-28 rounded-xl bg-white/[0.02] border border-white/[0.04] p-5 flex flex-col justify-between hover:bg-white/[0.03] transition-colors cursor-pointer">
                    <div className="text-[#888] text-[13px] font-medium">Uptime</div>
                    <div className="text-3xl font-semibold text-emerald-400">99.9%</div>
                  </div>
                </div>
                <div className="flex-1 rounded-xl border border-white/[0.04] bg-white/[0.01] p-5 flex flex-col">
                   <div className="text-[13px] text-[#888] font-medium mb-4">Velocity (Last 30 Days)</div>
                   <div className="flex-1 border-b border-l border-white/[0.05] relative flex items-end ml-4 mb-2">
                     {/* Abstract Line Chart */}
                     <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path d="M0,80 L15,70 L30,75 L45,45 L60,50 L75,20 L90,25 L100,5" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M0,80 L15,70 L30,75 L45,45 L60,50 L75,20 L90,25 L100,5 L100,100 L0,100 Z" fill="url(#chartGradient)" stroke="none" />
                     </svg>
                     <div className="absolute -bottom-6 left-0 text-[10px] text-[#555]">Oct 1</div>
                     <div className="absolute -bottom-6 right-0 text-[10px] text-[#555]">Oct 30</div>
                     <div className="absolute top-0 -left-8 text-[10px] text-[#555]">100</div>
                     <div className="absolute bottom-0 -left-8 text-[10px] text-[#555]">0</div>
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
                <div className="flex-1 rounded-xl bg-[#0a0a0a] border border-white/[0.05] mt-auto flex flex-col relative overflow-hidden font-sans">
                   <div className="absolute top-0 left-0 w-full h-9 border-b border-white/[0.05] bg-[#111] flex items-center px-4 gap-3 text-[11px] font-medium text-[#666] tracking-wider uppercase">
                     <div className="w-16">ID</div>
                     <div className="flex-1">Title</div>
                     <div className="w-24">Status</div>
                   </div>
                   <div className="pt-9 flex flex-col">
                     {[
                       { id: 'BAP-123', title: 'Update onboarding flow', status: 'In Progress', color: 'text-blue-400', dot: 'bg-blue-400' },
                       { id: 'BAP-124', title: 'Fix WebSocket connection drops', status: 'Done', color: 'text-[#888]', dot: 'bg-purple-500' },
                       { id: 'BAP-125', title: 'Add dark mode toggle', status: 'Todo', color: 'text-zinc-500', dot: 'bg-zinc-600' }
                     ].map((issue, i) => (
                       <div key={i} className="flex items-center px-4 py-3 border-b border-white/[0.03] text-[13px] bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer">
                         <div className="w-16 text-[#888] font-mono text-[12px]">{issue.id}</div>
                         <div className="flex-1 text-[#EDEDED] font-medium truncate pr-4">{issue.title}</div>
                         <div className={`w-24 ${issue.color} flex items-center gap-2 text-[12px] font-medium`}>
                           <div className={`w-2 h-2 rounded-full ${issue.dot}`}></div>
                           {issue.status}
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Small */}
            <div className="md:col-span-2 rounded-2xl bg-[#111] border border-white/10 p-8 flex flex-col relative overflow-hidden group">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                <Terminal size={20} className="text-[#EDEDED]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Command K</h3>
              <p className="text-[#888888] mb-8 text-[15px]">Navigate the entire app, take actions, and run commands without your hands ever leaving the keyboard.</p>
              
              <div className="mt-auto h-40 rounded-xl bg-[#0a0a0a] border border-white/[0.05] flex flex-col overflow-hidden relative shadow-inner font-sans">
                 <div className="h-10 border-b border-white/[0.05] flex items-center px-3 gap-2 bg-[#111]">
                   <span className="text-[#888]">
                     <Command size={14} />
                   </span>
                   <span className="text-[#EDEDED] text-[13px] font-medium">Create issue...</span>
                 </div>
                 <div className="flex-1 p-2 flex flex-col gap-1">
                   <div className="px-2 py-1.5 text-[10px] font-bold text-[#555] uppercase tracking-wider">Actions</div>
                   <div className="px-2 py-1.5 bg-white/[0.06] rounded-md flex items-center justify-between text-[13px]">
                     <span className="text-white font-medium">Create new issue</span>
                     <span className="text-[#888] font-mono text-[10px] bg-white/[0.05] px-1.5 py-0.5 rounded">C</span>
                   </div>
                   <div className="px-2 py-1.5 text-[#888] flex items-center justify-between text-[13px]">
                     <span className="font-medium">Search issues</span>
                     <span className="text-[#666] font-mono text-[10px] bg-white/[0.02] px-1.5 py-0.5 rounded">/</span>
                   </div>
                 </div>
                 {/* Fade out bottom */}
                 <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Feature 3 - Small */}
            <div className="md:col-span-2 rounded-2xl bg-[#111] border border-white/10 p-8 flex flex-col relative overflow-hidden group">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                <Lock size={20} className="text-[#EDEDED]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-[#888888] mb-8 text-[15px]">Granular permissions to ensure the right people have the right access across Workspaces and Apps.</p>
              
              <div className="mt-auto rounded-xl bg-[#0a0a0a] border border-white/[0.05] flex flex-col overflow-hidden relative shadow-inner p-2 gap-1 font-sans">
                 <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/[0.05] transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] text-white font-bold">JD</div>
                     <span className="text-[#EDEDED] text-[14px] font-medium">John Doe</span>
                   </div>
                   <span className="text-[#888] bg-white/[0.04] border border-white/[0.02] px-2 py-0.5 rounded-md text-[11px] font-medium">Owner</span>
                 </div>
                 <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/[0.05] transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] text-white font-bold">AS</div>
                     <span className="text-[#EDEDED] text-[14px] font-medium">Alice Smith</span>
                   </div>
                   <span className="text-[#888] bg-white/[0.04] border border-white/[0.02] px-2 py-0.5 rounded-md text-[11px] font-medium">Member</span>
                 </div>
              </div>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-4 rounded-2xl bg-[#111] border border-white/10 p-8 flex flex-col relative overflow-hidden group">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                <GitBranch size={20} className="text-[#EDEDED]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Copilot</h3>
              <p className="text-[#888888] mb-8 max-w-md">Let AI analyze your codebase, predict failures, and automate bug reports before they even happen.</p>
              
              <div className="mt-auto flex-1 rounded-xl bg-[#0a0a0a] border border-white/[0.05] flex flex-col overflow-hidden relative shadow-inner p-5 font-sans min-h-[160px]">
                 <div className="flex gap-3 mb-4">
                   <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                     <Zap size={14} />
                   </div>
                   <div className="bg-[#111] border border-white/[0.05] rounded-xl rounded-tl-none p-3.5 text-[14px] text-[#EDEDED] max-w-[85%] leading-relaxed shadow-md font-medium">
                     I noticed a potential memory leak in <code className="text-purple-400 font-mono text-[12px] bg-purple-400/10 px-1.5 py-0.5 rounded border border-purple-500/20">websocket_handler.py</code>. Would you like me to generate a fix?
                   </div>
                 </div>
                 <div className="flex gap-3 self-end flex-row-reverse">
                   <div className="w-7 h-7 rounded-full bg-[#222] border border-white/[0.05] text-[#888] flex items-center justify-center shrink-0">
                     <User size={14} />
                   </div>
                   <div className="bg-purple-600 border border-purple-500/30 rounded-xl rounded-tr-none p-3.5 text-[14px] text-white max-w-[85%] leading-relaxed shadow-md font-medium">
                     Yes, please apply the fix and create a PR.
                   </div>
                 </div>
              </div>
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
