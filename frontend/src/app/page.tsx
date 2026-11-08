"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  GitBranch,
  GitCommit,
  HardDrive,
  Layers,
  Network,
  Radio,
  RefreshCw,
  Search,
  Server,
  Shield,
  Sliders,
  Sparkles,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/Logo";

/* ═══════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════════ */

interface ServiceHealth {
  name: string;
  category: "gateway" | "compute" | "data" | "cache";
  status: "operational" | "degraded" | "warning";
  latency: string;
  errorRate: string;
  rps: string;
  checked: string;
}

const SAMPLE_SERVICES: ServiceHealth[] = [
  { name: "api-gateway-edge", category: "gateway", status: "operational", latency: "1.2ms", errorRate: "0.001%", rps: "18.4k", checked: "1s ago" },
  { name: "auth-session-v2", category: "compute", status: "operational", latency: "3.4ms", errorRate: "0.000%", rps: "4.2k", checked: "2s ago" },
  { name: "payment-worker-pool", category: "compute", status: "degraded", latency: "142ms", errorRate: "1.18%", rps: "1.8k", checked: "Just now" },
  { name: "postgres-primary-mesh", category: "data", status: "operational", latency: "0.8ms", errorRate: "0.000%", rps: "12.9k", checked: "1s ago" },
  { name: "redis-cluster-cache", category: "cache", status: "operational", latency: "0.3ms", errorRate: "0.000%", rps: "48.2k", checked: "1s ago" },
  { name: "event-stream-consumer", category: "compute", status: "operational", latency: "5.1ms", errorRate: "0.004%", rps: "9.3k", checked: "3s ago" },
];

