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
  ChevronDown
} from "lucide-react";
import { Logo } from "@/components/Logo";

/* ═══════════════════════════════════════════════════════════════
   1. STRIPE-STYLE NAVIGATION BAR
   ═══════════════════════════════════════════════════════════════ */
function StripeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group focus:outline-none shrink-0">
          <div className="flex flex-col">
            <Logo className="h-5 text-[#0A2540] group-hover:text-[#635BFF] transition-colors" />
            <span className="text-[9px] font-mono tracking-widest text-[#425466] uppercase mt-0.5 font-bold">
              Bharti Nexus Technologies
            </span>
          </div>
        </Link>

        {/* Stripe Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-7 text-[14.5px] font-semibold text-[#0A2540]">
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

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-[14px] font-bold text-[#0A2540] hover:text-[#635BFF] px-3 py-1.5 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="group px-4.5 py-2.5 rounded-full bg-[#0A2540] hover:bg-[#635BFF] text-white text-[13.5px] font-bold transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5"
          >
            <span>Start now</span>
            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. STRIPE HERO SECTION WITH ICONIC ANGLED GRADIENT CANVAS
   ═══════════════════════════════════════════════════════════════ */
function StripeHeroSection() {
  const [activeConsoleTab, setActiveConsoleTab] = useState<"topology" | "traces" | "anomaly">("topology");
  const [activeNode, setActiveNode] = useState("api-gateway");
  const [anomalyResolved, setAnomalyResolved] = useState(false);

  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 px-6 sm:px-10 overflow-hidden bg-white">
      
      {/* ── THE SIGNATURE STRIPE ANGLED GRADIENT MESH CANVAS ── */}
      <div 
        className="absolute top-0 left-0 right-0 h-[680px] pointer-events-none -z-10 overflow-hidden"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 75%, 0 100%)"
        }}
      >
        {/* Multicolored Gradient Mesh Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#80E9FF]/40 via-[#7A73FF]/30 to-[#FF5894]/25 blur-3xl opacity-80" />
        <div className="absolute -top-24 -left-20 w-[600px] h-[500px] bg-[#635BFF]/30 rounded-full blur-[100px]" />
        <div className="absolute top-10 right-0 w-[550px] h-[450px] bg-[#FF725E]/25 rounded-full blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 w-[650px] h-[350px] bg-[#00D4FF]/25 rounded-full blur-[90px]" />
        
        {/* Subtle Diagonal Scanlines */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(135deg, #0A2540 10%, transparent 10%, transparent 50%, #0A2540 50%, #0A2540 60%, transparent 60%, transparent 100%)",
            backgroundSize: "28px 28px"
          }}
        />
      </div>

      <div className="max-w-[1320px] mx-auto text-left relative z-10">
        
        {/* TWO-COLUMN STRIPE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column (7 cols): Stripe Editorial Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Pill Eyebrow */}
            <Link 
              href="#interactive-simulator" 
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6 hover:border-[#635BFF]/40 transition-colors"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#635BFF] animate-pulse" />
              <span className="text-[12.5px] font-bold text-[#0A2540]">
                Now in GA: Autonomous eBPF Telemetry Mesh 3.0
              </span>
              <ChevronRight size={13} className="text-[#635BFF] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Grand Headline (Stripe Typographic System) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-[-0.04em] text-[#0A2540] leading-[1.05] mb-6 text-left">
              Autonomous telemetry <br className="hidden sm:inline" />
              infrastructure for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#635BFF] via-[#0073E6] to-[#00D4FF] bg-clip-text text-transparent">
                modern cloud systems.
              </span>
            </h1>

            {/* Supporting Subhead */}
            <p className="text-lg sm:text-[20px] text-[#425466] font-normal max-w-xl leading-relaxed mb-8 text-left">
              Millions of requests across Kubernetes, microservices, and databases are monitored in real time with BREXAL. Synthesize logs, kernel traces, and metrics into self-healing incident intelligence.
            </p>

            {/* Stripe Dual Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <Link
                href="/register"
                className="group px-7 py-3.5 rounded-full bg-[#0A2540] text-white text-[15px] font-bold hover:bg-[#635BFF] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Start now</span>
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="group px-7 py-3.5 rounded-full bg-white/80 hover:bg-white border border-slate-300/80 text-[#0A2540] text-[15px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <span>Explore Live Console</span>
                <ChevronRight size={16} className="text-[#635BFF] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Reassurance Micro-Metrics */}
            <div className="flex flex-wrap items-center gap-6 text-[12.5px] font-semibold text-[#425466]">
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-emerald-600 font-bold" /> Free developer tier
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-emerald-600 font-bold" /> Zero bytecode injection
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-emerald-600 font-bold" /> SOC-2 Type II Certified
              </span>
            </div>

          </div>

          {/* Right Column (5 cols): The Signature Stripe Interactive Device */}
          <div className="lg:col-span-5 relative w-full">
            
            {/* Ambient Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#635BFF]/20 to-[#00D4FF]/20 rounded-3xl blur-2xl opacity-70 -z-10" />

            {/* Main Interactive Mockup Device Card */}
            <div className="w-full bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-[0_24px_64px_rgba(10,37,64,0.12)] overflow-hidden text-left">
              
              {/* Device Window Chrome */}
              <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[11px] font-bold text-[#425466]">
                    live-mesh.bhartinexus.io
                  </span>
                </div>

                {/* Live Pill Indicator */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>STREAMING</span>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex border-b border-slate-200/80 bg-slate-100/50 text-[12px] font-mono font-bold">
                <button
                  onClick={() => setActiveConsoleTab("topology")}
                  className={`flex-1 py-2.5 px-3 transition-colors ${
                    activeConsoleTab === "topology"
                      ? "bg-white text-[#635BFF] border-b-2 border-[#635BFF]"
                      : "text-[#425466] hover:text-[#0A2540]"
                  }`}
                >
                  Topology
                </button>
                <button
                  onClick={() => setActiveConsoleTab("traces")}
                  className={`flex-1 py-2.5 px-3 transition-colors ${
                    activeConsoleTab === "traces"
                      ? "bg-white text-[#635BFF] border-b-2 border-[#635BFF]"
                      : "text-[#425466] hover:text-[#0A2540]"
                  }`}
                >
                  Traces
                </button>
                <button
                  onClick={() => setActiveConsoleTab("anomaly")}
                  className={`flex-1 py-2.5 px-3 transition-colors ${
                    activeConsoleTab === "anomaly"
                      ? "bg-white text-[#635BFF] border-b-2 border-[#635BFF]"
                      : "text-[#425466] hover:text-[#0A2540]"
                  }`}
                >
                  AI Radar
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 min-h-[300px]">
                
                {activeConsoleTab === "topology" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-[#425466] pb-2 border-b border-slate-100">
                      <span>42.8k req/sec • Ingress p99: 0.84ms</span>
                      <span className="text-emerald-700 font-bold">14/14 Nominal</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                      {[
                        { id: "api-gateway", name: "Cloudflare Ingress", type: "EDGE", p99: "0.8ms" },
                        { id: "auth-cluster", name: "Auth & IAM Mesh", type: "SECURITY", p99: "2.1ms" },
                        { id: "payment-worker", name: "Billing Engine", type: "SERVICE", p99: "12.4ms" },
                        { id: "postgres-primary", name: "PostgreSQL Primary", type: "DATA", p99: "0.4ms" },
                      ].map((node) => (
                        <div
                          key={node.id}
                          onClick={() => setActiveNode(node.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            activeNode === node.id
                              ? "border-[#635BFF] bg-[#635BFF]/5 ring-1 ring-[#635BFF]"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-[#425466] uppercase mb-1">
                            <span>{node.type}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </div>
                          <div className="font-bold text-[#0A2540] truncate">{node.name}</div>
                          <div className="text-[11px] font-bold text-[#635BFF] mt-1">{node.p99}</div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11.5px] font-mono text-[#425466]">
                      <span className="font-bold text-[#0A2540]">Node Inspection: </span>
                      <span className="text-[#635BFF] font-bold uppercase">{activeNode}</span>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-600">
                        <span>eBPF: Active</span>
                        <span>mTLS: TLS 1.3</span>
                        <span>Replicas: 8/8</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeConsoleTab === "traces" && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[#425466]">
                      <span>Trace ID: 0x9f2a1b4e</span>
                      <span className="font-bold text-[#0A2540]">Total: 18.2ms</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: "POST /v1/checkout", duration: "18.2ms", width: "100%", color: "bg-[#0A2540]" },
                        { name: "auth.verify_bearer", duration: "2.1ms", width: "18%", color: "bg-[#635BFF]" },
                        { name: "redis.get(session)", duration: "0.3ms", width: "8%", color: "bg-[#00D4FF]" },
                        { name: "stripe.charge_intent", duration: "14.1ms", width: "74%", color: "bg-emerald-600" },
                      ].map((span, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                          <div className="flex items-center justify-between font-bold text-[#0A2540] text-[11px] mb-1">
                            <span>{span.name}</span>
                            <span>{span.duration}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${span.color}`} style={{ width: span.width }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeConsoleTab === "anomaly" && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>Baseline Nominal: 0 Critical Outages</span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed text-emerald-800">
                        AI correlation monitored 48,000 transactions across 14 clusters in last 60s.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#425466]">Simulation Test:</span>
                        <button
                          onClick={() => setAnomalyResolved(!anomalyResolved)}
                          className="px-2.5 py-1 rounded-md bg-[#635BFF] text-white font-bold text-[10.5px] hover:bg-[#5046e5] transition-colors"
                        >
                          {anomalyResolved ? "Reset State" : "Simulate Outage"}
                        </button>
                      </div>
                      <div className="text-[11px] font-bold text-[#0A2540]">
                        {anomalyResolved ? (
                          <span className="text-emerald-700">✓ Resolved in 38s via canary pool recycle</span>
                        ) : (
                          <span className="text-amber-700">Ready to inject connection pool anomaly</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Card Footer Link */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
                <span className="text-[#425466] font-medium">WebSocket link live</span>
                <Link href="/dashboard" className="text-[#635BFF] font-bold flex items-center gap-1 hover:underline">
                  <span>Open Full Dashboard</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

            </div>

            {/* Floating Stripe-Style Accent Badge */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-4 items-center gap-3.5 font-mono text-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-[13px] font-black text-[#0A2540]">0.84ms P99 Latency</div>
                <div className="text-[11px] text-[#425466]">0.0% Bytecode CPU penalty</div>
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
    <section className="py-14 border-t border-b border-slate-200/80 bg-[#FAFBFD]">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
        <p className="text-center font-mono text-[11px] font-bold uppercase tracking-widest text-[#425466] mb-8">
          Powering mission-critical platforms and distributed engineering teams
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 hover:opacity-100 transition-opacity">
          {logos.map((lg, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-default">
              <span className="w-2 h-2 rounded-full bg-[#0A2540]/30 group-hover:bg-[#635BFF] transition-colors" />
              <span className="font-mono text-sm sm:text-base font-extrabold text-[#0A2540] tracking-wider uppercase">
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
   4. STRIPE BENTO GRID: "A FULLY INTEGRATED SUITE"
   ═══════════════════════════════════════════════════════════════ */
function StripeBentoGridSection() {
  return (
    <section id="architecture" className="py-24 md:py-32 px-6 sm:px-10 bg-white border-b border-slate-200/80">
      <div className="max-w-[1320px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <div className="text-[12px] font-mono font-bold text-[#635BFF] uppercase tracking-widest mb-3">
            Unified Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#0A2540] leading-tight mb-4">
            A fully integrated suite of telemetry products.
          </h2>
          <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed">
            We bring together everything that's required to observe, trace, and stabilize high-throughput cloud software.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Bento Card 1 (Large 7 cols) */}
          <div className="md:col-span-7 p-8 sm:p-10 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-[#635BFF] mb-6">
                <Cpu size={24} />
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#635BFF] mb-2">
                Kernel Telemetry // 0.0% CPU Penalty
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mb-3">
                Zero-overhead kernel eBPF socket inspection
              </h3>
              <p className="text-[#425466] text-base leading-relaxed max-w-lg mb-6">
                Deploy without changing code or rebuilding containers. BREXAL attaches lightweight eBPF probes directly into Linux kernel sockets to measure TCP drops, TLS negotiation latencies, and SQL connection pools in microsecond resolution.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between font-mono text-xs">
              <span className="text-[#425466] font-semibold">Throughput capacity:</span>
              <span className="font-extrabold text-[#0A2540] text-sm">14.2M spans/second per cluster</span>
            </div>
          </div>

          {/* Bento Card 2 (5 cols) */}
          <div className="md:col-span-5 p-8 sm:p-10 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-[#00D4FF] mb-6">
                <Sparkles size={24} />
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#635BFF] mb-2">
                Automated Root-Cause
              </div>
              <h3 className="text-2xl font-extrabold text-[#0A2540] mb-3">
                Autonomous AI incident correlation
              </h3>
              <p className="text-[#425466] text-sm leading-relaxed mb-6">
                No more 2-hour war rooms. When an anomaly triggers, BREXAL analyzes git history, deployment manifests, and cloud provider API status to pinpoint the exact commit causing the regression.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between font-mono text-xs">
              <span className="text-[#425466] font-semibold">MTTR Reduction:</span>
              <span className="font-extrabold text-emerald-700 text-sm">&lt; 90 seconds</span>
            </div>
          </div>

          {/* Bento Card 3 (5 cols) */}
          <div className="md:col-span-5 p-8 sm:p-10 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-[#FF5894] mb-6">
                <Network size={24} />
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#635BFF] mb-2">
                OpenTelemetry Native
              </div>
              <h3 className="text-2xl font-extrabold text-[#0A2540] mb-3">
                Distributed trace waterfalls & graphs
              </h3>
              <p className="text-[#425466] text-sm leading-relaxed mb-6">
                Capture complete request flows across distributed microservices, Redis queues, and edge workers with open standards and zero vendor lock-in.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between font-mono text-xs">
              <span className="text-[#425466] font-semibold">Standard Support:</span>
              <span className="font-extrabold text-[#0A2540] text-sm">OTel v1.28 Native</span>
            </div>
          </div>

          {/* Bento Card 4 (Large 7 cols) */}
          <div className="md:col-span-7 p-8 sm:p-10 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-emerald-600 mb-6">
                <ShieldCheck size={24} />
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#635BFF] mb-2">
                Self-Healing Infrastructure
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] mb-3">
                Automated mitigations with human safeguards
              </h3>
              <p className="text-[#425466] text-base leading-relaxed max-w-lg mb-6">
                Connect your CI/CD and Kubernetes orchestrator. When database pool saturation or memory leak cascades occur, BREXAL can automatically trigger canary rollbacks, connection recycling, or traffic sheds with strict RBAC approval logs.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between font-mono text-xs">
              <span className="text-[#425466] font-semibold">Safety:</span>
              <span className="font-extrabold text-[#0A2540] text-sm">Non-Custodial RBAC Controls</span>
            </div>
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
    <section id="developer-sandbox" className="py-24 md:py-32 px-6 sm:px-10 bg-[#0A2540] text-white">
      <div className="max-w-[1320px] mx-auto text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-[12px] font-mono font-bold text-[#00D4FF] uppercase tracking-widest mb-3">
            Designed for Developers
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-white leading-tight mb-4">
            The world’s most powerful and developer-friendly telemetry engine.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            We obsess over developer experience. Instrument your entire distributed system in two lines of code without rebuilding Docker containers.
          </p>
        </div>

        {/* Split Sandbox Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Code Snippet Panel */}
          <div className="lg:col-span-7 bg-[#051527] rounded-3xl border border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Language Switcher Tabs */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 font-mono text-xs">
                <div className="flex items-center gap-2">
                  {(["curl", "python", "go", "helm"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all uppercase ${
                        activeLang === lang
                          ? "bg-[#635BFF] text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  {copied ? <CheckCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Code Pre Block */}
              <pre className="font-mono text-[13px] sm:text-[14px] leading-relaxed text-slate-200 overflow-x-auto whitespace-pre">
                <code>{codeSnippets[activeLang]}</code>
              </pre>
            </div>

            <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Client SDK v3.2.0 • Zero dependencies</span>
              <Link href="/dashboard" className="text-[#00D4FF] hover:underline font-bold flex items-center gap-1">
                <span>View Full API Reference</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right: Simulated Real-Time Response Payload */}
          <div className="lg:col-span-5 bg-[#051527] rounded-3xl border border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between shadow-2xl font-mono text-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white uppercase">Live Ingestion Response</span>
                </div>
                <span className="text-emerald-400 font-bold">200 OK (0.84ms)</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 text-[12px] text-slate-300 space-y-2 overflow-x-auto">
                <div className="text-emerald-400">&#123;</div>
                <div className="pl-4 text-slate-300">&quot;status&quot;: &quot;MESH_ACTIVE&quot;,</div>
                <div className="pl-4 text-slate-300">&quot;cluster_id&quot;: &quot;k8s-us-east-prod&quot;,</div>
                <div className="pl-4 text-slate-300">&quot;ebpf_socket_probes&quot;: 14,</div>
                <div className="pl-4 text-slate-300">&quot;p99_latency_ms&quot;: 0.84,</div>
                <div className="pl-4 text-slate-300">&quot;anomaly_detection_model&quot;: &quot;brexal-deep-correlation-v3&quot;,</div>
                <div className="pl-4 text-slate-300">&quot;auto_mitigation_ready&quot;: true</div>
                <div className="text-emerald-400">&#125;</div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 mt-6">
              <div className="flex items-center justify-between text-slate-400 text-[11.5px]">
                <span>Kernel eBPF Socket Filter: OK</span>
                <span className="text-emerald-400 font-bold">0.0% CPU overhead</span>
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
    <section className="py-24 md:py-32 px-6 sm:px-10 bg-white border-b border-slate-200/80">
      <div className="max-w-[1320px] mx-auto text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-[12px] font-mono font-bold text-[#635BFF] uppercase tracking-widest mb-3">
            Global Scale
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#0A2540] leading-tight mb-4">
            The backbone for internet-scale infrastructure.
          </h2>
          <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed">
            High-growth startups and global enterprises rely on Bharti Nexus to ensure 24/7 service availability.
          </p>
        </div>

        {/* 4 Stat Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-slate-200">
          {stats.map((st, i) => (
            <div key={i} className="flex flex-col text-left">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#0A2540] tracking-tight mb-2 font-mono">
                {st.number}
              </div>
              <div className="text-sm font-bold text-[#635BFF] uppercase tracking-wider mb-2 font-mono">
                {st.label}
              </div>
              <p className="text-[#425466] text-sm leading-relaxed">
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
    <section id="pricing" className="py-24 md:py-32 px-6 sm:px-10 bg-[#FAFBFD] border-b border-slate-200/80">
      <div className="max-w-[1320px] mx-auto text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-[12px] font-mono font-bold text-[#635BFF] uppercase tracking-widest mb-3">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#0A2540] leading-tight mb-4">
            Simple, predictable pricing. No surprise per-GB penalties.
          </h2>
          <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed">
            Scale your telemetry infrastructure without worrying about explosive log ingestion fees.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`p-8 sm:p-10 rounded-3xl bg-white border transition-all flex flex-col justify-between ${
                t.highlight
                  ? "border-[#635BFF] shadow-[0_16px_48px_rgba(99,91,255,0.12)] -translate-y-2 relative"
                  : "border-slate-200/90 shadow-xs hover:border-slate-300"
              }`}
            >
              <div>
                {t.highlight && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#635BFF] text-white text-[11px] font-mono font-bold tracking-wider uppercase mb-4">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-2xl font-extrabold text-[#0A2540] mb-2">{t.name}</h3>
                <p className="text-sm text-[#425466] mb-6 leading-relaxed">{t.desc}</p>
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-5xl font-black text-[#0A2540] font-mono tracking-tight">{t.price}</span>
                  <span className="text-xs text-[#425466] font-bold font-mono">{t.period}</span>
                </div>

                <div className="space-y-3.5 pt-6 border-t border-slate-100 text-sm text-[#0A2540] font-medium">
                  {t.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check size={16} className="text-[#635BFF] font-bold shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/register"
                  className={`w-full py-3.5 rounded-full text-center text-sm font-bold transition-all block ${
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
    <section className="py-24 md:py-32 px-6 sm:px-10 bg-white border-b border-slate-200/80">
      <div className="max-w-[1320px] mx-auto text-left flex flex-col items-start">
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#0A2540] leading-tight mb-4">
          Ready to get started?
        </h2>

        <p className="text-lg sm:text-xl text-[#425466] font-normal max-w-xl leading-relaxed mb-8">
          Explore our live sandboxed console or talk with our solutions architects to instrument your clusters today.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
          <Link
            href="/register"
            className="group px-7 py-3.5 rounded-full bg-[#0A2540] text-white text-[15px] font-bold hover:bg-[#635BFF] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Start now</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="group px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-[#0A2540] text-[15px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <span>Contact sales</span>
            <ChevronRight size={16} className="text-[#635BFF] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[12.5px] font-mono text-[#425466] font-semibold pt-6 border-t border-slate-200 w-full">
          <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-emerald-600" /> SOC-2 Type II Certified</span>
          <span className="flex items-center gap-1.5"><Zap size={15} className="text-[#635BFF]" /> 5-Minute Zero-Downtime Deployment</span>
          <span className="flex items-center gap-1.5"><Lock size={15} className="text-[#0A2540]" /> Non-Custodial eBPF Telemetry</span>
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
    <footer className="py-16 px-6 sm:px-10 bg-[#FAFBFD] text-[#0A2540] font-sans">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-16 border-b border-slate-200">
          
          {/* Brand & Country Selector */}
          <div className="col-span-2 flex flex-col items-start text-left">
            <div className="flex flex-col mb-4">
              <Logo className="h-5.5 text-[#0A2540] mb-1" />
              <span className="text-[9.5px] font-mono tracking-widest text-[#425466] uppercase font-bold">
                Bharti Nexus Technologies
              </span>
            </div>
            <p className="text-[13.5px] text-[#425466] font-medium leading-relaxed max-w-sm mb-6">
              Autonomous telemetry infrastructure and AI incident intelligence engineered by Bharti Nexus Technologies.
            </p>
            
            {/* India Region Selector (Stripe.com/in style) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-[#0A2540]">
              <Globe size={14} className="text-[#635BFF]" />
              <span>India (English)</span>
            </div>
          </div>

          {/* Column 1: Products */}
          <div className="flex flex-col gap-2.5 text-[13.5px] text-left">
            <span className="font-mono text-[11.5px] font-black text-[#0A2540] uppercase tracking-wider mb-2">
              Products
            </span>
            <Link href="#architecture" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">eBPF Telemetry Mesh</Link>
            <Link href="#interactive-simulator" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">AI Incident Engine</Link>
            <Link href="#developer-sandbox" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Distributed Tracing</Link>
            <Link href="#pricing" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Pricing</Link>
          </div>

          {/* Column 2: Solutions */}
          <div className="flex flex-col gap-2.5 text-[13.5px] text-left">
            <span className="font-mono text-[11.5px] font-black text-[#0A2540] uppercase tracking-wider mb-2">
              Solutions
            </span>
            <Link href="/dashboard" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Kubernetes Mesh</Link>
            <Link href="/dashboard" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Cloud Ingress & CDN</Link>
            <Link href="/dashboard" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">PostgreSQL Monitoring</Link>
            <Link href="/teams" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Engineering Team</Link>
          </div>

          {/* Column 3: Developers */}
          <div className="flex flex-col gap-2.5 text-[13.5px] text-left">
            <span className="font-mono text-[11.5px] font-black text-[#0A2540] uppercase tracking-wider mb-2">
              Developers
            </span>
            <Link href="#developer-sandbox" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Documentation</Link>
            <Link href="#developer-sandbox" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">API Reference</Link>
            <Link href="/roadmap" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Product Roadmap</Link>
            <Link href="/logs" className="text-[#425466] font-semibold hover:text-[#635BFF] transition-colors">Audit & System Logs</Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#425466] gap-4">
          <div>
            © 2026 Bharti Nexus Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
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
        <StripeBentoGridSection />
        <StripeDeveloperSandboxSection />
        <StripeGlobalScaleSection />
        <StripePricingSection />
        <StripeFinalCtaSection />
      </main>
      <StripeFooter />
    </div>
  );
}
