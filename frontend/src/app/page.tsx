"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Command,
  Cpu,
  Database,
  ExternalLink,
  Flame,
  GitBranch,
  GitCommit,
  Globe,
  HardDrive,
  Layers,
  Lock,
  Network,
  Play,
  Radio,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/Logo";

/* ═══════════════════════════════════════════════════════════════
   1. NAVIGATION (CRISP BLACK TYPOGRAPHY)
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] py-3"
          : "bg-white/70 backdrop-blur-sm border-b border-black/5 py-4.5"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
          <div className="flex flex-col">
            <Logo className="h-5.5 text-black group-hover:text-[#635BFF] transition-colors" />
            <span className="text-[9.5px] font-mono tracking-widest text-black uppercase mt-0.5 font-bold">
              Bharti Nexus Technologies
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Black text) */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-bold text-black">
          <Link href="#architecture" className="hover:text-[#635BFF] transition-colors">
            Architecture
          </Link>
          <Link href="#interactive-simulator" className="hover:text-[#635BFF] transition-colors">
            AI Simulator
          </Link>
          <Link href="#telemetry-matrix" className="hover:text-[#635BFF] transition-colors">
            Telemetry Mesh
          </Link>
          <Link href="#comparison" className="hover:text-[#635BFF] transition-colors">
            Benchmark
          </Link>
          <Link href="#pricing" className="hover:text-[#635BFF] transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-black hover:bg-slate-100 transition-colors"
          >
            <Command size={13} className="text-black" />
            <span>Live Console</span>
          </Link>
          <Link
            href="/login"
            className="text-[13.5px] font-bold text-black hover:text-[#635BFF] px-2.5 py-1.5 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4.5 py-2 rounded-lg bg-black text-white text-[13px] font-bold hover:bg-[#635BFF] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5"
          >
            <span>Get Started Free</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO INSTANT SIGNUP CARD (EXACT REPLICA FROM USER MOCKUP)
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
    <div className="w-full max-w-[480px] bg-transparent p-0 flex flex-col text-left">
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <label className="block text-[15px] sm:text-base font-bold text-black mb-2">
          Work email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full px-5 py-3.5 sm:py-4 rounded-2xl border-2 border-black/25 bg-white text-black placeholder:text-slate-400 text-base font-medium outline-none focus:border-[#1868DB] focus:ring-4 focus:ring-[#1868DB]/15 transition-all shadow-xs"
        />
        <p className="text-[13px] sm:text-[13.5px] text-black/80 mt-2.5 mb-1 font-medium leading-relaxed">
          Use a work email to find teammates and get access to BREXAL AI
        </p>

        <button
          type="submit"
          className="w-full mt-4 py-3.5 sm:py-4 rounded-full bg-[#1868DB] hover:bg-[#1356ba] text-white font-bold text-base sm:text-[16.5px] tracking-wide transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
        >
          Sign up
        </button>
      </form>

      <div className="relative flex py-4 sm:py-5 items-center">
        <div className="flex-grow border-t border-black/15"></div>
        <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-black/60 font-bold">
          Or continue with
        </span>
        <div className="flex-grow border-t border-black/15"></div>
      </div>

      <button
        type="button"
        onClick={() => { window.location.href = "/register"; }}
        className="w-full py-3.5 rounded-full border-2 border-black/25 bg-white hover:bg-slate-50 text-black font-bold text-base flex items-center justify-center gap-3 transition-all shadow-2xs hover:border-black/50 hover:-translate-y-0.5"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
   2. HERO WITH INTERACTIVE COCKPIT & INSTANT SIGNUP
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const [activeConsoleTab, setActiveConsoleTab] = useState<"topology" | "traces" | "anomaly">("topology");
  const [activeNode, setActiveNode] = useState("api-gateway");

  return (
    <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 px-6 sm:px-10 overflow-hidden bg-white border-b border-black/10">
      
      <div className="max-w-[1320px] mx-auto text-left flex flex-col items-start relative z-10">
        
        {/* HERO 2-COLUMN GRID: Left Hero Copy + Right Instant Signup Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full mb-8">
          
          {/* Left Column (7 cols): Hero Headline & Description */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Product Release Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-transparent border border-black/15 shadow-none mb-4 hover:border-black/30 transition-colors cursor-pointer self-start">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <Logo className="h-3.5 text-black" />
              <span className="text-[12px] font-mono font-bold text-black tracking-tight">
                3.0 AUTONOMOUS OBSERVABILITY MESH
              </span>
              <span className="text-black/30">•</span>
              <span className="text-[12px] font-bold text-[#635BFF] flex items-center gap-0.5">
                Explore Engine <ChevronRight size={13} />
              </span>
            </div>

            {/* Master Grand Headline (Black Text - Sleek Reduced Size) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-black max-w-2xl leading-[1.1] mb-3.5 text-left">
              Autonomous Telemetry & <br className="hidden sm:inline" />
              <span className="text-black underline decoration-[#635BFF] decoration-4 underline-offset-8">
                AI Incident Intelligence
              </span>
            </h1>

            {/* Supporting Narrative (Sleek Reduced Size) */}
            <p className="text-base sm:text-[17px] text-black font-medium max-w-xl leading-relaxed mb-5 text-left">
              Synthesize distributed microservices, traces, and kernel eBPF signals into one real-time operational mesh. Detect anomalies and resolve outages before customer impact.
            </p>

            {/* Dual Primary Call-to-Actions (Left Aligned) */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-3 w-full sm:w-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto px-6.5 py-3 rounded-xl bg-black text-white text-[13.5px] font-bold hover:bg-[#635BFF] transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Start Free in Sandbox</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border-2 border-black text-black text-[13.5px] font-bold hover:bg-slate-50 transition-all shadow-xs flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Play size={13} className="fill-black text-black" />
                <span>Interactive Console Tour</span>
              </Link>
            </div>
          </div>

          {/* Right Column (5 cols): The Instant Signup Card in the Empty Space */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <HeroSignupCard />
          </div>

        </div>

        {/* Live Operational Metrics Ribbon (Black text) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-3xl w-full pt-4 pb-6 border-t border-black/10 mb-8 text-left font-mono">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-black">0.84ms</div>
            <div className="text-[10.5px] text-black font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Mesh P99 Latency
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-black">99.992%</div>
            <div className="text-[10.5px] text-black font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Platform SLA
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-black">&lt; 90 sec</div>
            <div className="text-[10.5px] text-black font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" /> Automated MTTR
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-black">0%</div>
            <div className="text-[10.5px] text-black font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bytecode Overhead
            </div>
          </div>
        </div>

        {/* ─── THE INTERACTIVE HERO COCKPIT MOCKUP ─── */}
        <div className="w-full max-w-5xl rounded-2xl bg-white border-2 border-black/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden text-left">
          
          {/* Top Browser / Cockpit Chrome */}
          <div className="px-5 py-3.5 bg-slate-50 border-b border-black/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-[11.5px] font-bold text-black">
                https://console.bhartinexus.com/live-mesh
              </span>
            </div>

            {/* Interactive Mode Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-black/15 shadow-xs text-[11.5px] font-mono">
              <button
                onClick={() => setActiveConsoleTab("topology")}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  activeConsoleTab === "topology" ? "bg-black text-white shadow-xs" : "text-black hover:bg-slate-100"
                }`}
              >
                Service Topology
              </button>
              <button
                onClick={() => setActiveConsoleTab("traces")}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  activeConsoleTab === "traces" ? "bg-black text-white shadow-xs" : "text-black hover:bg-slate-100"
                }`}
              >
                Trace Spans
              </button>
              <button
                onClick={() => setActiveConsoleTab("anomaly")}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  activeConsoleTab === "anomaly" ? "bg-black text-white shadow-xs" : "text-black hover:bg-slate-100"
                }`}
              >
                AI Anomaly Radar
              </button>
            </div>
          </div>

          {/* Cockpit Content Area */}
          <div className="p-6 sm:p-8 bg-white min-h-[380px]">
            
            {/* VIEW 1: INTERACTIVE SERVICE TOPOLOGY GRAPH */}
            {activeConsoleTab === "topology" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-black/10 gap-2">
                  <div>
                    <h3 className="font-bold text-[16px] text-black">Production Microservice Mesh</h3>
                    <p className="text-[12px] text-black font-mono font-medium">Live traffic routes, mTLS state, and distributed nodes</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-mono font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 14/14 NODES NOMINAL
                  </span>
                </div>

                {/* Node Cards Interactive Flow */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { id: "api-gateway", name: "Cloudflare Envoy", type: "EDGE INGRESS", latency: "0.8ms", status: "HEALTHY", rps: "48.2k/s", color: "border-black/20 bg-blue-50/20" },
                    { id: "auth-service", name: "Auth & IAM Cluster", type: "SECURITY", latency: "2.4ms", status: "HEALTHY", rps: "12.4k/s", color: "border-black/20 bg-purple-50/20" },
                    { id: "payment-worker", name: "Billing Engine", type: "WORKER", latency: "14.2ms", status: "HEALTHY", rps: "3.1k/s", color: "border-black/20 bg-emerald-50/20" },
                    { id: "postgres-mesh", name: "PostgreSQL Primary", type: "DATASTORE", latency: "0.4ms", status: "HEALTHY", rps: "22.8k/s", color: "border-black/20 bg-cyan-50/20" },
                  ].map((node) => (
                    <div
                      key={node.id}
                      onClick={() => setActiveNode(node.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer shadow-xs ${
                        activeNode === node.id
                          ? "border-black bg-slate-50 ring-2 ring-black/10"
                          : `${node.color} hover:border-black/50`
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10.5px] font-mono font-bold text-black uppercase tracking-wider mb-2">
                        <span>{node.type}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <div className="font-extrabold text-[15px] text-black mb-1">{node.name}</div>
                      <div className="flex items-center justify-between text-[12px] font-mono mt-3 pt-2 border-t border-black/10">
                        <span className="text-black font-bold">{node.latency}</span>
                        <span className="text-[#635BFF] font-extrabold">{node.rps}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Node Drilldown */}
                <div className="p-4 rounded-xl bg-slate-50 border border-black/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[12px]">
                  <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-black" />
                    <div>
                      <span className="text-black font-semibold">Selected Node Inspection: </span>
                      <strong className="text-black uppercase font-black">{activeNode}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[11.5px] text-black font-bold">
                    <span>eBPF probes: <strong className="text-emerald-700">Active</strong></span>
                    <span>mTLS: <strong className="text-emerald-700">TLS v1.3 Verified</strong></span>
                    <span>Replicas: <strong className="text-black">8 / 8 Active</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: TRACE SPANS WATERFALL */}
            {activeConsoleTab === "traces" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-black/10 font-mono text-[12px]">
                  <span className="font-extrabold text-black">Trace ID: 0x8f2a1b9c44e0</span>
                  <span className="text-black font-semibold">Total duration: <strong className="text-black font-black">18.4ms</strong></span>
                </div>

                <div className="space-y-2.5 font-mono text-[12px]">
                  {[
                    { name: "HTTP POST /v1/checkout", duration: "18.4ms", width: "100%", offset: "0%", color: "bg-black" },
                    { name: "auth.verify_bearer_token", duration: "2.1ms", width: "12%", offset: "2%", color: "bg-emerald-600" },
                    { name: "redis.get(session_token)", duration: "0.3ms", width: "4%", offset: "14%", color: "bg-cyan-600" },
                    { name: "stripe.charge_intent", duration: "14.2ms", width: "76%", offset: "18%", color: "bg-amber-600" },
                    { name: "sql.insert_audit_record", duration: "1.2ms", width: "8%", offset: "92%", color: "bg-purple-600" },
                  ].map((span, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-black/15 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-1.5 font-bold text-black">
                        <span>{span.name}</span>
                        <span className="text-black font-black">{span.duration}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${span.color}`}
                          style={{ width: span.width, marginLeft: span.offset }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 3: AI ANOMALY RADAR */}
            {activeConsoleTab === "anomaly" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 flex items-start gap-3.5">
                  <ShieldCheck size={20} className="text-emerald-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-[14px] text-black font-sans">
                      Autonomous Intelligence: Baseline Nominal
                    </h4>
                    <p className="text-[13px] text-black font-sans mt-0.5 leading-relaxed font-medium">
                      AI Root-Cause models evaluated 42,000 requests in the last 60 seconds across US, EU, and APAC clusters. Zero latency regression anomalies detected.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[12px]">
                  <div className="p-3.5 rounded-xl border border-black/15 bg-slate-50">
                    <span className="text-[10.5px] text-black uppercase font-bold block mb-1">Seasonal Baseline</span>
                    <span className="text-lg font-black text-black">48,200 req/s</span>
                    <span className="text-[10.5px] text-emerald-800 font-bold block mt-1">Normal Friday Peak</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-black/15 bg-slate-50">
                    <span className="text-[10.5px] text-black uppercase font-bold block mb-1">Memory Fragmentation</span>
                    <span className="text-lg font-black text-black">1.2%</span>
                    <span className="text-[10.5px] text-emerald-800 font-bold block mt-1">Well below 15% threshold</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-black/15 bg-slate-50">
                    <span className="text-[10.5px] text-black uppercase font-bold block mb-1">Autonomous Safeguard</span>
                    <span className="text-lg font-black text-black">Armed</span>
                    <span className="text-[10.5px] text-black font-bold block mt-1">Auto-scale buffer ready</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Cockpit Status Bar */}
          <div className="px-6 py-3 bg-slate-50 border-t border-black/10 flex items-center justify-between text-[11.5px] font-mono text-black font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Real-time WebSocket link active</span>
            </div>
            <Link href="/dashboard" className="text-black underline decoration-2 hover:text-[#635BFF] font-bold flex items-center gap-1">
              <span>Open Full SRE Dashboard</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. ENTERPRISE ECOSYSTEM LOGO CLOUD (BLACK TEXT)
   ═══════════════════════════════════════════════════════════════ */
function EcosystemSection() {
  const stacks = [
    { name: "Kubernetes", tag: "Container Orchestration" },
    { name: "Docker", tag: "Runtime" },
    { name: "Amazon AWS", tag: "EKS & Lambda" },
    { name: "Google Cloud", tag: "GKE Telemetry" },
    { name: "Cloudflare", tag: "Workers & CDN" },
    { name: "PostgreSQL", tag: "Relational Mesh" },
    { name: "Redis", tag: "Cache & Queue" },
    { name: "OpenTelemetry", tag: "Standardized Traces" },
  ];

  return (
    <section className="py-10 px-6 sm:px-10 border-b border-black/10 bg-white">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-[12px] font-mono uppercase tracking-wider text-black font-black shrink-0 text-center md:text-left">
          Seamless Zero-Config Ingestion:
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4 font-mono text-[12.5px]">
          {stacks.map((stack, i) => (
            <div
              key={i}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-black/20 shadow-xs flex items-center gap-2 hover:border-black hover:shadow-sm transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              <span className="font-bold text-black">{stack.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. THREE CORE PILLARS (ALL BLACK TEXT)
   ═══════════════════════════════════════════════════════════════ */
function ArchitecturePillarsSection() {
  const pillars = [
    {
      title: "Real-Time Distributed Telemetry",
      desc: "Capture microsecond-level request spans, database query locks, and network saturation directly from kernel socket inspection.",
      icon: Network,
      highlight: "eBPF + OpenTelemetry Native",
      stat: "14.2M spans/sec"
    },
    {
      title: "Autonomous AI Incident Isolation",
      desc: "Correlate error bursts with recent Git commits, configuration changes, or cloud outages to identify exact root cause in seconds.",
      icon: Sparkles,
      highlight: "Deep Correlation Engine",
      stat: "< 90s MTTR"
    },
    {
      title: "Zero-Overhead Kernel Telemetry",
      desc: "Deploy without changing a single line of your code. Instant auto-discovery of Kubernetes pods, ingress routes, and replica pools.",
      icon: Cpu,
      highlight: "Zero Bytecode Overhead",
      stat: "0.0% CPU Penalty"
    }
  ];

  return (
    <section id="architecture" className="py-12 md:py-16 px-6 sm:px-10 border-b border-black/10 bg-white">
      <div className="max-w-[1320px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-black border border-black/15 font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
            Unified Core Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight mb-3">
            Built for mission-critical reliability at enterprise scale.
          </h2>
          <p className="text-sm sm:text-base text-black font-medium leading-relaxed">
            Eliminate noisy alerts and fragmented dashboards. BREXAL continuously fuses logs, metrics, and traces into a single operational reality.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border-2 border-black/15 hover:border-black hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border-2 border-black/20 flex items-center justify-center text-black mb-6 shadow-xs group-hover:bg-black group-hover:text-white transition-all">
                    <Icon size={22} />
                  </div>
                  <div className="text-[11px] font-mono font-bold text-black uppercase tracking-wider mb-2">
                    {pil.highlight}
                  </div>
                  <h3 className="text-xl font-extrabold text-black mb-3 leading-snug">
                    {pil.title}
                  </h3>
                  <p className="text-[14px] text-black font-medium leading-relaxed">
                    {pil.desc}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-black/10 flex items-center justify-between font-mono text-[12px]">
                  <span className="text-black font-semibold">Benchmark:</span>
                  <span className="font-black text-black">{pil.stat}</span>
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
   5. INTERACTIVE INCIDENT SIMULATOR (BLACK TEXT)
   ═══════════════════════════════════════════════════════════════ */
function InteractiveSimulatorSection() {
  const [simStep, setSimStep] = useState<1 | 2 | 3 | 4>(1);

  const steps = [
    { step: 1, title: "1. Normal State", badge: "HEALTHY", desc: "All 14 ingress nodes routing 48.2k requests/sec at 0.84ms latency." },
    { step: 2, title: "2. Outage Injected", badge: "P0 ANOMALY", desc: "Database connection pool exhausted. Latency spikes to 148ms." },
    { step: 3, title: "3. AI Correlation", badge: "COMMIT DETECTED", desc: "BREXAL correlates spike to Git commit #8f2a1b9 in staging." },
    { step: 4, title: "4. Auto Mitigation", badge: "RESOLVED", desc: "Autonomous pool recycling and bounded buffer applied in 42 seconds." }
  ];

  return (
    <section id="interactive-simulator" className="py-12 md:py-16 px-6 sm:px-10 border-b border-black/10 bg-white">
      <div className="max-w-[1320px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-black border border-black/15 font-mono text-[11px] font-bold uppercase tracking-wider mb-2.5">
            Interactive AI Lab
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight mb-2.5">
            Test the Autonomous Incident Engine live.
          </h2>
          <p className="text-sm sm:text-base text-black font-medium leading-relaxed">
            Click through the 4 phases below to see how BREXAL detects, isolates, and mitigates an outage in under 90 seconds.
          </p>
        </div>

        {/* Phase Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {steps.map((st) => (
            <button
              key={st.step}
              onClick={() => setSimStep(st.step as any)}
              className={`p-4 rounded-xl text-left border-2 transition-all shadow-xs ${
                simStep === st.step
                  ? "bg-white border-black ring-2 ring-black/15"
                  : "bg-white border-black/15 hover:border-black/40"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                <span className="text-black">PHASE 0{st.step}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  st.step === 2 ? "bg-red-100 text-red-800" : st.step === 3 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {st.badge}
                </span>
              </div>
              <div className="font-extrabold text-[14px] text-black">{st.title}</div>
            </button>
          ))}
        </div>

        {/* Live Simulation Display Card */}
        <div className="rounded-2xl bg-white border-2 border-black/15 p-6 sm:p-8 shadow-sm">
          {simStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-mono text-[12px] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                STATE: ALL SYSTEMS OPERATIONAL
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[12px]">
                <div className="p-4 rounded-xl bg-slate-50 border border-black/15">
                  <span className="text-black font-bold">INGRESS P99</span>
                  <div className="text-2xl font-black text-black mt-1">0.84ms</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-black/15">
                  <span className="text-black font-bold">ERROR RATE</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">0.000%</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-black/15">
                  <span className="text-black font-bold">ACTIVE PODS</span>
                  <div className="text-2xl font-black text-black mt-1">14 / 14</div>
                </div>
              </div>
              <p className="text-black font-medium text-sm">
                Synthetic health probes across 8 global edge nodes confirm zero latency anomalies.
              </p>
            </div>
          )}

          {simStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-700 font-mono text-[12px] font-bold">
                <AlertTriangle size={16} />
                ALERT: CRITICAL THRESHOLD BREACH ON PAYMENT-WORKER-POOL
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[12px]">
                <div className="p-4 rounded-xl bg-red-50 border border-red-300">
                  <span className="text-red-900 font-bold">INGRESS P99</span>
                  <div className="text-2xl font-black text-red-700 mt-1">148.2ms</div>
                </div>
                <div className="p-4 rounded-xl bg-red-50 border border-red-300">
                  <span className="text-red-900 font-bold">ERROR RATE</span>
                  <div className="text-2xl font-black text-red-700 mt-1">3.42%</div>
                </div>
                <div className="p-4 rounded-xl bg-red-50 border border-red-300">
                  <span className="text-red-900 font-bold">QUEUE DEPTH</span>
                  <div className="text-2xl font-black text-red-700 mt-1">1,842 queued</div>
                </div>
              </div>
              <p className="text-black font-medium text-sm">
                Connection pool reached 50/50 capacity. Database lock timeouts cascading to checkout endpoints.
              </p>
            </div>
          )}

          {simStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-black font-mono text-[12px] font-bold">
                <GitCommit size={16} className="text-[#635BFF]" />
                AI CORRELATION: SOURCE COMMIT IDENTIFIED
              </div>
              <div className="p-4 rounded-xl bg-[#0A2540] text-slate-100 font-mono text-[12px] space-y-2">
                <div className="text-emerald-400 font-bold">Root Cause Analysis Output:</div>
                <div className="text-white">Commit <span className="text-[#635BFF] font-bold">#8f2a1b9</span> (merged 14m ago by dev-ops-bot) introduced unbounded WebSocket buffer in <span className="text-amber-300">websocket_handler.py:142</span>.</div>
                <div className="text-slate-300 text-[11px]">Correlation Confidence: 99.4% • Diagnostic Duration: 1.2s</div>
              </div>
            </div>
          )}

          {simStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-mono text-[12px] font-bold">
                <CheckCircle2 size={16} />
                MITIGATION COMPLETE: LATENCY NORMALIZED
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[12px]">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300">
                  <span className="text-emerald-900 font-bold">INGRESS P99</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">0.86ms</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300">
                  <span className="text-emerald-900 font-bold">RESOLVED IN</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">42 seconds</div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300">
                  <span className="text-emerald-900 font-bold">CUSTOMERS AFFECTED</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">0 dropped</div>
                </div>
              </div>
              <p className="text-black font-medium text-sm">
                Canary mitigation patch verified against staging test suite with human authorization safeguards intact.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. HEAD-TO-HEAD COMPARISON MATRIX (BLACK TEXT)
   ═══════════════════════════════════════════════════════════════ */
function ComparisonSection() {
  const points = [
    { feature: "Data Ingestion Model", traditional: "Heavy bytecode agent hooks & memory bloat", brexal: "Zero-overhead kernel eBPF socket monitoring" },
    { feature: "Incident Root Cause", traditional: "Manual log grepping & 2-hour war rooms", brexal: "Autonomous Git commit correlation in < 90s" },
    { feature: "Multi-Region Latency", traditional: "Sampled aggregates every 60 seconds", brexal: "Microsecond live streaming p99 matrix" },
    { feature: "Alert Noise", traditional: "Dozens of false positive PagerDuty alerts", brexal: "Intelligent anomaly clustering & suppression" },
    { feature: "Pricing Transparency", traditional: "Punitive gigabyte indexing fees", brexal: "Predictable flat compute-based pricing" },
  ];

  return (
    <section id="comparison" className="py-12 md:py-16 px-6 sm:px-10 border-b border-black/10 bg-white">
      <div className="max-w-[1320px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-black border border-black/15 font-mono text-[11px] font-bold uppercase tracking-wider mb-2.5">
            Benchmark Analysis
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight mb-2.5">
            Why high-growth engineering teams choose BREXAL.
          </h2>
          <p className="text-sm sm:text-base text-black font-medium leading-relaxed">
            A direct side-by-side comparison between legacy monitoring tools and BREXAL's autonomous observability mesh.
          </p>
        </div>

        {/* Table Comparison */}
        <div className="rounded-2xl border-2 border-black/15 overflow-hidden shadow-xs">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-black/10 text-black font-mono text-[12px] uppercase">
                <th className="p-4 sm:p-5 font-black">Capabilities</th>
                <th className="p-4 sm:p-5 font-bold text-black/60">Traditional APM Tools</th>
                <th className="p-4 sm:p-5 font-bold text-black bg-slate-100">
                  <div className="flex items-center gap-2">
                    <Logo className="h-3.5 text-black" />
                    <span>Autonomous Mesh</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {points.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-black">{p.feature}</td>
                  <td className="p-4 sm:p-5 text-black font-medium flex items-center gap-2">
                    <span className="text-red-600 font-black">✕</span> {p.traditional}
                  </td>
                  <td className="p-4 sm:p-5 font-extrabold text-black bg-slate-100/60">
                    <span className="text-emerald-700 font-black mr-2">✓</span> {p.brexal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. TRANSPARENT PRICING TIERS (BLACK TEXT)
   ═══════════════════════════════════════════════════════════════ */
function PricingSection() {
  const tiers = [
    {
      name: "Developer Sandbox",
      price: "$0",
      period: "forever free",
      desc: "Ideal for individual developers, staging prototypes, and side projects.",
      features: ["Up to 3 microservices", "24-hour trace retention", "eBPF kernel metrics", "Community Discord support"],
      cta: "Start Free",
      highlight: false
    },
    {
      name: "Scale Team",
      price: "$89",
      period: "per cluster / mo",
      desc: "For fast-moving engineering teams managing production microservices.",
      features: ["Unlimited microservices", "30-day trace retention", "AI Root-Cause engine", "Automated Git commit correlation", "Slack & PagerDuty webhooks"],
      cta: "Deploy Production",
      highlight: true
    },
    {
      name: "Enterprise Cloud",
      price: "Custom",
      period: "annual contract",
      desc: "Mission-critical infrastructure with dedicated SLAs and custom compliance.",
      features: ["Custom data retention", "On-prem & hybrid cloud agents", "Dedicated SRE support engineer", "SOC-2 Type II audit reports", "99.99% uptime guarantee"],
      cta: "Contact Enterprise",
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-12 md:py-16 px-6 sm:px-10 border-b border-black/10 bg-white">
      <div className="max-w-[1320px] mx-auto text-center flex flex-col items-center">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-black border border-black/15 font-mono text-[11px] font-bold uppercase tracking-wider mb-2.5">
            Transparent Tiers
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight mb-2.5">
            Simple, predictable pricing. No per-GB surprise fees.
          </h2>
          <p className="text-sm sm:text-base text-black font-medium leading-relaxed">
            Scale your observability without worrying about explosive log ingestion penalties.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl bg-white border-2 transition-all flex flex-col justify-between shadow-xs ${
                t.highlight
                  ? "border-black shadow-lg -translate-y-2"
                  : "border-black/15 hover:border-black"
              }`}
            >
              <div>
                {t.highlight && (
                  <span className="inline-block px-3 py-1 rounded-full bg-black text-white text-[10.5px] font-mono font-bold tracking-wider uppercase mb-4">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-black text-black mb-1">{t.name}</h3>
                <p className="text-xs text-black font-semibold mb-6">{t.desc}</p>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-4xl font-black text-black font-mono">{t.price}</span>
                  <span className="text-xs text-black font-bold font-mono">{t.period}</span>
                </div>

                <div className="space-y-3 pt-6 border-t border-black/10 text-[13.5px] text-black font-medium">
                  {t.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check size={16} className="text-black font-bold shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/register"
                  className={`w-full py-3 rounded-xl text-center text-sm font-bold transition-all block ${
                    t.highlight
                      ? "bg-black text-white hover:bg-[#635BFF] shadow-sm"
                      : "bg-slate-100 text-black border border-black hover:bg-black hover:text-white"
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
   8. FINAL CALL TO ACTION (BLACK TEXT)
   ═══════════════════════════════════════════════════════════════ */
function FinalCtaSection() {
  return (
    <section className="py-12 md:py-16 px-6 sm:px-10 border-b border-black/10 bg-white">
      <div className="max-w-[960px] mx-auto text-center flex flex-col items-center">
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-black leading-tight mb-3">
          See outages before your customers do.
        </h2>

        <p className="text-base sm:text-lg text-black font-medium max-w-xl leading-relaxed mb-6">
          Join leading platform teams who trust BREXAL for real-time observability, kernel-level telemetry, and automated MTTR reduction.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black text-white text-[15px] font-bold hover:bg-[#635BFF] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Deploy Free Sandbox Cluster</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border-2 border-black text-black text-[15px] font-bold hover:bg-slate-50 transition-colors shadow-xs"
          >
            Live Sandboxed Console
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-[12px] font-mono text-black font-bold">
          <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-emerald-700" /> SOC-2 Type II Certified</span>
          <span className="flex items-center gap-1.5"><Zap size={15} className="text-black" /> 5-Minute Zero-Downtime Setup</span>
          <span className="flex items-center gap-1.5"><Lock size={15} className="text-black" /> Non-Custodial Telemetry</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. CLEAN ENTERPRISE FOOTER (BLACK TEXT)
   ═══════════════════════════════════════════════════════════════ */
function EnterpriseFooter() {
  return (
    <footer className="py-10 px-6 sm:px-10 bg-white border-t border-black/10 text-black font-sans">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-black/10">
          
          {/* Brand Info */}
          <div className="col-span-2 flex flex-col items-start">
            <div className="flex flex-col mb-4">
              <Logo className="h-5.5 text-black mb-1" />
              <span className="text-[9.5px] font-mono tracking-widest text-black uppercase font-bold">
                Bharti Nexus Technologies
              </span>
            </div>
            <p className="text-[13.5px] text-black font-medium leading-relaxed max-w-sm mb-4">
              Autonomous telemetry mesh and AI incident intelligence engineered by Bharti Nexus Technologies.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational • 99.992% SLA</span>
            </div>
          </div>

          {/* Links 1 */}
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <span className="font-mono text-[11.5px] font-black text-black uppercase tracking-wider mb-2">
              Architecture
            </span>
            <Link href="#architecture" className="text-black font-semibold hover:text-[#635BFF] transition-colors">Distributed Traces</Link>
            <Link href="#architecture" className="text-black font-semibold hover:text-[#635BFF] transition-colors">Kernel eBPF Probes</Link>
            <Link href="#interactive-simulator" className="text-black font-semibold hover:text-[#635BFF] transition-colors">AI Anomaly Engine</Link>
            <Link href="#comparison" className="text-black font-semibold hover:text-[#635BFF] transition-colors">Latency Benchmarks</Link>
          </div>

          {/* Links 2 */}
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <span className="font-mono text-[11.5px] font-black text-black uppercase tracking-wider mb-2">
              Solutions
            </span>
            <Link href="/dashboard" className="text-black font-semibold hover:text-[#635BFF] transition-colors">Kubernetes Monitoring</Link>
            <Link href="/dashboard" className="text-black font-semibold hover:text-[#635BFF] transition-colors">Cloud Ingress & CDN</Link>
            <Link href="/dashboard" className="text-black font-semibold hover:text-[#635BFF] transition-colors">PostgreSQL Mesh</Link>
            <Link href="/teams" className="text-black font-semibold hover:text-[#635BFF] transition-colors">Engineering Team</Link>
          </div>

          {/* Links 3 */}
          <div className="flex flex-col gap-2.5 text-[13.5px]">
            <span className="font-mono text-[11.5px] font-black text-black uppercase tracking-wider mb-2">
              Resources
            </span>
            <Link href="/login" className="text-black font-semibold hover:text-[#635BFF] transition-colors">Documentation</Link>
            <Link href="/login" className="text-black font-semibold hover:text-[#635BFF] transition-colors">API Keys</Link>
            <Link href="/dashboard" className="text-black font-semibold hover:text-[#635BFF] transition-colors">Live Status</Link>
            <Link href="/settings" className="text-black font-semibold hover:text-[#635BFF] transition-colors">Console Settings</Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-black font-mono font-bold">
          <div>
            © 2026 Bharti Nexus Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:underline cursor-pointer">Security Safeguards</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPLETE PAGE COMPOSITION
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white">
      <Navigation />
      <main>
        <HeroSection />
        <EcosystemSection />
        <ArchitecturePillarsSection />
        <InteractiveSimulatorSection />
        <ComparisonSection />
        <PricingSection />
        <FinalCtaSection />
      </main>
      <EnterpriseFooter />
    </div>
  );
}
