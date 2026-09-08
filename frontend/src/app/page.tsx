"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Activity, Shield, Cpu, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5 w-full">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-xl leading-none">
              B
            </div>
            <span className="font-semibold text-lg tracking-tight">BhartiAppPlus</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link 
              href="/register" 
              className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
          
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="flex-1 flex flex-col items-start z-10"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Experience the Future of Monitoring
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text text-transparent leading-[1.1]">
              Master your apps <br /> with ultimate precision.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-zinc-400 max-w-xl mb-10">
              BhartiAppPlus is the premium command center for your applications. Real-time monitoring, AI insights, and robust security in one breathtakingly dark interface.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <Link 
                href="/register" 
                className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
              >
                Get Started for Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 w-full relative z-10"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full aspect-square md:aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/10"
            >
              <Image 
                src="/3d_abstract_hero_1788871973142.jpg" 
                alt="Premium 3D Abstract Shape" 
                fill 
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Trusted By Logo Cloud */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="w-full max-w-7xl mx-auto px-6 py-12 border-y border-white/5 bg-white/[0.01]"
        >
          <p className="text-center text-sm font-medium text-zinc-500 mb-8 tracking-widest uppercase">Trusted by innovative teams</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            {['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella'].map((logo) => (
              <div key={logo} className="text-xl md:text-2xl font-bold font-serif text-white hover:opacity-100 transition-opacity">
                {logo}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Interactive App Mockup */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="w-full max-w-7xl mx-auto px-6 py-24 flex flex-col items-center"
        >
          <div className="text-center mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">A command center that feels like magic.</h2>
            <p className="text-xl text-zinc-400">Everything you need, beautifully arranged in a dark glassmorphic interface.</p>
          </div>
          
          <div className="relative w-full max-w-5xl rounded-xl overflow-hidden bg-black border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.05)]">
            {/* Mockup Header */}
            <div className="h-8 w-full bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            {/* Mockup Content (Abstract representation of dashboard) */}
            <div className="w-full aspect-[16/9] bg-zinc-950 p-8 flex flex-col gap-6">
              <div className="w-full flex gap-6 h-1/4">
                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="w-12 h-4 bg-white/10 rounded mb-4"></div>
                  <div className="w-24 h-8 bg-white/20 rounded"></div>
                </div>
                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="w-12 h-4 bg-white/10 rounded mb-4"></div>
                  <div className="w-32 h-8 bg-white/20 rounded"></div>
                </div>
                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="w-12 h-4 bg-white/10 rounded mb-4"></div>
                  <div className="w-20 h-8 bg-emerald-500/20 rounded"></div>
                </div>
              </div>
              <div className="w-full flex gap-6 h-3/4">
                <div className="w-2/3 bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="w-32 h-4 bg-white/10 rounded mb-4"></div>
                  <div className="w-full h-full bg-blue-500/10 rounded-xl border border-blue-500/20"></div>
                </div>
                <div className="w-1/3 bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="w-24 h-4 bg-white/10 rounded mb-4"></div>
                  <div className="w-full h-12 bg-white/5 rounded-lg"></div>
                  <div className="w-full h-12 bg-white/5 rounded-lg"></div>
                  <div className="w-full h-12 bg-white/5 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stacked Features Section */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 space-y-32">
          
          {/* Feature 1 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="flex flex-col md:flex-row items-center gap-16 group"
          >
            <div className="flex-1 w-full relative aspect-square max-w-lg rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] p-4 transition-transform duration-700 group-hover:scale-105">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/3d_feature_1_1788871989968.jpg" 
                  alt="Real-time Monitoring 3D Object" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 border border-white/10">
                <Activity size={28} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Real-time Monitoring</h2>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                Keep a pulse on your entire infrastructure. Our automated systems track uptime, latency, and throughput, delivering critical alerts instantly when things go wrong.
              </p>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> Millisecond-precision latency tracking</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> Automated downtime SMS & Email alerts</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> Customizable dashboard metrics</li>
              </ul>
            </div>
          </motion.div>

          {/* Feature 2 (Reversed) */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="flex flex-col md:flex-row-reverse items-center gap-16 group"
          >
            <div className="flex-1 w-full relative aspect-square max-w-lg rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] p-4 transition-transform duration-700 group-hover:scale-105">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/3d_feature_2_1788872005004.jpg" 
                  alt="AI Copilot 3D Object" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 border border-white/10">
                <Cpu size={28} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Intelligent AI Copilot</h2>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                Leverage the power of artificial intelligence to categorize bugs automatically, predict failures before they happen, and generate comprehensive weekly CTO reports.
              </p>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> Automated bug severity assessment</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> Predictive failure analysis</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> Executive weekly summaries</li>
              </ul>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="flex flex-col md:flex-row items-center gap-16 group"
          >
            <div className="flex-1 w-full relative aspect-square max-w-lg rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] p-4 transition-transform duration-700 group-hover:scale-105">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/3d_feature_3_1788872147332.jpg" 
                  alt="Enterprise Security 3D Object" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-start">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 border border-white/10">
                <Shield size={28} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Enterprise-grade Security</h2>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                Sleep soundly knowing your data is protected. With our granular Role-Based Access Control (RBAC), you decide exactly who sees what across your entire organization.
              </p>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> 5 distinct permission levels</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> Workspace and App-level isolation</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white"></div> Immutable audit logging</li>
              </ul>
            </div>
          </motion.div>

        </section>

        {/* Testimonials */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-white/5"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Loved by engineering teams.</h2>
            <p className="text-xl text-zinc-400">See what our early adopters are saying.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "BhartiAppPlus replaced three different tools we were using for monitoring and bug tracking. The AI copilot alone is worth its weight in gold.", author: "Sarah J.", role: "CTO, TechCorp" },
              { text: "The pure dark interface is incredibly easy on the eyes during late-night debugging sessions. Best developer experience I've seen in a while.", author: "Marcus T.", role: "Lead Engineer" },
              { text: "RBAC implementation is flawless. It was incredibly easy to set up isolated workspaces for our different client projects.", author: "Elena R.", role: "Project Manager" }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col gap-6">
                <div className="flex gap-1 text-amber-500">★★★★★</div>
                <p className="text-zinc-300 text-lg flex-1">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-white">{t.author}</p>
                  <p className="text-sm text-zinc-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-white/5"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing.</h2>
            <p className="text-xl text-zinc-400">Start for free, upgrade when you need more power.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Free */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
              <h3 className="text-xl font-medium text-zinc-400 mb-2">Starter</h3>
              <div className="mb-6"><span className="text-5xl font-bold text-white">$0</span><span className="text-zinc-500">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 size={18} className="text-zinc-500"/> 1 Application</li>
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 size={18} className="text-zinc-500"/> 5 Team Members</li>
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 size={18} className="text-zinc-500"/> Basic Monitoring</li>
              </ul>
              <Link href="/register" className="w-full text-center bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors">
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl bg-white/[0.05] border border-white/20 flex flex-col relative shadow-[0_0_50px_rgba(255,255,255,0.05)] transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-medium text-zinc-400 mb-2">Pro</h3>
              <div className="mb-6"><span className="text-5xl font-bold text-white">$29</span><span className="text-zinc-500">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 size={18} className="text-white"/> Unlimited Applications</li>
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 size={18} className="text-white"/> Unlimited Team Members</li>
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 size={18} className="text-white"/> Advanced RBAC Security</li>
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 size={18} className="text-white"/> AI Copilot Features</li>
              </ul>
              <Link href="/register" className="w-full text-center bg-white hover:bg-zinc-200 text-black py-3 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Upgrade to Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
              <h3 className="text-xl font-medium text-zinc-400 mb-2">Enterprise</h3>
              <div className="mb-6"><span className="text-5xl font-bold text-white">Custom</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 size={18} className="text-zinc-500"/> Custom Integrations</li>
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 size={18} className="text-zinc-500"/> Dedicated Support</li>
                <li className="flex items-center gap-3 text-zinc-300"><CheckCircle2 size={18} className="text-zinc-500"/> SLA Guarantee</li>
              </ul>
              <Link href="#" className="w-full text-center bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors">
                Contact Sales
              </Link>
            </div>

          </div>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-zinc-800 text-zinc-400 rounded flex items-center justify-center font-bold text-xs">
              B
            </div>
            <span className="font-semibold text-zinc-400">BhartiAppPlus</span>
          </div>
          <p>© {new Date().getFullYear()} Bharti Nexus. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
