"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
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
import { StripeProductShowcase } from "@/components/StripeProductShowcase";
import { DarkTelemetryCard } from "@/components/DarkTelemetryCard";
import { HeroVideoShowcase } from "@/components/HeroVideoShowcase";

/* ═══════════════════════════════════════════════════════════════
   TYPES & SAMPLE TELEMETRY
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
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] py-3.5"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Brand Mark + Minimal Symbol */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-8 h-8 rounded-lg bg-[#0A2540] flex items-center justify-center text-white shadow-sm group-hover:bg-[#635BFF] transition-colors">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <Logo className="h-4 text-[#0A2540] group-hover:text-[#635BFF] transition-colors" />
            <span className="text-[9px] font-mono tracking-widest text-[#627D98] uppercase">Bharti Nexus</span>
          </div>
        </Link>

        {/* Center Navigation Links (Stripe Dropdown Style) */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#425466]">
          <Link href="#platform" className="hover:text-[#0A2540] transition-colors flex items-center gap-1">
            Products <span className="text-[10px] text-slate-400">⌄</span>
          </Link>
          <Link href="#solutions" className="hover:text-[#0A2540] transition-colors flex items-center gap-1">
            Solutions <span className="text-[10px] text-slate-400">⌄</span>
          </Link>
          <Link href="#features" className="hover:text-[#0A2540] transition-colors flex items-center gap-1">
            Developers <span className="text-[10px] text-slate-400">⌄</span>
          </Link>
          <Link href="#stack" className="hover:text-[#0A2540] transition-colors flex items-center gap-1">
            Resources <span className="text-[10px] text-slate-400">⌄</span>
          </Link>
          <Link href="#features" className="hover:text-[#0A2540] transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[14px] font-semibold text-[#425466] hover:text-[#0A2540] transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-full bg-[#635BFF] text-white text-[13.5px] font-semibold hover:bg-[#5349e0] transition-all shadow-[0_2px_8px_rgba(99,91,255,0.25)] hover:shadow-[0_4px_16px_rgba(99,91,255,0.35)] focus:outline-none focus:ring-2 focus:ring-[#635BFF] flex items-center gap-1.5"
          >
            Contact sales <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: BREXAL HERO WITH CREATION VIDEO SHOWCASE
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 px-6 sm:px-10 overflow-hidden bg-white border-b border-slate-100 flex items-center">
      
      <div className="relative z-10 max-w-[1360px] mx-auto w-full">
        
        {/* HERO GRID: Left Editorial Content (6 cols) + Right Enlarged Video in Empty Space (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Clean Editorial Headline & CTAs (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            
            {/* Live Telemetry Ticker Line */}
            <div className="text-[12px] font-mono text-[#0A2540] font-semibold tracking-tight mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              <span>Global telemetry running on BREXAL:</span>
              <span className="text-[#635BFF] font-bold">99.984201%</span>
            </div>

            {/* Main Headline (BREXAL Mission with Stripe-grade typography & accent) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-bold tracking-[-0.03em] text-[#0A2540] leading-[1.06] mb-5 font-display max-w-xl">
              See the failure before it becomes <span className="text-[#635BFF]">an incident.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg md:text-[20px] text-[#3A5A78] font-normal leading-relaxed max-w-xl mb-7 font-sans">
              Monitor every microservice, trace every distributed request, and identify the root cause with AI before downtime impacts your users or your business.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-7 w-full sm:w-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#635BFF] text-white text-[14.5px] font-semibold hover:bg-[#5349e0] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(99,91,255,0.35)] hover:shadow-[0_6px_22px_rgba(99,91,255,0.45)] focus:ring-2 focus:ring-[#635BFF]"
              >
                Request early access
                <ChevronRight size={16} />
              </Link>
              <a
                href="#modular-showcase"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/90 text-[#0A2540] border border-slate-200 text-[14px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs flex items-center justify-center gap-2"
              >
                Explore the platform
              </a>
            </div>

            {/* Technical Metadata Line */}
            <div className="pt-4 border-t border-slate-200/70 w-full flex flex-wrap items-center gap-3 text-[11.5px] font-mono text-[#627D98]">
              <span className="flex items-center gap-1.5 text-[#059669] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                Mesh latency: 0.8ms
              </span>
              <span className="text-slate-300">/</span>
              <span>Application monitoring</span>
              <span className="text-slate-300">/</span>
              <span>Infrastructure intelligence</span>
              <span className="text-slate-300">/</span>
              <span>AI incident response</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Enlarged Seamless Video in the Empty Space (6 cols) */}
          <div className="lg:col-span-6 w-full flex items-center justify-center lg:justify-end">
            <HeroVideoShowcase />
          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2.5: LIVE TELEMETRY & SERVICE MESH COCKPIT (SHIFTED CARD)
   ═══════════════════════════════════════════════════════════════ */
function TelemetryCockpitSection() {
  return (
    <section id="telemetry-cockpit" className="py-14 md:py-18 px-6 sm:px-10 bg-[#F6F9FC] border-y border-slate-200/80">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Editorial Copy */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3985FF]/10 border border-[#3985FF]/20 text-[#3985FF] font-mono text-[11px] font-bold tracking-wider uppercase mb-4">
              Real-Time Mesh Topology
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] font-display mb-5 leading-tight">
              Know what’s happening across every cluster and node.
            </h2>
            <p className="text-base text-[#425466] leading-relaxed mb-6 font-sans">
              Instant multi-region latency telemetry, p99 distribution tracking, error frequency budgets, and autonomous AI anomaly correlation across distributed microservices.
            </p>
            <div className="space-y-3 font-mono text-xs text-[#0A2540]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#36D399]" />
                <span>Multi-region synthetic ping & latency probes</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#36D399]" />
                <span>Live topology degradation detection & warnings</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#9B7BFF]" />
                <span>Automated git commit correlation via AI Copilot</span>
              </div>
            </div>
          </div>

          {/* Right: The Exact Dark Telemetry Card from Image 1 */}
          <div className="lg:col-span-7 flex justify-center">
            <DarkTelemetryCard />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: OPERATIONAL INTELLIGENCE (BENTO GRID - WHITE THEME)
   "Your infrastructure tells a story. Read every signal."
   ═══════════════════════════════════════════════════════════════ */
function OperationalIntelligenceSection() {
  const [activeTraceStep, setActiveTraceStep] = useState<number>(2);

  return (
    <section id="platform" className="py-14 md:py-20 px-6 sm:px-10 border-b border-slate-200/80 bg-[#F6F9FC]">
      <div className="max-w-[1360px] mx-auto">
        {/* Editorial Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] font-mono text-[11px] font-semibold tracking-wider uppercase mb-4">
            Unified Signal Correlation
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0A2540] leading-tight font-display mb-4">
            Your infrastructure tells a story. Read every signal.
          </h2>
          <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed">
            Siloed tools blind your engineering team during critical outages. BREXAL continuously synthesizes metrics, distributed traces, system logs, and dependency maps into a single operational narrative.
          </p>
        </div>

        {/* Asymmetric Bento Layout (Unequal Dimensions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* BENTO BLOCK 1: Distributed Trace Waterfall (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/80 p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <Network size={18} className="text-[#635BFF]" />
                  <span className="font-bold text-sm text-[#0A2540]">Distributed Request Trace</span>
                </div>
                <span className="font-mono text-[11px] text-[#627D98] bg-[#F6F9FC] px-2 py-0.5 rounded border border-slate-200/60">trace_id: 8f2a1b9c</span>
              </div>
              
              <p className="text-[13.5px] text-[#425466] mb-6">
                Inspect cross-boundary latencies from edge CDN ingress down to low-level PostgreSQL lock acquisitions.
              </p>

              {/* Trace Spans Waterfall */}
              <div className="space-y-3 font-mono text-[12px]">
                {[
                  { name: "api-gateway (HTTP POST /v1/checkout)", duration: "148ms", spanWidth: "100%", startOffset: "0%", color: "bg-[#635BFF]" },
                  { name: "auth-verify (JWT validation)", duration: "4.2ms", spanWidth: "8%", startOffset: "2%", color: "bg-[#059669]" },
                  { name: "payment-worker (stripe_token_create)", duration: "128ms", spanWidth: "82%", startOffset: "12%", color: "bg-amber-500" },
                  { name: "db-pool (SELECT * FROM user_balances)", duration: "1.1ms", spanWidth: "3%", startOffset: "94%", color: "bg-[#059669]" },
                ].map((span, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveTraceStep(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      activeTraceStep === idx 
                        ? "bg-[#F6F9FC] border-[#635BFF]/50 shadow-xs" 
                        : "bg-white border-slate-200/70 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 font-medium">
                      <span className="text-[#0A2540]">{span.name}</span>
                      <span className="text-[#627D98] font-bold">{span.duration}</span>
                    </div>
                    {/* Visual Bar representation */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full ${span.color}`}
                        style={{ width: span.spanWidth, marginLeft: span.startOffset }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-[#627D98]">
              <span>Captured via OpenTelemetry SDK</span>
              <span className="text-[#059669] font-semibold">100% span coverage</span>
            </div>
          </div>

          {/* BENTO BLOCK 2: High-throughput eBPF Logs (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <Terminal size={18} className="text-[#059669]" />
                  <span className="font-bold text-sm text-[#0A2540]">Kernel-level eBPF Logs</span>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#059669] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                  STREAMING
                </span>
              </div>

              <p className="text-[13.5px] text-[#425466] mb-4">
                Structured logs ingested at the network boundary without application bytecode overhead.
              </p>

              {/* Log Window */}
              <div className="rounded-xl bg-[#0A2540] border border-slate-800 p-4 font-mono text-[11px] leading-relaxed space-y-2.5 text-slate-300 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#00D924] font-bold">INFO</span>
                  <span className="text-slate-500">18:42:01</span>
                  <span className="text-white">route_dispatch 200 OK 1.4ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">WARN</span>
                  <span className="text-slate-500">18:42:02</span>
                  <span className="text-amber-300">pool saturation: 48/50 active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">CRIT</span>
                  <span className="text-slate-500">18:42:03</span>
                  <span className="text-red-300">socket timeout: payment_upstream</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#00D4FF] font-bold">AUTO</span>
                  <span className="text-slate-500">18:42:04</span>
                  <span className="text-slate-200">mitigation: spawned +2 replicas</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-[#627D98] flex items-center justify-between">
              <span>Throughput: 42.8k logs/sec</span>
              <span className="text-[#635BFF] font-semibold">Zero kernel drops</span>
            </div>
          </div>

          {/* BENTO BLOCK 3: Service Dependency Mesh (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <Layers size={18} className="text-[#635BFF]" />
                  <span className="font-bold text-sm text-[#0A2540]">Automated Service Mesh</span>
                </div>
                <span className="font-mono text-[11px] text-[#627D98]">Live topology</span>
              </div>
              <p className="text-[13.5px] text-[#425466] mb-5">
                Dynamic dependency graphs generated autonomously from live TCP/HTTP traffic flows.
              </p>

              {/* Topology Matrix */}
              <div className="grid grid-cols-2 gap-2.5 font-mono text-[11px]">
                <div className="p-3.5 rounded-xl bg-[#F6F9FC] border border-slate-200/80">
                  <span className="text-[#627D98] block text-[10px] font-semibold">INGRESS</span>
                  <span className="text-[#0A2540] font-bold">Cloudflare → Envoy</span>
                  <span className="text-[#059669] block mt-1 font-medium">✓ mTLS verified</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F6F9FC] border border-slate-200/80">
                  <span className="text-[#627D98] block text-[10px] font-semibold">DATA LAYER</span>
                  <span className="text-[#0A2540] font-bold">PostgreSQL Mesh</span>
                  <span className="text-[#059669] block mt-1 font-medium">✓ 0 replication lag</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-[#627D98]">
              Graph refreshes every 1,000ms based on socket telemetry
            </div>
          </div>

          {/* BENTO BLOCK 4: Deployment Delta Tracker (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/80 p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <GitBranch size={18} className="text-[#059669]" />
                  <span className="font-bold text-sm text-[#0A2540]">Deployment & Canary Delta Verification</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono bg-[#059669]/10 text-[#059669] border border-[#059669]/20 font-semibold">
                  CANARY 100% VERIFIED
                </span>
              </div>
              <p className="text-[13.5px] text-[#425466] mb-5">
                Automatically measure performance deltas before and after every release commit to block regression spikes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[12px]">
                <div className="p-3.5 rounded-xl bg-[#F6F9FC] border border-slate-200/80">
                  <span className="text-[10px] text-[#627D98] block mb-1 font-semibold">LATENCY DELTA</span>
                  <span className="text-lg font-bold text-[#059669]">-14.2ms</span>
                  <span className="text-[10px] text-[#627D98] block mt-1">Optimized query cache</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F6F9FC] border border-slate-200/80">
                  <span className="text-[10px] text-[#627D98] block mb-1 font-semibold">MEMORY COMMIT</span>
                  <span className="text-lg font-bold text-[#0A2540]">142MB</span>
                  <span className="text-[10px] text-[#627D98] block mt-1">Within SLA limits</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F6F9FC] border border-slate-200/80">
                  <span className="text-[10px] text-[#627D98] block mb-1 font-semibold">STATUS</span>
                  <span className="text-lg font-bold text-[#059669]">No regression</span>
                  <span className="text-[10px] text-[#627D98] block mt-1">Full rollout allowed</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-[#627D98]">
              <span>Commit #8f2a1b9 verified against 14 staging scenarios</span>
              <span className="text-[#635BFF] font-semibold">CI/CD webhook hooked</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4: REAL-TIME OPERATIONAL VISIBILITY (STRIPE DATA TABLE)
   "Know what's happening across every layer."
   ═══════════════════════════════════════════════════════════════ */
function RealTimeVisibilitySection() {
  const [activeTab, setActiveTab] = useState<"services" | "alerts" | "resources">("services");

  return (
    <section id="features" className="py-14 md:py-20 px-6 sm:px-10 border-b border-slate-200/80 bg-white">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] font-mono text-[11px] font-semibold tracking-wider uppercase mb-4">
              Real-time telemetry preview
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0A2540] leading-tight font-display mb-3">
              Know what's happening across every layer.
            </h2>
            <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed">
              Consolidated operational telemetry covering container clusters, API gateways, database read replicas, and active alert rosters.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F6F9FC] border border-slate-200/80 self-start font-mono text-[12px]">
            <button
              onClick={() => setActiveTab("services")}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === "services" ? "bg-white text-[#0A2540] shadow-xs border border-slate-200/60" : "text-[#425466] hover:text-[#0A2540]"
              }`}
            >
              Services (6)
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === "alerts" ? "bg-white text-[#0A2540] shadow-xs border border-slate-200/60" : "text-[#425466] hover:text-[#0A2540]"
              }`}
            >
              Latest alerts (2)
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === "resources" ? "bg-white text-[#0A2540] shadow-xs border border-slate-200/60" : "text-[#425466] hover:text-[#0A2540]"
              }`}
            >
              Infra nodes
            </button>
          </div>
        </div>

        {/* Dashboard Shell */}
        <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-[0_13px_27px_-5px_rgba(50,50,93,0.06),0_8px_16px_-8px_rgba(0,0,0,0.04)]">
          
          {/* Top Operational Bar */}
          <div className="px-6 py-4 bg-[#F6F9FC] border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-mono text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#059669]" />
                <span className="text-[#0A2540] font-bold">Multi-region mesh</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-[#425466]">Latency p99: 1.4ms</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#425466]">SLA: 99.98%</span>
            </div>
            
            <div className="flex items-center gap-2 font-mono text-[10.5px] text-[#627D98] tracking-wider uppercase">
              <span>ILLUSTRATIVE TELEMETRY</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-[#0A2540] font-bold">LIVE SIMULATION</span>
            </div>
          </div>

          {/* Conditional Views based on Tab */}
          <div className="p-6">
            {activeTab === "services" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[12.5px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[#627D98] text-[11px] tracking-wider uppercase font-bold">
                      <th className="pb-3.5 font-bold">Service name</th>
                      <th className="pb-3.5 font-bold">Layer</th>
                      <th className="pb-3.5 font-bold">Status</th>
                      <th className="pb-3.5 font-bold text-right">P99 Latency</th>
                      <th className="pb-3.5 font-bold text-right">Error %</th>
                      <th className="pb-3.5 font-bold text-right">Throughput</th>
                      <th className="pb-3.5 font-bold text-right">Checked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SAMPLE_SERVICES.map((srv, i) => (
                      <tr key={i} className="hover:bg-[#F6F9FC]/80 transition-colors">
                        <td className="py-4 text-[#0A2540] font-bold flex items-center gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              srv.status === "operational"
                                ? "bg-[#059669]"
                                : srv.status === "degraded"
                                ? "bg-amber-500 animate-pulse"
                                : "bg-red-500"
                            }`}
                          />
                          {srv.name}
                        </td>
                        <td className="py-4 text-[#627D98] uppercase text-[10.5px] font-semibold">{srv.category}</td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                              srv.status === "operational"
                                ? "bg-[#059669]/10 text-[#059669]"
                                : "bg-amber-500/10 text-amber-700"
                            }`}
                          >
                            {srv.status}
                          </span>
                        </td>
                        <td className="py-4 text-right text-[#0A2540] font-bold">{srv.latency}</td>
                        <td className={`py-4 text-right font-bold ${srv.errorRate === "0.000%" ? "text-[#627D98]" : "text-red-500"}`}>
                          {srv.errorRate}
                        </td>
                        <td className="py-4 text-right text-[#635BFF] font-bold">{srv.rps}</td>
                        <td className="py-4 text-right text-[#627D98]">{srv.checked}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "alerts" && (
              <div className="space-y-3 font-mono text-[12px]">
                <div className="p-4 rounded-xl bg-red-50/40 border border-red-200/80 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-bold">P0 CRITICAL</span>
                        <span className="text-[#0A2540] font-bold">Connection pool exhaustion on payment-worker-pool</span>
                      </div>
                      <p className="text-[#425466] text-[12px] mt-1 font-sans">
                        Active connections reached 49/50 limit. Request queue latency climbed from 12ms to 142ms.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#627D98]">2m ago</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Activity size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-700 font-bold">P2 WARNING</span>
                        <span className="text-[#0A2540] font-bold">Memory headroom threshold reached on node-worker-03</span>
                      </div>
                      <p className="text-[#425466] text-[12px] mt-1 font-sans">
                        Heap usage exceeded 85% of allocated Kubernetes cgroup limit. Auto-scaling pod scheduled.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#627D98]">14m ago</span>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-[#F6F9FC] border border-slate-200/80">
                  <div className="flex items-center justify-between text-[11px] text-[#627D98] font-bold mb-2">
                    <span>CPU ALLOCATION</span>
                    <Cpu size={14} className="text-[#635BFF]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A2540]">44.2%</div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-[#635BFF] rounded-full" style={{ width: "44.2%" }} />
                  </div>
                  <span className="text-[10px] text-[#627D98] block mt-2">16 vCPUs active across 3 clusters</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F9FC] border border-slate-200/80">
                  <div className="flex items-center justify-between text-[11px] text-[#627D98] font-bold mb-2">
                    <span>MEMORY COMMIT</span>
                    <HardDrive size={14} className="text-[#059669]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A2540]">62.8%</div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-[#059669] rounded-full" style={{ width: "62.8%" }} />
                  </div>
                  <span className="text-[10px] text-[#627D98] block mt-2">40.2 GB / 64 GB provisioned</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F9FC] border border-slate-200/80">
                  <div className="flex items-center justify-between text-[11px] text-[#627D98] font-bold mb-2">
                    <span>NETWORK I/O</span>
                    <Wifi size={14} className="text-[#00D4FF]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A2540]">3.4 Gbps</div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-[#00D4FF] rounded-full" style={{ width: "34%" }} />
                  </div>
                  <span className="text-[10px] text-[#627D98] block mt-2">0 packet drops recorded</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Latency Chart Visual */}
          <div className="p-6 bg-[#F6F9FC] border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-3 font-mono text-[11px] text-[#425466] font-semibold">
              <span>API RESPONSE TIME (P99 • MULTI-REGION MESH)</span>
              <span className="text-[#635BFF] font-bold">SAMPLED LAST 30 DAYS</span>
            </div>
            
            <div className="h-28 w-full border-b border-l border-slate-200 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="stripeGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#635BFF" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#635BFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,85 L15,80 L30,82 L45,55 L60,62 L75,30 L90,38 L100,18"
                  fill="none"
                  stroke="#635BFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-0 -left-9 text-[10px] font-mono text-[#627D98]">12ms</div>
              <div className="absolute bottom-0 -left-7 text-[10px] font-mono text-[#627D98]">0ms</div>
              <div className="absolute -bottom-5 left-0 text-[10px] font-mono text-[#627D98]">Day 1</div>
              <div className="absolute -bottom-5 right-0 text-[10px] font-mono text-[#627D98]">Day 30</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5: AI-POWERED INTELLIGENCE (WHITE THEME)
   "From detecting anomalies to understanding why."
   ═══════════════════════════════════════════════════════════════ */
function AiIntelligenceSection() {
  return (
    <section id="solutions" className="py-14 md:py-20 px-6 sm:px-10 border-b border-slate-200/80 bg-[#F6F9FC]">
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT: Capabilities list & explanation */}
        <div className="lg:col-span-6 flex flex-col text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] font-mono text-[11px] font-semibold tracking-wider uppercase mb-4 self-start">
            <Sparkles size={13} />
            AI Root Cause Engine
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0A2540] leading-tight font-display mb-6">
            From detecting anomalies to understanding why.
          </h2>

          <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed mb-8">
            Traditional monitoring alerts you when thresholds fail. BREXAL correlates time-series telemetry with code deployments, identifying the exact commit, database transaction, or external dependency causing the incident.
          </p>

          <div className="space-y-4 font-sans">
            {[
              { title: "AI anomaly detection", desc: "Learns seasonal traffic baselines without manual alert threshold tuning." },
              { title: "Automated root cause analysis", desc: "Traces error spikes to the underlying commit hash or database lock." },
              { title: "Predictive maintenance", desc: "Forecasts disk saturation and memory leaks days before customer impact." },
              { title: "Autonomous remediation with approval safeguards", desc: "Suggests tested patch diffs while keeping humans fully in control." },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[14.5px] font-bold text-[#0A2540]">{item.title}</h4>
                  <p className="text-[13px] text-[#425466] leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Anomaly to RCA Technical Breakdown in Stripe White Card */}
        <div className="lg:col-span-6 w-full">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_13px_27px_-5px_rgba(50,50,93,0.08),0_8px_16px_-8px_rgba(0,0,0,0.06)] flex flex-col gap-4">
            
            {/* Stage 1: Anomaly Detected */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mt-1 shrink-0" />
              <div className="flex-1 font-mono text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-amber-700 font-bold">STAGE 1: ANOMALY ISOLATED</span>
                  <span className="text-[#627D98]">T + 0.4s</span>
                </div>
                <p className="text-[#0A2540] mt-1 font-sans text-[13px] font-medium">
                  Unusual 8x latency jump on <code className="text-[#635BFF] bg-white px-1.5 py-0.5 rounded border border-amber-200">/v2/payment/charge</code> endpoint.
                </p>
              </div>
            </div>

            {/* Stage 2: Correlation with Deployment */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
              <GitCommit size={16} className="text-[#635BFF] mt-0.5 shrink-0" />
              <div className="flex-1 font-mono text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#635BFF] font-bold">STAGE 2: COMMIT CORRELATION</span>
                  <span className="text-[#627D98]">T + 1.2s</span>
                </div>
                <p className="text-[#0A2540] mt-1 font-sans text-[13px] font-medium">
                  Deployment <span className="font-mono text-[#635BFF] font-bold">#8f2a1b9</span> introduced unbuffered WebSocket reconnect loop.
                </p>
              </div>
            </div>

            {/* Stage 3: Suggested Remediation vs Executed Action */}
            <div className="p-5 rounded-xl bg-[#0A2540] text-slate-200 border border-slate-800 flex flex-col gap-3 font-mono text-[11px] shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-[#00D4FF] font-bold">STAGE 3: REMEDIATION DIFF</span>
                <span className="text-[#00D924] font-bold">CONFIDENCE: 98.4%</span>
              </div>

              <div className="leading-relaxed font-mono">
                <div className="text-slate-400">142 |  async def handle_connection(ws, client_id):</div>
                <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded my-1 border-l-2 border-red-500">
                  -     await ws.send_text(await get_unbounded_stream())
                </div>
                <div className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded my-1 border-l-2 border-emerald-500">
                  +     await ws.send_text(await get_bounded_stream(max_buf=512))
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                <span className="text-[10.5px] text-slate-400">Action requires on-call engineer approval</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#635BFF] text-white text-[10.5px] font-bold">
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
   SECTION 6: COMPLETE OBSERVABILITY STACK (WHITE CARDS)
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
    <section id="stack" className="py-14 md:py-20 px-6 sm:px-10 border-b border-slate-200/80 bg-white">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] font-mono text-[11px] font-semibold tracking-wider uppercase mb-4">
            Unified Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0A2540] leading-tight font-display mb-4">
            Every signal. One connected view.
          </h2>
          <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed">
            Eliminate fragmented observability silos. BREXAL delivers a single pipeline for telemetry ingestion, correlation, and resolution.
          </p>
        </div>

        {/* Structured Technical Capability Grid (Stripe White Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={i}
                className="p-7 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-[0_13px_27px_-5px_rgba(50,50,93,0.08),0_8px_16px_-8px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#F6F9FC] border border-slate-200/80 flex items-center justify-center text-[#635BFF] mb-5 group-hover:bg-[#635BFF] group-hover:text-white transition-all shadow-xs">
                    <Icon size={19} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A2540] mb-2 font-display">{cap.name}</h3>
                  <p className="text-[13.5px] text-[#425466] leading-relaxed font-sans">{cap.desc}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-[#627D98] group-hover:text-[#0A2540] transition-colors">
                  <span className="font-semibold">CAPABILITY // 0{i + 1}</span>
                  <ArrowRight size={14} className="text-[#635BFF] opacity-0 group-hover:opacity-100 transition-opacity" />
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
   SECTION 7: INCIDENT RESPONSE WORKFLOW (STRIPE TIMELINE)
   "Reduce the distance between detection and resolution."
   ═══════════════════════════════════════════════════════════════ */
function IncidentResponseSection() {
  const steps = [
    { stage: "01", name: "Detection", time: "00:00", detail: "eBPF probe detects memory leak anomaly on payment-worker-pool.", badge: "P0 CRITICAL", color: "text-red-600 bg-red-50 border-red-200" },
    { stage: "02", name: "Investigation", time: "+00:12s", detail: "Automated correlation links error burst to commit #8f2a1b9 in staging.", badge: "AUTO-LINKED", color: "text-[#635BFF] bg-blue-50 border-blue-200" },
    { stage: "03", name: "Root cause", time: "+00:38s", detail: "Unbounded buffer recursion isolated in websocket_handler.py line 142.", badge: "ISOLATED", color: "text-purple-700 bg-purple-50 border-purple-200" },
    { stage: "04", name: "Remediation", time: "+01:15s", detail: "Suggested patch generated and validated against staging test harness.", badge: "READY", color: "text-amber-700 bg-amber-50 border-amber-200" },
    { stage: "05", name: "Resolution", time: "+01:45s", detail: "Canary rollout completed with zero dropped customer transactions.", badge: "RESOLVED", color: "text-[#059669] bg-emerald-50 border-emerald-200" },
  ];

  return (
    <section id="incident-response" className="py-14 md:py-20 px-6 sm:px-10 border-b border-slate-200/80 bg-[#F6F9FC]">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#059669]/10 border border-[#059669]/20 text-[#059669] font-mono text-[11px] font-semibold tracking-wider uppercase mb-4">
            Autonomous MTTR Reduction
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0A2540] leading-tight font-display mb-4">
            Reduce the distance between detection and resolution.
          </h2>
          <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed">
            Every minute of downtime damages user trust. Follow the five-step autonomous incident lifecycle that compresses mean time to recovery from hours to under two minutes.
          </p>
        </div>

        {/* 5-Step Connected Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-md transition-all relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 font-mono text-[11.5px]">
                  <span className="text-[#635BFF] font-bold">{st.stage}</span>
                  <span className="text-[#627D98]">{st.time}</span>
                </div>
                <h4 className="text-base font-bold text-[#0A2540] mb-1 font-display">{st.name}</h4>
                <p className="text-[12.5px] text-[#425466] leading-relaxed font-sans">{st.detail}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${st.color}`}>
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
   SECTION 8: STRIPE-STYLE MINIMAL FINAL CTA
   "Your systems move fast. Your intelligence should move faster."
   ═══════════════════════════════════════════════════════════════ */
function FinalCtaSection() {
  return (
    <section className="py-14 md:py-20 px-6 sm:px-10 border-b border-slate-200/80 bg-white">
      <div className="max-w-[960px] mx-auto text-center flex flex-col items-center">
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0A2540] leading-tight font-display mb-5">
          Your systems move fast. Your intelligence should move faster.
        </h2>

        <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed max-w-2xl mb-8 font-sans">
          Bring monitoring, investigation, and incident response into one connected platform built for modern engineering teams.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#635BFF] text-white text-[14.5px] font-semibold hover:bg-[#5349e0] transition-all shadow-[0_4px_14px_rgba(99,91,255,0.3)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.4)] focus:ring-2 focus:ring-[#635BFF]"
          >
            Request early access
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white border border-slate-200/90 text-[#0A2540] text-[14.5px] font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            Sign in to console
          </Link>
        </div>

        <span className="font-mono text-[11px] text-[#627D98] mt-7">
          SOC-2 Type II Certified • Zero Telemetry Lock-in • OpenTelemetry Native
        </span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 9: STRIPE-GRADE CLEAN FOOTER
   ═══════════════════════════════════════════════════════════════ */
function EnterpriseFooter() {
  return (
    <footer className="py-12 px-6 sm:px-10 bg-[#F6F9FC] text-[#425466] font-sans">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-16 border-b border-slate-200/80">
          
          {/* Brand Info (Col 1) */}
          <div className="col-span-2 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#0A2540] flex items-center justify-center text-white">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <Logo className="h-4 text-[#0A2540]" />
            </div>
            <p className="text-[13px] text-[#425466] leading-relaxed max-w-sm mb-4">
              BREXAL is an AI-powered observability and incident response platform developed by Bharti Nexus Technologies.
            </p>
            <div className="font-mono text-[11px] text-[#627D98]">
              Intelligence, engineered to move.
            </div>
          </div>

          {/* Platform Capabilities (Col 2) */}
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <span className="font-mono text-[11px] font-bold text-[#0A2540] uppercase tracking-wider mb-2">
              Platform
            </span>
            <Link href="#platform" className="hover:text-[#0A2540] transition-colors">APM & Metrics</Link>
            <Link href="#platform" className="hover:text-[#0A2540] transition-colors">Infrastructure</Link>
            <Link href="#platform" className="hover:text-[#0A2540] transition-colors">Distributed Tracing</Link>
            <Link href="#solutions" className="hover:text-[#0A2540] transition-colors">AI Copilot</Link>
            <Link href="#features" className="hover:text-[#0A2540] transition-colors">Incident Manager</Link>
          </div>

          {/* Solutions (Col 3) */}
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <span className="font-mono text-[11px] font-bold text-[#0A2540] uppercase tracking-wider mb-2">
              Solutions
            </span>
            <span className="hover:text-[#0A2540] transition-colors cursor-pointer">DevOps Teams</span>
            <span className="hover:text-[#0A2540] transition-colors cursor-pointer">Site Reliability Engineers</span>
            <span className="hover:text-[#0A2540] transition-colors cursor-pointer">Platform Engineering</span>
            <span className="hover:text-[#0A2540] transition-colors cursor-pointer">Cloud Migration</span>
          </div>

          {/* Resources & Legal (Col 4) */}
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <span className="font-mono text-[11px] font-bold text-[#0A2540] uppercase tracking-wider mb-2">
              Resources
            </span>
            <span className="hover:text-[#0A2540] transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-[#0A2540] transition-colors cursor-pointer">API Reference</span>
            <span className="hover:text-[#0A2540] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#0A2540] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#0A2540] transition-colors cursor-pointer">Security & SOC-2</span>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#627D98] gap-4">
          <div>
            © {new Date().getFullYear()} Bharti Nexus Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#059669] font-medium">Server status: Nominal</span>
            <span>•</span>
            <span>Edge latency: 1.4ms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE EXPORT (STRIPE-GRADE WHITE THEME)
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0A2540] selection:bg-[#635BFF]/15 selection:text-[#635BFF]">
      {/* 1. Minimal Navigation */}
      <Navigation />

      <main>
        {/* 2. Stripe-inspired Hero with 3D WebGL Colored Wave Mesh */}
        <HeroSection />

        {/* 2.2. Shifted Live Telemetry & Service Mesh Cockpit (Pixel-perfect Dark Card) */}
        <TelemetryCockpitSection />

        {/* 2.5. Stripe-Style Modular Product Showcase (Mobile Terminal + Browser + Usage Meter + 30-Day Histogram) */}
        <StripeProductShowcase />

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
