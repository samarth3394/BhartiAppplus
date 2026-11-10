"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Cpu,
  Sparkles,
  Network,
  Activity,
  Terminal,
  Play,
  Check,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  ExternalLink,
  Copy,
  CheckCheck,
  Globe,
  Layers,
  Lock,
  Server,
  Database,
  Code2,
  ChevronDown,
  Menu,
  X,
  Brain,
  Bell,
  RotateCcw,
  MessageSquare
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { BrexalIntegrationsSection } from "@/components/landing/BrexalIntegrationsSection";
import { BrexalComparisonSection } from "@/components/landing/BrexalComparisonSection";
// BrexalTrustSecuritySection removed
import { BrexalFaqSection } from "@/components/landing/BrexalFaqSection";

/* ═══════════════════════════════════════════════════════════════
   1. STRIPE-STYLE NAVIGATION BAR
   ═══════════════════════════════════════════════════════════════ */
function StripeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_12px_rgba(10,37,64,0.03)] py-3 sm:py-3.5 transition-all duration-200"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-10 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group focus:outline-none shrink-0">
          <Logo className="h-5 sm:h-5.5 text-[#0A2540] group-hover:text-[#635BFF] transition-colors" />
        </Link>

        {/* Right Nav & Action CTAs Group */}
        <div className="flex items-center gap-4 xl:gap-7 shrink-0">
          {/* Stripe Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13.5px] xl:text-[14.5px] font-semibold text-[#0A2540] whitespace-nowrap">
            <div 
              className="relative cursor-pointer group flex items-center gap-1 hover:text-[#635BFF] transition-colors"
              onMouseEnter={() => setActiveDropdown("products")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#architecture">Products</Link>
              <ChevronDown size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              
              {activeDropdown === "products" && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-3 text-left">
                    <Link href="#architecture-flow" className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="font-bold text-sm text-[#0A2540]">Architecture Data Flow</div>
                      <div className="text-xs text-[#425466]">From Linux kernel sockets to Slack/PagerDuty in &lt; 90s</div>
                    </Link>
                    <Link href="#architecture" className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="font-bold text-sm text-[#0A2540]">eBPF Telemetry Mesh</div>
                      <div className="text-xs text-[#425466]">Kernel-level socket monitoring with 0% CPU overhead</div>
                    </Link>
                    <Link href="#interactive-simulator" className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="font-bold text-sm text-[#0A2540]">AI Incident Engine</div>
                      <div className="text-xs text-[#425466]">Automated root-cause commit correlation in &lt; 90s</div>
                    </Link>
                    <Link href="#developer-sandbox" className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="font-bold text-sm text-[#0A2540]">Distributed Traces</div>
                      <div className="text-xs text-[#425466]">Microsecond span waterfalls & dependency graphs</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div 
              className="relative cursor-pointer group flex items-center gap-1 hover:text-[#635BFF] transition-colors"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#comparison">Solutions</Link>
              <ChevronDown size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              
              {activeDropdown === "solutions" && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-3 text-left">
                    <div className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="font-bold text-sm text-[#0A2540]">Enterprise Kubernetes</div>
                      <div className="text-xs text-[#425466]">Multi-cluster pod routing & ingress telemetry</div>
                    </div>
                    <div className="block p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="font-bold text-sm text-[#0A2540]">Fintech & High-Throughput</div>
                      <div className="text-xs text-[#425466]">Sub-millisecond SLA enforcement & audits</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="#developer-sandbox" className="hover:text-[#635BFF] transition-colors">
              Developers
            </Link>
            <Link href="#pricing" className="hover:text-[#635BFF] transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Action CTAs & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/login"
              className="text-[13px] sm:text-[14px] font-bold text-[#0A2540] hover:text-[#635BFF] px-2 sm:px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="group px-3.5 py-2 sm:px-4.5 sm:py-2.5 rounded-full bg-[#0A2540] hover:bg-[#635BFF] text-white text-[12.5px] sm:text-[13.5px] font-bold transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Start now</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#0A2540] hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-5 space-y-4 shadow-xl text-left">
          <div className="space-y-1">
            <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#635BFF] px-3 py-1">
              Navigation
            </div>
            <Link
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-[#0A2540] hover:bg-slate-50 transition-colors"
            >
              eBPF Telemetry Mesh
            </Link>
            <Link
              href="#interactive-simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-[#0A2540] hover:bg-slate-50 transition-colors"
            >
              AI Incident Radar
            </Link>
            <Link
              href="#developer-sandbox"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-[#0A2540] hover:bg-slate-50 transition-colors"
            >
              Distributed Traces & Sandbox
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-[#0A2540] hover:bg-slate-50 transition-colors"
            >
              Transparent Pricing
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full bg-[#1868DB] hover:bg-[#1356ba] text-white text-center font-bold text-sm shadow-md"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full border border-slate-300 bg-white text-center font-bold text-sm text-[#0A2540]"
            >
              Sign In to Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BROWSER MOCKUP FRAME (MACOS WINDOW WITH URL BAR)
   ═══════════════════════════════════════════════════════════════ */
interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

function BrowserFrame({ url = "console.bhartinexus.io", children, className = "" }: BrowserFrameProps) {
  return (
    <div className={`rounded-xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-[0_20px_50px_rgba(10,37,64,0.09)] overflow-hidden ${className}`}>
      {/* Browser Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-slate-50/90 border-b border-slate-200/80">
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF5F56]/90 border border-[#E0443E]/50" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFBD2E]/90 border border-[#DEA123]/50" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27C93F]/90 border border-[#1AAB29]/50" />
        </div>
        <div className="flex-1 max-w-[190px] sm:max-w-sm mx-auto flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md bg-white border border-slate-200/70 text-[10px] sm:text-[11px] font-mono text-slate-500 font-medium truncate">
          <Lock size={10} className="text-slate-400 shrink-0" />
          <span className="truncate">{url}</span>
        </div>
      </div>
      {/* Window Body */}
      <div className="relative bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO INSTANT SIGNUP CARD (CLEAN & COMPACT)
   ═══════════════════════════════════════════════════════════════ */
function HeroSignupCard() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `/register?email=${encodeURIComponent(email)}`;
    } else {
      window.location.href = "/register";
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-transparent p-0 flex flex-col text-left mb-4 sm:mb-5">
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <label className="block text-[13px] sm:text-[13.5px] font-bold text-[#0A2540] mb-1">
          Work email
        </label>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3 min-h-[44px] rounded-xl border border-slate-300 bg-white text-[#0A2540] placeholder:text-slate-400 text-sm font-medium outline-none focus:border-[#635BFF] focus:ring-3 focus:ring-[#635BFF]/15 transition-all shadow-2xs"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 min-h-[44px] rounded-xl bg-[#1868DB] hover:bg-[#1356ba] text-white font-bold text-sm tracking-wide transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Sign up</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <p className="text-[11.5px] sm:text-[12px] text-[#425466] mt-1.5 font-medium leading-relaxed">
          Use a work email to find teammates and get access to BREXAL AI
        </p>
      </form>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-3 text-[10.5px] sm:text-[11px] uppercase tracking-wider text-[#425466] font-bold">
          Or continue with
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <button
        type="button"
        onClick={() => { window.location.href = "/register"; }}
        className="w-full py-2.5 sm:py-3 min-h-[44px] rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-[#0A2540] font-bold text-sm flex items-center justify-center gap-2.5 transition-colors hover:border-[#0A2540] shadow-2xs active:bg-slate-100"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Google</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STRIPE COLOR GRID BACKGROUND (THE ICONIC SKEWED MESH & GRID)
   ═══════════════════════════════════════════════════════════════ */
function StripeColorGridCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      
      {/* ── SKEWED SLANTED CANVAS WRAPPER (STRIPE SIGNATURE -8deg SKEW) ── */}
      <div 
        className="absolute -top-40 left-[-15%] w-[130%] h-[680px] sm:h-[720px] md:h-[760px] origin-top-left"
        style={{
          transform: "skewY(-7.5deg)",
        }}
      >
        {/* Layer 1: Vibrant Stripe Multi-Color Gradient Mesh */}
        <div className="absolute inset-0">
          {/* Top-Right: Warm Sunset Coral & Amber */}
          <div className="absolute top-0 right-[6%] w-[600px] h-[540px] bg-gradient-to-bl from-[#FF725E] via-[#FF5894] to-transparent rounded-full blur-[80px] opacity-80" />
          
          {/* Center-Top: Iconic Stripe Blurple / Indigo */}
          <div className="absolute -top-16 left-[32%] w-[680px] h-[580px] bg-gradient-to-br from-[#635BFF] via-[#7A73FF] to-[#00D4FF] rounded-full blur-[90px] opacity-85" />
          
          {/* Left: Electric Cyan & Turquoise */}
          <div className="absolute top-10 left-[4%] w-[580px] h-[500px] bg-gradient-to-r from-[#00D4FF] via-[#80E9FF] to-[#635BFF] rounded-full blur-[85px] opacity-80" />
          
          {/* Bottom-Center: Mint Cyan & Deep Indigo Accent */}
          <div className="absolute bottom-10 left-[24%] w-[720px] h-[420px] bg-gradient-to-tr from-[#A6FFCB]/75 via-[#00D4FF]/65 to-[#635BFF]/55 rounded-full blur-[80px] opacity-75" />
          
          {/* Bottom-Right: Hot Pink Glow */}
          <div className="absolute bottom-4 right-[16%] w-[480px] h-[400px] bg-gradient-to-tl from-[#FF2E93] via-[#FF5894] to-transparent rounded-full blur-[75px] opacity-70" />
        </div>

        {/* Layer 2: The Iconic Technical Grid Pattern (Stripe Color Grid) */}
        <div 
          className="absolute inset-0 opacity-65"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.55) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.55) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px"
          }}
        />

        {/* Layer 3: Secondary Crisp Dark Grid Lines for Contrast on Bright Hues */}
        <div 
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #0A2540 1px, transparent 1px),
              linear-gradient(to bottom, #0A2540 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px"
          }}
        />

        {/* Layer 4: Grid Intersection Crosshair Dots */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.9) 1.5px, transparent 1.5px)",
            backgroundSize: "44px 44px"
          }}
        />

        {/* Layer 5: Glowing Highlighted Tech Grid Cells */}
        <div className="absolute inset-0">
          <div className="absolute top-[176px] left-[352px] w-[88px] h-[44px] bg-white/20 border border-white/50 rounded-xs backdrop-blur-xs shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
          <div className="absolute top-[264px] right-[308px] w-[44px] h-[88px] bg-white/25 border border-white/60 rounded-xs backdrop-blur-xs shadow-[0_0_25px_rgba(255,255,255,0.5)]" />
          <div className="absolute top-[352px] left-[220px] w-[132px] h-[44px] bg-[#635BFF]/30 border border-white/40 rounded-xs backdrop-blur-xs" />
          <div className="absolute top-[132px] right-[440px] w-[44px] h-[44px] bg-[#FF5894]/30 border border-white/40 rounded-xs backdrop-blur-xs" />
          <div className="absolute top-[308px] right-[176px] w-[88px] h-[44px] bg-[#00D4FF]/30 border border-white/40 rounded-xs backdrop-blur-xs" />
        </div>

        {/* Layer 6: Soft Glassmorphism Sheen Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/40 pointer-events-none" />
      </div>

      {/* ── SMOOTH DISSOLVE MASK INTO PAGE WHITE ── */}
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-32 bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none" />
      
      {/* ── SUBTLE GLOBAL AMBIENT DOT GRID ON BASE ── */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0A2540 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. STRIPE HERO SECTION WITH ICONIC ANGLED GRADIENT CANVAS
   ═══════════════════════════════════════════════════════════════ */
function StripeHeroSection() {
  return (
    <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-14 px-4 sm:px-10 overflow-hidden bg-white">
      
      {/* ── THE SIGNATURE STRIPE COLOR GRID CANVAS ── */}
      <StripeColorGridCanvas />

      <div className="max-w-[1320px] mx-auto text-left relative z-10">
        
        {/* TWO-COLUMN STRIPE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (5 cols): Editorial Copy & Quick Signup */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            
            {/* Top Pill Eyebrow */}
            <Link 
              href="#interactive-simulator" 
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-3 sm:mb-4 hover:border-[#635BFF]/40 transition-colors"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#635BFF] animate-pulse" />
              <span className="text-[11px] sm:text-[12px] font-bold text-[#0A2540]">
                Now in GA: Autonomous eBPF Telemetry Mesh 3.0
              </span>
              <ChevronRight size={13} className="text-[#635BFF] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Refined Headline (Compact & Modern Sans) */}
            <h1 className="font-sans text-[26px] sm:text-3xl md:text-[34px] lg:text-[38px] font-bold tracking-[-0.025em] text-[#0A2540] leading-[1.18] mb-2.5 sm:mb-3 text-left">
              Autonomous telemetry <br className="hidden sm:inline" />
              infrastructure for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">
                modern cloud systems.
              </span>
            </h1>

            {/* Supporting Subhead */}
            <p className="text-[14.5px] sm:text-[16px] text-[#425466] font-normal leading-relaxed mb-4 sm:mb-5 text-left">
              Millions of requests across Kubernetes, microservices, and databases are monitored in real time with BREXAL. Synthesize logs, kernel traces, and metrics into self-healing incident intelligence.
            </p>

            {/* Instant Signup Card */}
            <HeroSignupCard />

            {/* Reassurance Micro-Metrics */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[11.5px] sm:text-[12px] font-semibold text-[#425466] pt-0.5">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600 font-bold shrink-0" /> Free developer tier
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600 font-bold shrink-0" /> Zero bytecode injection
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600 font-bold shrink-0" /> SOC-2 Type II Certified
              </span>
            </div>

          </div>

          {/* Right Column (7 cols): Layered Futuristic Visual Showcase (shot-3 + shot-1) */}
          <div className="lg:col-span-7 relative w-full pt-2 lg:pt-0 pb-3 sm:pb-5 lg:pb-2">
            
            {/* Ambient Multi-Color Gradient Mesh Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#635BFF]/30 via-[#00D4FF]/25 to-[#FF5894]/25 rounded-3xl blur-3xl opacity-75 -z-10" />
            
            {/* Main Background Window: shot-3.png (Console Dashboard Overview) */}
            <BrowserFrame url="console.bhartinexus.io/dashboard" className="transition-transform duration-300 hover:scale-[1.01]">
              <div className="relative">
                <img
                  src="/showcase/shot-3.png"
                  alt="Bharti Nexus Telemetry Console Overview"
                  className="w-full h-auto block select-none"
                />
                {/* Subtle Modern Futuristic Color Grading Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#635BFF]/5 via-transparent to-[#00D4FF]/5 pointer-events-none" />
              </div>
            </BrowserFrame>

            {/* Overlapping Corner Card: shot-1.png (Live Telemetry Cockpit) */}
            <div className="absolute -bottom-3 -left-2 sm:-bottom-5 sm:-left-5 w-[68%] sm:w-[54%] z-20 transition-transform duration-300 hover:-translate-y-1">
              <div className="rounded-xl sm:rounded-2xl border-2 border-white/95 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_-10px_rgba(10,37,64,0.28)] overflow-hidden ring-1 ring-slate-900/10">
                <div className="px-2.5 sm:px-3 py-1.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9.5px] sm:text-[10px] font-mono font-bold text-[#0A2540] uppercase tracking-wider">Live Mesh Ingress</span>
                  </div>
                  <span className="text-[8.5px] sm:text-[9.5px] font-mono font-extrabold text-[#635BFF]">0.84ms P99</span>
                </div>
                <div className="relative">
                  <img
                    src="/showcase/shot-1.png"
                    alt="Live Telemetry Ingress Probe"
                    className="w-full h-auto block select-none"
                  />
                  {/* Subtle Corner Vignette & Glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#635BFF]/10 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. STRIPE CLIENT MARQUEE (TRUSTED INFRASTRUCTURE)
   ═══════════════════════════════════════════════════════════════ */
function StripeClientMarquee() {
  const logos = [
    { name: "Amazon AWS", code: "AWS" },
    { name: "Google Cloud", code: "GCP" },
    { name: "Cloudflare", code: "CF" },
    { name: "Kubernetes", code: "K8S" },
    { name: "Docker", code: "DCK" },
    { name: "OpenAI", code: "OAI" },
    { name: "Anthropic", code: "ANT" },
    { name: "PostgreSQL", code: "PG" },
    { name: "Redis", code: "RDS" },
  ];

  return (
    <section className="py-6 sm:py-8 border-t border-b border-slate-200/80 bg-[#FAFBFD] px-4 sm:px-10">
      <div className="max-w-[1320px] mx-auto">
        <p className="text-center font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#425466] mb-3 sm:mb-4">
          Powering mission-critical platforms and distributed engineering teams
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-14 opacity-80 hover:opacity-100 transition-opacity">
          {logos.map((lg, i) => (
            <div key={i} className="flex items-center gap-1.5 sm:gap-2 group cursor-default">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#0A2540]/30 group-hover:bg-[#635BFF] transition-colors" />
              <span className="font-mono text-xs sm:text-base font-extrabold text-[#0A2540] tracking-wider uppercase">
                {lg.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OFFICIAL TECH LOGOS FOR ARCHITECTURE FLOW (EXACT AS SPEC)
   ═══════════════════════════════════════════════════════════════ */
function KubernetesLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-gradient-to-br from-[#1E60ED] to-[#0D4ECC] flex items-center justify-center p-2 shadow-sm shrink-0`}>
      <img src="/k8s-wheel.svg" alt="Kubernetes" className="w-8 h-8 object-contain drop-shadow-xs" />
    </div>
  );
}

function EbpfLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center shrink-0`}>
      <img src="/ebpf-bee.svg" alt="eBPF Kernel Probe" className="w-11 h-11 object-contain drop-shadow-xs" />
    </div>
  );
}

function NeuralEngineLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-[#E1EFFF] border border-blue-200/70 flex items-center justify-center p-2 shadow-xs shrink-0`}>
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-[#2563EB]">
        {/* Microchip Body */}
        <rect x="7" y="7" width="18" height="18" rx="4" stroke="#2563EB" strokeWidth="2" fill="#DBEAFE" fillOpacity="0.3" />
        {/* Top Pins (3) */}
        <line x1="11" y1="3" x2="11" y2="7" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="3" x2="16" y2="7" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="21" y1="3" x2="21" y2="7" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        {/* Bottom Pins (3) */}
        <line x1="11" y1="25" x2="11" y2="29" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="25" x2="16" y2="29" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="21" y1="25" x2="21" y2="29" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        {/* Left Pins (3) */}
        <line x1="3" y1="11" x2="7" y2="11" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="16" x2="7" y2="16" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="21" x2="7" y2="21" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        {/* Right Pins (3) */}
        <line x1="25" y1="11" x2="29" y2="11" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="16" x2="29" y2="16" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="21" x2="29" y2="21" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        {/* Neural Braces Code Synapse */}
        <path d="M13.5 11.5c-1.2 0-1.8.6-1.8 1.6v.9c0 1-.6 1.6-1.7 1.8 1.1.2 1.7.8 1.7 1.8v.9c0 1 .6 1.6 1.8 1.6" stroke="#1D4ED8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M18.5 11.5c1.2 0 1.8.6 1.8 1.6v.9c0 1 .6 1.6 1.7 1.8-1.1.2-1.7.8-1.7 1.8v.9c0 1-.6 1.6-1.8 1.6" stroke="#1D4ED8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <circle cx="16" cy="13.5" r="1" fill="#2563EB" />
        <circle cx="16" cy="18.5" r="1" fill="#2563EB" />
      </svg>
    </div>
  );
}

function SlackLogo({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-[#F8FAFC] border border-slate-200/60 flex items-center justify-center p-2 shadow-2xs shrink-0`}>
      <img src="/slack-logo.svg" alt="Slack" className="w-7 h-7 object-contain" />
    </div>
  );
}

function PagerDutyLogo({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-[#F0FDF4] border border-emerald-100 flex items-center justify-center p-2 shadow-2xs shrink-0`}>
      <img src="/pagerduty-logo.svg" alt="PagerDuty" className="w-6 h-6 object-contain" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3.5. INTERACTIVE ANIMATED ARCHITECTURE DATA FLOW (EXACT SPEC)
   ═══════════════════════════════════════════════════════════════ */
function StripeArchitectureFlowSection() {
  const [simulating, setSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleTriggerFlow = () => {
    if (simulating) return;
    setSimulating(true);
    setActiveStep(1);

    setTimeout(() => setActiveStep(2), 700);
    setTimeout(() => setActiveStep(3), 1500);
    setTimeout(() => setActiveStep(4), 2300);
    setTimeout(() => {
      setSimulating(false);
      setActiveStep(null);
    }, 3800);
  };

  return (
    <section id="architecture-flow" className="py-16 sm:py-20 md:py-24 px-4 sm:px-10 bg-white border-b border-slate-200/80 relative overflow-hidden font-sans">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-r from-blue-100/40 via-sky-50/30 to-emerald-50/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto text-center relative z-10">
        
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-8 h-[1px] bg-slate-300" />
          <span className="text-[11px] sm:text-[12px] font-mono font-bold uppercase tracking-widest text-slate-500">
            ARCHITECTURE FLOW
          </span>
          <span className="w-8 h-[1px] bg-slate-300" />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold tracking-[-0.03em] text-[#0A2540] mb-3 leading-tight">
          From Your Workload <span className="text-[#2563EB]">to Action</span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#425466] max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-14">
          See how telemetry flows from your Kubernetes workloads through eBPF and BREXAL&apos;s AI engine to the tools your team already uses.
        </p>

        {/* Interactive Simulation Trigger Button */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <button
            onClick={handleTriggerFlow}
            disabled={simulating}
            className={`inline-flex items-center gap-2 px-4.5 py-2 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
              simulating
                ? "bg-blue-50 text-blue-700 border border-blue-300"
                : "bg-white hover:bg-slate-50 text-[#0A2540] border border-slate-300 hover:border-blue-400 hover:shadow-md"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${simulating ? "bg-blue-600 animate-ping" : "bg-blue-500"}`} />
            <span>{simulating ? "Simulating Telemetry Pipeline Flow..." : "Test Interactive Data Flow"}</span>
          </button>
        </div>

        {/* ── DIAGRAM CONTAINER ── */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-3 xl:gap-4 max-w-[1240px] mx-auto">
          
          {/* 1. Your Kubernetes Pod */}
          <div
            className={`w-full lg:w-[230px] xl:w-[245px] bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 text-left transition-all duration-300 shadow-[0_2px_12px_rgba(10,37,64,0.03)] shrink-0 ${
              activeStep === 1
                ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg -translate-y-1"
                : "border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <KubernetesLogo />
            <div>
              <h3 className="text-[13.5px] sm:text-[14px] font-extrabold text-[#0A2540] leading-snug mb-1">
                Your Kubernetes Pod
              </h3>
              <p className="text-[11.5px] text-[#425466] leading-relaxed">
                Application, logs, metrics and network events
              </p>
            </div>
          </div>

          {/* Arrow 1 (Desktop: Horizontal / Mobile: Vertical) */}
          <div className="hidden lg:flex items-center justify-center text-blue-500 w-8 xl:w-10 shrink-0">
            <svg viewBox="0 0 36 16" className="w-9 h-4 stroke-current fill-none">
              <line x1="0" y1="8" x2="28" y2="8" strokeWidth="1.8" strokeDasharray={activeStep === 1 ? "3 3" : "none"} />
              <polyline points="24,4 30,8 24,12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="lg:hidden flex items-center justify-center text-blue-500">
            <svg viewBox="0 0 16 28" className="w-4 h-7 stroke-current fill-none">
              <line x1="8" y1="0" x2="8" y2="22" strokeWidth="1.8" />
              <polyline points="4,18 8,24 12,18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 2. eBPF Kernel Probe */}
          <div
            className={`w-full lg:w-[230px] xl:w-[245px] bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 text-left transition-all duration-300 shadow-[0_2px_12px_rgba(10,37,64,0.03)] shrink-0 ${
              activeStep === 2
                ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg -translate-y-1"
                : "border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <EbpfLogo />
            <div>
              <h3 className="text-[13.5px] sm:text-[14px] font-extrabold text-[#0A2540] leading-snug mb-1">
                eBPF Kernel Probe
              </h3>
              <p className="text-[11.5px] text-[#425466] leading-relaxed">
                Kernel-level telemetry with minimal overhead
              </p>
            </div>
          </div>

          {/* Arrow 2 (Desktop: Horizontal / Mobile: Vertical) */}
          <div className="hidden lg:flex items-center justify-center text-blue-500 w-8 xl:w-10 shrink-0">
            <svg viewBox="0 0 36 16" className="w-9 h-4 stroke-current fill-none">
              <line x1="0" y1="8" x2="28" y2="8" strokeWidth="1.8" strokeDasharray={activeStep === 2 ? "3 3" : "none"} />
              <polyline points="24,4 30,8 24,12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="lg:hidden flex items-center justify-center text-blue-500">
            <svg viewBox="0 0 16 28" className="w-4 h-7 stroke-current fill-none">
              <line x1="8" y1="0" x2="8" y2="22" strokeWidth="1.8" />
              <polyline points="4,18 8,24 12,18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 3. BREXAL Neural Engine (Featured Center Card) */}
          <div
            className={`w-full lg:w-[275px] xl:w-[295px] relative rounded-2xl border-2 p-5 sm:p-5.5 text-left transition-all duration-300 shadow-[0_8px_24px_rgba(37,99,235,0.08)] shrink-0 ${
              activeStep === 3
                ? "bg-[#EBF5FF] border-[#2563EB] ring-3 ring-blue-500/25 shadow-xl -translate-y-1"
                : "bg-[#F0F7FF] border-[#60A5FA]"
            }`}
          >
            {/* Top Right AI Engine Badge */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-700 text-[10.5px] font-bold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>AI Engine</span>
            </div>

            <div className="flex items-center gap-3.5 pt-2 sm:pt-1">
              <NeuralEngineLogo />
              <div className="pr-1">
                <h3 className="text-[14.5px] sm:text-[15px] font-black text-[#0A2540] leading-snug mb-1">
                  BREXAL Neural Engine
                </h3>
                <p className="text-[11.5px] text-[#425466] leading-relaxed">
                  AI-driven analysis, anomaly detection and root cause
                </p>
              </div>
            </div>
          </div>

          {/* Branching Connector 3 (Desktop: Curved Fork to Slack & PagerDuty) */}
          <div className="hidden lg:block w-12 xl:w-14 h-40 relative shrink-0">
            <svg viewBox="0 0 54 160" className="w-full h-full stroke-blue-500 fill-none overflow-visible">
              {/* Top Branch to Slack */}
              <path
                d="M 0 80 C 24 80, 24 35, 46 35"
                strokeWidth="1.8"
                strokeDasharray={activeStep === 4 ? "3 3" : "none"}
              />
              <polyline points="40,30 48,35 40,40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Bottom Branch to PagerDuty */}
              <path
                d="M 0 80 C 24 80, 24 125, 46 125"
                strokeWidth="1.8"
                strokeDasharray={activeStep === 4 ? "3 3" : "none"}
              />
              <polyline points="40,120 48,125 40,130" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="lg:hidden flex items-center justify-center text-blue-500">
            <svg viewBox="0 0 16 28" className="w-4 h-7 stroke-current fill-none">
              <line x1="8" y1="0" x2="8" y2="22" strokeWidth="1.8" />
              <polyline points="4,18 8,24 12,18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 4 & 5. Right Column Stack (Slack & PagerDuty) */}
          <div className="flex flex-col gap-3.5 w-full lg:w-[230px] xl:w-[245px] shrink-0">
            
            {/* Slack */}
            <div
              className={`bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 text-left transition-all duration-300 shadow-[0_2px_12px_rgba(10,37,64,0.03)] ${
                activeStep === 4
                  ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg -translate-y-0.5"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              <SlackLogo />
              <div>
                <h3 className="text-[13.5px] sm:text-[14px] font-extrabold text-[#0A2540] leading-snug mb-1">
                  Slack
                </h3>
                <p className="text-[11.5px] text-[#425466] leading-relaxed">
                  Real-time alerts and updates to your team
                </p>
              </div>
            </div>

            {/* PagerDuty */}
            <div
              className={`bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 text-left transition-all duration-300 shadow-[0_2px_12px_rgba(10,37,64,0.03)] ${
                activeStep === 4
                  ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg -translate-y-0.5"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              <PagerDutyLogo />
              <div>
                <h3 className="text-[13.5px] sm:text-[14px] font-extrabold text-[#0A2540] leading-snug mb-1">
                  PagerDuty
                </h3>
                <p className="text-[11.5px] text-[#425466] leading-relaxed">
                  Critical incident alerts and on-call escalation
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. LAYERED PRODUCT SHOWCASES (CORNER-OVERLAPPING PANELS)
   ═══════════════════════════════════════════════════════════════ */
function StripeProductShowcaseSection() {
  return (
    <section id="architecture" className="py-10 sm:py-14 md:py-18 px-4 sm:px-10 bg-white border-b border-slate-200/80 relative overflow-hidden">
      
      {/* Ambient subtle color grading meshes behind the showcases */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-[#FF725E]/15 via-[#635BFF]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#00D4FF]/15 via-[#10B981]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto space-y-12 sm:space-y-16 md:space-y-20">

        {/* ── SHOWCASE A: SPRINT VELOCITY & LIVE BUG RADAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Editorial Left */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="text-[11px] sm:text-[11.5px] font-mono font-bold text-[#635BFF] uppercase tracking-widest mb-2">
              Engineering Velocity
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-[40px] font-extrabold tracking-[-0.035em] text-[#0A2540] leading-[1.15] mb-3 sm:mb-3.5">
              Agile sprint pipelines with autonomous bug watchdogs.
            </h2>
            <p className="text-sm sm:text-base text-[#425466] leading-relaxed mb-4 sm:mb-5 font-normal">
              Track multi-engineer sprint deliverables in lockstep with automated production regression feeds. Critical runtime anomalies are mapped directly to git commits before impacting customers.
            </p>

            <div className="space-y-2.5 mb-4 sm:mb-5 w-full">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#0A2540] font-semibold">
                  Live Kanban boards synchronized with GitHub and GitLab pull requests
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#0A2540] font-semibold">
                  Zero-latency regression radar with automated issue severity tags
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#0A2540] font-semibold">
                  Automated commit correlation & fast rollback recommendations
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#635BFF] hover:text-[#0A2540] transition-colors"
            >
              <span>Explore engineering workflows</span>
              <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Layered Visual Right: shot-4 (Kanban Board) + shot-5 (Issues & Bugs) */}
          <div className="lg:col-span-7 relative w-full pt-2 lg:pt-0 pb-3 sm:pb-5 lg:pb-2">
            {/* Warm Sunset / Amber-Violet Ambient Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF725E]/20 via-[#635BFF]/25 to-[#00D4FF]/20 rounded-3xl blur-3xl opacity-75 -z-10" />
            
            {/* Background Browser Window: shot-4.png (Kanban Board) */}
            <BrowserFrame url="git.bhartinexus.io/sprints/active" className="transition-transform duration-300 hover:scale-[1.01]">
              <div className="relative">
                <img
                  src="/showcase/shot-4.png"
                  alt="Engineering Sprint Kanban Board"
                  className="w-full h-auto block select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#635BFF]/5 via-transparent to-[#FF725E]/5 pointer-events-none" />
              </div>
            </BrowserFrame>

            {/* Overlapping Corner Card: shot-5.png (Issues & Bugs Feed) */}
            <div className="absolute -bottom-3 -left-2 sm:-bottom-5 sm:-left-5 w-[75%] sm:w-[60%] z-20 transition-transform duration-300 hover:-translate-y-1">
              <div className="rounded-xl sm:rounded-2xl border-2 border-white/95 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_-10px_rgba(10,37,64,0.28)] overflow-hidden ring-1 ring-slate-900/10">
                <div className="px-2.5 sm:px-3.5 py-1.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#0A2540] uppercase tracking-wider">AI Watchdog</span>
                  </div>
                  <span className="text-[8.5px] sm:text-[9.5px] font-mono font-bold text-rose-600 bg-rose-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-rose-200">
                    2 Critical
                  </span>
                </div>
                <div className="relative">
                  <img
                    src="/showcase/shot-5.png"
                    alt="Active Issues and Bug Traces"
                    className="w-full h-auto block select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ── SHOWCASE B: TEAM GOVERNANCE & MULTI-CLUSTER INFRASTRUCTURE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Layered Visual Left: shot-2 (Team Access) + shot-6 (Infrastructure Nodes) */}
          <div className="lg:col-span-7 relative w-full order-2 lg:order-1 pt-2 lg:pt-0 pb-3 sm:pb-5 lg:pb-2">
            {/* Tech Cyan / Emerald Ambient Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#00D4FF]/25 via-[#10B981]/25 to-[#635BFF]/20 rounded-3xl blur-3xl opacity-75 -z-10" />
            
            {/* Background Browser Window: shot-2.png (Team Access Control) */}
            <BrowserFrame url="auth.bhartinexus.io/organization/members" className="transition-transform duration-300 hover:scale-[1.01]">
              <div className="relative">
                <img
                  src="/showcase/shot-2.png"
                  alt="Team Governance and Access Control"
                  className="w-full h-auto block select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/5 via-transparent to-[#00D4FF]/5 pointer-events-none" />
              </div>
            </BrowserFrame>

            {/* Overlapping Corner Card: shot-6.png (Infrastructure & Worker Nodes) */}
            <div className="absolute -bottom-3 -right-2 sm:-bottom-5 sm:-right-5 w-[72%] sm:w-[58%] z-20 transition-transform duration-300 hover:-translate-y-1">
              <div className="rounded-xl sm:rounded-2xl border-2 border-white/95 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_-10px_rgba(10,37,64,0.28)] overflow-hidden ring-1 ring-slate-900/10">
                <div className="px-2.5 sm:px-3.5 py-1.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#0A2540] uppercase tracking-wider">Cluster Telemetry</span>
                  </div>
                  <span className="text-[8.5px] sm:text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200">
                    99.99% Uptime
                  </span>
                </div>
                <div className="relative">
                  <img
                    src="/showcase/shot-6.png"
                    alt="Active Worker Nodes and Hardware Telemetry"
                    className="w-full h-auto block select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>

          {/* Editorial Right */}
          <div className="lg:col-span-5 flex flex-col items-start text-left order-1 lg:order-2">
            <div className="text-[11px] sm:text-[11.5px] font-mono font-bold text-emerald-600 uppercase tracking-widest mb-2">
              Infrastructure & Governance
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-[40px] font-extrabold tracking-[-0.035em] text-[#0A2540] leading-[1.15] mb-3 sm:mb-3.5">
              Enterprise team controls with hardware node telemetry.
            </h2>
            <p className="text-sm sm:text-base text-[#425466] leading-relaxed mb-4 sm:mb-5 font-normal">
              Manage architectural ownership, RBAC permissions, and multi-tenant audit logs alongside live CPU, memory, NVMe disk, and network throughput across every cloud cluster.
            </p>

            <div className="space-y-2.5 mb-4 sm:mb-5 w-full">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#0A2540] font-semibold">
                  Granular role-based access control (RBAC) with audit verification
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#0A2540] font-semibold">
                  Microsecond node metrics: 34.8% CPU, 58.2% RAM, 1.8 Gbps network
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#0A2540] font-semibold">
                  Automated security audit log streams and team invite workflows
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-[#0A2540] transition-colors"
            >
              <span>View cluster architecture</span>
              <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. STRIPE DEVELOPER SECTION (DARK CONTRAST IDE / PLAYGROUND)
   ═══════════════════════════════════════════════════════════════ */
function StripeDeveloperSandboxSection() {
  const [activeLang, setActiveLang] = useState<"curl" | "python" | "go" | "helm">("curl");
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    curl: `curl -X POST https://api.bhartinexus.com/v1/telemetry/probes \\
  -H "Authorization: Bearer bx_live_9f82a17b" \\
  -H "Content-Type: application/json" \\
  -d '{
    "cluster": "k8s-us-east-prod",
    "ebpf_filter": "socket.latency > 15ms",
    "sampling_rate": 1.0,
    "auto_mitigation": true
  }'`,
    python: `from brexal import TelemetryEngine

# Zero-overhead eBPF initialization
client = TelemetryEngine(api_key="bx_live_9f82a17b")

@client.watch_cluster("k8s-us-east-prod")
def on_anomaly_detected(incident):
    print(f"P0 Alert: {incident.root_cause_commit}")
    incident.auto_mitigate(strategy="canary_rollback")`,
    go: `package main

import (
	"context"
	"github.com/bhartinexus/brexal-go"
)

func main() {
	mesh := brexal.NewMeshClient("bx_live_9f82a17b")
	mesh.AttachKernelProbe(context.Background(), &brexal.ProbeConfig{
		Cluster: "k8s-us-east-prod",
		Tracing: brexal.MicrosecondWaterfalls,
	})
}`,
    helm: `helm repo add brexal https://charts.bhartinexus.com
helm install brexal-agent brexal/ebpf-mesh \\
  --set apiKey="bx_live_9f82a17b" \\
  --set clusterName="k8s-us-east-prod" \\
  --set autoDiscovery=true`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developer-sandbox" className="relative py-10 sm:py-14 md:py-18 px-4 sm:px-10 bg-[#0A2540] text-white overflow-hidden">
      {/* Background Subtle Gradient & Mesh Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-br from-[#635BFF]/20 via-[#00D4FF]/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[350px] bg-gradient-to-tr from-[#00D4FF]/15 via-transparent to-transparent rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto text-left relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-6 sm:mb-8 text-left">
          {/* Eyebrow: Dual Font Style (Designed for in Modern Sans, Developers in Futuristic Mono Badge) */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="font-sans text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.22em] text-[#00D4FF]">
              Designed for
            </span>
            <span className="font-mono text-[11px] sm:text-[12px] font-bold uppercase tracking-widest text-white px-2.5 py-0.5 rounded-md bg-white/10 border border-white/20 shadow-xs">
              Developers
            </span>
          </div>

          {/* Headline: Futuristic Space Grotesk Font, Pure 100% White */}
          <h2 className="font-space text-2xl sm:text-4xl md:text-[42px] font-bold tracking-[-0.03em] text-white leading-[1.18] mb-3">
            The world’s most powerful and developer-friendly telemetry engine.
          </h2>

          {/* Subhead: Clean Modern Sans, High Contrast Pure Text */}
          <p className="font-sans text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            We obsess over developer experience. Instrument your entire distributed system in two lines of code without rebuilding Docker containers.
          </p>
        </div>

        {/* Split Sandbox Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* Left: Code Snippet Panel */}
          <div className="lg:col-span-7 bg-[#07101E] rounded-2xl sm:rounded-3xl border border-[#1C2E4A] p-4 sm:p-6 md:p-7 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
            <div>
              {/* Language Switcher Tabs */}
              <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#1C2E4A] mb-3 sm:mb-4 font-mono text-xs gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full">
                  {(["curl", "python", "go", "helm"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all uppercase text-[11px] sm:text-xs shrink-0 ${
                        activeLang === lang
                          ? "bg-[#635BFF] text-white shadow-sm"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors text-[11px] sm:text-xs shrink-0 border border-white/10"
                >
                  {copied ? <CheckCheck size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Code Pre Block */}
              <pre className="font-mono text-xs sm:text-[13.5px] leading-relaxed text-white overflow-x-auto whitespace-pre p-1">
                <code>{codeSnippets[activeLang]}</code>
              </pre>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-[#1C2E4A] mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-400 gap-2">
              <span>Client SDK v3.2.0 • Zero dependencies</span>
              <Link href="/dashboard" className="text-[#00D4FF] hover:underline font-bold flex items-center gap-1">
                <span>View Full API Reference</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right: Simulated Real-Time Response Payload */}
          <div className="lg:col-span-5 bg-[#07101E] rounded-2xl sm:rounded-3xl border border-[#1C2E4A] p-4 sm:p-6 md:p-7 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.5)] font-mono text-xs overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#1C2E4A] mb-3 sm:mb-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white uppercase text-[11px] sm:text-xs">Live Ingestion</span>
                </div>
                <span className="text-emerald-400 font-bold text-[11px] sm:text-xs">200 OK (0.84ms)</span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#030712] border border-[#1C2E4A] text-[11px] sm:text-[12px] text-white space-y-1.5 overflow-x-auto">
                <div className="text-emerald-400">&#123;</div>
                <div className="pl-3 sm:pl-4 text-white">&quot;status&quot;: &quot;MESH_ACTIVE&quot;,</div>
                <div className="pl-3 sm:pl-4 text-white">&quot;cluster_id&quot;: &quot;k8s-us-east-prod&quot;,</div>
                <div className="pl-3 sm:pl-4 text-white">&quot;ebpf_socket_probes&quot;: 14,</div>
                <div className="pl-3 sm:pl-4 text-white">&quot;p99_latency_ms&quot;: 0.84,</div>
                <div className="pl-3 sm:pl-4 text-white">&quot;anomaly_detection_model&quot;: &quot;brexal-v3&quot;,</div>
                <div className="pl-3 sm:pl-4 text-white">&quot;auto_mitigation_ready&quot;: true</div>
                <div className="text-emerald-400">&#125;</div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-[#1C2E4A] mt-3 sm:mt-4">
              <div className="flex items-center justify-between text-slate-400 text-[10.5px] sm:text-[11.5px]">
                <span>Kernel eBPF Filter: OK</span>
                <span className="text-emerald-400 font-bold">0.0% CPU penalty</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. STRIPE GLOBAL SCALE & RELIABILITY NUMBERS
   ═══════════════════════════════════════════════════════════════ */
function StripeGlobalScaleSection() {
  const stats = [
    { number: "250M+", label: "Telemetry Spans / Sec", desc: "Inspected at line-rate across production cloud regions." },
    { number: "99.999%", label: "Platform Uptime SLA", desc: "Enterprise SLA backed by autonomous multi-region failover." },
    { number: "< 0.8ms", label: "P99 Telemetry Overhead", desc: "Zero bytecode injection and zero garbage collection halts." },
    { number: "140+", label: "Global Edge Locations", desc: "Synthesizing ingress signals closer to customer endpoints." },
  ];

  return (
    <section className="py-10 sm:py-14 md:py-18 px-4 sm:px-10 bg-white border-b border-slate-200/80">
      <div className="max-w-[1320px] mx-auto text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-6 sm:mb-8">
          <div className="text-[11px] sm:text-[12px] font-mono font-bold text-[#635BFF] uppercase tracking-widest mb-2">
            Global Scale
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#0A2540] leading-tight mb-2.5 sm:mb-3">
            The backbone for internet-scale infrastructure.
          </h2>
          <p className="text-sm sm:text-base text-[#425466] font-normal leading-relaxed">
            High-growth startups and global enterprises rely on Bharti Nexus to ensure 24/7 service availability.
          </p>
        </div>

        {/* 4 Stat Columns (2 columns on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-5 sm:pt-6 border-t border-slate-200">
          {stats.map((st, i) => (
            <div key={i} className="flex flex-col text-left">
              <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight mb-1 sm:mb-2 font-mono">
                {st.number}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#635BFF] uppercase tracking-wider mb-1 sm:mb-2 font-mono">
                {st.label}
              </div>
              <p className="text-[#425466] text-xs sm:text-sm leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. STRIPE TRANSPARENT PRICING
   ═══════════════════════════════════════════════════════════════ */
function StripePricingSection() {
  const tiers = [
    {
      name: "Developer Sandbox",
      price: "$0",
      period: "forever free",
      desc: "For individual developers, staging prototypes, and side projects.",
      features: ["Up to 3 microservices", "24-hour trace retention", "eBPF kernel metrics", "Community Discord support"],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Scale Team",
      price: "$89",
      period: "per cluster / mo",
      desc: "For fast-growing engineering teams managing production microservices.",
      features: ["Unlimited microservices", "30-day trace retention", "AI Root-Cause engine", "Automated Git commit correlation", "Slack & PagerDuty webhooks"],
      cta: "Start free trial",
      highlight: true
    },
    {
      name: "Enterprise Cloud",
      price: "Custom",
      period: "annual contract",
      desc: "Mission-critical infrastructure with dedicated SLAs and custom compliance.",
      features: ["Custom data retention", "On-prem & hybrid cloud agents", "Dedicated SRE support engineer", "SOC-2 Type II audit reports", "99.999% uptime guarantee"],
      cta: "Contact Enterprise",
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-10 sm:py-14 md:py-18 px-4 sm:px-10 bg-[#FAFBFD] border-b border-slate-200/80">
      <div className="max-w-[1320px] mx-auto text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-6 sm:mb-8">
          <div className="text-[11px] sm:text-[12px] font-mono font-bold text-[#635BFF] uppercase tracking-widest mb-2">
            Transparent Pricing
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#0A2540] leading-tight mb-2.5 sm:mb-3">
            Simple, predictable pricing. No surprise per-GB penalties.
          </h2>
          <p className="text-sm sm:text-base text-[#425466] font-normal leading-relaxed">
            Scale your telemetry infrastructure without worrying about explosive log ingestion fees.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border transition-all flex flex-col justify-between ${
                t.highlight
                  ? "border-[#635BFF] shadow-[0_16px_48px_rgba(99,91,255,0.12)] md:-translate-y-2 relative"
                  : "border-slate-200/90 shadow-xs hover:border-slate-300"
              }`}
            >
              <div>
                {t.highlight && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#635BFF] text-white text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase mb-2.5 sm:mb-3">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A2540] mb-1 sm:mb-1.5">{t.name}</h3>
                <p className="text-xs sm:text-sm text-[#425466] mb-3 sm:mb-4 leading-relaxed">{t.desc}</p>
                <div className="flex items-baseline gap-1.5 mb-4 sm:mb-5">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A2540] font-mono tracking-tight">{t.price}</span>
                  <span className="text-xs text-[#425466] font-bold font-mono">{t.period}</span>
                </div>

                <div className="space-y-2.5 pt-3.5 sm:pt-4 border-t border-slate-100 text-xs sm:text-sm text-[#0A2540] font-medium">
                  {t.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#635BFF] font-bold shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 sm:pt-6">
                <Link
                  href="/register"
                  className={`w-full py-3 min-h-[44px] rounded-full text-center text-sm font-bold transition-all flex items-center justify-center ${
                    t.highlight
                      ? "bg-[#635BFF] text-white hover:bg-[#5046e5] shadow-md hover:shadow-lg"
                      : "bg-[#0A2540] text-white hover:bg-[#635BFF] shadow-xs"
                  }`}
                >
                  {t.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. STRIPE READY TO GET STARTED (FINAL CTA)
   ═══════════════════════════════════════════════════════════════ */
function StripeFinalCtaSection() {
  return (
    <section className="py-10 sm:py-14 md:py-18 px-4 sm:px-10 bg-white border-b border-slate-200/80">
      <div className="max-w-[1320px] mx-auto text-left flex flex-col items-start">
        
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#0A2540] leading-tight mb-2.5 sm:mb-3">
          Ready to get started?
        </h2>

        <p className="text-sm sm:text-base text-[#425466] font-normal max-w-xl leading-relaxed mb-4 sm:mb-5">
          Explore our live sandboxed console or talk with our solutions architects to instrument your clusters today.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-6 sm:mb-7 w-full sm:w-auto">
          <Link
            href="/register"
            className="group px-6 py-3 min-h-[44px] rounded-full bg-[#0A2540] text-white text-[14px] sm:text-[14.5px] font-bold hover:bg-[#635BFF] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Start now</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="group px-6 py-3 min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200/80 text-[#0A2540] text-[14px] sm:text-[14.5px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <span>Contact sales</span>
            <ChevronRight size={16} className="text-[#635BFF] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-[12px] font-mono text-[#425466] font-semibold pt-4 sm:pt-5 border-t border-slate-200 w-full">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600 shrink-0" /> SOC-2 Type II Certified</span>
          <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#635BFF] shrink-0" /> 5-Minute Zero-Downtime Deployment</span>
          <span className="flex items-center gap-1.5"><Lock size={14} className="text-[#0A2540] shrink-0" /> Non-Custodial eBPF Telemetry</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. STRIPE OFFICIAL MULTI-COLUMN FOOTER WITH REGION SELECTOR
   ═══════════════════════════════════════════════════════════════ */
function StripeFooter() {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-10 bg-[#FAFBFD] text-[#0A2540] font-sans">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-slate-200">
          
          {/* Brand & Country Selector */}
          <div className="col-span-2 flex flex-col items-start text-left">
            <div className="flex flex-col mb-2.5 sm:mb-3">
              <Logo className="h-5 sm:h-5.5 text-[#0A2540]" />
            </div>
            <p className="text-[12px] sm:text-[13px] text-[#425466] font-medium leading-relaxed max-w-sm mb-4">
              Autonomous telemetry infrastructure and AI incident intelligence engineered by Bharti Nexus Technologies.
            </p>
            
            {/* India Region Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-[#0A2540]">
              <Globe size={14} className="text-[#635BFF]" />
              <span>India (English)</span>
            </div>
          </div>

          {/* Column 1: Products */}
          <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-[13.5px] text-left">
            <span className="font-mono text-[11px] sm:text-[11.5px] font-black text-[#0A2540] uppercase tracking-wider mb-1 sm:mb-2">
              Products
            </span>
            <Link href="#architecture" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">eBPF Telemetry</Link>
            <Link href="#interactive-simulator" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">AI Incident Engine</Link>
            <Link href="#developer-sandbox" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Distributed Tracing</Link>
            <Link href="#pricing" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Pricing</Link>
          </div>

          {/* Column 2: Solutions */}
          <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-[13.5px] text-left">
            <span className="font-mono text-[11px] sm:text-[11.5px] font-black text-[#0A2540] uppercase tracking-wider mb-1 sm:mb-2">
              Solutions
            </span>
            <Link href="/dashboard" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Kubernetes Mesh</Link>
            <Link href="/dashboard" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Cloud Ingress & CDN</Link>
            <Link href="/dashboard" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">PostgreSQL Monitoring</Link>
            <Link href="/teams" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Engineering Team</Link>
          </div>

          {/* Column 3: Developers */}
          <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-[13.5px] text-left col-span-2 sm:col-span-1">
            <span className="font-mono text-[11px] sm:text-[11.5px] font-black text-[#0A2540] uppercase tracking-wider mb-1 sm:mb-2">
              Developers
            </span>
            <Link href="#developer-sandbox" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Documentation</Link>
            <Link href="#developer-sandbox" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">API Reference</Link>
            <Link href="/roadmap" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Product Roadmap</Link>
            <Link href="/logs" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Audit & System Logs</Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#425466] gap-3 sm:gap-4 text-center sm:text-left">
          <div>
            © 2026 Bharti Nexus Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/maintenance" className="hover:text-[#635BFF] transition-colors">System Status: 99.999% SLA</Link>
            <Link href="/login" className="hover:text-[#635BFF] transition-colors">Privacy & Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT (STRIPE REPLICA)
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0A2540] selection:bg-[#635BFF]/20 selection:text-[#0A2540] antialiased">
      <StripeNavbar />
      <main>
        <StripeHeroSection />
        <StripeClientMarquee />
        <StripeArchitectureFlowSection />
        <StripeProductShowcaseSection />
        <BrexalIntegrationsSection />
        <StripeDeveloperSandboxSection />
        <BrexalComparisonSection />
        {/* BrexalTrustSecuritySection removed */}
        <StripeGlobalScaleSection />
        <StripePricingSection />
        <BrexalFaqSection />
        <StripeFinalCtaSection />
      </main>
      <StripeFooter />
    </div>
  );
}
