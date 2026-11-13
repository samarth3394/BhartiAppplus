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
          <span className="font-['Sora',sans-serif] text-[9px] sm:text-[13.5px] font-semibold tracking-[0.22em] sm:tracking-[0.25em] text-[#0A2540] pl-[0.22em] sm:pl-[0.25em] leading-none">
            BREXAL
          </span>
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 sm:py-3.5 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#E2E4E9] shadow-[0_2px_16px_rgba(16,17,20,0.04)]"
          : "bg-white/50 backdrop-blur-xs border-b border-black/5"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-10 flex items-center justify-between">
        
        {/* Brand Logo with Double Diagonal Slash Icon */}
        <Link href="/" className="flex items-center gap-2 group focus:outline-none shrink-0">
          <div className="flex items-center gap-1.5 font-bold tracking-[0.16em] text-[15px] sm:text-[16px] text-[#101114]">
            <span className="text-[#6366F1] font-mono text-base font-bold">//</span>
            <span className="font-['Sora',sans-serif] tracking-[0.18em]">BREXAL</span>
          </div>
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
                    <Link href="#architecture-flow" className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">eBPF Telemetry Mesh</div>
                      <div className="text-[11px] text-[#5B5F6B]">0.0% CPU kernel-level socket observability</div>
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
              AI MONITORING &amp; INCIDENT PLATFORM
            </span>
          </div>

          {/* Display Headline: "Intelligence for modern infrastructure." */}
          <h1 className="font-['Sora',sans-serif] text-[32px] xs:text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] font-bold tracking-[-0.035em] text-[#0F1017] leading-[1.12] sm:leading-[1.04] mb-4 sm:mb-6 text-left">
            Intelligence for <br className="hidden sm:inline" />
            <span>modern </span>
            <span className="font-editorial italic font-normal text-[#7E22CE]">infrastructure.</span>
          </h1>

          {/* Supporting Subhead */}
          <p className="font-['Inter',sans-serif] text-[14.5px] sm:text-[17px] md:text-[18.5px] text-[#374151] font-normal leading-relaxed mb-6 sm:mb-10 max-w-[620px] text-left">
            Real-time monitoring, AI-powered incident response, and proactive reliability for modern engineering teams.
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
              href="#platform"
              className="px-6 sm:px-8 py-3.5 rounded-full bg-white/90 border border-[#7C3AED]/40 text-[#1E1B4B] hover:bg-white active:scale-[0.98] text-[14px] sm:text-[14.5px] font-medium transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <span>Book a demo</span>
            </Link>
          </div>

          {/* 3 Micro Feature Callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-6 pt-5 sm:pt-8 border-t border-slate-300/70 w-full max-w-[620px]">
            <div className="flex items-center sm:items-start gap-2.5 p-2 sm:p-0 rounded-xl bg-white/70 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-white/80 sm:border-0 shadow-3xs sm:shadow-none">
              <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg bg-[#7C3AED]/10 sm:bg-transparent flex items-center justify-center shrink-0">
                <Zap size={16} className="text-[#7C3AED]" />
              </div>
              <div className="text-left">
                <div className="text-[12.5px] sm:text-[13.5px] font-bold text-[#0F1017]">Detect faster</div>
                <div className="text-[11px] sm:text-[11.5px] text-[#474A57]">AI-powered insights</div>
              </div>
            </div>

            <div className="flex items-center sm:items-start gap-2.5 p-2 sm:p-0 rounded-xl bg-white/70 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-white/80 sm:border-0 shadow-3xs sm:shadow-none">
              <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg bg-[#7C3AED]/10 sm:bg-transparent flex items-center justify-center shrink-0">
                <Layers size={16} className="text-[#7C3AED]" />
              </div>
              <div className="text-left">
                <div className="text-[12.5px] sm:text-[13.5px] font-bold text-[#0F1017]">Resolve smarter</div>
                <div className="text-[11px] sm:text-[11.5px] text-[#474A57]">RCA in minutes</div>
              </div>
            </div>

            <div className="flex items-center sm:items-start gap-2.5 p-2 sm:p-0 rounded-xl bg-white/70 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border border-white/80 sm:border-0 shadow-3xs sm:shadow-none">
              <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg bg-[#7C3AED]/10 sm:bg-transparent flex items-center justify-center shrink-0">
                <ShieldCheck size={16} className="text-[#7C3AED]" />
              </div>
              <div className="text-left">
                <div className="text-[12.5px] sm:text-[13.5px] font-bold text-[#0F1017]">Stay reliable</div>
                <div className="text-[11px] sm:text-[11.5px] text-[#474A57]">High-uptime systems</div>
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
              From real-time monitoring and intelligent incident management to automated remediation, BREXAL brings the entire reliability stack in one place.
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

          {/* Right Column (7 cols): 2x2 Bento Cards with Custom Visual Art */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            
            {/* ── CARD 1: REAL-TIME MONITORING ── */}
            <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#EEF2FF]/70 p-6 sm:p-7 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#818CF8]/50 transition-all">
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
                <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-2 leading-snug">
                  Real-Time Monitoring
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[200px]">
                  Get full visibility into your applications, infrastructure and services.
                </p>
              </div>

              <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#425CF5] font-semibold text-sm transition-colors">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* ── CARD 2: AI INCIDENT COPILOT ── */}
            <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#FFFBEB]/70 p-6 sm:p-7 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#C8A96B]/50 transition-all">
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
                <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-2 leading-snug">
                  AI Incident Copilot
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[200px]">
                  Detect, analyze and resolve incidents with the power of AI.
                </p>
              </div>

              <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#C8A96B] font-semibold text-sm transition-colors">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* ── CARD 3: PREDICTIVE MAINTENANCE ── */}
            <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#F5F3FF]/70 p-6 sm:p-7 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#8B5CF6]/50 transition-all">
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
                <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-2 leading-snug">
                  Predictive Maintenance
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[200px]">
                  Identify risks early and prevent outages before they happen.
                </p>
              </div>

              <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#7C3AED] font-semibold text-sm transition-colors">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* ── CARD 4: AUTOMATED BUG TRACKING ── */}
            <div className="group relative rounded-2xl border border-[#E2E4E9] bg-gradient-to-br from-[#F7F6F2] via-white to-[#EEF2FF]/70 p-6 sm:p-7 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-[#4F46E5]/50 transition-all">
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
                <h3 className="text-[17px] sm:text-[18px] font-bold text-[#101114] mb-2 leading-snug">
                  Automated Bug Tracking
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#5B5F6B] leading-relaxed max-w-[200px]">
                  Capture, group and prioritize issues across your stack.
                </p>
              </div>

              <div className="relative z-10 pt-4 flex items-center text-[#101114] group-hover:text-[#4F46E5] font-semibold text-sm transition-colors">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OFFICIAL TECH LOGOS FOR ARCHITECTURE FLOW
   ═══════════════════════════════════════════════════════════════ */
function KubernetesLogo({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-gradient-to-br from-[#1E60ED] to-[#0D4ECC] flex items-center justify-center p-2 shadow-xs shrink-0`}>
      <img src="/k8s-wheel.svg" alt="Kubernetes" className="w-7 h-7 object-contain drop-shadow-2xs" />
    </div>
  );
}

function EbpfLogo({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center shrink-0`}>
      <img src="/ebpf-bee.svg" alt="eBPF Kernel Probe" className="w-10 h-10 object-contain drop-shadow-2xs" />
    </div>
  );
}

function NeuralEngineLogo({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-center p-2 shadow-2xs shrink-0`}>
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7 text-[#7C3AED]">
        {/* Microchip Body */}
        <rect x="7" y="7" width="18" height="18" rx="4" stroke="#7C3AED" strokeWidth="2" fill="#C7BDF7" fillOpacity="0.25" />
        {/* Top Pins */}
        <line x1="11" y1="3" x2="11" y2="7" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="3" x2="16" y2="7" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        <line x1="21" y1="3" x2="21" y2="7" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        {/* Bottom Pins */}
        <line x1="11" y1="25" x2="11" y2="29" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="25" x2="16" y2="29" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        <line x1="21" y1="25" x2="21" y2="29" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        {/* Left Pins */}
        <line x1="3" y1="11" x2="7" y2="11" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="16" x2="7" y2="16" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="21" x2="7" y2="21" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        {/* Right Pins */}
        <line x1="25" y1="11" x2="29" y2="11" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="16" x2="29" y2="16" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="21" x2="29" y2="21" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        {/* Neural Synapse */}
        <circle cx="16" cy="13.5" r="1.2" fill="#7C3AED" />
        <circle cx="16" cy="18.5" r="1.2" fill="#7C3AED" />
      </svg>
    </div>
  );
}

function SlackLogo({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-[#F7F6F2] border border-[#E2E4E9] flex items-center justify-center p-2 shadow-2xs shrink-0`}>
      <img src="/slack-logo.svg" alt="Slack" className="w-6 h-6 object-contain" />
    </div>
  );
}

function PagerDutyLogo({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-center p-2 shadow-2xs shrink-0`}>
      <img src="/pagerduty-logo.svg" alt="PagerDuty" className="w-6 h-6 object-contain" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3.5. INTERACTIVE ANIMATED ARCHITECTURE DATA FLOW
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
    <section id="architecture-flow" className="py-16 sm:py-20 md:py-24 px-4 sm:px-10 bg-white border-b border-[#E2E4E9] relative overflow-hidden font-sans">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#7C3AED]/[0.04] via-[#C7BDF7]/[0.03] to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto text-center relative z-10">
        
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-8 h-[1px] bg-[#E2E4E9]" />
          <span className="text-[10.5px] sm:text-[11.5px] font-mono font-medium uppercase tracking-[0.16em] text-[#7C3AED]">
            ARCHITECTURE FLOW
          </span>
          <span className="w-8 h-[1px] bg-[#E2E4E9]" />
        </div>

        {/* Title */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-[42px] font-semibold tracking-[-0.03em] text-[#101114] mb-3 leading-tight">
          From Your Workload <span className="font-editorial italic font-normal text-[#7E22CE]">to Action</span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#5B5F6B] max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal">
          See how telemetry flows from your Kubernetes workloads through eBPF and BREXAL&apos;s AI engine to the tools your team already uses.
        </p>

        {/* Interactive Simulation Trigger Button */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <button
            onClick={handleTriggerFlow}
            disabled={simulating}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
              simulating
                ? "bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]"
                : "bg-white hover:bg-[#F5F3FF] text-[#101114] border border-[#D6D8DE] hover:border-[#7C3AED] hover:shadow-sm"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${simulating ? "bg-[#7C3AED] animate-ping" : "bg-[#7C3AED]"}`} />
            <span>{simulating ? "Simulating Telemetry Pipeline Flow..." : "Test Interactive Data Flow"}</span>
          </button>
        </div>

        {/* ── DIAGRAM CONTAINER ── */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-3 xl:gap-4 max-w-[1240px] mx-auto">
          
          {/* 1. Your Kubernetes Pod */}
          <div
            className={`w-full lg:w-[230px] xl:w-[245px] bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 text-left transition-all duration-300 shadow-[0_2px_12px_rgba(16,17,20,0.03)] shrink-0 ${
              activeStep === 1
                ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-lg -translate-y-1"
                : "border-[#E2E4E9] hover:border-[#BFC3CC]"
            }`}
          >
            <KubernetesLogo />
            <div>
              <h3 className="text-[13.5px] sm:text-[14px] font-semibold text-[#101114] leading-snug mb-1">
                Your Kubernetes Pod
              </h3>
              <p className="text-[11.5px] text-[#5B5F6B] leading-relaxed">
                Application, logs, metrics and network events
              </p>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden lg:flex items-center justify-center text-[#7C3AED] w-8 xl:w-10 shrink-0">
            <svg viewBox="0 0 36 16" className="w-9 h-4 stroke-current fill-none">
              <line x1="0" y1="8" x2="28" y2="8" strokeWidth="1.8" strokeDasharray={activeStep === 1 ? "3 3" : "none"} />
              <polyline points="24,4 30,8 24,12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="lg:hidden flex items-center justify-center text-[#7C3AED]">
            <svg viewBox="0 0 16 28" className="w-4 h-7 stroke-current fill-none">
              <line x1="8" y1="0" x2="8" y2="22" strokeWidth="1.8" />
              <polyline points="4,18 8,24 12,18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 2. eBPF Kernel Probe */}
          <div
            className={`w-full lg:w-[230px] xl:w-[245px] bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 text-left transition-all duration-300 shadow-[0_2px_12px_rgba(16,17,20,0.03)] shrink-0 ${
              activeStep === 2
                ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-lg -translate-y-1"
                : "border-[#E2E4E9] hover:border-[#BFC3CC]"
            }`}
          >
            <EbpfLogo />
            <div>
              <h3 className="text-[13.5px] sm:text-[14px] font-semibold text-[#101114] leading-snug mb-1">
                eBPF Kernel Probe
              </h3>
              <p className="text-[11.5px] text-[#5B5F6B] leading-relaxed">
                Kernel-level telemetry with minimal overhead
              </p>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="hidden lg:flex items-center justify-center text-[#7C3AED] w-8 xl:w-10 shrink-0">
            <svg viewBox="0 0 36 16" className="w-9 h-4 stroke-current fill-none">
              <line x1="0" y1="8" x2="28" y2="8" strokeWidth="1.8" strokeDasharray={activeStep === 2 ? "3 3" : "none"} />
              <polyline points="24,4 30,8 24,12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="lg:hidden flex items-center justify-center text-[#7C3AED]">
            <svg viewBox="0 0 16 28" className="w-4 h-7 stroke-current fill-none">
              <line x1="8" y1="0" x2="8" y2="22" strokeWidth="1.8" />
              <polyline points="4,18 8,24 12,18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 3. BREXAL Neural Engine (Featured Center Card) */}
          <div
            className={`w-full lg:w-[275px] xl:w-[295px] relative rounded-2xl border p-5 sm:p-5.5 text-left transition-all duration-300 shadow-[0_8px_24px_rgba(124,58,237,0.1)] shrink-0 ${
              activeStep === 3
                ? "bg-[#F5F3FF] border-[#7C3AED] ring-2 ring-[#7C3AED]/25 shadow-xl -translate-y-1"
                : "bg-[#F7F6F2] border-[#C7BDF7]"
            }`}
          >
            {/* Top Right AI Engine Badge */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#7C3AED] text-[10.5px] font-semibold font-mono border border-[#DDD6FE]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
              <span>AI Engine</span>
            </div>

            <div className="flex items-center gap-3.5 pt-2 sm:pt-1">
              <NeuralEngineLogo />
              <div className="pr-1">
                <h3 className="text-[14.5px] sm:text-[15px] font-bold text-[#101114] leading-snug mb-1">
                  BREXAL Neural Engine
                </h3>
                <p className="text-[11.5px] text-[#5B5F6B] leading-relaxed">
                  AI-driven analysis, anomaly detection and root cause
                </p>
              </div>
            </div>
          </div>

          {/* Branching Connector 3 */}
          <div className="hidden lg:block w-12 xl:w-14 h-40 relative shrink-0">
            <svg viewBox="0 0 54 160" className="w-full h-full stroke-[#7C3AED] fill-none overflow-visible">
              <path
                d="M 0 80 C 24 80, 24 35, 46 35"
                strokeWidth="1.8"
                strokeDasharray={activeStep === 4 ? "3 3" : "none"}
              />
              <polyline points="40,30 48,35 40,40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              
              <path
                d="M 0 80 C 24 80, 24 125, 46 125"
                strokeWidth="1.8"
                strokeDasharray={activeStep === 4 ? "3 3" : "none"}
              />
              <polyline points="40,120 48,125 40,130" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="lg:hidden flex items-center justify-center text-[#7C3AED]">
            <svg viewBox="0 0 16 28" className="w-4 h-7 stroke-current fill-none">
              <line x1="8" y1="0" x2="8" y2="22" strokeWidth="1.8" />
              <polyline points="4,18 8,24 12,18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 4 & 5. Right Column Stack (Slack & PagerDuty) */}
          <div className="flex flex-col gap-3.5 w-full lg:w-[230px] xl:w-[245px] shrink-0">
            
            {/* Slack */}
            <div
              className={`bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 text-left transition-all duration-300 shadow-[0_2px_12px_rgba(16,17,20,0.03)] ${
                activeStep === 4
                  ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-lg -translate-y-0.5"
                : "border-[#E2E4E9] hover:border-[#BFC3CC]"
              }`}
            >
              <SlackLogo />
              <div>
                <h3 className="text-[13.5px] sm:text-[14px] font-semibold text-[#101114] leading-snug mb-1">
                  Slack
                </h3>
                <p className="text-[11.5px] text-[#5B5F6B] leading-relaxed">
                  Real-time alerts and updates to your team
                </p>
              </div>
            </div>

            {/* PagerDuty */}
            <div
              className={`bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 text-left transition-all duration-300 shadow-[0_2px_12px_rgba(16,17,20,0.03)] ${
                activeStep === 4
                  ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/20 shadow-lg -translate-y-0.5"
                : "border-[#E2E4E9] hover:border-[#BFC3CC]"
              }`}
            >
              <PagerDutyLogo />
              <div>
                <h3 className="text-[13.5px] sm:text-[14px] font-semibold text-[#101114] leading-snug mb-1">
                  PagerDuty
                </h3>
                <p className="text-[11.5px] text-[#5B5F6B] leading-relaxed">
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
   4. SHOWCASE 1: ENGINEERING WORKSPACE MOCKUP (LIGHT THEME)
   ═══════════════════════════════════════════════════════════════ */
function EngineeringWorkspaceMockup() {
  return (
    <div className="relative rounded-2xl border border-[#E2E4E9] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] p-3.5 sm:p-5 text-[#101114] overflow-hidden text-left">
      <div className="grid grid-cols-12 gap-3 sm:gap-4 items-start">
        
        {/* Left Sidebar (3 cols on sm+, compact on mobile) with Real Product Features List */}
        <div className="hidden sm:flex sm:col-span-3 flex-col gap-0.5 pr-2.5 border-r border-[#E2E4E9] text-[11px]">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-[11.5px] text-[#101114] mb-2">
            <span className="text-[#7C3AED] font-mono font-bold">//</span>
            <span>BREXAL</span>
          </div>

          {/* OVERVIEW */}
          <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 flex items-center justify-between">
            <span>OVERVIEW</span>
            <ChevronDown size={10} className="text-slate-300" />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#EDE9FE] text-[#6366F1] font-semibold text-[11px]">
            <LayoutGrid size={12} className="shrink-0 text-[#6366F1]" />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-[11px]">
            <Zap size={12} className="text-slate-400 shrink-0" />
            <span>AI Copilot</span>
          </div>

          {/* COMMUNICATION */}
          <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 pt-1.5 flex items-center justify-between">
            <span>COMMUNICATION</span>
            <ChevronDown size={10} className="text-slate-300" />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-[11px]">
            <MessageSquare size={12} className="text-slate-400 shrink-0" />
            <span>Inbox</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-[11px]">
            <Users size={12} className="text-slate-400 shrink-0" />
            <span>Teams</span>
          </div>

          {/* PLANNING */}
          <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 pt-1.5 flex items-center justify-between">
            <span>PLANNING</span>
            <ChevronDown size={10} className="text-slate-300" />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-[11px]">
            <FolderKanban size={12} className="text-slate-400 shrink-0" />
            <span>Kanban</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-[11px]">
            <Bug size={12} className="text-slate-400 shrink-0" />
            <span>Issues &amp; Bugs</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-[11px]">
            <Map size={12} className="text-slate-400 shrink-0" />
            <span>Roadmap</span>
          </div>

          {/* OPERATIONS */}
          <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 pt-1.5 flex items-center justify-between">
            <span>OPERATIONS</span>
            <ChevronDown size={10} className="text-slate-300" />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-[11px]">
            <Activity size={12} className="text-slate-400 shrink-0" />
            <span>Uptime</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-[11px]">
            <Server size={12} className="text-slate-400 shrink-0" />
            <span>Infrastructure</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-[11px]">
            <Terminal size={12} className="text-slate-400 shrink-0" />
            <span>Logs</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-[11px]">
            <Wrench size={12} className="text-slate-400 shrink-0" />
            <span>Maintenance</span>
          </div>
        </div>

        {/* Right Main Body (9 cols) */}
        <div className="col-span-12 sm:col-span-9 space-y-3">
          
          {/* Top Bar: Engineering Workspace + Sprint 24 Dropdown */}
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[13px] sm:text-[14px] text-[#101114]">
              Engineering Workspace
            </h4>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F7F6F2] border border-[#E2E4E9] text-[10px] text-slate-600 font-mono font-medium">
              <span>Sprint 24 (Nov 11 - Nov 25)</span>
              <ChevronDown size={11} className="text-slate-400" />
            </div>
          </div>

          {/* 3 Metric Cards Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#F0FDF4] border border-emerald-100 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <Check size={12} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[13px] sm:text-[15px] font-bold text-[#101114] leading-none">08</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Completed</div>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#7C3AED]/15 text-[#7C3AED] flex items-center justify-center shrink-0">
                <RotateCcw size={12} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[13px] sm:text-[15px] font-bold text-[#101114] leading-none">04</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">In Progress</div>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-[#FEF2F2] border border-rose-100 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
                <Bug size={12} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[13px] sm:text-[15px] font-bold text-[#101114] leading-none">02</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Critical Bugs</div>
              </div>
            </div>
          </div>

          {/* Sprint Board Columns */}
          <div>
            <div className="text-[11px] font-bold text-[#101114] mb-1.5">Sprint Board</div>
            <div className="grid grid-cols-3 gap-2">
              {/* To Do */}
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E4E9] p-2 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 pb-1 border-b border-slate-200/60">
                  <span>To Do</span>
                  <span className="font-mono text-slate-400">4</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-[#E2E4E9] shadow-3xs flex items-center justify-between text-[9.5px]">
                  <span className="text-slate-800 font-medium truncate">API testing</span>
                  <span className="text-slate-400 font-mono text-[8.5px]">#421</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-[#E2E4E9] shadow-3xs flex items-center justify-between text-[9.5px]">
                  <span className="text-slate-800 font-medium truncate">UI fixes</span>
                  <span className="text-slate-400 font-mono text-[8.5px]">#422</span>
                </div>
              </div>

              {/* In Progress */}
              <div className="rounded-xl bg-[#FAF5FF] border border-[#DDD6FE]/60 p-2 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#6B21A8] pb-1 border-b border-[#DDD6FE]/60">
                  <span>In Progress</span>
                  <span className="font-mono text-[#7C3AED]">3</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-[#E2E4E9] shadow-3xs flex items-center justify-between text-[9.5px]">
                  <span className="text-slate-800 font-medium truncate">Auth service refactor</span>
                  <span className="text-slate-400 font-mono text-[8.5px]">#418</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-[#E2E4E9] shadow-3xs flex items-center justify-between text-[9.5px]">
                  <span className="text-slate-800 font-medium truncate">Add monitoring SDK</span>
                  <span className="text-slate-400 font-mono text-[8.5px]">#419</span>
                </div>
              </div>

              {/* Done */}
              <div className="rounded-xl bg-[#F0FDF4] border border-emerald-200/60 p-2 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 pb-1 border-b border-emerald-200/60">
                  <span>Done</span>
                  <span className="font-mono text-emerald-600">8</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-[#E2E4E9] shadow-3xs flex items-center justify-between text-[9.5px]">
                  <span className="text-slate-800 font-medium flex items-center gap-1 truncate">
                    <Check size={10} className="text-emerald-500 shrink-0" />
                    Bug fixes
                  </span>
                  <span className="text-slate-400 font-mono text-[8.5px]">#415</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-[#E2E4E9] shadow-3xs flex items-center justify-between text-[9.5px]">
                  <span className="text-slate-800 font-medium flex items-center gap-1 truncate">
                    <Check size={10} className="text-emerald-500 shrink-0" />
                    Release v1.4.2
                  </span>
                  <span className="text-slate-400 font-mono text-[8.5px]">#416</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-[#101114] mb-1.5">Recent Activity</div>
            <div className="space-y-1.5">
              <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E4E9] flex items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded-md bg-slate-200 flex items-center justify-center shrink-0">
                    <GitPullRequest size={11} className="text-slate-700" />
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-slate-800">PR #248 — Authentication update</span>
                    <span className="text-slate-400 font-mono ml-2 hidden sm:inline">Linked to commit 9f3e2d1 • 2 hours ago</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-mono font-bold shrink-0">
                  Merged
                </span>
              </div>

              <div className="p-2 rounded-xl bg-[#FEF2F2]/60 border border-rose-100 flex items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <Bug size={11} className="text-rose-600" />
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-slate-800">Production regression detected</span>
                    <span className="text-slate-400 font-mono ml-2 hidden sm:inline">auth.bhartinexus.io • P1 (Critical) • 14 minutes ago</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[9px] font-mono font-bold shrink-0">
                  Critical
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. SHOWCASE 2: INFRASTRUCTURE & GOVERNANCE MOCKUP (DARK THEME)
   ═══════════════════════════════════════════════════════════════ */
function InfrastructureGovernanceMockup() {
  return (
    <div className="relative rounded-2xl border border-white/12 bg-[#121422] shadow-[0_25px_60px_rgba(0,0,0,0.55)] p-3.5 sm:p-5 text-white overflow-hidden text-left">
      <div className="grid grid-cols-12 gap-3 sm:gap-4 items-start">
        
        {/* Left Dark Sidebar (3 cols on sm+, hidden on mobile) with Real Product Features List */}
        <div className="hidden sm:flex sm:col-span-3 flex-col gap-0.5 pr-2.5 border-r border-white/8 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-[11.5px] text-white mb-2">
            <span className="text-[#C7BDF7] font-mono font-bold">//</span>
            <span>BREXAL</span>
          </div>

          {/* OVERVIEW */}
          <div className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider px-2 pt-1 flex items-center justify-between">
            <span>OVERVIEW</span>
            <ChevronDown size={10} className="text-white/30" />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors text-[11px]">
            <LayoutGrid size={12} className="text-white/40 shrink-0" />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors text-[11px]">
            <Zap size={12} className="text-white/40 shrink-0" />
            <span>AI Copilot</span>
          </div>

          {/* COMMUNICATION */}
          <div className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider px-2 pt-1.5 flex items-center justify-between">
            <span>COMMUNICATION</span>
            <ChevronDown size={10} className="text-white/30" />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors text-[11px]">
            <MessageSquare size={12} className="text-white/40 shrink-0" />
            <span>Inbox</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors text-[11px]">
            <Users size={12} className="text-white/40 shrink-0" />
            <span>Teams</span>
          </div>

          {/* PLANNING */}
          <div className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider px-2 pt-1.5 flex items-center justify-between">
            <span>PLANNING</span>
            <ChevronDown size={10} className="text-white/30" />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors text-[11px]">
            <FolderKanban size={12} className="text-white/40 shrink-0" />
            <span>Kanban</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors text-[11px]">
            <Bug size={12} className="text-white/40 shrink-0" />
            <span>Issues &amp; Bugs</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors text-[11px]">
            <Map size={12} className="text-white/40 shrink-0" />
            <span>Roadmap</span>
          </div>

          {/* OPERATIONS */}
          <div className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider px-2 pt-1.5 flex items-center justify-between">
            <span>OPERATIONS</span>
            <ChevronDown size={10} className="text-white/30" />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors text-[11px]">
            <Activity size={12} className="text-white/40 shrink-0" />
            <span>Uptime</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#6366F1] text-white font-semibold text-[11px] shadow-xs">
            <Server size={12} className="shrink-0" />
            <span>Infrastructure</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors text-[11px]">
            <Terminal size={12} className="text-white/40 shrink-0" />
            <span>Logs</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors text-[11px]">
            <Wrench size={12} className="text-white/40 shrink-0" />
            <span>Maintenance</span>
          </div>
        </div>

        {/* Right Dashboard Content (9 cols) */}
        <div className="col-span-12 sm:col-span-9 space-y-3">
          
          {/* Top Bar: Cluster Telemetry + Healthy badge + Last 24 hours */}
          <div className="flex items-center justify-between pb-2 border-b border-white/8">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[13px] sm:text-[14px] text-white">
                Cluster Telemetry
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[9.5px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                <span>◆</span> Healthy
              </span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/70 font-mono">
              <span>Last 24 hours</span>
              <ChevronDown size={11} className="text-white/40" />
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/8">
              <div className="flex items-center gap-1 text-[9.5px] text-white/50 font-mono mb-1">
                <Cpu size={11} className="text-[#818CF8]" />
                <span>CPU Usage</span>
              </div>
              <div className="text-[14px] sm:text-[16px] font-bold text-white">34.8%</div>
              <div className="text-[9px] text-[#C7BDF7] font-mono mt-0.5">↓ -2.1%</div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/8">
              <div className="flex items-center gap-1 text-[9.5px] text-white/50 font-mono mb-1">
                <Layers size={11} className="text-[#818CF8]" />
                <span>Memory</span>
              </div>
              <div className="text-[14px] sm:text-[16px] font-bold text-white">58.2%</div>
              <div className="text-[9px] text-emerald-400 font-mono mt-0.5">↑ +3.4%</div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/8">
              <div className="flex items-center gap-1 text-[9.5px] text-white/50 font-mono mb-1">
                <Activity size={11} className="text-[#818CF8]" />
                <span>Network</span>
              </div>
              <div className="text-[14px] sm:text-[16px] font-bold text-white">1.8 Gbps</div>
              <div className="text-[9px] text-emerald-400 font-mono mt-0.5">↑ +12.6%</div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/8">
              <div className="flex items-center gap-1 text-[9.5px] text-white/50 font-mono mb-1">
                <ShieldCheck size={11} className="text-emerald-400" />
                <span>Uptime</span>
              </div>
              <div className="text-[14px] sm:text-[16px] font-bold text-white">99.99%</div>
              <div className="text-[9px] text-emerald-400 font-mono mt-0.5 flex items-center gap-0.5">
                <span>●</span> Operational
              </div>
            </div>
          </div>

          {/* Bottom Row: Node Resource Usage (Wave Area Chart) + Security Audit Stream */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 pt-1">
            
            {/* Chart (7 cols) */}
            <div className="md:col-span-7 p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/8 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] font-semibold text-white/90">Node Resource Usage</span>
                <div className="flex items-center gap-2 text-[8px] font-mono text-white/60">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" /> CPU</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#C7BDF7]" /> RAM</span>
                </div>
              </div>

              {/* SVG Curve Chart */}
              <div className="relative w-full h-[75px] sm:h-[85px] my-1">
                <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="cpuWaveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 65 C 40 60, 70 70, 110 50 C 150 30, 180 55, 220 35 C 260 20, 280 40, 300 30 L 300 80 L 0 80 Z"
                    fill="url(#cpuWaveGrad)"
                  />
                  <path
                    d="M 0 65 C 40 60, 70 70, 110 50 C 150 30, 180 55, 220 35 C 260 20, 280 40, 300 30"
                    fill="none"
                    stroke="#818CF8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex justify-between items-center text-[7.5px] font-mono text-white/40 pt-1 border-t border-white/5">
                <span>12 AM</span>
                <span>3 AM</span>
                <span>6 AM</span>
                <span>9 AM</span>
                <span>12 PM</span>
                <span>3 PM</span>
                <span>6 PM</span>
                <span>9 PM</span>
              </div>
            </div>

            {/* Audit Stream (5 cols) */}
            <div className="md:col-span-5 p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/8 flex flex-col justify-between">
              <div className="text-[10.5px] font-semibold text-white/90 mb-2">
                Security Audit Stream
              </div>

              <div className="space-y-1.5">
                <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/6 flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <ShieldCheck size={11} className="text-emerald-400 shrink-0" />
                    <span className="text-white/80 truncate">Admin permission updated</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[8px] font-bold shrink-0">
                    Verified
                  </span>
                </div>

                <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/6 flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Box size={11} className="text-[#818CF8] shrink-0" />
                    <span className="text-white/80 truncate">New service deployed</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#6366F1]/20 text-[#C7BDF7] font-mono text-[8px] font-bold shrink-0">
                    Logged
                  </span>
                </div>

                <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/6 flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Layers size={11} className="text-[#C4B5FD] shrink-0" />
                    <span className="text-white/80 truncate">Access policy changed</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-[#C4B5FD] font-mono text-[8px] font-bold shrink-0">
                    Audited
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. DUAL PRODUCT SHOWCASES (AS SHOWN IN REFERENCE SPEC IMAGE)
   ═══════════════════════════════════════════════════════════════ */
function StripeProductShowcaseSection() {
  return (
    <section id="architecture" className="relative overflow-hidden font-sans">
      
      {/* ── SHOWCASE 1: ENGINEERING VELOCITY (LIGHT SECTION) ── */}
      <div className="py-14 sm:py-20 md:py-24 px-4 sm:px-10 bg-[#FAFAFC] border-b border-[#E2E4E9]">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Text & Features */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[2px] bg-[#7C3AED]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#7C3AED]">
                ENGINEERING VELOCITY
              </span>
            </div>

            <h2 className="font-['Sora',sans-serif] text-[32px] sm:text-[40px] md:text-[44px] font-bold text-[#101114] tracking-[-0.03em] leading-[1.12] mb-3">
              Engineering Velocity
            </h2>

            <p className="text-[15px] sm:text-[16px] font-bold text-[#101114] leading-snug mb-3">
              Agile sprint pipelines with autonomous bug watchdogs.
            </p>

            <p className="text-[13.5px] sm:text-[14px] text-[#5B5F6B] leading-relaxed mb-6 max-w-[480px]">
              Track multi-engineer sprint deliverables in lockstep with automated production regression feeds. Critical runtime anomalies are mapped directly to git commits before impacting customers.
            </p>

            {/* 3 Circular Icon Feature Items */}
            <div className="space-y-3.5 mb-7 w-full">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5 shadow-3xs">
                  <GitPullRequest size={15} />
                </div>
                <div className="text-xs sm:text-[13px] text-[#101114] font-medium leading-relaxed pt-1">
                  Live Kanban boards synchronized with GitHub and GitLab pull requests
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5 shadow-3xs">
                  <Activity size={15} />
                </div>
                <div className="text-xs sm:text-[13px] text-[#101114] font-medium leading-relaxed pt-1">
                  Real-time regression detection with automated issue severity tags
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5 shadow-3xs">
                  <GitCommit size={15} />
                </div>
                <div className="text-xs sm:text-[13px] text-[#101114] font-medium leading-relaxed pt-1">
                  Automated commit correlation &amp; fast rollback recommendations
                </div>
              </div>
            </div>

            {/* Purple CTA Button */}
            <Link
              href="/register"
              className="px-6 py-3 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[13.5px] font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore engineering workflows</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Engineering Workspace Light Mockup */}
          <div className="lg:col-span-7 relative w-full pt-4 lg:pt-0">
            <EngineeringWorkspaceMockup />
          </div>

        </div>
      </div>

      {/* ── SHOWCASE 2: INFRASTRUCTURE & GOVERNANCE (DARK SECTION) ── */}
      <div className="py-14 sm:py-20 md:py-24 px-4 sm:px-10 bg-[#0B0D17] text-white border-b border-[#1E2338] relative overflow-hidden">
        {/* Ambient Dark Atmospheric Glow */}
        <div className="absolute top-1/2 left-0 w-[550px] h-[550px] bg-gradient-to-r from-[#7C3AED]/15 via-[#6366F1]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left: Dark Infrastructure Mockup */}
          <div className="lg:col-span-7 relative w-full order-2 lg:order-1 pt-4 lg:pt-0">
            <InfrastructureGovernanceMockup />
          </div>

          {/* Right: Text & Features */}
          <div className="lg:col-span-5 flex flex-col items-start text-left order-1 lg:order-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[2px] bg-[#A78BFA]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#A78BFA]">
                INFRASTRUCTURE &amp; GOVERNANCE
              </span>
            </div>

            <h2 className="font-['Sora',sans-serif] text-[32px] sm:text-[40px] md:text-[44px] font-bold text-white tracking-[-0.03em] leading-[1.12] mb-3">
              Infrastructure &amp; <br />
              Governance
            </h2>

            <p className="text-[15px] sm:text-[16px] font-bold text-white/95 leading-snug mb-3">
              Enterprise team controls with hardware node telemetry.
            </p>

            <p className="text-[13.5px] sm:text-[14px] text-white/60 leading-relaxed mb-6 max-w-[480px]">
              Manage architectural ownership, RBAC permissions, and multi-tenant audit logs alongside live CPU, memory, NVMe disk, and network throughput across every cloud cluster.
            </p>

            {/* 3 Circular Icon Feature Items */}
            <div className="space-y-3.5 mb-7 w-full">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#A78BFA] flex items-center justify-center shrink-0 mt-0.5 shadow-3xs">
                  <ShieldCheck size={15} />
                </div>
                <div className="text-xs sm:text-[13px] text-white/90 font-medium leading-relaxed pt-1">
                  Granular role-based access control (RBAC) with audit verification
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#A78BFA] flex items-center justify-center shrink-0 mt-0.5 shadow-3xs">
                  <BarChart3 size={15} />
                </div>
                <div className="text-xs sm:text-[13px] text-white/90 font-medium leading-relaxed pt-1">
                  High-resolution node metrics: 34.8% CPU, 58.2% RAM, 1.8 Gbps network
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#A78BFA] flex items-center justify-center shrink-0 mt-0.5 shadow-3xs">
                  <Database size={15} />
                </div>
                <div className="text-xs sm:text-[13px] text-white/90 font-medium leading-relaxed pt-1">
                  Automated security audit log stream
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
   5. ELITE GLOBAL SCALE & RELIABILITY NUMBERS
   ═══════════════════════════════════════════════════════════════ */
function StripeGlobalScaleSection() {
  const stats = [
    { number: "250M+", label: "Telemetry Spans / Sec", desc: "Inspected at line-rate across production cloud regions." },
    { number: "99.999%", label: "Platform Uptime SLA", desc: "Enterprise SLA backed by autonomous multi-region failover." },
    { number: "< 0.8ms", label: "P99 Telemetry Overhead", desc: "Zero bytecode injection and zero garbage collection halts." },
    { number: "140+", label: "Global Edge Locations", desc: "Synthesizing ingress signals closer to customer endpoints." },
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
            High-growth startups and global enterprises rely on Bharti Nexus to ensure 24/7 service availability.
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
                  className={`w-full py-3 min-h-[44px] rounded-full text-center text-sm font-semibold transition-all flex items-center justify-center cursor-pointer ${
                    t.highlight
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
          Explore our live sandboxed console or talk with our solutions architects to instrument your clusters today.
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
              <Logo className="h-5 sm:h-5.5 text-[#101114]" />
            </div>
            <p className="text-[12px] sm:text-[13px] text-[#5B5F6B] font-medium leading-relaxed max-w-sm mb-4">
              Autonomous telemetry infrastructure and AI incident intelligence engineered by Bharti Nexus Technologies.
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
            <Link href="#architecture" className="text-[#5B5F6B] font-medium hover:text-[#7C3AED] transition-colors">eBPF Telemetry</Link>
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
            © 2026 Bharti Nexus Technologies Inc. All rights reserved.
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
        <PlatformOverviewSection />
        <StripeArchitectureFlowSection />
        <StripeProductShowcaseSection />
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
