"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Sparkles,
  Check,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Bug,
  Lock,
  Layers,
  MapPin,
  TrendingUp,
  Cpu
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { BrexalComparisonSection } from "@/components/landing/BrexalComparisonSection";
import { BrexalFaqSection } from "@/components/landing/BrexalFaqSection";

/* ═══════════════════════════════════════════════════════════════
   1. EDITORIAL WARM MINIMALIST NAVIGATION BAR (AI LAB AESTHETIC)
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 sm:py-3.5 ${
        scrolled
          ? "bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D9] shadow-[0_2px_16px_rgba(31,30,29,0.04)]"
          : "bg-[#FAF8F5]/60 backdrop-blur-xs border-b border-[#E8E2D9]/60"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-10 flex items-center justify-between">

        {/* Brand Logo with Terracotta Accent */}
        <Link href="/" className="flex items-center gap-2 group focus:outline-none shrink-0">
          <Logo className="text-[#1F1E1D]" slashColor="text-[#CC5A2B]" />
        </Link>

        {/* Right Nav & Action CTAs Group */}
        <div className="flex items-center gap-5 xl:gap-8 shrink-0">
          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13.5px] font-medium text-[#57534E] whitespace-nowrap">
            <div
              className="relative cursor-pointer group flex items-center gap-1 hover:text-[#1F1E1D] transition-colors"
              onMouseEnter={() => setActiveDropdown("product")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#platform">Product</Link>
              <ChevronDown size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />

              {activeDropdown === "product" && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="p-3.5 bg-[#FDFBF7] rounded-2xl border border-[#E8E2D9] shadow-[0_16px_36px_rgba(31,30,29,0.06)] space-y-1.5 text-left">
                    <Link href="#platform" className="block p-2 rounded-xl hover:bg-[#F5F1EB] transition-colors">
                      <div className="font-semibold text-xs text-[#1F1E1D]">Real-Time Monitoring</div>
                      <div className="text-[11px] text-[#57534E]">Full visibility into apps and mesh</div>
                    </Link>
                    <Link href="#platform" className="block p-2 rounded-xl hover:bg-[#F5F1EB] transition-colors">
                      <div className="font-semibold text-xs text-[#1F1E1D]">AI Incident Copilot</div>
                      <div className="text-[11px] text-[#57534E]">Root cause analysis &amp; remediation in &lt; 90s</div>
                    </Link>
                    <Link href="#how-it-works" className="block p-2 rounded-xl hover:bg-[#F5F1EB] transition-colors">
                      <div className="font-semibold text-xs text-[#1F1E1D]">How It Works</div>
                      <div className="text-[11px] text-[#57534E]">Connect in 60s &amp; auto-detect telemetry</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative cursor-pointer group flex items-center gap-1 hover:text-[#1F1E1D] transition-colors"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#comparison">Solutions</Link>
              <ChevronDown size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />

              {activeDropdown === "solutions" && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="p-3.5 bg-[#FDFBF7] rounded-2xl border border-[#E8E2D9] shadow-[0_16px_36px_rgba(31,30,29,0.06)] space-y-1.5 text-left">
                    <div className="block p-2 rounded-xl hover:bg-[#F5F1EB] transition-colors">
                      <div className="font-semibold text-xs text-[#1F1E1D]">Enterprise Kubernetes</div>
                      <div className="text-[11px] text-[#57534E]">Multi-cluster pod routing &amp; ingress</div>
                    </div>
                    <div className="block p-2 rounded-xl hover:bg-[#F5F1EB] transition-colors">
                      <div className="font-semibold text-xs text-[#1F1E1D]">High-Throughput Fintech</div>
                      <div className="text-[11px] text-[#57534E]">Sub-millisecond SLA enforcement</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/dashboard" className="hover:text-[#1F1E1D] transition-colors">
              Developers
            </Link>

            <Link href="#faq" className="hover:text-[#1F1E1D] transition-colors">
              Resources
            </Link>

            <Link href="#pricing" className="hover:text-[#1F1E1D] transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Action CTAs: Sign in & Start Free */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13.5px] font-medium text-[#57534E] hover:text-[#1F1E1D] transition-colors px-2 py-1"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 rounded-full bg-[#1F1E1D] text-[#FAF8F5] hover:bg-[#CC5A2B] text-[13px] font-medium transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Start free</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1F1E1D] hover:bg-[#F5F1EB] rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 py-5 space-y-3.5 text-left animate-fadeIn">
          <Link
            href="#platform"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#1F1E1D] py-1"
          >
            Product
          </Link>
          <Link
            href="#comparison"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#1F1E1D] py-1"
          >
            Solutions
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#1F1E1D] py-1"
          >
            Developers
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#1F1E1D] py-1"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#1F1E1D] py-1"
          >
            FAQ
          </Link>
          <div className="pt-3 border-t border-[#E8E2D9] flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-2.5 text-center text-sm font-semibold text-[#1F1E1D] bg-[#F5F1EB] rounded-full"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="w-full py-2.5 text-center text-sm font-semibold text-[#FAF8F5] bg-[#1F1E1D] hover:bg-[#CC5A2B] rounded-full transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. HERO SECTION — WARM MINIMALISM & EDITORIAL TYPOGRAPHY
      (BESPOKE AI LAB ARTWORK — WARM CREAM, TERRACOTTA & PEBBLE)
   ═══════════════════════════════════════════════════════════════ */
function StripeHeroSection() {
  return (
    <section className="relative min-h-[88vh] sm:min-h-screen flex items-center pt-24 pb-14 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 px-4 sm:px-8 lg:px-12 overflow-hidden bg-[#FAF8F5]">

      {/* ── ORGANIC AMBIENT BACKGROUND GLOW & CONTOURS ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#F5E6DC]/40 via-[#F7ECE1]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-[#EBF2EC]/30 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-[1320px] mx-auto w-full relative z-10">

        {/* 2-COLUMN EDITORIAL HERO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-center">

          {/* LEFT COLUMN (7 cols): EDITORIAL CONTENT */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            {/* Eyebrow Pill — Anthropic Warm Style */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-[#FBF0EA] border border-[#F3DACD] shadow-3xs mb-4 sm:mb-6 max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CC5A2B] shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-[#CC5A2B] truncate">
                INTELLIGENT RELIABILITY &amp; DEV PLATFORM
              </span>
            </div>

            {/* Display Headline — Serif & Sans Editorial Contrast */}
            <h1 className="font-['Sora',sans-serif] text-[34px] xs:text-[42px] sm:text-[50px] md:text-[58px] lg:text-[62px] xl:text-[68px] font-bold tracking-[-0.035em] text-[#1F1E1D] leading-[1.08] mb-5 sm:mb-6 text-left">
              Server monitoring, bug tracking &amp; AI. <br className="hidden sm:inline" />
              <span className="font-editorial italic font-normal text-[#CC5A2B]">All in one place.</span>
            </h1>

            {/* Supporting Subhead */}
            <p className="font-['Inter',sans-serif] text-[15px] sm:text-[16.5px] md:text-[17.5px] text-[#57534E] font-normal leading-relaxed mb-7 sm:mb-10 max-w-[580px] text-left">
              Stop switching between five different tools. BREXAL unifies live server telemetry, sprint bug tracking, and AI-powered root-cause analysis in one calm, fast workspace.
            </p>

            {/* Action CTAs Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-8 sm:mb-10 w-full sm:w-auto">
              <Link
                href="/register"
                className="px-7 py-3.5 rounded-full bg-[#1F1E1D] text-[#FAF8F5] hover:bg-[#CC5A2B] active:scale-[0.98] text-[14px] sm:text-[14.5px] font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(31,30,29,0.18)]"
              >
                <span>Start free trial</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="#how-it-works"
                className="px-7 py-3.5 rounded-full bg-white border border-[#E8E2D9] text-[#1F1E1D] hover:bg-[#F5F1EB] active:scale-[0.98] text-[14px] sm:text-[14.5px] font-medium transition-all flex items-center justify-center gap-2 shadow-3xs"
              >
                <span>See how it works</span>
              </Link>
            </div>

            {/* 3 Micro Feature Callouts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-5 pt-5 sm:pt-7 border-t border-[#E8E2D9] w-full max-w-[580px]">
              <div className="flex items-center sm:items-start gap-2.5 p-2 sm:p-0 rounded-xl bg-white/60 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-[#E8E2D9] sm:border-0">
                <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg bg-[#FBF0EA] sm:bg-transparent flex items-center justify-center shrink-0">
                  <Zap size={16} className="text-[#CC5A2B]" />
                </div>
                <div className="text-left">
                  <div className="text-[12px] sm:text-[13px] font-bold text-[#1F1E1D]">1. Connect in 60s</div>
                  <div className="text-[10.5px] sm:text-[11px] text-[#57534E]">Zero code changes</div>
                </div>
              </div>

              <div className="flex items-center sm:items-start gap-2.5 p-2 sm:p-0 rounded-xl bg-white/60 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-[#E8E2D9] sm:border-0">
                <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg bg-[#FBF0EA] sm:bg-transparent flex items-center justify-center shrink-0">
                  <Layers size={16} className="text-[#CC5A2B]" />
                </div>
                <div className="text-left">
                  <div className="text-[12px] sm:text-[13px] font-bold text-[#1F1E1D]">2. Auto-detect</div>
                  <div className="text-[10.5px] sm:text-[11px] text-[#57534E]">CPU, RAM &amp; bugs</div>
                </div>
              </div>

              <div className="flex items-center sm:items-start gap-2.5 p-2 sm:p-0 rounded-xl bg-white/60 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-[#E8E2D9] sm:border-0">
                <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg bg-[#FBF0EA] sm:bg-transparent flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} className="text-[#CC5A2B]" />
                </div>
                <div className="text-left">
                  <div className="text-[12px] sm:text-[13px] font-bold text-[#1F1E1D]">3. Resolve with AI</div>
                  <div className="text-[10.5px] sm:text-[11px] text-[#57534E]">Root cause in &lt; 90s</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (5 cols): BESPOKE WARM MINIMALIST HERO ARTWORK */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[480px] lg:max-w-none group">
              {/* Soft warm ambient shadow halo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#CC5A2B]/15 via-[#D97706]/10 to-[#F5F1EB] rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />

              {/* Editorial Framed Artwork Container */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8E2D9] bg-[#FDFBF7] shadow-[0_16px_44px_rgba(31,30,29,0.08)]">
                <img
                  src="/hero-warm-minimalist.jpg"
                  alt="BREXAL Warm Minimalist AI Lab Artwork"
                  className="w-full h-auto object-cover max-h-[380px] sm:max-h-[460px] lg:max-h-[500px] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Editorial Floating Badge at Bottom */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-3.5 rounded-xl bg-[#FAF8F5]/92 backdrop-blur-md border border-[#E8E2D9] shadow-3xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#CC5A2B] animate-pulse" />
                    <span className="font-['Sora',sans-serif] text-[11px] sm:text-[12px] font-bold text-[#1F1E1D]">
                      Autonomous Telemetry
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#57534E] font-medium">
                    Kernel eBPF &bull; 0.8ms
                  </span>
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
   3. CLIENT TRUST MARQUEE (WARM MINIMALIST ACCENT)
   ═══════════════════════════════════════════════════════════════ */
function StripeClientMarquee() {
  const clients = [
    { name: "Rivex", symbol: "∞" },
    { name: "Cloudway", symbol: "☁" },
    { name: "Nexora", symbol: "//" },
    { name: "Taskly", symbol: "⊞" },
    { name: "Aventra", symbol: "⬡" },
  ];

  return (
    <section className="bg-[#FAF8F5] border-t border-b border-[#E8E2D9] py-5 sm:py-6 px-4 sm:px-10">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">

        {/* Left Trust Statement */}
        <div className="flex items-center text-center md:text-left text-xs sm:text-[13px] font-medium text-[#57534E] shrink-0">
          <span>Trusted by <br className="hidden md:inline" /> engineering teams worldwide</span>
          <span className="hidden md:block w-px h-8 bg-[#E8E2D9] mx-6" />
        </div>

        {/* Client Logos / Monogram Identity */}
        <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 lg:gap-14 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
          {clients.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs sm:text-[13.5px] font-semibold text-[#1F1E1D]/75 hover:text-[#CC5A2B] transition-colors whitespace-nowrap cursor-default select-none"
            >
              <span className="font-mono text-sm sm:text-base text-[#CC5A2B]">{c.symbol}</span>
              <span className="tracking-tight">{c.name}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. HOW BREXAL WORKS (MINIMAL LINEAR-STYLE CLEAN TIMELINE)
   ═══════════════════════════════════════════════════════════════ */
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Connect in 60 seconds",
      desc: "Run a single helm or docker command on your cluster. Zero SDK imports and no complicated configuration.",
    },
    {
      num: "02",
      title: "Live metrics & bugs sync",
      desc: "CPU, memory, API latency, and sprint bugs automatically stream into one unified real-time dashboard.",
    },
    {
      num: "03",
      title: "Resolve outages with AI",
      desc: "When an anomaly occurs, AI isolates the exact failing commit or database query in under 90 seconds.",
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 bg-[#FAF8F5] border-b border-[#E8E2D9]">
      <div className="max-w-[1320px] mx-auto text-left">
        
        {/* Header */}
        <div className="flex flex-col items-start max-w-2xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-5 h-[2px] bg-[#CC5A2B]" />
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-[#CC5A2B]">
              HOW IT WORKS
            </span>
          </div>
          <h2 className="font-['Sora',sans-serif] text-[28px] sm:text-[38px] md:text-[42px] font-bold text-[#1F1E1D] tracking-[-0.03em] leading-tight mb-3">
            Up and running in <span className="font-editorial italic font-normal text-[#CC5A2B]">three simple steps.</span>
          </h2>
          <p className="text-[14px] sm:text-[15.5px] text-[#57534E] font-normal leading-relaxed">
            No complex setup or weeks of onboarding. Connect your infrastructure and get instant visibility.
          </p>
        </div>

        {/* Minimal Linear Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 relative">
          {steps.map((st, i) => (
            <div key={i} className="flex flex-col items-start relative group">
              <div className="w-full pb-6 border-b border-[#E8E2D9] group-hover:border-[#CC5A2B] transition-colors mb-6">
                <span className="font-editorial italic text-4xl sm:text-5xl font-normal text-[#CC5A2B] tracking-tight">
                  {st.num}
                </span>
              </div>
              <h3 className="font-['Sora',sans-serif] text-[18px] sm:text-[20px] font-bold text-[#1F1E1D] mb-2.5 leading-snug">
                {st.title}
              </h3>
              <p className="text-[13.5px] sm:text-[14px] text-[#57534E] leading-relaxed">
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
   5. "THE PLATFORM" SECTION — 4 BENTO CARDS WITH ORGANIC LINE ART
      (REPLACED ALL 3D BLOCKS & GLOSSY AI CLUTTER WITH HANDCRAFTED ART)
   ═══════════════════════════════════════════════════════════════ */
function PlatformOverviewSection() {
  return (
    <section id="platform" className="bg-[#F5F1EB] text-[#1F1E1D] py-18 sm:py-24 px-4 sm:px-8 lg:px-12 border-b border-[#E8E2D9]">
      <div className="max-w-[1320px] mx-auto">

        {/* Section Grid: Left Intro + Right 2x2 Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* Left Column (5 cols): Editorial Intro & CTA */}
          <div className="lg:col-span-5 flex flex-col items-start text-left lg:sticky lg:top-28">

            {/* Terracotta Eyebrow */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-5 h-[2px] bg-[#CC5A2B]" />
              <span className="text-[11px] sm:text-[12px] font-mono font-medium tracking-[0.2em] uppercase text-[#CC5A2B]">
                THE PLATFORM
              </span>
            </div>

            {/* Display Headline */}
            <h2 className="text-[32px] sm:text-[42px] lg:text-[46px] font-bold text-[#1F1E1D] tracking-[-0.03em] leading-[1.12] mb-4 sm:mb-5 text-left">
              Everything you need to <br />
              <span className="font-editorial italic font-normal text-[#CC5A2B]">keep systems reliable.</span>
            </h2>

            {/* Description */}
            <p className="text-[14.5px] sm:text-[15.5px] text-[#57534E] font-normal leading-relaxed mb-6 sm:mb-8 max-w-[420px] text-left">
              Real-time monitoring, intelligent incident management, and automated remediation in one unified platform.
            </p>

            {/* CTA Button */}
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1F1E1D] text-[#FAF8F5] hover:bg-[#CC5A2B] text-[13.5px] sm:text-[14px] font-semibold transition-all shadow-xs group"
            >
              <span>Explore the platform</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

          </div>

          {/* Right Column (7 cols): 2x2 Bento Cards with Handcrafted Organic Line Art */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible gap-4 sm:gap-5 pb-3 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar [scroll-padding-left:1rem]">

              {/* ── CARD 1: REAL-TIME MONITORING (ORGANIC HARMONIC WAVE) ── */}
              <div className="group relative rounded-2xl border border-[#E8E2D9] bg-[#FDFBF7] p-6 sm:p-7 min-h-[220px] w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink flex flex-col justify-between overflow-hidden shadow-3xs hover:shadow-sm hover:border-[#CC5A2B]/40 transition-all">
                {/* Organic Monoline Harmonic Wave Graphic */}
                <div className="absolute -right-3 -bottom-3 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                  <svg viewBox="0 0 200 200" className="w-full h-full text-[#CC5A2B]" fill="none">
                    <path d="M20 180 C60 120, 100 190, 140 130 C160 100, 180 140, 200 110" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M40 185 C80 130, 115 195, 150 140 C170 110, 185 145, 205 120" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 4" opacity="0.6" />
                    <path d="M10 170 C50 110, 90 180, 130 120 C150 90, 175 130, 195 100" stroke="currentColor" strokeWidth="1.25" opacity="0.8" />
                    <path d="M60 190 C95 145, 125 200, 160 150 C180 120, 190 150, 210 130" stroke="#D97706" strokeWidth="1" opacity="0.5" />
                  </svg>
                </div>

                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FBF0EA] border border-[#F3DACD] flex items-center justify-center mb-4 text-[#CC5A2B]">
                    <Activity size={18} />
                  </div>
                  <h3 className="font-['Sora',sans-serif] text-[17px] sm:text-[18px] font-bold text-[#1F1E1D] mb-1.5 leading-snug">
                    Real-Time Monitoring
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] text-[#57534E] leading-relaxed max-w-[240px]">
                    Full visibility into applications, clusters, and network mesh.
                  </p>
                </div>

                <div className="pt-5 flex items-center text-[#CC5A2B] text-xs font-semibold">
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Learn more →
                  </span>
                </div>
              </div>

              {/* ── CARD 2: AI INCIDENT COPILOT (ORGANIC RESONANCE RINGS) ── */}
              <div className="group relative rounded-2xl border border-[#E8E2D9] bg-[#FDFBF7] p-6 sm:p-7 min-h-[220px] w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink flex flex-col justify-between overflow-hidden shadow-3xs hover:shadow-sm hover:border-[#D97706]/40 transition-all">
                {/* Organic Concentric Resonance Orbit Rings */}
                <div className="absolute -right-4 -bottom-4 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                  <svg viewBox="0 0 200 200" className="w-full h-full text-[#D97706]" fill="none">
                    <circle cx="160" cy="160" r="120" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 5" opacity="0.4" />
                    <circle cx="160" cy="160" r="90" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                    <circle cx="160" cy="160" r="60" stroke="currentColor" strokeWidth="1.25" opacity="0.8" />
                    <circle cx="160" cy="160" r="30" stroke="#CC5A2B" strokeWidth="1.5" />
                    <circle cx="160" cy="160" r="8" fill="#D97706" opacity="0.8" />
                  </svg>
                </div>

                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center mb-4 text-[#D97706]">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="font-['Sora',sans-serif] text-[17px] sm:text-[18px] font-bold text-[#1F1E1D] mb-1.5 leading-snug">
                    AI Incident Copilot
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] text-[#57534E] leading-relaxed max-w-[240px]">
                    Detect, analyze, and resolve production outages in &lt; 90 seconds.
                  </p>
                </div>

                <div className="pt-5 flex items-center text-[#D97706] text-xs font-semibold">
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Learn more →
                  </span>
                </div>
              </div>

              {/* ── CARD 3: PREDICTIVE MAINTENANCE (TRAJECTORY LINE ART) ── */}
              <div className="group relative rounded-2xl border border-[#E8E2D9] bg-[#FDFBF7] p-6 sm:p-7 min-h-[220px] w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink flex flex-col justify-between overflow-hidden shadow-3xs hover:shadow-sm hover:border-[#4D6B53]/40 transition-all">
                {/* Organic Parabolic Predictive Curve */}
                <div className="absolute -right-3 -bottom-3 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                  <svg viewBox="0 0 200 200" className="w-full h-full text-[#4D6B53]" fill="none">
                    <path d="M10 190 Q90 180 130 110 T190 20" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M130 110 L195 70" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.6" />
                    <line x1="30" y1="180" x2="190" y2="180" stroke="#E8E2D9" strokeWidth="1" strokeDasharray="2 3" />
                    <circle cx="130" cy="110" r="4.5" fill="#4D6B53" />
                  </svg>
                </div>

                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EBF2EC] border border-[#D1E2D5] flex items-center justify-center mb-4 text-[#4D6B53]">
                    <TrendingUp size={18} />
                  </div>
                  <h3 className="font-['Sora',sans-serif] text-[17px] sm:text-[18px] font-bold text-[#1F1E1D] mb-1.5 leading-snug">
                    Predictive Maintenance
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] text-[#57534E] leading-relaxed max-w-[240px]">
                    Prevent memory leaks and connection saturation before users feel it.
                  </p>
                </div>

                <div className="pt-5 flex items-center text-[#4D6B53] text-xs font-semibold">
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Learn more →
                  </span>
                </div>
              </div>

              {/* ── CARD 4: AUTOMATED BUG TRACKING (MINIMALIST NODE NETWORK) ── */}
              <div className="group relative rounded-2xl border border-[#E8E2D9] bg-[#FDFBF7] p-6 sm:p-7 min-h-[220px] w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink flex flex-col justify-between overflow-hidden shadow-3xs hover:shadow-sm hover:border-[#CC5A2B]/40 transition-all">
                {/* Organic Minimalist Interconnected Node Topology */}
                <div className="absolute -right-3 -bottom-3 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-35 group-hover:opacity-55 transition-opacity">
                  <svg viewBox="0 0 200 200" className="w-full h-full text-[#1F1E1D]" fill="none">
                    <line x1="70" y1="150" x2="130" y2="100" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                    <line x1="130" y1="100" x2="175" y2="140" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="130" y1="100" x2="150" y2="50" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="70" y1="150" x2="110" y2="180" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" />
                    <circle cx="70" cy="150" r="5" stroke="currentColor" strokeWidth="1.5" fill="#FAF8F5" />
                    <circle cx="130" cy="100" r="6" stroke="#CC5A2B" strokeWidth="1.5" fill="#FBF0EA" />
                    <circle cx="175" cy="140" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="#FAF8F5" />
                    <circle cx="150" cy="50" r="4" stroke="#D97706" strokeWidth="1.5" fill="#FEF3C7" />
                    <circle cx="110" cy="180" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="#FAF8F5" />
                  </svg>
                </div>

                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FBF0EA] border border-[#F3DACD] flex items-center justify-center mb-4 text-[#CC5A2B]">
                    <Bug size={18} />
                  </div>
                  <h3 className="font-['Sora',sans-serif] text-[17px] sm:text-[18px] font-bold text-[#1F1E1D] mb-1.5 leading-snug">
                    Automated Bug Tracking
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] text-[#57534E] leading-relaxed max-w-[240px]">
                    Group, prioritize, and triage sprint issues tied directly to telemetry.
                  </p>
                </div>

                <div className="pt-5 flex items-center text-[#CC5A2B] text-xs font-semibold">
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Learn more →
                  </span>
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
   6. GLOBAL SCALE & STATS SECTION (WARM EDITORIAL NUMBERS)
   ═══════════════════════════════════════════════════════════════ */
function StripeGlobalScaleSection() {
  const stats = [
    { number: "250M+", label: "Telemetry Spans / Sec", desc: "Line-rate processing across cloud regions." },
    { number: "99.999%", label: "Platform Uptime SLA", desc: "Autonomous multi-region failover." },
    { number: "< 0.8ms", label: "P99 Telemetry Overhead", desc: "Zero bytecode injection or GC pauses." },
    { number: "140+", label: "Global Edge Locations", desc: "Ingress signals synthesized at the edge." },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-10 bg-[#FAF8F5] border-b border-[#E8E2D9]">
      <div className="max-w-[1320px] mx-auto text-left">

        <div className="max-w-2xl mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-5 h-[2px] bg-[#CC5A2B]" />
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-[#CC5A2B]">
              PROVEN SCALE
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[40px] font-bold tracking-[-0.03em] text-[#1F1E1D] leading-[1.15] mb-3">
            Engineered for <span className="font-editorial italic font-normal text-[#CC5A2B]">critical workloads.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-xl font-normal">
            From single developer clusters to global distributed platforms, BREXAL processes telemetry without latency impact.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-4 border-t border-[#E8E2D9]">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-start">
              <span className="font-['Sora',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1F1E1D] mb-1.5">
                {s.number}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#1F1E1D] mb-1">
                {s.label}
              </span>
              <p className="text-[12px] sm:text-[13px] text-[#57534E] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. TRANSPARENT PRICING SECTION (WARM MINIMALIST CARDS)
   ═══════════════════════════════════════════════════════════════ */
function StripePricingSection() {
  const tiers = [
    {
      name: "Developer Sandbox",
      price: "$0",
      period: "forever free",
      desc: "For individual developers and open source projects.",
      features: ["Up to 3 microservices", "24-hour trace retention", "eBPF kernel metrics", "Community Discord support"],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Scale Team",
      price: "$89",
      period: "per cluster / mo",
      desc: "For engineering teams running production workloads.",
      features: ["Unlimited microservices", "30-day trace retention", "Autonomous root-cause AI", "Slack & PagerDuty alerts", "Sprint bug tracking board"],
      cta: "Start 14-Day Free Trial",
      highlight: true
    },
    {
      name: "Enterprise Dedicated",
      price: "Custom",
      period: "annual contract",
      desc: "For security-sensitive and high-compliance organizations.",
      features: ["On-premises or private VPC", "Custom data retention", "99.999% SLA guarantee", "Dedicated solutions architect", "Custom audit logging"],
      cta: "Contact Enterprise Sales",
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-10 bg-[#F5F1EB] border-b border-[#E8E2D9]">
      <div className="max-w-[1320px] mx-auto text-left">

        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-5 h-[2px] bg-[#CC5A2B]" />
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-[#CC5A2B]">
              TRANSPARENT PRICING
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[42px] font-bold tracking-[-0.03em] text-[#1F1E1D] leading-[1.15] mb-3">
            Predictable pricing with <span className="font-editorial italic font-normal text-[#CC5A2B]">zero surprises.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-xl font-normal">
            No per-GB penalties or surprise ingestion invoices. Flat, predictable tiers built for modern engineering teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all ${
                t.highlight
                  ? "bg-[#FDFBF7] border-2 border-[#CC5A2B]/60 shadow-[0_8px_30px_rgba(204,90,43,0.08)] relative"
                  : "bg-[#FDFBF7] border border-[#E8E2D9] shadow-3xs hover:shadow-xs"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3.5 right-7 px-3 py-0.5 rounded-full bg-[#CC5A2B] text-[#FAF8F5] text-[10.5px] font-mono font-bold uppercase tracking-wider">
                  MOST POPULAR
                </div>
              )}

              <div>
                <h3 className="font-['Sora',sans-serif] text-lg font-bold text-[#1F1E1D] mb-1">
                  {t.name}
                </h3>
                <p className="text-xs text-[#57534E] mb-5 leading-relaxed">
                  {t.desc}
                </p>

                <div className="flex items-baseline gap-1.5 pb-6 border-b border-[#E8E2D9] mb-6">
                  <span className="font-['Sora',sans-serif] text-4xl sm:text-5xl font-extrabold text-[#1F1E1D] tracking-tight">
                    {t.price}
                  </span>
                  <span className="text-xs text-[#57534E] font-medium">
                    / {t.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 text-xs sm:text-[13px] text-[#1F1E1D]">
                  {t.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <Check size={14} className="text-[#4D6B53] shrink-0" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/register"
                className={`w-full py-3 rounded-full text-center text-xs sm:text-[13.5px] font-semibold transition-all ${
                  t.highlight
                    ? "bg-[#CC5A2B] text-white hover:bg-[#B44A1E] shadow-xs"
                    : "bg-[#1F1E1D] text-[#FAF8F5] hover:bg-[#CC5A2B]"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. FINAL EDITORIAL CTA (CALM INVITATION TO GET STARTED)
   ═══════════════════════════════════════════════════════════════ */
function StripeFinalCtaSection() {
  return (
    <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-10 bg-[#FAF8F5] border-b border-[#E8E2D9]">
      <div className="max-w-[1320px] mx-auto text-left flex flex-col items-start">

        <h2 className="font-['Sora',sans-serif] text-2xl sm:text-4xl md:text-5xl font-bold tracking-[-0.035em] text-[#1F1E1D] leading-tight mb-3">
          Ready to experience <span className="font-editorial italic font-normal text-[#CC5A2B]">calm reliability?</span>
        </h2>

        <p className="text-sm sm:text-base text-[#57534E] font-normal max-w-xl leading-relaxed mb-6 sm:mb-8">
          Start in 60 seconds with our sandboxed console or talk to our engineering team.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-7 sm:mb-9 w-full sm:w-auto">
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-full bg-[#1F1E1D] text-[#FAF8F5] hover:bg-[#CC5A2B] min-h-[46px] text-[14px] font-semibold flex items-center justify-center gap-2 group transition-all shadow-xs"
          >
            <span>Start free trial</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="px-7 py-3.5 rounded-full bg-white border border-[#E8E2D9] text-[#1F1E1D] hover:bg-[#F5F1EB] min-h-[46px] text-[14px] font-medium flex items-center justify-center gap-2 transition-all shadow-3xs"
          >
            <span>Explore live demo</span>
            <ChevronRight size={16} className="text-[#8C857E]" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-[12px] font-mono text-[#57534E] pt-5 border-t border-[#E8E2D9] w-full">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#CC5A2B] shrink-0" /> SOC-2 Type II Certified</span>
          <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#CC5A2B] shrink-0" /> 5-Minute Zero-Downtime Deployment</span>
          <span className="flex items-center gap-1.5"><Lock size={14} className="text-[#1F1E1D] shrink-0" /> Non-Custodial eBPF Telemetry</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. EDITORIAL MULTI-COLUMN FOOTER (WARM BISCUIT STONE)
   ═══════════════════════════════════════════════════════════════ */
function StripeFooter() {
  return (
    <footer className="py-10 sm:py-14 px-4 sm:px-10 bg-[#F5F1EB] text-[#1F1E1D] font-sans">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-7 sm:gap-8 pb-8 sm:pb-10 border-b border-[#E8E2D9]">

          {/* Brand Column */}
          <div className="col-span-2 flex flex-col items-start text-left">
            <div className="flex flex-col mb-3">
              <Logo className="text-[#1F1E1D]" slashColor="text-[#CC5A2B]" />
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-[#57534E] font-medium leading-relaxed max-w-sm mb-4">
              Autonomous telemetry infrastructure and AI root-cause analysis for modern engineering teams.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8C857E]">
              <span className="w-2 h-2 rounded-full bg-[#4D6B53]" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col items-start text-left">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C857E] mb-3">
              Product
            </span>
            <ul className="space-y-2 text-[13px] text-[#57534E]">
              <li><Link href="#platform" className="hover:text-[#1F1E1D] transition-colors">Telemetry Engine</Link></li>
              <li><Link href="#platform" className="hover:text-[#1F1E1D] transition-colors">AI Incident Copilot</Link></li>
              <li><Link href="#platform" className="hover:text-[#1F1E1D] transition-colors">Bug Tracking Kanban</Link></li>
              <li><Link href="#comparison" className="hover:text-[#1F1E1D] transition-colors">Comparison</Link></li>
              <li><Link href="#pricing" className="hover:text-[#1F1E1D] transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Developers Links */}
          <div className="flex flex-col items-start text-left">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C857E] mb-3">
              Developers
            </span>
            <ul className="space-y-2 text-[13px] text-[#57534E]">
              <li><Link href="/dashboard" className="hover:text-[#1F1E1D] transition-colors">Documentation</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#1F1E1D] transition-colors">eBPF Kernel Probes</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#1F1E1D] transition-colors">Helm Charts</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#1F1E1D] transition-colors">REST API</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#1F1E1D] transition-colors">SDK Releases</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="flex flex-col items-start text-left">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C857E] mb-3">
              Company
            </span>
            <ul className="space-y-2 text-[13px] text-[#57534E]">
              <li><Link href="#faq" className="hover:text-[#1F1E1D] transition-colors">About BREXAL</Link></li>
              <li><Link href="#faq" className="hover:text-[#1F1E1D] transition-colors">Security &amp; SOC-2</Link></li>
              <li><Link href="#faq" className="hover:text-[#1F1E1D] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#faq" className="hover:text-[#1F1E1D] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C857E]">
          <div>
            &copy; {new Date().getFullYear()} BREXAL, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="#faq" className="hover:text-[#1F1E1D] transition-colors">Terms of Service</Link>
            <Link href="#faq" className="hover:text-[#1F1E1D] transition-colors">Privacy Policy</Link>
            <Link href="#faq" className="hover:text-[#1F1E1D] transition-colors">Security Overview</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. MAIN LANDING PAGE CONTAINER
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1D] selection:bg-[#CC5A2B]/15 selection:text-[#1F1E1D] antialiased overflow-x-hidden">
      <StripeNavbar />
      <main>
        <StripeHeroSection />
        <StripeClientMarquee />
        <HowItWorksSection />
        <PlatformOverviewSection />
        <BrexalComparisonSection />
        <StripeGlobalScaleSection />
        <StripePricingSection />
        <BrexalFaqSection />
        <StripeFinalCtaSection />
      </main>
      <StripeFooter />
    </div>
  );
}
