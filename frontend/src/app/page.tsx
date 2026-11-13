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
  MessageSquare
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { BrexalIntegrationsSection } from "@/components/landing/BrexalIntegrationsSection";
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
   1. ELITE DARK EDITORIAL NAVIGATION BAR (EXACT AS SPECIFIED)
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
          ? "bg-[#0A0C14]/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          : "bg-[#0A0C14]/80 backdrop-blur-xs border-b border-white/5"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-10 flex items-center justify-between">
        
        {/* Brand Logo with Double Diagonal Slash Icon */}
        <Link href="/" className="flex items-center gap-2 group focus:outline-none shrink-0">
          <div className="flex items-center gap-1.5 font-bold tracking-[0.16em] text-[15px] sm:text-[16px] text-white">
            <span className="text-[#C7BDF7] font-mono text-base font-bold">//</span>
            <span className="font-['Sora',sans-serif] tracking-[0.18em]">BREXAL</span>
          </div>
        </Link>

        {/* Right Nav & Action CTAs Group */}
        <div className="flex items-center gap-5 xl:gap-8 shrink-0">
          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13.5px] font-medium text-[#BFC3CC] whitespace-nowrap">
            <div 
              className="relative cursor-pointer group flex items-center gap-1 hover:text-white transition-colors"
              onMouseEnter={() => setActiveDropdown("product")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#platform">Product</Link>
              <ChevronDown size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              
              {activeDropdown === "product" && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="p-3.5 bg-[#12141F] rounded-2xl border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.7)] space-y-2 text-left">
                    <Link href="#platform" className="block p-2 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="font-semibold text-xs text-white">Real-Time Monitoring</div>
                      <div className="text-[11px] text-[#8B8F9A]">Full visibility into applications and mesh</div>
                    </Link>
                    <Link href="#interactive-simulator" className="block p-2 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="font-semibold text-xs text-white">AI Incident Copilot</div>
                      <div className="text-[11px] text-[#8B8F9A]">Root cause analysis & remediation in &lt; 90s</div>
                    </Link>
                    <Link href="#architecture-flow" className="block p-2 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="font-semibold text-xs text-white">eBPF Telemetry Mesh</div>
                      <div className="text-[11px] text-[#8B8F9A]">0.0% CPU kernel-level socket observability</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div 
              className="relative cursor-pointer group flex items-center gap-1 hover:text-white transition-colors"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#comparison">Solutions</Link>
              <ChevronDown size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              
              {activeDropdown === "solutions" && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="p-3.5 bg-[#12141F] rounded-2xl border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.7)] space-y-2 text-left">
                    <div className="block p-2 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="font-semibold text-xs text-white">Enterprise Kubernetes</div>
                      <div className="text-[11px] text-[#8B8F9A]">Multi-cluster pod routing & ingress</div>
                    </div>
                    <div className="block p-2 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="font-semibold text-xs text-white">High-Throughput Fintech</div>
                      <div className="text-[11px] text-[#8B8F9A]">Sub-millisecond SLA enforcement</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div 
              className="relative cursor-pointer group flex items-center gap-1 hover:text-white transition-colors"
              onMouseEnter={() => setActiveDropdown("developers")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#developer-sandbox">Developers</Link>
              <ChevronDown size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            <div 
              className="relative cursor-pointer group flex items-center gap-1 hover:text-white transition-colors"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#faq">Resources</Link>
              <ChevronDown size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            <Link href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Action CTAs: Log in + Get started → */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link
              href="/login"
              className="text-[13px] sm:text-[13.5px] font-medium text-[#BFC3CC] hover:text-white px-2 py-1.5 transition-colors whitespace-nowrap"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="group px-4.5 py-2 rounded-full bg-white text-[#0A0C14] hover:bg-neutral-100 text-[12.5px] sm:text-[13px] font-semibold transition-all shadow-[0_2px_12px_rgba(255,255,255,0.15)] hover:scale-105 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Get started</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0A0C14]/98 backdrop-blur-xl px-4 py-5 space-y-4 shadow-2xl text-left">
          <div className="space-y-1">
            <Link
              href="#platform"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Product
            </Link>
            <Link
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Solutions
            </Link>
            <Link
              href="#developer-sandbox"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Developers
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full bg-white text-[#0A0C14] text-center font-semibold text-sm shadow-sm"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full border border-white/20 bg-white/5 text-center font-semibold text-sm text-white"
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
   2. FLOATING 3D PERSPECTIVE DARK CONSOLE MOCKUP (EXACT STATS & CHARTS)
   ═══════════════════════════════════════════════════════════════ */
function HeroConsole3D() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="relative w-full max-w-[620px] mx-auto lg:max-w-none">
      {/* 3D Perspective Wrapper */}
      <div className="relative transform lg:rotate-y-[-7deg] lg:rotate-x-[4deg] lg:rotate-z-[-2deg] transition-all duration-700 hover:rotate-0 hover:scale-[1.01] group">
        
        {/* Glow Behind Console */}
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#7C3AED]/25 via-[#425CF5]/20 to-[#C8A96B]/15 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Main Dark Console Window */}
        <div className="relative rounded-2xl border border-white/12 bg-[#12141F]/95 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.7),0_0_50px_rgba(124,58,237,0.18)] p-3 sm:p-4 text-white overflow-hidden">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/8 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-bold tracking-wider text-[11px] text-white">
                <span className="text-[#C7BDF7] font-mono">//</span>
                <span>BREXAL</span>
              </div>
              <span className="text-white/20">|</span>
              <span className="text-white/80 font-medium text-[11px] hidden sm:inline">
                System Overview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10.5px] text-white/70 hover:text-white cursor-pointer transition-colors">
                <span>Last 24 hours</span>
                <ChevronDown size={11} className="text-white/50" />
              </div>
            </div>
          </div>

          {/* Console Body: Left Nav + Main Content */}
          <div className="grid grid-cols-12 gap-3">
            
            {/* Left Nav (3 cols on sm+, hidden on mobile for space) */}
            <div className="hidden sm:flex sm:col-span-3 flex-col gap-1 pr-1 border-r border-white/8 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                  activeTab === "overview"
                    ? "bg-[#6366F1] text-white font-semibold shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Layers size={13} />
                <span>Overview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("monitoring")}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                  activeTab === "monitoring"
                    ? "bg-[#6366F1] text-white font-semibold shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Activity size={13} />
                <span>Monitoring</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("incidents")}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                  activeTab === "incidents"
                    ? "bg-[#6366F1] text-white font-semibold shadow-xs"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <AlertTriangle size={13} />
                <span>Incidents</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
              >
                <Network size={13} />
                <span>Traces</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
              >
                <Terminal size={13} />
                <span>Logs</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
              >
                <Server size={13} />
                <span>Infrastructure</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left mt-auto"
              >
                <Cpu size={13} />
                <span>Settings</span>
              </button>
            </div>

            {/* Right Main Dashboard Display (9 cols on sm+, 12 cols on mobile) */}
            <div className="col-span-12 sm:col-span-9 flex flex-col gap-2.5">
              
              {/* 4 Top Metric Cards (EXACT VALUES FROM USER SPEC) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Uptime */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/8">
                  <div className="text-[9.5px] text-white/50 font-mono mb-1">Uptime</div>
                  <div className="text-[14px] sm:text-[16px] font-bold text-white leading-tight">
                    99.98%
                  </div>
                  <div className="text-[9px] text-[#10B981] font-mono mt-0.5 flex items-center gap-0.5">
                    <span>↑</span> +0.12%
                  </div>
                </div>

                {/* Incidents */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/8">
                  <div className="text-[9.5px] text-white/50 font-mono mb-1">Incidents</div>
                  <div className="text-[14px] sm:text-[16px] font-bold text-white leading-tight">
                    3
                  </div>
                  <div className="text-[9px] text-[#C7BDF7] font-mono mt-0.5 flex items-center gap-0.5">
                    <span>↓</span> -40%
                  </div>
                </div>

                {/* MTTR */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/8">
                  <div className="text-[9.5px] text-white/50 font-mono mb-1">MTTR</div>
                  <div className="text-[14px] sm:text-[16px] font-bold text-white leading-tight">
                    4m 26s
                  </div>
                  <div className="text-[9px] text-[#C7BDF7] font-mono mt-0.5 flex items-center gap-0.5">
                    <span>↓</span> -32%
                  </div>
                </div>

                {/* Error Rate */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/8">
                  <div className="text-[9.5px] text-white/50 font-mono mb-1">Error Rate</div>
                  <div className="text-[14px] sm:text-[16px] font-bold text-white leading-tight">
                    0.12%
                  </div>
                  <div className="text-[9px] text-[#10B981] font-mono mt-0.5 flex items-center gap-0.5">
                    <span>↑</span> +0.03%
                  </div>
                </div>
              </div>

              {/* Bottom Row: Request Volume Area Chart (Left) + SLO Health Donut (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                
                {/* Request Volume Chart (8 cols) */}
                <div className="md:col-span-8 p-3 rounded-xl bg-white/[0.04] border border-white/8 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-white/90">
                      Request Volume
                    </span>
                    <span className="text-[9px] font-mono text-[#C7BDF7] bg-[#6366F1]/20 px-1.5 py-0.5 rounded">
                      Live Telemetry
                    </span>
                  </div>

                  {/* SVG Wave Chart */}
                  <div className="relative w-full h-[95px] sm:h-[110px]">
                    {/* Tooltip on peak: 1.24M reqs */}
                    <div className="absolute top-1 right-[22%] -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#101114] border border-[#6366F1] shadow-lg text-[9px] font-mono font-bold text-white z-10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                      <span>1.24M reqs</span>
                    </div>

                    <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="reqVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.45" />
                          <stop offset="60%" stopColor="#6366F1" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d="M 0 85 C 30 82, 50 65, 80 68 C 110 71, 130 50, 160 55 C 190 60, 210 20, 230 22 C 255 24, 275 48, 300 45 L 300 100 L 0 100 Z"
                        fill="url(#reqVolumeGrad)"
                      />

                      {/* Stroke Line */}
                      <path
                        d="M 0 85 C 30 82, 50 65, 80 68 C 110 71, 130 50, 160 55 C 190 60, 210 20, 230 22 C 255 24, 275 48, 300 45"
                        fill="none"
                        stroke="#818CF8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Peak Marker Dot */}
                      <circle cx="230" cy="22" r="3.5" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2.5" />
                    </svg>
                  </div>

                  {/* X Axis Time Labels */}
                  <div className="flex justify-between items-center text-[7.5px] sm:text-[8px] font-mono text-white/40 pt-1 border-t border-white/5">
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

                {/* SLO Health Donut Gauge (4 cols) */}
                <div className="md:col-span-4 p-3 rounded-xl bg-white/[0.04] border border-white/8 flex flex-col items-center justify-between">
                  <div className="text-[11px] font-semibold text-white/90 text-center w-full">
                    SLO Health
                  </div>

                  {/* Circular Radial Gauge */}
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 my-1 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Background Track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="8"
                      />
                      {/* Active Arc (99.9%) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke="#818CF8"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 38}
                        strokeDashoffset={(2 * Math.PI * 38) * (1 - 0.999)}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(129,140,248,0.7)]"
                      />
                    </svg>
                    
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[14px] sm:text-[15px] font-bold text-white leading-none">
                        99.9%
                      </span>
                    </div>
                  </div>

                  <div className="text-[8.5px] font-mono text-white/50 text-center">
                    SLO Target Met
                  </div>
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
   3. CINEMATIC DARK HERO SECTION (EXACT REFERENCE DESIGN)
   ═══════════════════════════════════════════════════════════════ */
function StripeHeroSection() {
  return (
    <section className="relative bg-[#0A0C14] text-white pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 px-4 sm:px-8 lg:px-12 overflow-hidden">
      
      {/* ── CINEMATIC ARCHITECTURAL MASTER BACKGROUND (USER MASTER ASSET) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-0">
        {/* Master Architectural Wave Artwork from New folder (2) */}
        <img
          src="/hero-mesh.png"
          alt="Luminous Architectural Wave"
          className="absolute top-0 right-0 w-full sm:w-[90%] lg:w-[68%] xl:w-[62%] h-full object-cover object-right pointer-events-none opacity-95"
        />

        {/* Seamless Radial/Linear Left Blend Mask for Perfect Headline Readability */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[52%] bg-gradient-to-r from-[#0A0C14] via-[#0A0C14] to-transparent pointer-events-none" />

        {/* Atmospheric Ambient Lighting Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#C8A96B]/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-[#7C3AED]/15 blur-[110px] pointer-events-none" />

        {/* Top and Bottom Soft Transitions */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#0A0C14] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0A0C14] to-transparent pointer-events-none" />
      </div>

      <div className="max-w-[1320px] mx-auto relative z-10">
        
        {/* TWO-COLUMN EDITORIAL COMPOSITION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* Left Column (5 cols): Editorial Headline & Copy */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            
            {/* Minimal Gold Eyebrow */}
            <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
              <span className="w-6 h-[1.5px] bg-[#C8A96B]" />
              <span className="text-[11px] sm:text-[11.5px] font-mono font-semibold tracking-[0.2em] uppercase text-[#C8A96B]">
                AI MONITORING PLATFORM
              </span>
            </div>

            {/* Display Headline: "Intelligence, engineered to move." */}
            <h1 className="text-[38px] sm:text-[50px] md:text-[56px] lg:text-[60px] xl:text-[66px] font-semibold tracking-[-0.035em] text-white leading-[1.05] mb-4 sm:mb-5 text-left">
              Intelligence, <br />
              engineered <span className="font-editorial italic font-normal text-[#C7BDF7]">to move.</span>
            </h1>

            {/* Supporting Subhead */}
            <p className="text-[14.5px] sm:text-[15.5px] text-[#A1A5B4] font-normal leading-relaxed mb-6 sm:mb-7 max-w-[460px] text-left">
              A modern monitoring and incident management platform that gives teams complete visibility, faster resolution and a more reliable system.
            </p>

            {/* Action CTAs Row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-3.5 mb-8 sm:mb-10 w-full sm:w-auto">
              <Link
                href="/register"
                className="px-6 py-3 rounded-full bg-white text-[#0A0C14] hover:bg-neutral-100 text-[13.5px] sm:text-[14px] font-semibold transition-all shadow-[0_4px_20px_rgba(255,255,255,0.18)] hover:scale-105 flex items-center gap-2 group cursor-pointer"
              >
                <span>Start free trial</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#interactive-simulator"
                className="px-6 py-3 rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 text-[13.5px] sm:text-[14px] font-medium transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Book a demo</span>
              </Link>
            </div>

            {/* 3 Micro Feature Callouts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-6 border-t border-white/10 w-full max-w-[500px]">
              <div className="flex items-start gap-2.5">
                <Zap size={17} className="text-[#C7BDF7] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[12.5px] sm:text-[13px] font-semibold text-white">Detect faster</div>
                  <div className="text-[10.5px] sm:text-[11px] text-[#8B8F9A]">AI-powered insights</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Layers size={17} className="text-[#C7BDF7] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[12.5px] sm:text-[13px] font-semibold text-white">Resolve smarter</div>
                  <div className="text-[10.5px] sm:text-[11px] text-[#8B8F9A]">RCA in minutes</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={17} className="text-[#C7BDF7] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[12.5px] sm:text-[13px] font-semibold text-white">Stay reliable</div>
                  <div className="text-[10.5px] sm:text-[11px] text-[#8B8F9A]">High-uptime systems</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (7 cols): Floating 3D Perspective Console Mockup */}
          <div className="lg:col-span-7 relative w-full pt-4 lg:pt-0">
            <HeroConsole3D />
          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. SOCIAL PROOF / CLIENT STRIP (EXACT AS IN REFERENCE)
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
    <section className="bg-[#0A0C14] border-t border-b border-white/10 py-5 sm:py-6 px-4 sm:px-10">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
        
        {/* Left Trust Statement */}
        <div className="flex items-center text-center md:text-left text-xs sm:text-[13px] font-medium text-[#8B8F9A] shrink-0">
          <span>Trusted by <br className="hidden md:inline" /> engineering teams worldwide</span>
          <span className="hidden md:block w-px h-8 bg-white/15 ml-8" />
        </div>

        {/* Right Client Logos */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-12 flex-1 opacity-90 hover:opacity-100 transition-opacity">
          {clients.map((c, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-default">
              <span className="text-white/40 group-hover:text-[#C7BDF7] font-mono text-base transition-colors">
                {c.symbol}
              </span>
              <span className="font-['Sora',sans-serif] text-sm sm:text-[15px] font-semibold text-white/80 group-hover:text-white tracking-wide transition-colors">
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
    <div className={`${className} rounded-xl bg-[#EEF2FF] border border-[#C7BDF7]/60 flex items-center justify-center p-2 shadow-2xs shrink-0`}>
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7 text-[#425CF5]">
        {/* Microchip Body */}
        <rect x="7" y="7" width="18" height="18" rx="4" stroke="#425CF5" strokeWidth="2" fill="#C7BDF7" fillOpacity="0.25" />
        {/* Top Pins */}
        <line x1="11" y1="3" x2="11" y2="7" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="3" x2="16" y2="7" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        <line x1="21" y1="3" x2="21" y2="7" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        {/* Bottom Pins */}
        <line x1="11" y1="25" x2="11" y2="29" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="25" x2="16" y2="29" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        <line x1="21" y1="25" x2="21" y2="29" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        {/* Left Pins */}
        <line x1="3" y1="11" x2="7" y2="11" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="16" x2="7" y2="16" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="21" x2="7" y2="21" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        {/* Right Pins */}
        <line x1="25" y1="11" x2="29" y2="11" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="16" x2="29" y2="16" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="21" x2="29" y2="21" stroke="#425CF5" strokeWidth="2" strokeLinecap="round" />
        {/* Neural Synapse */}
        <circle cx="16" cy="13.5" r="1.2" fill="#425CF5" />
        <circle cx="16" cy="18.5" r="1.2" fill="#425CF5" />
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
    <div className={`${className} rounded-xl bg-[#F0FDF4] border border-emerald-100 flex items-center justify-center p-2 shadow-2xs shrink-0`}>
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#425CF5]/[0.035] via-[#C7BDF7]/[0.025] to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto text-center relative z-10">
        
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-8 h-[1px] bg-[#E2E4E9]" />
          <span className="text-[10.5px] sm:text-[11.5px] font-mono font-medium uppercase tracking-[0.16em] text-[#5B5F6B]">
            ARCHITECTURE FLOW
          </span>
          <span className="w-8 h-[1px] bg-[#E2E4E9]" />
        </div>

        {/* Title */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-[42px] font-semibold tracking-[-0.03em] text-[#101114] mb-3 leading-tight">
          From Your Workload <span className="text-[#425CF5]">to Action</span>
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
                ? "bg-[#EEF2FF] text-[#425CF5] border border-[#C7BDF7]"
                : "bg-white hover:bg-[#F7F6F2] text-[#101114] border border-[#D6D8DE] hover:border-[#425CF5] hover:shadow-sm"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${simulating ? "bg-[#425CF5] animate-ping" : "bg-[#425CF5]"}`} />
            <span>{simulating ? "Simulating Telemetry Pipeline Flow..." : "Test Interactive Data Flow"}</span>
          </button>
        </div>

        {/* ── DIAGRAM CONTAINER ── */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-3 xl:gap-4 max-w-[1240px] mx-auto">
          
          {/* 1. Your Kubernetes Pod */}
          <div
            className={`w-full lg:w-[230px] xl:w-[245px] bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 text-left transition-all duration-300 shadow-[0_2px_12px_rgba(16,17,20,0.03)] shrink-0 ${
              activeStep === 1
                ? "border-[#425CF5] ring-2 ring-[#425CF5]/20 shadow-lg -translate-y-1"
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
          <div className="hidden lg:flex items-center justify-center text-[#425CF5] w-8 xl:w-10 shrink-0">
            <svg viewBox="0 0 36 16" className="w-9 h-4 stroke-current fill-none">
              <line x1="0" y1="8" x2="28" y2="8" strokeWidth="1.8" strokeDasharray={activeStep === 1 ? "3 3" : "none"} />
              <polyline points="24,4 30,8 24,12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="lg:hidden flex items-center justify-center text-[#425CF5]">
            <svg viewBox="0 0 16 28" className="w-4 h-7 stroke-current fill-none">
              <line x1="8" y1="0" x2="8" y2="22" strokeWidth="1.8" />
              <polyline points="4,18 8,24 12,18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 2. eBPF Kernel Probe */}
          <div
            className={`w-full lg:w-[230px] xl:w-[245px] bg-white rounded-2xl border p-4 sm:p-5 flex items-center gap-3.5 text-left transition-all duration-300 shadow-[0_2px_12px_rgba(16,17,20,0.03)] shrink-0 ${
              activeStep === 2
                ? "border-[#425CF5] ring-2 ring-[#425CF5]/20 shadow-lg -translate-y-1"
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
          <div className="hidden lg:flex items-center justify-center text-[#425CF5] w-8 xl:w-10 shrink-0">
            <svg viewBox="0 0 36 16" className="w-9 h-4 stroke-current fill-none">
              <line x1="0" y1="8" x2="28" y2="8" strokeWidth="1.8" strokeDasharray={activeStep === 2 ? "3 3" : "none"} />
              <polyline points="24,4 30,8 24,12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="lg:hidden flex items-center justify-center text-[#425CF5]">
            <svg viewBox="0 0 16 28" className="w-4 h-7 stroke-current fill-none">
              <line x1="8" y1="0" x2="8" y2="22" strokeWidth="1.8" />
              <polyline points="4,18 8,24 12,18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 3. BREXAL Neural Engine (Featured Center Card) */}
          <div
            className={`w-full lg:w-[275px] xl:w-[295px] relative rounded-2xl border p-5 sm:p-5.5 text-left transition-all duration-300 shadow-[0_8px_24px_rgba(66,92,245,0.08)] shrink-0 ${
              activeStep === 3
                ? "bg-[#EEF2FF] border-[#425CF5] ring-2 ring-[#425CF5]/25 shadow-xl -translate-y-1"
                : "bg-[#F7F6F2] border-[#C7BDF7]"
            }`}
          >
            {/* Top Right AI Engine Badge */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#425CF5] text-[10.5px] font-semibold font-mono border border-[#C7BDF7]/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#425CF5]" />
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
            <svg viewBox="0 0 54 160" className="w-full h-full stroke-[#425CF5] fill-none overflow-visible">
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

          <div className="lg:hidden flex items-center justify-center text-[#425CF5]">
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
                  ? "border-[#425CF5] ring-2 ring-[#425CF5]/20 shadow-lg -translate-y-0.5"
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
                  ? "border-[#425CF5] ring-2 ring-[#425CF5]/20 shadow-lg -translate-y-0.5"
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
   BROWSER MOCKUP FRAME (ARCHITECTURAL SWISS WINDOW WITH URL BAR)
   ═══════════════════════════════════════════════════════════════ */
interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

function BrowserFrame({ url = "console.bhartinexus.io", children, className = "" }: BrowserFrameProps) {
  return (
    <div className={`rounded-xl sm:rounded-2xl border border-[#E2E4E9] bg-white shadow-[0_20px_50px_rgba(16,17,20,0.06)] overflow-hidden ${className}`}>
      {/* Browser Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#F7F6F2] border-b border-[#E2E4E9]">
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF5F56]/90 border border-[#E0443E]/40" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFBD2E]/90 border border-[#DEA123]/40" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27C93F]/90 border border-[#1AAB29]/40" />
        </div>
        <div className="flex-1 max-w-[190px] sm:max-w-sm mx-auto flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-md bg-white border border-[#E2E4E9] text-[10px] sm:text-[11px] font-mono text-[#5B5F6B] font-medium truncate">
          <Lock size={10} className="text-[#8B8F9A] shrink-0" />
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
   4. LAYERED PRODUCT SHOWCASES (ARCHITECTURAL PANELS)
   ═══════════════════════════════════════════════════════════════ */
function StripeProductShowcaseSection() {
  return (
    <section id="architecture" className="py-10 sm:py-14 md:py-18 px-4 sm:px-10 bg-white border-b border-[#E2E4E9] relative overflow-hidden">
      
      {/* Ambient subtle color grading meshes behind the showcases */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-[#425CF5]/[0.05] via-[#C7BDF7]/[0.04] to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#425CF5]/[0.03] via-[#059669]/[0.03] to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto space-y-12 sm:space-y-16 md:space-y-20">

        {/* ── SHOWCASE A: SPRINT VELOCITY & LIVE BUG RADAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Editorial Left */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="text-[10.5px] sm:text-[11.5px] font-mono font-medium text-[#425CF5] uppercase tracking-[0.16em] mb-2">
              Engineering Velocity
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-[38px] font-semibold tracking-[-0.03em] text-[#101114] leading-[1.15] mb-3 sm:mb-3.5">
              Agile sprint pipelines with autonomous bug watchdogs.
            </h2>
            <p className="text-sm sm:text-base text-[#5B5F6B] leading-relaxed mb-4 sm:mb-5 font-normal">
              Track multi-engineer sprint deliverables in lockstep with automated production regression feeds. Critical runtime anomalies are mapped directly to git commits before impacting customers.
            </p>

            <div className="space-y-2.5 mb-4 sm:mb-5 w-full">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-[#425CF5]/10 text-[#425CF5] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#101114] font-medium">
                  Live Kanban boards synchronized with GitHub and GitLab pull requests
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-[#425CF5]/10 text-[#425CF5] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#101114] font-medium">
                  Zero-latency regression radar with automated issue severity tags
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-[#425CF5]/10 text-[#425CF5] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#101114] font-medium">
                  Automated commit correlation & fast rollback recommendations
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#425CF5] hover:text-[#101114] transition-colors"
            >
              <span>Explore engineering workflows</span>
              <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Layered Visual Right: shot-4 (Kanban Board) + shot-5 (Issues & Bugs) */}
          <div className="lg:col-span-7 relative w-full pt-2 lg:pt-0 pb-3 sm:pb-5 lg:pb-2">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#425CF5]/10 via-[#C7BDF7]/10 to-transparent rounded-3xl blur-2xl opacity-60 -z-10" />
            
            {/* Background Browser Window: shot-4.png */}
            <BrowserFrame url="git.bhartinexus.io/sprints/active" className="transition-transform duration-300 hover:scale-[1.01]">
              <div className="relative">
                <img
                  src="/showcase/shot-4.png"
                  alt="Engineering Sprint Kanban Board"
                  className="w-full h-auto block select-none"
                />
              </div>
            </BrowserFrame>

            {/* Overlapping Corner Card: shot-5.png */}
            <div className="absolute -bottom-3 -left-2 sm:-bottom-5 sm:-left-5 w-[75%] sm:w-[60%] z-20 transition-transform duration-300 hover:-translate-y-1">
              <div className="rounded-xl sm:rounded-2xl border border-[#E2E4E9] bg-white/95 backdrop-blur-md shadow-[0_20px_50px_-10px_rgba(16,17,20,0.14)] overflow-hidden">
                <div className="px-2.5 sm:px-3.5 py-1.5 bg-[#F7F6F2] border-b border-[#E2E4E9] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-[9px] sm:text-[10px] font-mono font-medium text-[#101114] uppercase tracking-wider">AI Watchdog</span>
                  </div>
                  <span className="text-[8.5px] sm:text-[9.5px] font-mono font-semibold text-rose-600 bg-rose-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-rose-200">
                    2 Critical
                  </span>
                </div>
                <div className="relative">
                  <img
                    src="/showcase/shot-5.png"
                    alt="Active Issues and Bug Traces"
                    className="w-full h-auto block select-none"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ── SHOWCASE B: TEAM GOVERNANCE & MULTI-CLUSTER INFRASTRUCTURE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Layered Visual Left: shot-2 (Team Access) + shot-6 (Infrastructure Nodes) */}
          <div className="lg:col-span-7 relative w-full order-2 lg:order-1 pt-2 lg:pt-0 pb-3 sm:pb-5 lg:pb-2">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#059669]/10 via-[#425CF5]/10 to-transparent rounded-3xl blur-2xl opacity-60 -z-10" />
            
            {/* Background Browser Window: shot-2.png */}
            <BrowserFrame url="auth.bhartinexus.io/organization/members" className="transition-transform duration-300 hover:scale-[1.01]">
              <div className="relative">
                <img
                  src="/showcase/shot-2.png"
                  alt="Team Governance and Access Control"
                  className="w-full h-auto block select-none"
                />
              </div>
            </BrowserFrame>

            {/* Overlapping Corner Card: shot-6.png */}
            <div className="absolute -bottom-3 -right-2 sm:-bottom-5 sm:-right-5 w-[72%] sm:w-[58%] z-20 transition-transform duration-300 hover:-translate-y-1">
              <div className="rounded-xl sm:rounded-2xl border border-[#E2E4E9] bg-white/95 backdrop-blur-md shadow-[0_20px_50px_-10px_rgba(16,17,20,0.14)] overflow-hidden">
                <div className="px-2.5 sm:px-3.5 py-1.5 bg-[#F7F6F2] border-b border-[#E2E4E9] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#059669]" />
                    <span className="text-[9px] sm:text-[10px] font-mono font-medium text-[#101114] uppercase tracking-wider">Cluster Telemetry</span>
                  </div>
                  <span className="text-[8.5px] sm:text-[9.5px] font-mono font-semibold text-[#059669] bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200">
                    99.99% Uptime
                  </span>
                </div>
                <div className="relative">
                  <img
                    src="/showcase/shot-6.png"
                    alt="Active Worker Nodes and Hardware Telemetry"
                    className="w-full h-auto block select-none"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Editorial Right */}
          <div className="lg:col-span-5 flex flex-col items-start text-left order-1 lg:order-2">
            <div className="text-[10.5px] sm:text-[11.5px] font-mono font-medium text-[#059669] uppercase tracking-[0.16em] mb-2">
              Infrastructure & Governance
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-[38px] font-semibold tracking-[-0.03em] text-[#101114] leading-[1.15] mb-3 sm:mb-3.5">
              Enterprise team controls with hardware node telemetry.
            </h2>
            <p className="text-sm sm:text-base text-[#5B5F6B] leading-relaxed mb-4 sm:mb-5 font-normal">
              Manage architectural ownership, RBAC permissions, and multi-tenant audit logs alongside live CPU, memory, NVMe disk, and network throughput across every cloud cluster.
            </p>

            <div className="space-y-2.5 mb-4 sm:mb-5 w-full">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#101114] font-medium">
                  Granular role-based access control (RBAC) with audit verification
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#101114] font-medium">
                  Microsecond node metrics: 34.8% CPU, 58.2% RAM, 1.8 Gbps network
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="font-bold" />
                </div>
                <div className="text-xs sm:text-sm text-[#101114] font-medium">
                  Automated security audit log streams and team invite workflows
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#059669] hover:text-[#101114] transition-colors"
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
   5. ELITE DEVELOPER SECTION (MIDNIGHT NAVY IDE / PLAYGROUND)
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
    <section id="developer-sandbox" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-10 bg-[#101C35] text-white overflow-hidden">
      {/* Background Subtle Gradient & Mesh Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-br from-[#425CF5]/15 via-[#C7BDF7]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[350px] bg-gradient-to-tr from-[#425CF5]/10 via-transparent to-transparent rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto text-left relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-6 sm:mb-8 text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="font-mono text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.18em] text-[#C7BDF7]">
              Designed for
            </span>
            <span className="font-mono text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15">
              Developers
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-[40px] font-semibold tracking-[-0.03em] text-white leading-[1.18] mb-3">
            The world’s most powerful and developer-friendly telemetry engine.
          </h2>

          <p className="text-sm sm:text-base text-[#BFC3CC] font-normal leading-relaxed">
            We obsess over developer experience. Instrument your entire distributed system in two lines of code without rebuilding Docker containers.
          </p>
        </div>

        {/* Split Sandbox Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* Left: Code Snippet Panel */}
          <div className="lg:col-span-7 bg-[#0B1324] rounded-2xl sm:rounded-3xl border border-[#1E2D4A] p-4 sm:p-6 md:p-7 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
            <div>
              {/* Language Switcher Tabs */}
              <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#1E2D4A] mb-3 sm:mb-4 font-mono text-xs gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full">
                  {(["curl", "python", "go", "helm"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all uppercase text-[11px] sm:text-xs shrink-0 cursor-pointer ${
                        activeLang === lang
                          ? "bg-[#425CF5] text-white shadow-xs"
                          : "text-[#BFC3CC] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-[11px] sm:text-xs shrink-0 border border-white/10 cursor-pointer"
                >
                  {copied ? <CheckCheck size={13} className="text-[#059669]" /> : <Copy size={13} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Code Pre Block */}
              <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-white/90 overflow-x-auto whitespace-pre p-1">
                <code>{codeSnippets[activeLang]}</code>
              </pre>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-[#1E2D4A] mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#BFC3CC] gap-2">
              <span>Client SDK v3.2.0 • Zero dependencies</span>
              <Link href="/dashboard" className="text-[#C7BDF7] hover:text-white font-semibold flex items-center gap-1 transition-colors">
                <span>View Full API Reference</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right: Simulated Real-Time Response Payload */}
          <div className="lg:col-span-5 bg-[#0B1324] rounded-2xl sm:rounded-3xl border border-[#1E2D4A] p-4 sm:p-6 md:p-7 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.4)] font-mono text-xs overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#1E2D4A] mb-3 sm:mb-4 text-[#BFC3CC]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                  <span className="font-semibold text-white uppercase text-[11px] sm:text-xs">Live Ingestion</span>
                </div>
                <span className="text-[#059669] font-semibold text-[11px] sm:text-xs">200 OK (0.84ms)</span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#060A14] border border-[#1E2D4A] text-[11px] sm:text-[12px] text-white/90 space-y-1.5 overflow-x-auto">
                <div className="text-[#C7BDF7]">&#123;</div>
                <div className="pl-3 sm:pl-4 text-white/90">&quot;status&quot;: &quot;MESH_ACTIVE&quot;,</div>
                <div className="pl-3 sm:pl-4 text-white/90">&quot;cluster_id&quot;: &quot;k8s-us-east-prod&quot;,</div>
                <div className="pl-3 sm:pl-4 text-white/90">&quot;ebpf_socket_probes&quot;: 14,</div>
                <div className="pl-3 sm:pl-4 text-white/90">&quot;p99_latency_ms&quot;: 0.84,</div>
                <div className="pl-3 sm:pl-4 text-white/90">&quot;anomaly_detection_model&quot;: &quot;brexal-v3&quot;,</div>
                <div className="pl-3 sm:pl-4 text-white/90">&quot;auto_mitigation_ready&quot;: true</div>
                <div className="text-[#C7BDF7]">&#125;</div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-[#1E2D4A] mt-3 sm:mt-4">
              <div className="flex items-center justify-between text-[#BFC3CC] text-[10.5px] sm:text-[11.5px]">
                <span>Kernel eBPF Filter: OK</span>
                <span className="text-[#059669] font-semibold">0.0% CPU penalty</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. ELITE GLOBAL SCALE & RELIABILITY NUMBERS
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
          <div className="text-[10.5px] sm:text-[11.5px] font-mono font-medium text-[#425CF5] uppercase tracking-[0.16em] mb-2">
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
              <div className="text-xs sm:text-[13px] font-semibold text-[#425CF5] uppercase tracking-wider mb-1 sm:mb-2 font-mono">
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

/* ═══════════════════════════════════════════════════════════════
   7. ELITE TRANSPARENT PRICING
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
    <section id="pricing" className="py-10 sm:py-14 md:py-18 px-4 sm:px-10 bg-[#F7F6F2] border-b border-[#E2E4E9]">
      <div className="max-w-[1320px] mx-auto text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-6 sm:mb-8">
          <div className="text-[10.5px] sm:text-[11.5px] font-mono font-medium text-[#425CF5] uppercase tracking-[0.16em] mb-2">
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
                  ? "border-[#425CF5] shadow-[0_16px_48px_rgba(66,92,245,0.12)] md:-translate-y-2 relative ring-1 ring-[#425CF5]/30"
                  : "border-[#E2E4E9] shadow-xs hover:border-[#BFC3CC]"
              }`}
            >
              <div>
                {t.highlight && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#425CF5] text-white text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider uppercase mb-2.5 sm:mb-3">
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
                      <Check size={15} className="text-[#425CF5] font-bold shrink-0" />
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
                      ? "bg-[#425CF5] text-white hover:bg-[#344ED0] shadow-md hover:shadow-lg"
                      : "bg-[#101C35] text-white hover:bg-[#425CF5] shadow-xs"
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
   8. ELITE READY TO GET STARTED (FINAL CTA)
   ═══════════════════════════════════════════════════════════════ */
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
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#059669] shrink-0" /> SOC-2 Type II Certified</span>
          <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#425CF5] shrink-0" /> 5-Minute Zero-Downtime Deployment</span>
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
              <Globe size={14} className="text-[#425CF5]" />
              <span>India (English)</span>
            </div>
          </div>

          {/* Column 1: Products */}
          <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-[13.5px] text-left">
            <span className="font-mono text-[11px] sm:text-[11.5px] font-bold text-[#101114] uppercase tracking-wider mb-1 sm:mb-2">
              Products
            </span>
            <Link href="#architecture" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">eBPF Telemetry</Link>
            <Link href="#interactive-simulator" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">AI Incident Engine</Link>
            <Link href="#developer-sandbox" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">Distributed Tracing</Link>
            <Link href="#pricing" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">Pricing</Link>
          </div>

          {/* Column 2: Solutions */}
          <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-[13.5px] text-left">
            <span className="font-mono text-[11px] sm:text-[11.5px] font-bold text-[#101114] uppercase tracking-wider mb-1 sm:mb-2">
              Solutions
            </span>
            <Link href="/dashboard" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">Kubernetes Mesh</Link>
            <Link href="/dashboard" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">Cloud Ingress & CDN</Link>
            <Link href="/dashboard" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">PostgreSQL Monitoring</Link>
            <Link href="/teams" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">Engineering Team</Link>
          </div>

          {/* Column 3: Developers */}
          <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-[13.5px] text-left col-span-2 sm:col-span-1">
            <span className="font-mono text-[11px] sm:text-[11.5px] font-bold text-[#101114] uppercase tracking-wider mb-1 sm:mb-2">
              Developers
            </span>
            <Link href="#developer-sandbox" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">Documentation</Link>
            <Link href="#developer-sandbox" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">API Reference</Link>
            <Link href="/roadmap" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">Product Roadmap</Link>
            <Link href="/logs" className="text-[#5B5F6B] font-medium hover:text-[#425CF5] transition-colors">Audit & System Logs</Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#5B5F6B] gap-3 sm:gap-4 text-center sm:text-left">
          <div>
            © 2026 Bharti Nexus Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/maintenance" className="hover:text-[#425CF5] transition-colors">System Status: 99.999% SLA</Link>
            <Link href="/login" className="hover:text-[#425CF5] transition-colors">Privacy & Terms</Link>
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
    <div className="min-h-screen bg-white text-[#101114] selection:bg-[#425CF5]/15 selection:text-[#101114] antialiased overflow-x-hidden">
      <StripeNavbar />
      <main>
        <StripeHeroSection />
        <StripeClientMarquee />
        <PlatformOverviewSection />
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
