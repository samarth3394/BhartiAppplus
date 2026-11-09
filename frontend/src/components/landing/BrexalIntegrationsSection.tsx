"use client";

import React, { useState } from "react";
import { Brain, Zap, Activity, CheckCircle2, ShieldCheck } from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  category: string;
  logo: string;
  badge: string;
  angle: number; // in degrees
  radius: number; // in pixels
  color: string;
  metrics: {
    primary: string;
    primaryLabel: string;
    secondary: string;
    secondaryLabel: string;
    latency: string;
    status: string;
  };
  details: string;
}

const NODES_DATA: NodeData[] = [
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "Container Mesh",
    logo: "/logos/kubernetes.svg",
    badge: "1-Click Helm",
    angle: -90,
    radius: 190,
    color: "#326CE5",
    metrics: {
      primary: "184 Pods",
      primaryLabel: "Auto-Probed",
      secondary: "0 Drops",
      secondaryLabel: "Network Health",
      latency: "0.14ms",
      status: "Cluster Healthy"
    },
    details: "eBPF kernel probes hook container network namespaces with zero CPU and zero bytecode penalty."
  },
  {
    id: "redis",
    name: "Redis",
    category: "In-Memory Cache",
    logo: "/logos/redis.svg",
    badge: "0% Overhead",
    angle: -30,
    radius: 190,
    color: "#DC382D",
    metrics: {
      primary: "99.8%",
      primaryLabel: "Cache Hit Rate",
      secondary: "84k ops/s",
      secondaryLabel: "Throughput",
      latency: "0.12ms",
      status: "Zero Evictions"
    },
    details: "Automatic key eviction tracking, hit-rate profiling, and slow command audit at socket layer."
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "Relational DB",
    logo: "/logos/postgresql.svg",
    badge: "Slow Query AI",
    angle: 30,
    radius: 190,
    color: "#4169E1",
    metrics: {
      primary: "0 Locks",
      primaryLabel: "Wait Lock Free",
      secondary: "32 / 32",
      secondaryLabel: "Active Pool",
      latency: "0.84ms",
      status: "Query Optimal"
    },
    details: "eBPF intercepts query plans and wait lock contention without installing database extensions."
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    category: "Event Streaming",
    logo: "/logos/kafka.svg",
    badge: "Lag Sentry",
    angle: 90,
    radius: 190,
    color: "#231F20",
    metrics: {
      primary: "0 ms",
      primaryLabel: "Consumer Lag",
      secondary: "140k msg/s",
      secondaryLabel: "Ingestion Rate",
      latency: "0.45ms",
      status: "Balanced Partitions"
    },
    details: "Zero-latency consumer offset inspection, partition skew detection, and rebalance mitigations."
  },
  {
    id: "docker",
    name: "Docker",
    category: "Container Engine",
    logo: "/logos/docker.svg",
    badge: "Host Daemon",
    angle: 150,
    radius: 190,
    color: "#2496ED",
    metrics: {
      primary: "Host Daemon",
      primaryLabel: "Kernel Linked",
      secondary: "< 40 MB",
      secondaryLabel: "RAM Footprint",
      latency: "0.08ms",
      status: "Socket Hooked"
    },
    details: "Attaches directly to host kernel socket tables, monitoring bridge networks and container lifecycles."
  },
  {
    id: "python",
    name: "Python",
    category: "FastAPI / Django",
    logo: "/logos/python.svg",
    badge: "Auto-Instrument",
    angle: -150,
    radius: 190,
    color: "#3776AB",
    metrics: {
      primary: "Async IO",
      primaryLabel: "Event Loop",
      secondary: "0.0% CPU",
      secondaryLabel: "Overhead",
      latency: "0.32ms",
      status: "Auto-Instrumented"
    },
    details: "Automatic ASGI & WSGI request span correlation, exception tracking, and unhandled promise monitoring."
  },
  {
    id: "aws",
    name: "AWS Cloud",
    category: "Cloud Provider",
    logo: "/logos/aws.svg",
    badge: "Zero Egress Tax",
    angle: -120,
    radius: 290,
    color: "#FF9900",
    metrics: {
      primary: "EKS & Lambda",
      primaryLabel: "Serverless Mesh",
      secondary: "$0 Egress",
      secondaryLabel: "VPC Peering",
      latency: "Line-Rate",
      status: "CloudWatch Free"
    },
    details: "Native telemetry extraction inside your AWS VPC, eliminating costly CloudWatch custom metric bills."
  },
  {
    id: "gcp",
    name: "Google Cloud",
    category: "GCP & GKE",
    logo: "/logos/gcp.svg",
    badge: "GKE Native",
    angle: -60,
    radius: 290,
    color: "#4285F4",
    metrics: {
      primary: "GKE Autopilot",
      primaryLabel: "Container Mesh",
      secondary: "Native",
      secondaryLabel: "Cloud Run",
      latency: "0.19ms",
      status: "VPC Linked"
    },
    details: "Zero-configuration GKE and Cloud Run telemetry with Google Cloud VPC peering support."
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    category: "AKS & App Services",
    logo: "/logos/azure.svg",
    badge: "AKS Ready",
    angle: 0,
    radius: 290,
    color: "#0078D4",
    metrics: {
      primary: "AKS Cluster",
      primaryLabel: "Pod Telemetry",
      secondary: "Event Hub",
      secondaryLabel: "Stream Latency",
      latency: "0.22ms",
      status: "Azure Verified"
    },
    details: "End-to-end tracing for AKS clusters, Azure App Services, and Event Hub throughput."
  },
  {
    id: "go",
    name: "Go (Golang)",
    category: "Systems Runtime",
    logo: "/logos/go.svg",
    badge: "0% CPU Penalty",
    angle: 60,
    radius: 290,
    color: "#00ADD8",
    metrics: {
      primary: "4,120",
      primaryLabel: "Goroutines",
      secondary: "0 Deadlocks",
      secondaryLabel: "Thread Safety",
      latency: "0.05ms",
      status: "Zero GC Pause"
    },
    details: "Attaches to compiled ELF symbols via eBPF uprobes. No imports, no code edits, and zero binary overhead."
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Express / Nest",
    logo: "/logos/nodejs.svg",
    badge: "V8 Profiler",
    angle: 120,
    radius: 290,
    color: "#339933",
    metrics: {
      primary: "V8 Engine",
      primaryLabel: "Event Loop Lag",
      secondary: "< 1.2ms",
      secondaryLabel: "Task Delay",
      latency: "0.22ms",
      status: "Handle Monitoring"
    },
    details: "Continuous event loop starvation checks and asynchronous microtask pipeline profiling."
  },
  {
    id: "opentelemetry",
    name: "OpenTelemetry",
    category: "CNCF Standard",
    logo: "/logos/opentelemetry.svg",
    badge: "Zero Lock-In",
    angle: 180,
    radius: 290,
    color: "#4A154B",
    metrics: {
      primary: "OTLP Native",
      primaryLabel: "gRPC & HTTP",
      secondary: "PromQL",
      secondaryLabel: "Dashboard Drop-In",
      latency: "Sub-ms",
      status: "Zero Lock-In"
    },
    details: "100% compliant with CNCF standards. Ingests and exports standard OTLP metrics and PromQL queries."
  }
];

