import Link from "next/link";
import { ArrowRight, Activity, Shield, Cpu, Layout, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5 w-full">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Now with Role-Based Access Control
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700">
            Monitor. Manage. <br className="hidden md:block" /> Master your apps.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            BhartiAppPlus is the ultimate command center for your applications. Get real-time uptime monitoring, bug tracking, roadmap planning, and AI-powered insights all in one beautifully dark interface.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link 
              href="/register" 
              className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
            >
              Get Started for Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Activity size={24} />}
              title="Real-time Monitoring"
              description="Keep a pulse on your applications with automated uptime checks and downtime alerts."
            />
            <FeatureCard 
              icon={<Cpu size={24} />}
              title="AI Copilot"
              description="Get AI-powered insights, automated bug categorization, and weekly CTO executive reports."
            />
            <FeatureCard 
              icon={<Shield size={24} />}
              title="Enterprise Security"
              description="Robust Role-Based Access Control (RBAC) ensuring your team only sees what they need to."
            />
            <FeatureCard 
              icon={<Users size={24} />}
              title="Collaborative Bug Tracking"
              description="Report, assign, and squash bugs faster with a streamlined, clutter-free issue tracker."
            />
            <FeatureCard 
              icon={<Layout size={24} />}
              title="Roadmap Planning"
              description="Visualize your product's future, gather feedback, and prioritize features effectively."
            />
            <FeatureCard 
              icon={<Zap size={24} />}
              title="Premium Pure Dark UI"
              description="A meticulously crafted Apple-like dark mode interface designed to reduce eye strain."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-black py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
