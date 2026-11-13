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
   1. ELITE SWISS-STYLE NAVIGATION BAR
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
          ? "bg-white/95 backdrop-blur-md border-b border-[#E2E4E9] shadow-[0_2px_16px_rgba(16,17,20,0.03)]"
          : "bg-white/80 backdrop-blur-xs border-b border-transparent"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-10 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group focus:outline-none shrink-0">
          <Logo className="h-5 sm:h-5.5 text-[#101114] group-hover:text-[#425CF5] transition-colors" />
        </Link>

        {/* Right Nav & Action CTAs Group */}
        <div className="flex items-center gap-4 xl:gap-8 shrink-0">
          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13.5px] xl:text-[14px] font-medium text-[#34363D] whitespace-nowrap">
            <div 
              className="relative cursor-pointer group flex items-center gap-1 hover:text-[#425CF5] transition-colors"
              onMouseEnter={() => setActiveDropdown("products")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#architecture">Products</Link>
              <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              
              {activeDropdown === "products" && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="p-3.5 bg-white rounded-2xl border border-[#E2E4E9] shadow-[0_12px_36px_rgba(16,17,20,0.08)] space-y-2 text-left">
                    <Link href="#architecture-flow" className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">Architecture Data Flow</div>
                      <div className="text-[11px] text-[#5B5F6B]">Kernel sockets to Slack/PagerDuty in &lt; 90s</div>
                    </Link>
                    <Link href="#architecture" className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">eBPF Telemetry Mesh</div>
                      <div className="text-[11px] text-[#5B5F6B]">Socket monitoring with 0% CPU overhead</div>
                    </Link>
                    <Link href="#interactive-simulator" className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">AI Incident Engine</div>
                      <div className="text-[11px] text-[#5B5F6B]">Automated root-cause commit correlation</div>
                    </Link>
                    <Link href="#developer-sandbox" className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">Distributed Traces</div>
                      <div className="text-[11px] text-[#5B5F6B]">Microsecond span waterfalls & graphs</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div 
              className="relative cursor-pointer group flex items-center gap-1 hover:text-[#425CF5] transition-colors"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="#comparison">Solutions</Link>
              <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              
              {activeDropdown === "solutions" && (
                <div className="absolute top-full -left-4 w-72 pt-3">
                  <div className="p-3.5 bg-white rounded-2xl border border-[#E2E4E9] shadow-[0_12px_36px_rgba(16,17,20,0.08)] space-y-2 text-left">
                    <div className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">Enterprise Kubernetes</div>
                      <div className="text-[11px] text-[#5B5F6B]">Multi-cluster pod routing & ingress telemetry</div>
                    </div>
                    <div className="block p-2 rounded-xl hover:bg-[#F7F6F2] transition-colors">
                      <div className="font-semibold text-xs text-[#101114]">Fintech & High-Throughput</div>
                      <div className="text-[11px] text-[#5B5F6B]">Sub-millisecond SLA enforcement & audits</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="#developer-sandbox" className="hover:text-[#425CF5] transition-colors">
              Developers
            </Link>
            <Link href="#pricing" className="hover:text-[#425CF5] transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Action CTAs & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/login"
              className="text-[13px] sm:text-[13.5px] font-medium text-[#34363D] hover:text-[#425CF5] px-2.5 py-1.5 transition-colors whitespace-nowrap"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="group px-4 py-2 sm:px-4.5 sm:py-2 rounded-full bg-[#101C35] hover:bg-[#425CF5] text-white text-[12.5px] sm:text-[13px] font-semibold transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Start now</span>
              <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#101114] hover:bg-[#F7F6F2] transition-colors focus:outline-none"
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
            <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#425CF5] px-3 py-1">
              Navigation
            </div>
            <Link
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#101114] hover:bg-[#F7F6F2] transition-colors"
            >
              eBPF Telemetry Mesh
            </Link>
            <Link
              href="#interactive-simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#101114] hover:bg-[#F7F6F2] transition-colors"
            >
              AI Incident Radar
            </Link>
            <Link
              href="#developer-sandbox"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#101114] hover:bg-[#F7F6F2] transition-colors"
            >
              Distributed Traces & Sandbox
            </Link>
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#101114] hover:bg-[#F7F6F2] transition-colors"
            >
              Transparent Pricing
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E2E4E9] flex flex-col gap-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#101C35] hover:bg-[#425CF5] text-white text-center font-semibold text-sm shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full border border-[#D6D8DE] bg-white text-center font-semibold text-sm text-[#101114]"
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
   ARCHITECTURAL HERO CANVAS (SUBTLE GEOMETRIC GRID & ACCENT)
   ═══════════════════════════════════════════════════════════════ */
function EliteArchitecturalHeroCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Subtle fine architectural grid - top-right hemisphere */}
      <svg
        className="absolute top-0 right-0 w-full sm:w-[85%] lg:w-[65%] h-[90%] opacity-[0.38]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="arch-grid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#D6D8DE" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="1" fill="#BFC3CC" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arch-grid)" />
      </svg>

      {/* Atmospheric Soft Light: Electric Cobalt + Soft Lavender Ambient Glow */}
      <div className="absolute -top-32 right-[5%] w-[680px] h-[580px] rounded-full bg-gradient-to-bl from-[#425CF5]/[0.055] via-[#C7BDF7]/[0.035] to-transparent blur-[110px] brexal-ambient-breathe pointer-events-none" />
      <div className="absolute top-[20%] right-[30%] w-[380px] h-[380px] rounded-full bg-[#425CF5]/[0.025] blur-[90px] pointer-events-none" />

      {/* Bottom Dissolve Mask */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. ELITE HERO SECTION WITH ARCHITECTURAL COMPOSITION
   ═══════════════════════════════════════════════════════════════ */
function StripeHeroSection() {
  return (
    <section className="relative pt-16 pb-6 sm:pt-20 sm:pb-8 md:pt-22 md:pb-10 px-4 sm:px-8 lg:px-10 overflow-hidden bg-white">
      
      {/* ── ARCHITECTURAL HERO CANVAS ── */}
      <EliteArchitecturalHeroCanvas />

      <div className="max-w-[1320px] mx-auto text-left relative z-10">
        
        {/* TWO-COLUMN EDITORIAL COMPOSITION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Column (5 cols): Editorial Copy & High-End CTAs */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            
            {/* Top Minimal Pill Eyebrow */}
            <div className="brexal-pop-up" style={{ animationDelay: "0.05s" }}>
              <Link 
                href="#interactive-simulator" 
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E4E9] shadow-[0_2px_8px_rgba(16,17,20,0.03)] mb-3 hover:border-[#425CF5]/50 hover:bg-[#F7F6F2] transition-all"
              >
                <span className="flex h-2 w-2 rounded-full bg-[#425CF5] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-[0.1em] uppercase text-[#34363D]">
                  Now in GA: Autonomous eBPF Telemetry Mesh 3.0
                </span>
                <ChevronRight size={13} className="text-[#425CF5] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Editorial Display Headline (Sora, Proportioned to Viewport) */}
            <h1
              className="brexal-pop-up font-display text-[26px] sm:text-[34px] md:text-[38px] lg:text-[42px] xl:text-[46px] font-semibold tracking-[-0.035em] text-[#101114] leading-[1.12] mb-3 text-left"
              style={{ animationDelay: "0.14s" }}
            >
              Autonomous telemetry <br className="hidden sm:inline" />
              infrastructure for <br className="hidden sm:inline" />
              <span className="text-[#425CF5]">modern cloud systems.</span>
            </h1>

            {/* Supporting Subhead */}
            <p
              className="brexal-pop-up text-[14px] sm:text-[15px] text-[#5B5F6B] font-normal leading-relaxed mb-4 sm:mb-5 text-left max-w-[440px]"
              style={{ animationDelay: "0.22s" }}
            >
              Millions of requests across Kubernetes, microservices, and databases are monitored in real time with BREXAL. Synthesize logs, kernel traces, and metrics into self-healing incident intelligence.
            </p>

            {/* Elite Action CTAs Row */}
            <div
              className="brexal-pop-up flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 w-full sm:w-auto"
              style={{ animationDelay: "0.32s" }}
            >
              <Link
                href="/register"
                className="elite-btn-primary px-6 py-3 min-h-[44px] text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 group shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Start for free</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#interactive-simulator"
                className="elite-btn-secondary px-5 py-3 min-h-[44px] text-[13.5px] sm:text-[14px] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore live radar</span>
                <ChevronRight size={14} className="text-[#8B8F9A]" />
              </Link>
            </div>

            {/* Micro Trust Signals */}
            <div
              className="brexal-pop-up flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-[11.5px] font-mono text-[#5B5F6B] pt-0.5"
              style={{ animationDelay: "0.40s" }}
            >
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#059669] font-bold shrink-0" /> Free developer tier
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#059669] font-bold shrink-0" /> Zero bytecode injection
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-[#059669] font-bold shrink-0" /> SOC-2 Type II Certified
              </span>
            </div>

          </div>

          {/* Right Column (7 cols): 3D Technology Ecosystem Visualization */}
          <div className="lg:col-span-7 relative w-full pt-0">
            <HeroEcosystem3D />
          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. ELITE CLIENT MARQUEE (TRUSTED INFRASTRUCTURE)
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
    <section className="py-6 sm:py-7 border-t border-b border-[#E2E4E9] bg-[#F7F6F2] px-4 sm:px-10">
      <div className="max-w-[1320px] mx-auto">
        <p className="text-center font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5B5F6B] mb-3 sm:mb-3.5">
          Powering mission-critical platforms and distributed engineering teams
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-12 opacity-85 hover:opacity-100 transition-opacity">
          {logos.map((lg, i) => (
            <div key={i} className="flex items-center gap-1.5 sm:gap-2 group cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BFC3CC] group-hover:bg-[#425CF5] transition-colors" />
              <span className="font-mono text-xs sm:text-[13.5px] font-bold text-[#34363D] group-hover:text-[#101114] tracking-wider uppercase transition-colors">
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