export function BrexalIntegrationsSection() {
  const [activeNode, setActiveNode] = useState<NodeData>(NODES_DATA[0]);

  // Center coordinates for SVG 2D layout that maps onto 3D tilted plane
  const cx = 450;
  const cy = 350;

  return (
    <section id="integrations" className="py-16 sm:py-20 md:py-26 px-4 sm:px-10 bg-[#FAFCFF] border-b border-slate-200/80 font-sans relative overflow-hidden">
      
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[750px] bg-gradient-to-r from-blue-100/40 via-sky-50/30 to-indigo-50/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto text-left relative z-10">
        
        {/* ── SECTION HEADER ── */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-6 h-[1.5px] bg-[#2563EB]" />
            <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#2563EB] uppercase tracking-widest">
              AUTONOMOUS 3D ECOSYSTEM MESH
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[44px] font-extrabold tracking-[-0.035em] text-[#0A2540] leading-[1.15] mb-3">
            One Brain. Every Layer of Your Cloud.
          </h2>
          <p className="text-sm sm:text-base text-[#425466] leading-relaxed max-w-2xl font-normal">
            BREXAL's Neural Engine hooks directly into Linux kernel sockets. It autonomously discovers, traces, and correlates all microservices, databases, and message brokers with zero code changes.
          </p>
        </div>

        {/* ── QUICK 1-CLICK SELECTOR PILLS (MOBILE & TABLET) ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {NODES_DATA.map((node) => {
            const isSelected = activeNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNode(node)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#0A2540] text-white shadow-sm ring-2 ring-blue-500/25"
                    : "bg-white text-[#425466] border border-slate-200/90 hover:border-blue-400 hover:text-[#0A2540]"
                }`}
              >
                <img src={node.logo} alt={node.name} className="w-3.5 h-3.5 object-contain" />
                <span>{node.name}</span>
              </button>
            );
          })}
        </div>

        {/* ── 3D PERSPECTIVE NEURAL MATRIX CANVAS (UNCLUTTERED, NO FLOATING OVERLAY) ── */}
        <div className="hidden lg:block relative w-full h-[650px] rounded-3xl bg-white border border-slate-200/90 shadow-[0_8px_36px_rgba(10,37,64,0.06)] overflow-hidden mb-6 sm:mb-8 [perspective:1400px]">
          
          {/* Subtle high-tech isometric grid floor */}
          <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

          {/* 3D Tilted Orbital Plane Container */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center [transform-style:preserve-3d] [transform:rotateX(42deg)_rotateZ(-10deg)]">
            
            {/* SVG Glowing Neural Synaptic Lines & Orbit Rings */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              viewBox="0 0 900 700"
            >
              <defs>
                {/* Electric Blue Neural Glow Filter */}
                <filter id="neuralGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="neuralCoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Orbit Ring 1 (Inner Glowing Dashed Orbit) */}
              <circle
                cx={cx}
                cy={cy}
                r={190}
                fill="none"
                stroke="#60A5FA"
                strokeWidth="1.5"
                strokeOpacity="0.45"
                strokeDasharray="6 6"
              />

              {/* Orbit Ring 2 (Outer Glowing Dashed Orbit) */}
              <circle
                cx={cx}
                cy={cy}
                r={290}
                fill="none"
                stroke="#93C5FD"
                strokeWidth="1.5"
                strokeOpacity="0.35"
                strokeDasharray="8 8"
              />

              {/* ── VIVID NEURAL CONNECTION SYNAPSES (ALL 12 VISIBLE & GLOWING) ── */}
              {NODES_DATA.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const nx = cx + node.radius * Math.cos(rad);
                const ny = cy + node.radius * Math.sin(rad);
                const isSelected = activeNode.id === node.id;

                return (
                  <g key={`neural-${node.id}`}>
                    {/* Background glow halo line */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={nx}
                      y2={ny}
                      stroke={isSelected ? "#2563EB" : "#3B82F6"}
                      strokeWidth={isSelected ? "5" : "2.5"}
                      strokeOpacity={isSelected ? "0.75" : "0.35"}
                      filter="url(#neuralGlow)"
                    />

                    {/* Sharp foreground synaptic laser beam */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={nx}
                      y2={ny}
                      stroke={isSelected ? "#00F0FF" : "#60A5FA"}
                      strokeWidth={isSelected ? "3" : "1.8"}
                      strokeOpacity={isSelected ? "1" : "0.7"}
                      strokeDasharray={isSelected ? "8 6" : "5 5"}
                      className={isSelected ? "animate-synapse-fast" : "animate-synapse"}
                    />

                    {/* Traveling energy photon particle */}
                    <circle
                      cx={(cx + nx) / 2}
                      cy={(cy + ny) / 2}
                      r={isSelected ? "4.5" : "3"}
                      fill={isSelected ? "#00F0FF" : "#38BDF8"}
                      filter="url(#neuralGlow)"
                      className="animate-pulse"
                    />
                  </g>
                );
              })}
            </svg>

            {/* ── 3D ELEVATED CENTRAL NEURAL CORE ── */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center [transform-style:preserve-3d] pointer-events-none"
              style={{ left: `${(cx / 900) * 100}%`, top: `${(cy / 700) * 100}%` }}
            >
              {/* Pulsing 3D floor shadow */}
              <div className="absolute w-44 h-44 rounded-full bg-blue-600/20 blur-2xl [transform:translateZ(-20px)]" />
              
              {/* Outer holographic ripple wave */}
              <div className="absolute w-36 h-36 rounded-full border border-blue-400/50 animate-ping [transform:translateZ(10px)]" />
              
              {/* Center 3D elevated brain pedestal */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#0A2540] p-1 shadow-[0_0_40px_rgba(37,99,235,0.6)] [transform:translateZ(35px)] flex items-center justify-center">
                <div className="w-full h-full rounded-[22px] bg-[#0A2540] border border-blue-400/50 flex flex-col items-center justify-center p-2 text-white">
                  <Brain size={30} className="text-cyan-400 mb-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-blue-200">
                    BREXAL AI
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CORE ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* ── SATELLITE NODES WITH 100% ORIGINAL OFFICIAL LOGOS ── */}
            {NODES_DATA.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const nx = cx + node.radius * Math.cos(rad);
              const ny = cy + node.radius * Math.sin(rad);
              const isSelected = activeNode.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  onMouseEnter={() => setActiveNode(node)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "z-40 [transform:translateZ(45px)]"
                      : "hover:[transform:translateZ(25px)]"
                  }`}
                  style={{
                    left: `${(nx / 900) * 100}%`,
                    top: `${(ny / 700) * 100}%`
                  }}
                >
                  {/* Counter-rotate in 3D so the badge stays upright and faces forward */}
                  <div className="[transform:rotateZ(10deg)_rotateX(-42deg)]">
                    <div
                      className={`p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 flex items-center gap-2.5 shadow-md ${
                        isSelected
                          ? "bg-white border-[#2563EB] ring-4 ring-blue-500/30 shadow-2xl scale-110 -translate-y-2"
                          : "bg-white/95 border-slate-200/90 hover:border-slate-300 hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      {/* 100% REAL OFFICIAL BRAND LOGO */}
                      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/70 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                        <img
                          src={node.logo}
                          alt={node.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="text-left pr-1">
                        <div className="text-xs font-black text-[#0A2540] leading-tight">
                          {node.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono font-medium">
                          {node.category}
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          {/* ── TOP-LEFT LIVE STATUS BADGE ── */}
          <div className="absolute top-6 left-6 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-mono font-bold text-[#0A2540] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Autonomous 3D Socket Mesh Active</span>
          </div>

        </div>

        {/* ── ACTIVE SERVICE LIVE TELEMETRY PANEL (DIRECTLY BELOW THE 3D CANVAS) ── */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#0A2540] border border-[#1E3A8A] p-5 sm:p-7 text-white shadow-xl text-left mb-10 transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-white/10">
            
            {/* Left: Active Service Logo, Name & Status */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 p-2 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src={activeNode.logo}
                  alt={activeNode.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    {activeNode.name} Telemetry
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10.5px] font-mono font-bold">
                    eBPF Kernel Socket
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {activeNode.metrics.status}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-300 font-mono">
                    {activeNode.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: The 3 Live Metrics */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center min-w-[105px]">
                <div className="text-sm sm:text-base font-black text-white font-mono">
                  {activeNode.metrics.primary}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {activeNode.metrics.primaryLabel}
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center min-w-[105px]">
                <div className="text-sm sm:text-base font-black text-white font-mono">
                  {activeNode.metrics.secondary}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {activeNode.metrics.secondaryLabel}
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center min-w-[105px]">
                <div className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                  {activeNode.metrics.latency}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Avg Overhead
                </div>
              </div>
            </div>

          </div>

          {/* Bottom details description */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-[13px] text-slate-300">
            <p className="leading-relaxed font-normal">
              {activeNode.details}
            </p>
            <div className="flex items-center gap-2 text-blue-300 font-mono text-[11px] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Real-time Kernel Stream Active</span>
            </div>
          </div>

        </div>

        {/* ── BOTTOM ENTERPRISE STAT STRIP ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-slate-200/90 text-left">
          
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-[#0A2540] font-mono mb-0.5">
              &lt; 0.8% CPU
            </div>
            <div className="text-xs font-bold text-[#2563EB] mb-1 font-mono">
              Zero Bytecode Penalty
            </div>
            <p className="text-[11.5px] text-[#425466] leading-relaxed">
              eBPF probes run in a verified kernel sandbox without slowing application code.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-[#0A2540] font-mono mb-0.5">
              20+ Protocols
            </div>
            <div className="text-xs font-bold text-[#2563EB] mb-1 font-mono">
              Socket-Level Parsing
            </div>
            <p className="text-[11.5px] text-[#425466] leading-relaxed">
              HTTP/2, gRPC, Kafka, Redis, SQL, TLS &amp; DNS parsed at line-rate.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-[#0A2540] font-mono mb-0.5">
              0 Code Edits
            </div>
            <div className="text-xs font-bold text-[#2563EB] mb-1 font-mono">
              Zero Manual SDKs
            </div>
            <p className="text-[11.5px] text-[#425466] leading-relaxed">
              Never recompile binaries or add heavy dependencies to your repositories.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-xl sm:text-2xl font-black text-[#0A2540] font-mono mb-0.5">
              100% OTel Native
            </div>
            <div className="text-xs font-bold text-[#2563EB] mb-1 font-mono">
              Zero Lock-In
            </div>
            <p className="text-[11.5px] text-[#425466] leading-relaxed">
              Full CNCF OpenTelemetry v1.32 &amp; PromQL query compatibility out of the box.
            </p>
          </div>

        </div>

      </div>

      {/* ── CSS KEYFRAMES FOR 3D SYNAPTIC LASER BEAMS ── */}
      <style jsx>{`
        @keyframes synapse {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes synapse-fast {
          to {
            stroke-dashoffset: -24;
          }
        }
        .animate-synapse {
          animation: synapse 2.5s linear infinite;
        }
        .animate-synapse-fast {
          animation: synapse-fast 1.2s linear infinite;
        }
      `}</style>

    </section>
  );
}
