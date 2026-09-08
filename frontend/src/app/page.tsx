import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Activity, Shield, Cpu } from "lucide-react";

export default function LandingPage() {
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
          
          <div className="flex-1 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Experience the Future of Monitoring
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700 leading-[1.1]">
              Master your apps <br /> with ultimate precision.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              BhartiAppPlus is the premium command center for your applications. Real-time monitoring, AI insights, and robust security in one breathtakingly dark interface.
            </p>
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
              <Link 
                href="/register" 
                className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
              >
                Get Started for Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full relative z-10 animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
            <div className="relative w-full aspect-square md:aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/10">
              <Image 
                src="/3d_abstract_hero_1788871973142.jpg" 
                alt="Premium 3D Abstract Shape" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Stacked Features Section */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24 space-y-32">
          
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-16 group">
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
          </div>

          {/* Feature 2 (Reversed) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16 group">
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
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col md:flex-row items-center gap-16 group">
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
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-black py-12 mt-12">
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
