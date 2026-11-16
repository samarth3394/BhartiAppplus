"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
  MessageSquare,
  GitPullRequest,
  Bug,
  FolderKanban,
  Box,
  AlertCircle,
  BarChart3,
  LayoutGrid,
  Users,
  Wrench,
  Map
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { BrexalComparisonSection } from "@/components/landing/BrexalComparisonSection";
// BrexalTrustSecuritySection removed
import { BrexalFaqSection } from "@/components/landing/BrexalFaqSection";

const HeroEcosystem3D = dynamic(
  () => import("@/components/landing/HeroEcosystem3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[255px] sm:h-[460px] lg:h-[520px] bg-transparent flex items-center justify-center">
        <div className="w-[72px] h-[72px] sm:w-[114px] sm:h-[114px] rounded-full bg-white border border-slate-200/90 shadow-[0_12px_32px_rgba(15,23,42,0.06)] flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 font-['Sora',sans-serif] text-[9px] sm:text-[13px] font-bold tracking-[0.18em] text-[#0A2540] leading-none">
            <span className="text-[#6366F1] font-mono font-bold text-[1.1em]">//</span>
            <span>BREXAL</span>
          </div>
          <span className="w-4 sm:w-5 h-[1.5px] my-1 sm:my-1.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" />
          <span className="font-['Sora',sans-serif] text-[4.5px] sm:text-[6.5px] font-medium tracking-[0.13em] sm:tracking-[0.16em] uppercase text-[#64748B] text-center max-w-[56px] sm:max-w-[82px]">
            INTELLIGENT OBSERVABILITY
          </span>
        </div>
      </div>
    ),
  }
);