/* ═══════════════════════════════════════════════════════════════
   SECTION 1: MINIMAL ENTERPRISE NAVIGATION
   ═══════════════════════════════════════════════════════════════ */
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#050505]/85 backdrop-blur-md border-b border-[#202020] py-3.5"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Brand Mark + Minimal Symbol */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-[#3985FF]">
          <div className="w-8 h-8 rounded-lg bg-[#101010] border border-[#202020] flex items-center justify-center text-[#3985FF] group-hover:border-[#3985FF]/50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <Logo className="h-4 text-[#F5F5F5] group-hover:text-white transition-colors" />
            <span className="text-[9px] font-mono tracking-widest text-[#929292] uppercase">Bharti Nexus</span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#929292]">
          <Link href="#platform" className="hover:text-[#F5F5F5] transition-colors">Platform</Link>
          <Link href="#solutions" className="hover:text-[#F5F5F5] transition-colors">Solutions</Link>
          <Link href="#features" className="hover:text-[#F5F5F5] transition-colors">Features</Link>
          <Link href="#incident-response" className="hover:text-[#F5F5F5] transition-colors">Incident response</Link>
          <Link href="#stack" className="hover:text-[#F5F5F5] transition-colors">Stack</Link>
        </nav>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[13px] font-medium text-[#929292] hover:text-[#F5F5F5] transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-[#F5F5F5] text-[#050505] text-[13px] font-semibold hover:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-[#3985FF]"
          >
            Request access
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: ASYMMETRIC HERO COMPOSITION (OPTION 3 TOPOLOGY)
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const [selectedCluster, setSelectedCluster] = useState<"us-east-1" | "eu-central-1" | "ap-south-1">("us-east-1");
  const [liveP99, setLiveP99] = useState("1.42ms");
  const [packetTick, setPacketTick] = useState(48210);

  const clusterData = {
    "us-east-1": { label: "Virginia Core", ping: "0.8ms", p99: "1.42ms", error: "0.001%", rps: "48.2k", status: "HEALTHY" },
    "eu-central-1": { label: "Frankfurt Mesh", ping: "1.4ms", p99: "1.85ms", error: "0.000%", rps: "31.4k", status: "HEALTHY" },
    "ap-south-1": { label: "Mumbai Relay", ping: "2.1ms", p99: "3.12ms", error: "0.004%", rps: "19.8k", status: "NOMINAL" },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const base = selectedCluster === "us-east-1" ? 1.38 : selectedCluster === "eu-central-1" ? 1.80 : 3.05;
      const jitter = (base + Math.random() * 0.12).toFixed(2);
      setLiveP99(`${jitter}ms`);
      setPacketTick((prev) => prev + Math.floor(Math.random() * 18 - 8));
    }, 2200);
    return () => clearInterval(interval);
  }, [selectedCluster]);

  const active = clusterData[selectedCluster];

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 px-6 sm:px-10 overflow-hidden border-b border-[#202020] bg-[#050505]">
      
      {/* ── Option 3: 3D Topological Wireframe Background Image (Unobstructed) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img
          src="/backgrounds/hero-mesh-contour.jpg"
          alt="3D Topological Telemetry Mesh"
          className="w-full h-full object-cover object-right opacity-80 mix-blend-screen scale-100"
        />
        
        {/* Layer 1: Top Fade (Keeps minimal navbar 100% clean and transparent) */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent" />
        
        {/* Layer 2: Left Text Contrast Backing (Restricted to text side so right 3D art is completely visible) */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent" />
        
        {/* Layer 3: Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto">
        
        {/* HERO INTRO GRID: Headline on Left, 3D Mesh Artwork fully revealed on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[440px] md:min-h-[480px]">
          
          {/* LEFT COLUMN: Editorial Headline & Value (8 cols) */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#101010]/90 backdrop-blur-sm border border-[#202020] text-[#3985FF] font-mono text-[11px] font-medium tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3985FF] animate-pulse" />
              TOPOLOGICAL OBSERVABILITY • MULTI-REGION MESH
            </div>

            {/* Main Headline (Sentence Case, Balanced) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#F5F5F5] leading-[1.06] mb-6 font-display max-w-3xl">
              See the failure before it becomes an incident.
            </h1>

            {/* Supporting Description */}
            <p className="text-lg sm:text-xl text-[#929292] font-normal leading-relaxed max-w-2xl mb-8 font-sans">
              Monitor every service, trace every request, and identify the root cause before downtime impacts your users.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#3985FF] text-white text-[14px] font-semibold hover:bg-[#2B75F0] transition-all flex items-center justify-center gap-2 shadow-[0_2px_16px_rgba(57,133,255,0.35)] hover:shadow-[0_4px_24px_rgba(57,133,255,0.5)] focus:ring-2 focus:ring-[#3985FF]"
              >
                Request early access
                <ArrowRight size={15} />
              </Link>
              <a
                href="#platform"
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#101010]/80 backdrop-blur-sm border border-[#202020] text-[#F5F5F5] text-[14px] font-medium hover:border-[#3985FF]/40 hover:bg-[#151515] transition-colors flex items-center justify-center gap-2"
              >
                Explore the platform
              </a>
            </div>

            {/* Technical Metadata Line */}
            <div className="pt-5 border-t border-[#202020] w-full flex flex-wrap items-center gap-3 text-[12px] font-mono text-[#929292]">
              <span className="flex items-center gap-1.5 text-[#36D399]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36D399] animate-pulse" />
                Mesh latency: {active.ping}
              </span>
              <span className="text-[#202020]">/</span>
              <span>Application monitoring</span>
              <span className="text-[#202020]">/</span>
              <span>Infrastructure intelligence</span>
              <span className="text-[#202020]">/</span>
              <span>AI incident response</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Completely Open & Clear for the 3D Topological Wireframe */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end justify-center pointer-events-none">
            {/* Minimal Translucent Coordinate Markers that complement the 3D Mesh */}
            <div className="flex flex-col gap-3 font-mono text-[11px] items-end">
              <div className="px-3 py-1.5 rounded-md bg-[#0A0A0A]/60 backdrop-blur-md border border-[#202020]/60 text-[#3985FF] flex items-center gap-2 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3985FF] animate-pulse" />
                <span>3D CONTOUR MESH // ELEVATION ACTIVE</span>
              </div>
              <div className="px-3 py-1 rounded-md bg-[#0A0A0A]/40 backdrop-blur-sm border border-[#202020]/40 text-[#929292] text-[10px]">
                COORD: 37.7749° N, 122.4194° W
              </div>
            </div>
          </div>

        </div>

        {/* ── SHIFTED TELEMETRY CONSOLE: Positioned below hero text so the 3D background art above is 100% visible ── */}
        <div className="mt-16 md:mt-24 w-full rounded-xl bg-[#0A0A0A]/90 backdrop-blur-md border border-[#202020] p-5 shadow-2xl hover:border-[#3985FF]/30 transition-colors">
          
          {/* Console Header Bar */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#202020] gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 font-mono text-[12px] text-[#F5F5F5] font-semibold">
                <Radio size={14} className="text-[#36D399] animate-pulse" />
                <span>MULTI-REGION TELEMETRY CONSOLE</span>
              </div>
              <span className="text-[#5E5E5E]">|</span>
              <div className="flex items-center gap-1 bg-[#101010] p-1 rounded-md border border-[#202020] font-mono text-[11px]">
                {(["us-east-1", "eu-central-1", "ap-south-1"] as const).map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedCluster(reg)}
                    className={`px-2.5 py-0.5 rounded transition-colors ${
                      selectedCluster === reg ? "bg-[#3985FF] text-white font-medium shadow-sm" : "text-[#929292] hover:text-[#F5F5F5]"
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10.5px]">
              <span className="px-2 py-0.5 rounded bg-[#36D399]/10 text-[#36D399] border border-[#36D399]/20 font-semibold">
                STATUS: {active.status}
              </span>
              <span className="text-[#5E5E5E]">•</span>
              <span className="text-[#929292]">ILLUSTRATIVE TELEMETRY</span>
            </div>
          </div>

          {/* 3-Column Panoramic Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
            
            {/* Col 1: Metrics (4 cols) */}
            <div className="md:col-span-4 flex flex-col justify-between gap-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-lg bg-[#101010] border border-[#202020]">
                  <span className="text-[10px] font-mono text-[#929292] block mb-1">P99 LATENCY</span>
                  <span className="text-lg font-mono font-bold text-[#F5F5F5]">{liveP99}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101010] border border-[#202020]">
                  <span className="text-[10px] font-mono text-[#929292] block mb-1">ERROR RATE</span>
                  <span className="text-lg font-mono font-bold text-[#36D399]">{active.error}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101010] border border-[#202020]">
                  <span className="text-[10px] font-mono text-[#929292] block mb-1">THROUGHPUT</span>
                  <span className="text-lg font-mono font-bold text-[#3985FF]">
                    {(packetTick / 1000).toFixed(1)}k/s
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#929292] p-2.5 rounded-lg bg-[#101010] border border-[#202020]">
                <span className="flex items-center gap-1.5">
                  <GitCommit size={13} className="text-[#3985FF]" />
                  v2.4.1 deployed 4m ago
                </span>
                <span className="text-[#36D399]">0 canary rollbacks</span>
              </div>
            </div>

            {/* Col 2: Topology Nodes List (4 cols) */}
            <div className="md:col-span-4 p-3.5 rounded-lg bg-[#101010] border border-[#202020] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#929292] mb-2">
                <span>TOPOLOGY MESH ELEVATION</span>
                <span className="text-[10px] text-[#5E5E5E]">6 ACTIVE NODES</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11.5px]">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#0A0A0A] border border-[#202020]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36D399]" />
                    <span className="text-[#F5F5F5]">api-edge-proxy</span>
                  </div>
                  <span className="text-[10.5px] text-[#929292]">{active.ping} • {active.rps}</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#0A0A0A] border border-[#202020]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36D399]" />
                    <span className="text-[#F5F5F5]">auth-service-v2</span>
                  </div>
                  <span className="text-[10.5px] text-[#929292]">3.4ms • 4.2k rps</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#0A0A0A] border border-[#FF5252]/30">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5B942] animate-pulse" />
                    <span className="text-[#F5F5F5]">payment-worker-pool</span>
                  </div>
                  <span className="text-[10.5px] text-[#F5B942]">142ms • Degraded</span>
                </div>
              </div>
            </div>

            {/* Col 3: AI Anomaly Detection Callout (4 cols) */}
            <div className="md:col-span-4 p-3.5 rounded-lg bg-[#101010] border border-[#9B7BFF]/30 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[#9B7BFF] font-mono text-[11px] font-semibold">
                <Sparkles size={14} />
                <span>AI ANOMALY DETECTION // MESH</span>
              </div>
              <div className="my-2 text-[12px] font-mono text-[#F5F5F5] leading-snug">
                Connection pool saturation on <code className="text-[#3985FF]">postgres-primary</code>
              </div>
              <div className="text-[10.5px] text-[#929292] font-mono pt-2 border-t border-[#202020]">
                Correlated with commit sha:8f2a1b9 (payment retry loop)
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: OPERATIONAL INTELLIGENCE (BENTO GRID)
   "Your infrastructure tells a story. Read every signal."
   ═══════════════════════════════════════════════════════════════ */
function OperationalIntelligenceSection() {
  const [activeTraceStep, setActiveTraceStep] = useState<number>(2);

  return (
    <section id="platform" className="py-24 md:py-32 px-6 sm:px-10 border-b border-[#202020] bg-[#0A0A0A]">
      <div className="max-w-[1360px] mx-auto">
        {/* Editorial Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#101010] border border-[#202020] text-[#3985FF] font-mono text-[10.5px] tracking-wider uppercase mb-4">
            Unified Signal Correlation
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#F5F5F5] leading-tight font-display mb-4">
            Your infrastructure tells a story. Read every signal.
          </h2>
          <p className="text-base sm:text-lg text-[#929292] font-normal leading-relaxed">
            Siloed tools blind your engineering team during critical outages. BREXAL continuously synthesizes metrics, distributed traces, system logs, and dependency maps into a single operational narrative.
          </p>
        </div>

        {/* Asymmetric Bento Layout (Unequal Dimensions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* BENTO BLOCK 1: Distributed Trace Waterfall (7 cols) */}
          <div className="lg:col-span-7 rounded-xl bg-[#101010] border border-[#202020] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#202020] mb-4">
                <div className="flex items-center gap-2">
                  <Network size={16} className="text-[#3985FF]" />
                  <span className="font-semibold text-sm text-[#F5F5F5]">Distributed Request Trace</span>
                </div>
                <span className="font-mono text-[11px] text-[#929292]">trace_id: 8f2a1b9c</span>
              </div>
              
              <p className="text-[13px] text-[#929292] mb-6">
                Inspect cross-boundary latencies from edge CDN ingress down to low-level PostgreSQL lock acquisitions.
              </p>

              {/* Trace Spans Waterfall */}
              <div className="space-y-3 font-mono text-[12px]">
                {[
                  { name: "api-gateway (HTTP POST /v1/checkout)", duration: "148ms", spanWidth: "100%", startOffset: "0%", color: "bg-[#3985FF]" },
                  { name: "auth-verify (JWT validation)", duration: "4.2ms", spanWidth: "8%", startOffset: "2%", color: "bg-[#36D399]" },
                  { name: "payment-worker (stripe_token_create)", duration: "128ms", spanWidth: "82%", startOffset: "12%", color: "bg-[#F5B942]" },
                  { name: "db-pool (SELECT * FROM user_balances)", duration: "1.1ms", spanWidth: "3%", startOffset: "94%", color: "bg-[#36D399]" },
                ].map((span, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveTraceStep(idx)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      activeTraceStep === idx 
                        ? "bg-[#151515] border-[#3985FF]/40" 
                        : "bg-[#0A0A0A] border-[#202020] hover:border-[#2E2E2E]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[#F5F5F5]">{span.name}</span>
                      <span className="text-[#929292] font-semibold">{span.duration}</span>
                    </div>
                    {/* Visual Bar representation */}
                    <div className="h-1.5 w-full bg-[#202020] rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full ${span.color}`}
                        style={{ width: span.spanWidth, marginLeft: span.startOffset }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#202020] flex items-center justify-between text-[11px] font-mono text-[#929292]">
              <span>Captured via OpenTelemetry SDK</span>
              <span className="text-[#36D399]">100% span coverage</span>
            </div>
          </div>

          {/* BENTO BLOCK 2: High-throughput eBPF Logs (5 cols) */}
          <div className="lg:col-span-5 rounded-xl bg-[#101010] border border-[#202020] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#202020] mb-4">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-[#36D399]" />
                  <span className="font-semibold text-sm text-[#F5F5F5]">Kernel-level eBPF Logs</span>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-[#36D399]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36D399] animate-pulse" />
                  STREAMING
                </span>
              </div>

              <p className="text-[13px] text-[#929292] mb-4">
                Structured logs ingested at the network boundary without application bytecode overhead.
              </p>

              {/* Log Window */}
              <div className="rounded-lg bg-[#050505] border border-[#202020] p-3 font-mono text-[11px] leading-relaxed space-y-2 text-[#929292]">
                <div className="flex items-center gap-2">
                  <span className="text-[#36D399]">INFO</span>
                  <span className="text-[#5E5E5E]">18:42:01</span>
                  <span className="text-[#F5F5F5]">route_dispatch 200 OK 1.4ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#F5B942]">WARN</span>
                  <span className="text-[#5E5E5E]">18:42:02</span>
                  <span className="text-[#F5B942]">pool saturation: 48/50 active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FF5252]">CRIT</span>
                  <span className="text-[#5E5E5E]">18:42:03</span>
                  <span className="text-[#FF5252]">socket timeout: payment_upstream</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#3985FF]">AUTO</span>
                  <span className="text-[#5E5E5E]">18:42:04</span>
                  <span className="text-[#9B7BFF]">mitigation: spawned +2 replicas</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#202020] text-[11px] font-mono text-[#929292] flex items-center justify-between">
              <span>Ingestion throughput: 42.8k logs/sec</span>
              <span className="text-[#3985FF]">Zero kernel drops</span>
            </div>
          </div>

          {/* BENTO BLOCK 3: Service Dependency Mesh (5 cols) */}
          <div className="lg:col-span-5 rounded-xl bg-[#101010] border border-[#202020] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#202020] mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-[#9B7BFF]" />
                  <span className="font-semibold text-sm text-[#F5F5F5]">Automated Service Mesh</span>
                </div>
                <span className="font-mono text-[11px] text-[#929292]">Live topology</span>
              </div>
              <p className="text-[13px] text-[#929292] mb-5">
                Dynamic dependency graphs generated autonomously from live TCP/HTTP traffic flows.
              </p>

              {/* Topology Matrix */}
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-3 rounded-lg bg-[#0A0A0A] border border-[#202020]">
                  <span className="text-[#929292] block text-[10px]">INGRESS</span>
                  <span className="text-[#F5F5F5] font-semibold">Cloudflare → Envoy</span>
                  <span className="text-[#36D399] block mt-1">✓ mTLS verified</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0A0A0A] border border-[#202020]">
                  <span className="text-[#929292] block text-[10px]">DATA LAYER</span>
                  <span className="text-[#F5F5F5] font-semibold">PostgreSQL Mesh</span>
                  <span className="text-[#36D399] block mt-1">✓ 0 replication lag</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#202020] text-[11px] font-mono text-[#929292]">
              Graph refreshes every 1,000ms based on socket telemetry
            </div>
          </div>

          {/* BENTO BLOCK 4: Deployment Delta Tracker (7 cols) */}
          <div className="lg:col-span-7 rounded-xl bg-[#101010] border border-[#202020] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#202020] mb-4">
                <div className="flex items-center gap-2">
                  <GitBranch size={16} className="text-[#36D399]" />
                  <span className="font-semibold text-sm text-[#F5F5F5]">Deployment & Canary Delta Verification</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#36D399]/15 text-[#36D399] border border-[#36D399]/30">
                  CANARY 100% VERIFIED
                </span>
              </div>
              <p className="text-[13px] text-[#929292] mb-5">
                Automatically measure performance deltas before and after every release commit to block regression spikes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[12px]">
                <div className="p-3 rounded-lg bg-[#0A0A0A] border border-[#202020]">
                  <span className="text-[10px] text-[#929292] block mb-1">LATENCY DELTA</span>
                  <span className="text-base font-bold text-[#36D399]">-14.2ms</span>
                  <span className="text-[10px] text-[#5E5E5E] block mt-1">Optimized query cache</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0A0A0A] border border-[#202020]">
                  <span className="text-[10px] text-[#929292] block mb-1">MEMORY FOOTPRINT</span>
                  <span className="text-base font-bold text-[#F5F5F5]">142MB</span>
                  <span className="text-[10px] text-[#5E5E5E] block mt-1">Within SLA limits</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0A0A0A] border border-[#202020]">
                  <span className="text-[10px] text-[#929292] block mb-1">STATUS</span>
                  <span className="text-base font-bold text-[#36D399]">No regression</span>
                  <span className="text-[10px] text-[#5E5E5E] block mt-1">Full rollout allowed</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#202020] flex items-center justify-between text-[11px] font-mono text-[#929292]">
              <span>Commit: #8f2a1b9 verified against 14 staging scenarios</span>
              <span className="text-[#3985FF]">CI/CD webhook hooked</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4: REAL-TIME OPERATIONAL VISIBILITY
   "Know what's happening across every layer."
   ═══════════════════════════════════════════════════════════════ */
function RealTimeVisibilitySection() {
  const [activeTab, setActiveTab] = useState<"services" | "alerts" | "resources">("services");

  return (
    <section id="features" className="py-24 md:py-32 px-6 sm:px-10 border-b border-[#202020] bg-[#050505]">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#101010] border border-[#202020] text-[#3985FF] font-mono text-[10.5px] tracking-wider uppercase mb-4">
              Real-time telemetry preview
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#F5F5F5] leading-tight font-display mb-3">
              Know what's happening across every layer.
            </h2>
            <p className="text-base sm:text-lg text-[#929292] font-normal leading-relaxed">
              Consolidated operational telemetry covering container clusters, API gateways, database read replicas, and active alert rosters.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#101010] border border-[#202020] self-start font-mono text-[12px]">
            <button
              onClick={() => setActiveTab("services")}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === "services" ? "bg-[#3985FF] text-white font-medium" : "text-[#929292] hover:text-[#F5F5F5]"
              }`}
            >
              Services (6)
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === "alerts" ? "bg-[#3985FF] text-white font-medium" : "text-[#929292] hover:text-[#F5F5F5]"
              }`}
            >
              Latest alerts (2)
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === "resources" ? "bg-[#3985FF] text-white font-medium" : "text-[#929292] hover:text-[#F5F5F5]"
              }`}
            >
              Infra nodes
            </button>
          </div>
        </div>

        {/* Dashboard Shell */}
        <div className="rounded-xl bg-[#0A0A0A] border border-[#202020] overflow-hidden shadow-2xl">
          
          {/* Top Operational Bar */}
          <div className="px-6 py-4 bg-[#101010] border-b border-[#202020] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-mono text-[12px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#36D399]" />
                <span className="text-[#F5F5F5] font-semibold">Multi-region mesh</span>
              </div>
              <span className="text-[#5E5E5E]">|</span>
              <span className="text-[#929292]">Latency p99: 1.4ms</span>
              <span className="text-[#5E5E5E]">|</span>
              <span className="text-[#929292]">SLA: 99.98%</span>
            </div>
            
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#5E5E5E] tracking-wider uppercase">
              <span>ILLUSTRATIVE TELEMETRY</span>
              <span className="px-1.5 py-0.5 rounded bg-[#202020] text-[#929292]">LIVE SIMULATION</span>
            </div>
          </div>

          {/* Conditional Views based on Tab */}
          <div className="p-6">
            {activeTab === "services" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[12.5px]">
                  <thead>
                    <tr className="border-b border-[#202020] text-[#929292] text-[11px] tracking-wider uppercase">
                      <th className="pb-3 font-medium">Service name</th>
                      <th className="pb-3 font-medium">Layer</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">P99 Latency</th>
                      <th className="pb-3 font-medium text-right">Error %</th>
                      <th className="pb-3 font-medium text-right">Throughput</th>
                      <th className="pb-3 font-medium text-right">Checked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202020]">
                    {SAMPLE_SERVICES.map((srv, i) => (
                      <tr key={i} className="hover:bg-[#101010]/60 transition-colors">
                        <td className="py-3.5 text-[#F5F5F5] font-semibold flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              srv.status === "operational"
                                ? "bg-[#36D399]"
                                : srv.status === "degraded"
                                ? "bg-[#F5B942] animate-pulse"
                                : "bg-[#FF5252]"
                            }`}
                          />
                          {srv.name}
                        </td>
                        <td className="py-3.5 text-[#929292] uppercase text-[10px]">{srv.category}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              srv.status === "operational"
                                ? "bg-[#36D399]/10 text-[#36D399]"
                                : "bg-[#F5B942]/10 text-[#F5B942]"
                            }`}
                          >
                            {srv.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right text-[#F5F5F5]">{srv.latency}</td>
                        <td className={`py-3.5 text-right font-semibold ${srv.errorRate === "0.000%" ? "text-[#929292]" : "text-[#FF5252]"}`}>
                          {srv.errorRate}
                        </td>
                        <td className="py-3.5 text-right text-[#3985FF]">{srv.rps}</td>
                        <td className="py-3.5 text-right text-[#5E5E5E]">{srv.checked}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "alerts" && (
              <div className="space-y-3 font-mono text-[12px]">
                <div className="p-4 rounded-lg bg-[#101010] border border-[#FF5252]/40 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-[#FF5252] shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#FF5252] font-semibold">P0 CRITICAL</span>
                        <span className="text-[#F5F5F5]">Connection pool exhaustion on payment-worker-pool</span>
                      </div>
                      <p className="text-[#929292] text-[11px] mt-1 font-sans">
                        Active connections reached 49/50 limit. Request queue latency climbed from 12ms to 142ms.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#929292]">2m ago</span>
                </div>

                <div className="p-4 rounded-lg bg-[#101010] border border-[#F5B942]/30 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Activity size={18} className="text-[#F5B942] shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#F5B942] font-semibold">P2 WARNING</span>
                        <span className="text-[#F5F5F5]">Memory headroom threshold reached on node-worker-03</span>
                      </div>
                      <p className="text-[#929292] text-[11px] mt-1 font-sans">
                        Heap usage exceeded 85% of allocated Kubernetes cgroup limit. Auto-scaling pod scheduled.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#929292]">14m ago</span>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="p-4 rounded-lg bg-[#101010] border border-[#202020]">
                  <div className="flex items-center justify-between text-[11px] text-[#929292] mb-2">
                    <span>CPU ALLOCATION</span>
                    <Cpu size={14} className="text-[#3985FF]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F5F5F5]">44.2%</div>
                  <div className="h-1.5 w-full bg-[#202020] rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-[#3985FF] rounded-full" style={{ width: "44.2%" }} />
                  </div>
                  <span className="text-[10px] text-[#5E5E5E] block mt-2">16 vCPUs active across 3 clusters</span>
                </div>

                <div className="p-4 rounded-lg bg-[#101010] border border-[#202020]">
                  <div className="flex items-center justify-between text-[11px] text-[#929292] mb-2">
                    <span>MEMORY COMMIT</span>
                    <HardDrive size={14} className="text-[#36D399]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F5F5F5]">62.8%</div>
                  <div className="h-1.5 w-full bg-[#202020] rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-[#36D399] rounded-full" style={{ width: "62.8%" }} />
                  </div>
                  <span className="text-[10px] text-[#5E5E5E] block mt-2">40.2 GB / 64 GB provisioned</span>
                </div>

                <div className="p-4 rounded-lg bg-[#101010] border border-[#202020]">
                  <div className="flex items-center justify-between text-[11px] text-[#929292] mb-2">
                    <span>NETWORK I/O</span>
                    <Wifi size={14} className="text-[#9B7BFF]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F5F5F5]">3.4 Gbps</div>
                  <div className="h-1.5 w-full bg-[#202020] rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-[#9B7BFF] rounded-full" style={{ width: "34%" }} />
                  </div>
                  <span className="text-[10px] text-[#5E5E5E] block mt-2">0 packet drops recorded</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Latency Chart Visual */}
          <div className="p-6 bg-[#050505] border-t border-[#202020]">
            <div className="flex items-center justify-between mb-3 font-mono text-[11px] text-[#929292]">
              <span>API RESPONSE TIME (P99 • MULTI-REGION MESH)</span>
              <span className="text-[#3985FF]">SAMPLED LAST 30 DAYS</span>
            </div>
            
            <div className="h-28 w-full border-b border-l border-[#202020] relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path
                  d="M0,85 L15,80 L30,82 L45,55 L60,62 L75,30 L90,38 L100,18"
                  fill="none"
                  stroke="#3985FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-0 -left-9 text-[10px] font-mono text-[#5E5E5E]">12ms</div>
              <div className="absolute bottom-0 -left-7 text-[10px] font-mono text-[#5E5E5E]">0ms</div>
              <div className="absolute -bottom-5 left-0 text-[10px] font-mono text-[#5E5E5E]">Day 1</div>
              <div className="absolute -bottom-5 right-0 text-[10px] font-mono text-[#5E5E5E]">Day 30</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5: AI-POWERED INTELLIGENCE
   "From detecting anomalies to understanding why."
   ═══════════════════════════════════════════════════════════════ */
function AiIntelligenceSection() {
  return (
    <section id="solutions" className="py-24 md:py-32 px-6 sm:px-10 border-b border-[#202020] bg-[#0A0A0A]">
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT: Capabilities list & explanation */}
        <div className="lg:col-span-6 flex flex-col text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#101010] border border-[#202020] text-[#9B7BFF] font-mono text-[10.5px] tracking-wider uppercase mb-4 self-start">
            <Sparkles size={12} />
            AI Root Cause Engine
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#F5F5F5] leading-tight font-display mb-6">
            From detecting anomalies to understanding why.
          </h2>

          <p className="text-base sm:text-lg text-[#929292] font-normal leading-relaxed mb-8">
            Traditional monitoring alerts you when thresholds fail. BREXAL correlates time-series telemetry with code deployments, identifying the exact commit, database transaction, or external dependency causing the incident.
          </p>

          <div className="space-y-4 font-sans">
            {[
              { title: "AI anomaly detection", desc: "Learns seasonal traffic baselines without manual alert threshold tuning." },
              { title: "Automated root cause analysis", desc: "Traces error spikes to the underlying commit hash or database lock." },
              { title: "Predictive maintenance", desc: "Forecasts disk saturation and memory leaks days before customer impact." },
              { title: "Autonomous remediation with approval safeguards", desc: "Suggests tested patch diffs while keeping humans fully in control." },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-[#101010] border border-[#202020] flex items-center justify-center text-[#3985FF] shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#F5F5F5]">{item.title}</h4>
                  <p className="text-[12.5px] text-[#929292] leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Anomaly to RCA Technical Breakdown */}
        <div className="lg:col-span-6 w-full">
          <div className="rounded-xl bg-[#101010] border border-[#202020] p-6 shadow-2xl flex flex-col gap-4">
            
            {/* Stage 1: Anomaly Detected */}
            <div className="p-3.5 rounded-lg bg-[#0A0A0A] border border-[#F5B942]/30 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#F5B942] animate-pulse mt-1 shrink-0" />
              <div className="flex-1 font-mono text-[11.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#F5B942] font-semibold">STAGE 1: ANOMALY ISOLATED</span>
                  <span className="text-[#5E5E5E]">T + 0.4s</span>
                </div>
                <p className="text-[#F5F5F5] mt-1 font-sans text-[12.5px]">
                  Unusual 8x latency jump on <code className="text-[#3985FF] font-mono">/v2/payment/charge</code> endpoint.
                </p>
              </div>
            </div>

            {/* Stage 2: Correlation with Deployment */}
            <div className="p-3.5 rounded-lg bg-[#0A0A0A] border border-[#3985FF]/30 flex items-start gap-3">
              <GitCommit size={15} className="text-[#3985FF] mt-0.5 shrink-0" />
              <div className="flex-1 font-mono text-[11.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#3985FF] font-semibold">STAGE 2: COMMIT CORRELATION</span>
                  <span className="text-[#5E5E5E]">T + 1.2s</span>
                </div>
                <p className="text-[#F5F5F5] mt-1 font-sans text-[12.5px]">
                  Deployment <span className="font-mono text-[#3985FF]">#8f2a1b9</span> introduced unbuffered WebSocket reconnect loop.
                </p>
              </div>
            </div>

            {/* Stage 3: Suggested Remediation vs Executed Action */}
            <div className="p-4 rounded-lg bg-[#050505] border border-[#202020] flex flex-col gap-3 font-mono text-[11px]">
              <div className="flex items-center justify-between pb-2 border-b border-[#202020]">
                <span className="text-[#9B7BFF] font-semibold">STAGE 3: REMEDIATION DIFF</span>
                <span className="text-[#36D399]">CONFIDENCE: 98.4%</span>
              </div>

              <div className="text-[#929292] leading-relaxed">
                <div>142 |  async def handle_connection(ws, client_id):</div>
                <div className="bg-[#FF5252]/10 text-[#FF5252] px-2 py-0.5 rounded my-0.5">
                  -     await ws.send_text(await get_unbounded_stream())
                </div>
                <div className="bg-[#36D399]/10 text-[#36D399] px-2 py-0.5 rounded my-0.5">
                  +     await ws.send_text(await get_bounded_stream(max_buf=512))
                </div>
              </div>

              <div className="pt-2 border-t border-[#202020] flex items-center justify-between">
                <span className="text-[10px] text-[#5E5E5E]">Action requires on-call engineer approval</span>
                <span className="px-2 py-0.5 rounded bg-[#3985FF] text-white text-[10px] font-semibold">
                  AUDITED SAFEGUARD
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6: COMPLETE OBSERVABILITY STACK
   "Every signal. One connected view."
   ═══════════════════════════════════════════════════════════════ */
function CompleteStackSection() {
  const capabilities = [
    { name: "Application Performance Monitoring", desc: "Code-level profiling, P99 request latency, and automated garbage-collection analysis.", icon: Activity },
    { name: "Infrastructure Monitoring", desc: "Kubernetes pod resource allocation, host-level CPU/memory, and bare-metal disk IOPS.", icon: Server },
    { name: "Centralized Log Management", desc: "High-throughput log indexing without per-gigabyte penalization or indexing delays.", icon: Terminal },
    { name: "Distributed Tracing", desc: "End-to-end request tracing across multi-cloud clusters and heterogeneous microservices.", icon: Network },
    { name: "Cloud & Container Telemetry", desc: "Native integrations for Docker, AWS ECS, Google Cloud GKE, and Azure Kubernetes.", icon: Layers },
    { name: "Automated Dependency Mapping", desc: "Zero-configuration topological graphs derived directly from kernel socket inspection.", icon: Radio },
  ];

  return (
    <section id="stack" className="py-24 md:py-32 px-6 sm:px-10 border-b border-[#202020] bg-[#050505]">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#101010] border border-[#202020] text-[#3985FF] font-mono text-[10.5px] tracking-wider uppercase mb-4">
            Unified Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#F5F5F5] leading-tight font-display mb-4">
            Every signal. One connected view.
          </h2>
          <p className="text-base sm:text-lg text-[#929292] font-normal leading-relaxed">
            Eliminate fragmented observability silos. BREXAL delivers a single pipeline for telemetry ingestion, correlation, and resolution.
          </p>
        </div>

        {/* Structured Technical Capability Grid (Asymmetric & Diversified) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-xl bg-[#0A0A0A] border border-[#202020] hover:border-[#2E2E2E] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#101010] border border-[#202020] flex items-center justify-center text-[#3985FF] mb-5 group-hover:border-[#3985FF]/40 transition-colors">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#F5F5F5] mb-2 font-display">{cap.name}</h3>
                  <p className="text-[13px] text-[#929292] leading-relaxed font-sans">{cap.desc}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-[#202020] flex items-center justify-between text-[11px] font-mono text-[#5E5E5E] group-hover:text-[#929292] transition-colors">
                  <span>CAPABILITY // 0{i + 1}</span>
                  <ArrowRight size={13} className="text-[#3985FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7: INCIDENT RESPONSE WORKFLOW
   "Reduce the distance between detection and resolution."
   ═══════════════════════════════════════════════════════════════ */
function IncidentResponseSection() {
  const steps = [
    { stage: "01", name: "Detection", time: "00:00", detail: "eBPF probe detects memory leak anomaly on payment-worker-pool.", badge: "P0 CRITICAL", color: "text-[#FF5252]" },
    { stage: "02", name: "Investigation", time: "+00:12s", detail: "Automated correlation links error burst to commit #8f2a1b9 in staging.", badge: "AUTO-LINKED", color: "text-[#3985FF]" },
    { stage: "03", name: "Root cause", time: "+00:38s", detail: "Unbounded buffer recursion isolated in websocket_handler.py line 142.", badge: "ISOLATED", color: "text-[#9B7BFF]" },
    { stage: "04", name: "Remediation", time: "+01:15s", detail: "Suggested patch generated and validated against staging test harness.", badge: "READY", color: "text-[#F5B942]" },
    { stage: "05", name: "Resolution", time: "+01:45s", detail: "Canary rollout completed with zero dropped customer transactions.", badge: "RESOLVED", color: "text-[#36D399]" },
  ];

  return (
    <section id="incident-response" className="py-24 md:py-32 px-6 sm:px-10 border-b border-[#202020] bg-[#0A0A0A]">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#101010] border border-[#202020] text-[#36D399] font-mono text-[10.5px] tracking-wider uppercase mb-4">
            Autonomous MTTR Reduction
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#F5F5F5] leading-tight font-display mb-4">
            Reduce the distance between detection and resolution.
          </h2>
          <p className="text-base sm:text-lg text-[#929292] font-normal leading-relaxed">
            Every minute of downtime damages user trust. Follow the five-step autonomous incident lifecycle that compresses mean time to recovery from hours to under two minutes.
          </p>
        </div>

        {/* 5-Step Connected Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((st, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-[#101010] border border-[#202020] flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#202020] mb-3 font-mono text-[11px]">
                  <span className="text-[#3985FF] font-bold">{st.stage}</span>
                  <span className="text-[#929292]">{st.time}</span>
                </div>
                <h4 className="text-base font-semibold text-[#F5F5F5] mb-1 font-display">{st.name}</h4>
                <p className="text-[12px] text-[#929292] leading-relaxed font-sans">{st.detail}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#202020]">
                <span className={`text-[10px] font-mono font-semibold ${st.color}`}>
                  {st.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 8: MINIMAL ENTERPRISE FINAL CTA
   "Your systems move fast. Your intelligence should move faster."
   ═══════════════════════════════════════════════════════════════ */
function FinalCtaSection() {
  return (
    <section className="py-24 md:py-32 px-6 sm:px-10 border-b border-[#202020] bg-[#050505]">
      <div className="max-w-[1000px] mx-auto text-center flex flex-col items-center">
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#F5F5F5] leading-tight font-display mb-5">
          Your systems move fast. Your intelligence should move faster.
        </h2>

        <p className="text-base sm:text-lg text-[#929292] font-normal leading-relaxed max-w-2xl mb-8 font-sans">
          Bring monitoring, investigation, and incident response into one connected platform built for modern engineering teams.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#F5F5F5] text-[#050505] text-[14px] font-semibold hover:bg-white transition-all shadow-md focus:ring-2 focus:ring-[#3985FF]"
          >
            Request early access
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#101010] border border-[#202020] text-[#F5F5F5] text-[14px] font-medium hover:bg-[#151515] transition-colors"
          >
            Sign in to console
          </Link>
        </div>

        <span className="font-mono text-[11px] text-[#5E5E5E] mt-6">
          SOC-2 Type II Certified • Zero Telemetry Lock-in • OpenTelemetry Native
        </span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 9: ENTERPRISE FOOTER
   Bharti Nexus Technologies branding & compliance
   ═══════════════════════════════════════════════════════════════ */
function EnterpriseFooter() {
  return (
    <footer className="py-16 px-6 sm:px-10 bg-[#050505] text-[#929292] font-sans">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-16 border-b border-[#202020]">
          
          {/* Brand Info (Col 1) */}
          <div className="col-span-2 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#101010] border border-[#202020] flex items-center justify-center text-[#3985FF]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <Logo className="h-4 text-[#F5F5F5]" />
            </div>
            <p className="text-[13px] text-[#929292] leading-relaxed max-w-sm mb-4">
              BREXAL is an AI-powered observability and incident response platform developed by Bharti Nexus Technologies.
            </p>
            <div className="font-mono text-[11px] text-[#5E5E5E]">
              Intelligence, engineered to move.
            </div>
          </div>

          {/* Platform Capabilities (Col 2) */}
          <div className="flex flex-col gap-2.5 text-[13px]">
            <span className="font-mono text-[11px] font-semibold text-[#F5F5F5] uppercase tracking-wider mb-2">
              Platform
            </span>
            <Link href="#platform" className="hover:text-[#F5F5F5] transition-colors">APM & Metrics</Link>
            <Link href="#platform" className="hover:text-[#F5F5F5] transition-colors">Infrastructure</Link>
            <Link href="#platform" className="hover:text-[#F5F5F5] transition-colors">Distributed Tracing</Link>
            <Link href="#solutions" className="hover:text-[#F5F5F5] transition-colors">AI Copilot</Link>
            <Link href="#features" className="hover:text-[#F5F5F5] transition-colors">Incident Manager</Link>
          </div>

          {/* Solutions (Col 3) */}
          <div className="flex flex-col gap-2.5 text-[13px]">
            <span className="font-mono text-[11px] font-semibold text-[#F5F5F5] uppercase tracking-wider mb-2">
              Solutions
            </span>
            <span className="hover:text-[#F5F5F5] transition-colors cursor-pointer">DevOps Teams</span>
            <span className="hover:text-[#F5F5F5] transition-colors cursor-pointer">Site Reliability Engineers</span>
            <span className="hover:text-[#F5F5F5] transition-colors cursor-pointer">Platform Engineering</span>
            <span className="hover:text-[#F5F5F5] transition-colors cursor-pointer">Cloud Migration</span>
          </div>

          {/* Resources & Legal (Col 4) */}
          <div className="flex flex-col gap-2.5 text-[13px]">
            <span className="font-mono text-[11px] font-semibold text-[#F5F5F5] uppercase tracking-wider mb-2">
              Resources
            </span>
            <span className="hover:text-[#F5F5F5] transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-[#F5F5F5] transition-colors cursor-pointer">API Reference</span>
            <span className="hover:text-[#F5F5F5] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#F5F5F5] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#F5F5F5] transition-colors cursor-pointer">Security & SOC-2</span>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#5E5E5E] gap-4">
          <div>
            © {new Date().getFullYear()} Bharti Nexus Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Server status: Nominal</span>
            <span>•</span>
            <span>Edge latency: 1.4ms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#3985FF]/20 selection:text-white">
      {/* 1. Minimal Navigation */}
      <Navigation />

      <main>
        {/* 2. Asymmetric Hero */}
        <HeroSection />

        {/* 3. Operational Intelligence Bento */}
        <OperationalIntelligenceSection />

        {/* 4. Real-time Visibility Dashboard Preview */}
        <RealTimeVisibilitySection />

        {/* 5. AI-Powered Intelligence */}
        <AiIntelligenceSection />

        {/* 6. Complete Observability Stack */}
        <CompleteStackSection />

        {/* 7. Incident Response Workflow */}
        <IncidentResponseSection />

        {/* 8. Final CTA */}
        <FinalCtaSection />
      </main>

      {/* 9. Enterprise Footer */}
      <EnterpriseFooter />
    </div>
  );
}