/* ═══════════════════════════════════════════════════════════════
   1. ELITE EDITORIAL NAVIGATION BAR (LIGHT HERO ADAPTATION)
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 sm:py-3.5 ${scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#E2E4E9] shadow-[0_2px_16px_rgba(16,17,20,0.04)]"
          : "bg-white/50 backdrop-blur-xs border-b border-black/5"
        }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-10 flex items-center justify-between">

        {/* Brand Logo with Double Diagonal Slash Icon */}
        <Link href="/" className="flex items-center gap-2 group focus:outline-none shrink-0">
          <Logo className="text-[#101114]" />
        </Link>

        {/* Right Nav & Action CTAs Group */}
        <div className="flex items-center gap-5 xl:gap-8 shrink-0">
          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13.5px] font-medium text-[#34363D] whitespace-nowrap">
            <div
              className="relative cursor-pointer group flex items-center gap-1 hover:text-[#101114] transition-colors"
              onMouseEnter={() => setActiveDropdown("product")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#platform">Product</Link>
              <ChevronDown size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />

              {activeDropdown === "product" && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="p-3.5 bg-white rounded-2xl border border-[#E2E4E9] shadow-[0_16px_40px_rgba(0,0,0,0.08)] space-y-2 text-left">
                    <Link href="#platform" className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">Real-Time Monitoring</div>
                      <div className="text-[11px] text-[#5B5F6B]">Full visibility into applications and mesh</div>
                    </Link>
                    <Link href="#interactive-simulator" className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">AI Incident Copilot</div>
                      <div className="text-[11px] text-[#5B5F6B]">Root cause analysis & remediation in &lt; 90s</div>
                    </Link>
                    <Link href="#how-it-works" className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">How It Works</div>
                      <div className="text-[11px] text-[#5B5F6B]">Connect in 60s &amp; auto-detect telemetry</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative cursor-pointer group flex items-center gap-1 hover:text-[#101114] transition-colors"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#comparison">Solutions</Link>
              <ChevronDown size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />

              {activeDropdown === "solutions" && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="p-3.5 bg-white rounded-2xl border border-[#E2E4E9] shadow-[0_16px_40px_rgba(0,0,0,0.08)] space-y-2 text-left">
                    <div className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">Enterprise Kubernetes</div>
                      <div className="text-[11px] text-[#5B5F6B]">Multi-cluster pod routing & ingress</div>
                    </div>
                    <div className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">High-Throughput Fintech</div>
                      <div className="text-[11px] text-[#5B5F6B]">Sub-millisecond SLA enforcement</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative cursor-pointer group flex items-center gap-1 hover:text-[#101114] transition-colors"
              onMouseEnter={() => setActiveDropdown("developers")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="/dashboard">Developers</Link>
              <ChevronDown size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            <div
              className="relative cursor-pointer group flex items-center gap-1 hover:text-[#101114] transition-colors"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#faq">Resources</Link>
              <ChevronDown size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            <Link href="#pricing" className="hover:text-[#101114] transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Action CTAs: Log in + Get started → */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/login"
              className="hidden sm:inline-block text-[13px] sm:text-[13.5px] font-medium text-[#34363D] hover:text-[#101114] px-2 py-1.5 transition-colors whitespace-nowrap"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="group px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full bg-[#101114] text-white hover:bg-[#425CF5] text-[12px] sm:text-[13px] font-semibold transition-all shadow-sm hover:scale-105 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Get started</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-[#101114] hover:bg-black/5 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E4E9] bg-white/98 backdrop-blur-xl px-4 py-5 space-y-4 shadow-xl text-left">
          <div className="space-y-1">
            <Link
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#101114] hover:bg-[#F7F6F2] transition-colors"
            >
              Product
            </Link>
            <Link
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#101114] hover:bg-[#F7F6F2] transition-colors"
            >
              Solutions
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#101114] hover:bg-[#F7F6F2] transition-colors"
            >
              Developers
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#101114] hover:bg-[#F7F6F2] transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E2E4E9] flex flex-col gap-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#101114] text-white text-center font-semibold text-sm shadow-sm"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full border border-[#D6D8DE] bg-white text-center font-semibold text-sm text-[#101114]"
            >
              Log in to Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. FULL-SCREEN LUMINOUS ARCHITECTURAL HERO SECTION (white.png)
      (CLEAN EDITORIAL TYPOGRAPHY — FULLY RESPONSIVE FOR MOBILE)
   ═══════════════════════════════════════════════════════════════ */
function StripeHeroSection() {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center pt-20 pb-12 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-28 px-4 sm:px-8 lg:px-12 overflow-hidden bg-[#FBFBFE]">

      {/* ── FULL SCREEN ARCHITECTURAL WAVE BACKGROUND (USER ASSET: white.png) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-0">
        <img
          src="/white.png"
          alt="Luminous Architectural Wave"
          className="w-full h-full object-cover object-[right_center] sm:object-center pointer-events-none"
        />
        {/* Mobile Contrast Layer: subtle gradient so text is razor-sharp while architectural backdrop remains visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/45 to-white/85 pointer-events-none md:hidden" />

        {/* Desktop Left-to-Right Subtle Reading Gradient */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-white/80 via-white/35 to-transparent pointer-events-none" />

        {/* Soft bottom dissolve for seamless flow into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-[1320px] mx-auto w-full relative z-10">

        {/* EDITORIAL HERO CONTENT (CLEAN, NO CONSOLE, FULLY RESPONSIVE) */}
        <div className="max-w-[820px] flex flex-col items-start text-left">

          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-white/95 border border-[#C4B5FD] shadow-2xs mb-4 sm:mb-6 max-w-full">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#7C3AED] shrink-0" />
            <span className="text-[9.5px] sm:text-[11px] font-mono font-bold tracking-[0.14em] sm:tracking-[0.16em] uppercase text-[#6B21A8] truncate">
              ALL-IN-ONE RELIABILITY &amp; DEV PLATFORM
            </span>
          </div>

          {/* Display Headline */}
          <h1 className="font-['Sora',sans-serif] text-[32px] xs:text-[38px] sm:text-[50px] md:text-[60px] lg:text-[68px] font-bold tracking-[-0.035em] text-[#0F1017] leading-[1.12] sm:leading-[1.05] mb-4 sm:mb-6 text-left">
            Server monitoring, bug tracking &amp; AI. <br className="hidden sm:inline" />
            <span className="font-editorial italic font-normal text-[#7E22CE]">All in one place.</span>
          </h1>

          {/* Supporting Subhead */}
          <p className="font-['Inter',sans-serif] text-[14.5px] sm:text-[17px] md:text-[18px] text-[#374151] font-normal leading-relaxed mb-6 sm:mb-10 max-w-[620px] text-left">
            Stop switching between 5 different tools. BREXAL unifies live server health, sprint bug tracking, and AI-powered root-cause analysis in a single fast dashboard.
          </p>

          {/* Action CTAs Row (Full width on mobile, inline on sm+) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-8 sm:mb-12 w-full sm:w-auto">
            <Link
              href="/register"
              className="px-6 sm:px-8 py-3.5 rounded-full bg-[#1E1B4B] text-white hover:bg-[#2E1065] active:scale-[0.98] text-[14px] sm:text-[14.5px] font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(30,27,75,0.22)]"
            >
              <span>Start free trial</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href="#how-it-works"
              className="px-6 sm:px-8 py-3.5 rounded-full bg-white/90 border border-[#7C3AED]/40 text-[#1E1B4B] hover:bg-white active:scale-[0.98] text-[14px] sm:text-[14.5px] font-medium transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <span>See how it works</span>
            </Link>
          </div>

          {/* 3 Micro Feature Callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-6 pt-5 sm:pt-8 border-t border-slate-300/70 w-full max-w-[620px]">
            <div className="flex items-center sm:items-start gap-2.5 p-2 sm:p-0 rounded-xl bg-white/70 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-white/80 sm:border-0 shadow-3xs sm:shadow-none">
              <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg bg-[#7C3AED]/10 sm:bg-transparent flex items-center justify-center shrink-0">
                <Zap size={16} className="text-[#7C3AED]" />
              </div>
              <div className="text-left">
                <div className="text-[12.5px] sm:text-[13.5px] font-bold text-[#0F1017]">1. Connect in 60s</div>
                <div className="text-[11px] sm:text-[11.5px] text-[#474A57]">Zero code changes</div>
              </div>
            </div>

            <div className="flex items-center sm:items-start gap-2.5 p-2 sm:p-0 rounded-xl bg-white/70 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-white/80 sm:border-0 shadow-3xs sm:shadow-none">
              <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg bg-[#7C3AED]/10 sm:bg-transparent flex items-center justify-center shrink-0">
                <Layers size={16} className="text-[#7C3AED]" />
              </div>
              <div className="text-left">
                <div className="text-[12.5px] sm:text-[13.5px] font-bold text-[#0F1017]">2. Auto-detect issues</div>
                <div className="text-[11px] sm:text-[11.5px] text-[#474A57]">CPU, RAM &amp; bugs</div>
              </div>
            </div>

            <div className="flex items-center sm:items-start gap-2.5 p-2 sm:p-0 rounded-xl bg-white/70 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-white/80 sm:border-0 shadow-3xs sm:shadow-none">
              <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg bg-[#7C3AED]/10 sm:bg-transparent flex items-center justify-center shrink-0">
                <ShieldCheck size={16} className="text-[#7C3AED]" />
              </div>
              <div className="text-left">
                <div className="text-[12.5px] sm:text-[13.5px] font-bold text-[#0F1017]">3. Resolve with AI</div>
                <div className="text-[11px] sm:text-[11.5px] text-[#474A57]">Root cause in &lt; 90s</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. SOCIAL PROOF / CLIENT STRIP (LIGHT TRANSITION BAND)
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
    <section className="bg-white border-t border-b border-[#E2E4E9] py-5 sm:py-6 px-4 sm:px-10">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">

        {/* Left Trust Statement */}
        <div className="flex items-center text-center md:text-left text-xs sm:text-[13px] font-medium text-[#5B5F6B] shrink-0">
          <span>Trusted by <br className="hidden md:inline" /> engineering teams worldwide</span>
          <span className="hidden md:block w-px h-8 bg-[#E2E4E9] ml-8" />
        </div>

        {/* Right Client Logos */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-12 flex-1">
          {clients.map((c, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-default">
              <span className="text-[#8B8F9A] group-hover:text-[#6366F1] font-mono text-base transition-colors">
                {c.symbol}
              </span>
              <span className="font-['Sora',sans-serif] text-sm sm:text-[15px] font-semibold text-[#34363D] group-hover:text-[#101114] tracking-wide transition-colors">
                {c.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4.5. HOW BREXAL WORKS (3 SIMPLE STEPS - REFINED BENTO CARDS)
   ═══════════════════════════════════════════════════════════════ */
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 bg-white border-b border-[#E2E4E9]">
      <div className="max-w-[1320px] mx-auto text-left">
        
        {/* Header */}
        <div className="flex flex-col items-start max-w-2xl mb-10 sm:mb-12">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-5 h-[2px] bg-[#7C3AED]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#7C3AED]">
              HOW IT WORKS
            </span>
          </div>
          <h2 className="font-['Sora',sans-serif] text-[28px] sm:text-[38px] md:text-[42px] font-bold text-[#101114] tracking-[-0.03em] leading-tight mb-3">
            Up and running in <span className="font-editorial italic font-normal text-[#7E22CE]">three simple steps.</span>
          </h2>
          <p className="text-[14px] sm:text-[15.5px] text-[#5B5F6B] font-normal leading-relaxed">
            No complex setup or weeks of onboarding. Connect your infrastructure and get instant visibility.
          </p>
        </div>

        {/* 3 Bento Cards Grid (Same design aesthetic as Platform section) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

          {/* ── STEP 1: CONNECT IN 60 SECONDS ── */}
          <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#EEF2FF]/70 p-6 sm:p-7 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#818CF8]/50 transition-all">
            {/* Abstract Wave Ribbon Graphic */}
            <div className="absolute -right-4 -bottom-4 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-85 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="howStepWave1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#818CF8" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#4338CA" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="howStepWave2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#312E81" stopOpacity="0.85" />
                  </linearGradient>
                </defs>
                <path d="M 40 180 C 60 120, 100 80, 180 60 C 200 120, 160 180, 40 180 Z" fill="url(#howStepWave1)" />
                <path d="M 60 200 C 90 140, 130 100, 200 90 C 210 150, 170 200, 60 200 Z" fill="url(#howStepWave2)" opacity="0.75" />
                <path d="M 30 160 Q 90 100 170 50" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.5" />
                <path d="M 45 175 Q 105 115 185 65" stroke="#C7D2FE" strokeWidth="1.5" fill="none" opacity="0.4" />
              </svg>
            </div>

            <div className="relative z-10 text-left">
              <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#6366F1] mb-3.5 shadow-2xs">
                <Zap size={19} />
              </div>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-2 leading-snug">
                Connect in 60 Seconds
              </h3>
              <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[210px]">
                Run a single command on your cluster or host. Zero SDK imports or setup.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#425CF5] font-semibold text-sm transition-colors">
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* ── STEP 2: LIVE METRICS & BUGS SYNC ── */}
          <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#FFFBEB]/70 p-6 sm:p-7 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#C8A96B]/50 transition-all">
            {/* Golden Radial Architectural Fins Graphic */}
            <div className="absolute -right-3 -bottom-3 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-85 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="howStepGoldFin" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E2C385" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#C8A96B" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#85581A" stopOpacity="0.85" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <path
                    key={i}
                    d={`M ${60 + i * 14} 200 C ${80 + i * 12} ${130 - i * 6}, ${120 + i * 8} ${80 - i * 5}, 200 ${50 + i * 12} L 200 200 Z`}
                    fill="url(#howStepGoldFin)"
                    opacity={0.35 + i * 0.08}
                  />
                ))}
              </svg>
            </div>

            <div className="relative z-10 text-left">
              <div className="w-9 h-9 rounded-xl bg-[#FEF3C7]/60 flex items-center justify-center text-[#D97706] mb-3.5 shadow-2xs">
                <Activity size={19} />
              </div>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-2 leading-snug">
                Live Metrics &amp; Bug Sync
              </h3>
              <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[210px]">
                CPU, RAM, API latencies, and sprint bugs stream into one real-time dashboard.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#C8A96B] font-semibold text-sm transition-colors">
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* ── STEP 3: RESOLVE OUTAGES WITH AI ── */}
          <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#EEF2FF]/70 p-6 sm:p-7 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#4F46E5]/50 transition-all">
            {/* Geometric Isometric 3D Steps Graphic */}
            <div className="absolute -right-3 -bottom-3 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-85 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="howStep3DTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>
                  <linearGradient id="howStep3DSide1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#3730A3" />
                  </linearGradient>
                  <linearGradient id="howStep3DSide2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#1E1B4B" />
                  </linearGradient>
                </defs>
                <g transform="translate(45, 45)">
                  <polygon points="100,40 140,60 100,80 60,60" fill="url(#howStep3DTop)" />
                  <polygon points="60,60 100,80 100,120 60,100" fill="url(#howStep3DSide1)" />
                  <polygon points="100,80 140,60 140,100 100,120" fill="url(#howStep3DSide2)" />
                  <polygon points="60,80 100,100 60,120 20,100" fill="url(#howStep3DTop)" opacity="0.85" />
                  <polygon points="20,100 60,120 60,160 20,140" fill="url(#howStep3DSide1)" opacity="0.85" />
                  <polygon points="60,120 100,100 100,140 60,160" fill="url(#howStep3DSide2)" opacity="0.85" />
                </g>
              </svg>
            </div>

            <div className="relative z-10 text-left">
              <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-3.5 shadow-2xs">
                <Sparkles size={19} />
              </div>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-2 leading-snug">
                Resolve Outages with AI
              </h3>
              <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[210px]">
                When an anomaly occurs, AI isolates the exact failing commit or query in &lt; 90s.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#4F46E5] font-semibold text-sm transition-colors">
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. "THE PLATFORM" SECTION (EXACT 2x2 BENTO GRID AS IN REFERENCE)
   ═══════════════════════════════════════════════════════════════ */
function PlatformOverviewSection() {
  return (
    <section id="platform" className="bg-[#FAFAFC] text-[#101114] py-18 sm:py-24 px-4 sm:px-8 lg:px-12 border-b border-[#E2E4E9]">
      <div className="max-w-[1320px] mx-auto">

        {/* Section Grid: Left Intro + Right 2x2 Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* Left Column (5 cols): Editorial Intro & CTA */}
          <div className="lg:col-span-5 flex flex-col items-start text-left lg:sticky lg:top-28">

            {/* Minimal Purple Eyebrow */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-5 h-[2px] bg-[#7C3AED]" />
              <span className="text-[11px] sm:text-[12px] font-mono font-bold tracking-[0.2em] uppercase text-[#7C3AED]">
                THE PLATFORM
              </span>
            </div>

            {/* Display Headline */}
            <h2 className="text-[32px] sm:text-[42px] lg:text-[46px] font-bold text-[#101114] tracking-[-0.03em] leading-[1.12] mb-4 sm:mb-5 text-left">
              Everything you need to <br />
              keep your systems reliable.
            </h2>

            {/* Description */}
            <p className="text-[14.5px] sm:text-[15.5px] text-[#5B5F6B] font-normal leading-relaxed mb-6 sm:mb-8 max-w-[420px] text-left">
              Real-time monitoring, intelligent incident management, and automated remediation in one unified platform.
            </p>

            {/* CTA Button */}
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#101114] text-white hover:bg-[#425CF5] text-[13.5px] sm:text-[14px] font-semibold transition-all shadow-sm hover:scale-105 group"
            >
              <span>Explore the platform</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

          </div>

          {/* Right Column (7 cols): 2x2 Bento Cards with Custom Visual Art (Horizontally Scrollable on Mobile) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible gap-4 sm:gap-5 pb-3 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar [scroll-padding-left:1rem]">

              {/* ── CARD 1: REAL-TIME MONITORING ── */}
              <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#EEF2FF]/70 p-6 sm:p-7 min-h-[220px] w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#818CF8]/50 transition-all">
                {/* Abstract Wave Ribbon Graphic */}
                <div className="absolute -right-4 -bottom-4 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-85 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.85" />
                        <stop offset="50%" stopColor="#818CF8" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#4338CA" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#312E81" stopOpacity="0.85" />
                      </linearGradient>
                    </defs>
                    <path d="M 40 180 C 60 120, 100 80, 180 60 C 200 120, 160 180, 40 180 Z" fill="url(#waveGrad1)" />
                    <path d="M 60 200 C 90 140, 130 100, 200 90 C 210 150, 170 200, 60 200 Z" fill="url(#waveGrad2)" opacity="0.75" />
                    <path d="M 30 160 Q 90 100 170 50" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <path d="M 45 175 Q 105 115 185 65" stroke="#C7D2FE" strokeWidth="1.5" fill="none" opacity="0.4" />
                  </svg>
                </div>

                <div className="relative z-10 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#6366F1] mb-3.5 shadow-2xs">
                    <Layers size={19} />
                  </div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-1.5 leading-snug">
                    Real-Time Monitoring
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[200px]">
                    Full visibility into applications, infrastructure, and mesh.
                  </p>
                </div>

                <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#425CF5] font-semibold text-sm transition-colors">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* ── CARD 2: AI INCIDENT COPILOT ── */}
              <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#FFFBEB]/70 p-6 sm:p-7 min-h-[220px] w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#C8A96B]/50 transition-all">
                {/* Golden Radial Architectural Fins Graphic */}
                <div className="absolute -right-3 -bottom-3 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-85 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="goldFinGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#E2C385" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#C8A96B" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#85581A" stopOpacity="0.85" />
                      </linearGradient>
                    </defs>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <path
                        key={i}
                        d={`M ${60 + i * 14} 200 C ${80 + i * 12} ${130 - i * 6}, ${120 + i * 8} ${80 - i * 5}, 200 ${50 + i * 12} L 200 200 Z`}
                        fill="url(#goldFinGrad)"
                        opacity={0.35 + i * 0.08}
                      />
                    ))}
                  </svg>
                </div>

                <div className="relative z-10 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#FEF3C7]/60 flex items-center justify-center text-[#D97706] mb-3.5 shadow-2xs">
                    <Zap size={19} />
                  </div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-1.5 leading-snug">
                    AI Incident Copilot
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[200px]">
                    Detect, analyze, and resolve incidents with AI.
                  </p>
                </div>

                <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#C8A96B] font-semibold text-sm transition-colors">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* ── CARD 3: PREDICTIVE MAINTENANCE ── */}
              <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#F5F3FF]/70 p-6 sm:p-7 min-h-[220px] w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#8B5CF6]/50 transition-all">
                {/* Lavender Curved Arch / Tube Graphic */}
                <div className="absolute -right-4 -bottom-4 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-85 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="archGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.95" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 50 200 C 60 110, 120 70, 200 70 L 200 130 C 145 130, 105 155, 100 200 Z"
                      fill="url(#archGrad)"
                    />
                    <path
                      d="M 75 200 C 85 135, 135 105, 200 105 L 200 155 C 160 155, 125 170, 120 200 Z"
                      fill="#A78BFA"
                      opacity="0.5"
                    />
                  </svg>
                </div>

                <div className="relative z-10 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-[#7C3AED] mb-3.5 shadow-2xs">
                    <Activity size={19} />
                  </div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-1.5 leading-snug">
                    Predictive Maintenance
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[200px]">
                    Prevent outages before they impact users.
                  </p>
                </div>

                <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#7C3AED] font-semibold text-sm transition-colors">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* ── CARD 4: AUTOMATED BUG TRACKING ── */}
              <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#EEF2FF]/70 p-6 sm:p-7 min-h-[220px] w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#4F46E5]/50 transition-all">
                {/* Geometric Isometric 3D Steps Graphic */}
                <div className="absolute -right-3 -bottom-3 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none opacity-85 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="stepTop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C4B5FD" />
                        <stop offset="100%" stopColor="#818CF8" />
                      </linearGradient>
                      <linearGradient id="stepSide1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#3730A3" />
                      </linearGradient>
                      <linearGradient id="stepSide2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#1E1B4B" />
                      </linearGradient>
                    </defs>
                    <g transform="translate(45, 45)">
                      {/* Top block */}
                      <polygon points="100,40 140,60 100,80 60,60" fill="url(#stepTop)" />
                      <polygon points="60,60 100,80 100,120 60,100" fill="url(#stepSide1)" />
                      <polygon points="100,80 140,60 140,100 100,120" fill="url(#stepSide2)" />
                      {/* Middle block */}
                      <polygon points="60,80 100,100 60,120 20,100" fill="url(#stepTop)" opacity="0.85" />
                      <polygon points="20,100 60,120 60,160 20,140" fill="url(#stepSide1)" opacity="0.85" />
                      <polygon points="60,120 100,100 100,140 60,160" fill="url(#stepSide2)" opacity="0.85" />
                    </g>
                  </svg>
                </div>

                <div className="relative z-10 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-3.5 shadow-2xs">
                    <Database size={19} />
                  </div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-1.5 leading-snug">
                    Automated Bug Tracking
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[200px]">
                    Group, prioritize, and triage issues across your stack.
                  </p>
                </div>

                <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#4F46E5] font-semibold text-sm transition-colors">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

            {/* Mobile Scroll Indicator (visible only on mobile) */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 pt-2 text-[11px] text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="ml-1 text-[10.5px] text-slate-400 font-sans">Swipe to explore →</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════
   5. ELITE GLOBAL SCALE & RELIABILITY NUMBERS
   ═══════════════════════════════════════════════════════════════ */
function StripeGlobalScaleSection() {
  const stats = [
    { number: "250M+", label: "Telemetry Spans / Sec", desc: "Line-rate processing across cloud regions." },
    { number: "99.999%", label: "Platform Uptime SLA", desc: "Autonomous multi-region failover." },
    { number: "< 0.8ms", label: "P99 Telemetry Overhead", desc: "Zero bytecode injection or GC pauses." },
    { number: "140+", label: "Global Edge Locations", desc: "Ingress signals synthesized at the edge." },
  ];

  return (
    <section className="py-10 sm:py-14 md:py-18 px-4 sm:px-10 bg-white border-b border-[#E2E4E9]">
      <div className="max-w-[1320px] mx-auto text-left">

        {/* Section Header */}
        <div className="max-w-2xl mb-6 sm:mb-8">
          <div className="text-[10.5px] sm:text-[11.5px] font-mono font-medium text-[#7C3AED] uppercase tracking-[0.16em] mb-2">
            Global Scale
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.035em] text-[#101114] leading-tight mb-2.5 sm:mb-3">
            The backbone for internet-scale infrastructure.
          </h2>
          <p className="text-sm sm:text-base text-[#5B5F6B] font-normal leading-relaxed">
            Trusted by engineering teams for continuous 24/7 reliability.
          </p>
        </div>

        {/* 4 Stat Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-5 sm:pt-6 border-t border-[#E2E4E9]">
          {stats.map((st, i) => (
            <div key={i} className="flex flex-col text-left">
              <div className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#101114] tracking-tight mb-1 sm:mb-2">
                {st.number}
              </div>
              <div className="text-xs sm:text-[13px] font-semibold text-[#7C3AED] uppercase tracking-wider mb-1 sm:mb-2 font-mono">
                {st.label}
              </div>
              <p className="text-[#5B5F6B] text-xs sm:text-sm leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


function StripePricingSection() {
  const tiers = [
    {
      name: "Developer Sandbox",
      price: "$0",
      period: "forever free",
      desc: "For individual developers and side projects.",
      features: ["Up to 3 microservices", "24-hour trace retention", "eBPF kernel metrics", "Community Discord support"],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Scale Team",
      price: "$89",
      period: "per cluster / mo",
      desc: "For engineering teams running production workloads.",
      features: ["Unlimited microservices", "30-day trace retention", "AI Root-Cause engine", "Automated Git commit correlation", "Slack & PagerDuty webhooks"],
      cta: "Start free trial",
      highlight: true
    },
    {
      name: "Enterprise Cloud",
      price: "Custom",
      period: "annual contract",
      desc: "For enterprise scale with dedicated SLAs and compliance.",
      features: ["Custom data retention", "On-prem & hybrid cloud agents", "Dedicated SRE support engineer", "SOC-2 Type II audit reports", "99.999% uptime guarantee"],
      cta: "Contact Enterprise",
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-10 sm:py-14 md:py-18 px-4 sm:px-10 bg-[#F7F6F2] border-b border-[#E2E4E9]">
      <div className="max-w-[1320px] mx-auto text-left">

        {/* Section Header */}
        <div className="max-w-2xl mb-6 sm:mb-8">
          <div className="text-[10.5px] sm:text-[11.5px] font-mono font-medium text-[#7C3AED] uppercase tracking-[0.16em] mb-2">
            Transparent Pricing
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.035em] text-[#101114] leading-tight mb-2.5 sm:mb-3">
            Simple, predictable pricing. No surprise per-GB penalties.
          </h2>
          <p className="text-sm sm:text-base text-[#5B5F6B] font-normal leading-relaxed">
            Scale telemetry without per-GB ingestion penalties.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border transition-all flex flex-col justify-between ${t.highlight
                  ? "border-[#7C3AED] shadow-[0_16px_48px_rgba(124,58,237,0.12)] md:-translate-y-2 relative ring-1 ring-[#7C3AED]/30"
                  : "border-[#E2E4E9] shadow-xs hover:border-[#BFC3CC]"
                }`}
            >
              <div>
                {t.highlight && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#7C3AED] text-white text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider uppercase mb-2.5 sm:mb-3">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#101114] mb-1 sm:mb-1.5">{t.name}</h3>
                <p className="text-xs sm:text-sm text-[#5B5F6B] mb-3 sm:mb-4 leading-relaxed">{t.desc}</p>
                <div className="flex items-baseline gap-1.5 mb-4 sm:mb-5">
                  <span className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#101114] tracking-tight">{t.price}</span>
                  <span className="text-xs text-[#5B5F6B] font-medium font-mono">{t.period}</span>
                </div>

                <div className="space-y-2.5 pt-3.5 sm:pt-4 border-t border-[#E2E4E9] text-xs sm:text-sm text-[#101114] font-medium">
                  {t.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#7C3AED] font-bold shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 sm:pt-6">
                <Link
                  href="/register"
                  className={`w-full py-3 min-h-[44px] rounded-full text-center text-sm font-semibold transition-all flex items-center justify-center cursor-pointer ${t.highlight
                      ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-md hover:shadow-lg"
                      : "bg-[#101C35] text-white hover:bg-[#7C3AED] shadow-xs"
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


function StripeFinalCtaSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-10 bg-white border-b border-[#E2E4E9]">
      <div className="max-w-[1320px] mx-auto text-left flex flex-col items-start">

        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.035em] text-[#101114] leading-tight mb-2.5 sm:mb-3">
          Ready to get started?
        </h2>

        <p className="text-sm sm:text-base text-[#5B5F6B] font-normal max-w-xl leading-relaxed mb-5 sm:mb-6">
          Start in minutes with our sandboxed console or talk to our solutions team.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-6 sm:mb-7 w-full sm:w-auto">
          <Link
            href="/register"
            className="elite-btn-primary px-6 py-3.5 min-h-[46px] text-[14px] flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
          >
            <span>Start now</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="elite-btn-secondary px-6 py-3.5 min-h-[46px] text-[14px] flex items-center justify-center gap-2"
          >
            <span>Contact sales</span>
            <ChevronRight size={16} className="text-[#8B8F9A]" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-[12px] font-mono text-[#5B5F6B] pt-4 sm:pt-5 border-t border-[#E2E4E9] w-full">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#7C3AED] shrink-0" /> SOC-2 Type II Certified</span>
          <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#7C3AED] shrink-0" /> 5-Minute Zero-Downtime Deployment</span>
          <span className="flex items-center gap-1.5"><Lock size={14} className="text-[#101114] shrink-0" /> Non-Custodial eBPF Telemetry</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. ELITE MULTI-COLUMN EDITORIAL FOOTER
   ═══════════════════════════════════════════════════════════════ */
function StripeFooter() {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-10 bg-[#F7F6F2] text-[#101114] font-sans">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-[#E2E4E9]">

          {/* Brand & Country Selector */}
          <div className="col-span-2 flex flex-col items-start text-left">
            <div className="flex flex-col mb-2.5 sm:mb-3">
              <Logo className="text-[#101114] text-base sm:text-lg" />
            </div>
            <p className="text-[12px] sm:text-[13px] text-[#5B5F6B] font-medium leading-relaxed max-w-sm mb-4">
              Autonomous telemetry infrastructure and AI incident intelligence engineered by BREXAL Technologies.
            </p>

            {/* India Region Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E2E4E9] text-xs font-mono font-medium text-[#101114]">
              <Globe size={14} className="text-[#7C3AED]" />
              <span>India (English)</span>
            </div>
          </div>

          {/* Column 1: Products */}
          <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-[13.5px] text-left">
            <span className="font-mono text-[11px] sm:text-[11.5px] font-bold text-[#101114] uppercase tracking-wider mb-1 sm:mb-2">
              Products
            </span>
            <Link href="#platform" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">eBPF Telemetry</Link>
            <Link href="#interactive-simulator" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">AI Incident Engine</Link>
            <Link href="/dashboard" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">Distributed Tracing</Link>
            <Link href="#pricing" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">Pricing</Link>
          </div>

          {/* Column 2: Solutions */}
          <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-[13.5px] text-left">
            <span className="font-mono text-[11px] sm:text-[11.5px] font-bold text-[#101114] uppercase tracking-wider mb-1 sm:mb-2">
              Solutions
            </span>
            <Link href="/dashboard" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">Kubernetes Mesh</Link>
            <Link href="/dashboard" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">Cloud Ingress & CDN</Link>
            <Link href="/dashboard" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">PostgreSQL Monitoring</Link>
            <Link href="/teams" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">Engineering Team</Link>
          </div>

          {/* Column 3: Developers */}
          <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-[13.5px] text-left col-span-2 sm:col-span-1">
            <span className="font-mono text-[11px] sm:text-[11.5px] font-bold text-[#101114] uppercase tracking-wider mb-1 sm:mb-2">
              Developers
            </span>
            <Link href="/dashboard" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">Documentation</Link>
            <Link href="/dashboard" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">API Reference</Link>
            <Link href="/roadmap" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">Product Roadmap</Link>
            <Link href="/logs" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">Audit & System Logs</Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#5B5F6B] gap-3 sm:gap-4 text-center sm:text-left">
          <div>
            © 2026 BREXAL Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/maintenance" className="hover:text-[#7C3AED] transition-colors">System Status: 99.999% SLA</Link>
            <Link href="/login" className="hover:text-[#7C3AED] transition-colors">Privacy & Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT (ELITE EDITORIAL SAAS)
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#101114] selection:bg-[#7C3AED]/20 selection:text-[#101114] antialiased overflow-x-hidden">
      <StripeNavbar />
      <main>
        <StripeHeroSection />
        <StripeClientMarquee />
        <HowItWorksSection />
        <PlatformOverviewSection />
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
