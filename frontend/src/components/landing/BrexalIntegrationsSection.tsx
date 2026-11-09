"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Zap,
  Activity,
  CheckCircle2,
  Layers,
  Server,
  Database,
  Network,
  Cpu,
  Globe,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface OrbitNode {
  id: string;
  name: string;
  category: string;
  angle: number; // in degrees
  radius: number; // in pixels from center
  color: string;
  iconBg: string;
  textColor: string;
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

const ORBIT_NODES: OrbitNode[] = [
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "Container Mesh",
    angle: -90,
    radius: 175,
    color: "#326CE5",
    iconBg: "bg-blue-600",
    textColor: "text-blue-600",
    metrics: {
      primary: "184 Pods",
      primaryLabel: "Auto-Probed",
      secondary: "0 Drops",
      secondaryLabel: "Network Health",
      latency: "0.18ms",
      status: "Cluster Healthy"
    },
    details: "eBPF kernel sockets trace inter-pod TCP traffic and cgroup memory limits with 0% CPU penalty."
  },
  {
    id: "redis",
    name: "Redis",
    category: "In-Memory Cache",
    angle: 0,
    radius: 175,
    color: "#DC382D",
    iconBg: "bg-rose-600",
    textColor: "text-rose-600",
    metrics: {
      primary: "99.8%",
      primaryLabel: "Cache Hit Rate",
      secondary: "84k ops/s",
      secondaryLabel: "Throughput",
      latency: "0.12ms",
      status: "Zero Evictions"
    },
    details: "Continuous hit-ratio tracking, key eviction alerts, and slow command diagnostics without agents."
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "Relational DB",
    angle: 90,
    radius: 175,
    color: "#4169E1",
    iconBg: "bg-sky-700",
    textColor: "text-sky-700",
    metrics: {
      primary: "0 Locks",
      primaryLabel: "Wait Lock Free",
      secondary: "32 / 32",
      secondaryLabel: "Active Pool",
      latency: "0.84ms",
      status: "Query Optimal"
    },
    details: "Automatic slow query plan correlation, connection pool sizing, and table bloat monitoring."
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    category: "Event Streaming",
    angle: 180,
    radius: 175,
    color: "#231F20",
    iconBg: "bg-slate-900",
    textColor: "text-slate-900",
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
    id: "aws",
    name: "AWS Cloud",
    category: "Cloud Provider",
    angle: -140,
    radius: 275,
    color: "#FF9900",
    iconBg: "bg-amber-500",
    textColor: "text-amber-600",
    metrics: {
      primary: "EKS & Lambda",
      primaryLabel: "Serverless Mesh",
      secondary: "$0 Egress",
      secondaryLabel: "VPC Peering",
      latency: "Line-Rate",
      status: "CloudWatch Free"
    },
    details: "Native telemetry extraction directly within your AWS VPC, eliminating costly CloudWatch custom metric bills."
  },
  {
    id: "docker",
    name: "Docker",
    category: "Container Engine",
    angle: -40,
    radius: 275,
    color: "#2496ED",
    iconBg: "bg-sky-500",
    textColor: "text-sky-500",
    metrics: {
      primary: "Host Daemon",
      primaryLabel: "Kernel Linked",
      secondary: "< 40 MB",
      secondaryLabel: "RAM Footprint",
      latency: "0.08ms",
      status: "Socket Hooked"
    },
    details: "Zero bytecode modification. Captures all container bridge network packets via Linux kernel sockets."
  },
  {
    id: "python",
    name: "Python",
    category: "FastAPI / Django",
    angle: 40,
    radius: 275,
    color: "#3776AB",
    iconBg: "bg-amber-600",
    textColor: "text-amber-700",
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
    id: "go",
    name: "Go (Golang)",
    category: "Systems Runtime",
    angle: 75,
    radius: 275,
    color: "#00ADD8",
    iconBg: "bg-cyan-600",
    textColor: "text-cyan-600",
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
    angle: 140,
    radius: 275,
    color: "#339933",
    iconBg: "bg-emerald-600",
    textColor: "text-emerald-600",
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
    id: "otel",
    name: "OpenTelemetry",
    category: "CNCF Standard",
    angle: -105,
    radius: 275,
    color: "#4A154B",
    iconBg: "bg-purple-600",
    textColor: "text-purple-600",
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
  const [activeNode, setActiveNode] = useState<OrbitNode>(ORBIT_NODES[0]); // default Kubernetes
  const [pulseKey, setPulseKey] = useState(0);

  // Trigger pulse animation when activeNode changes
  useEffect(() => {
    setPulseKey((prev) => prev + 1);
  }, [activeNode]);

  // Canvas center coordinates
  const centerX = 400;
  const centerY = 320;

  return (
    <section id="integrations" className="py-16 sm:py-20 md:py-26 px-4 sm:px-10 bg-[#FAFCFF] border-b border-slate-200/80 font-sans relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[650px] bg-gradient-to-r from-blue-100/35 via-indigo-50/25 to-sky-100/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto text-left relative z-10">
        
        {/* ── SECTION HEADER ── */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-6 h-[1.5px] bg-[#2563EB]" />
            <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#2563EB] uppercase tracking-widest">
              AUTONOMOUS ECOSYSTEM MESH
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[44px] font-extrabold tracking-[-0.035em] text-[#0A2540] leading-[1.15] mb-3">
            One Brain. Every Layer of Your Cloud.
          </h2>
          <p className="text-sm sm:text-base text-[#425466] leading-relaxed max-w-2xl font-normal">
            BREXAL's Neural Engine hooks directly into Linux kernel sockets. It autonomously discovers, traces, and correlates all microservices, databases, and message brokers with zero code changes.
          </p>
        </div>

        {/* ── INTERACTIVE 1-CLICK SELECTOR PILLS (MOBILE & DESKTOP QUICK SWITCH) ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {ORBIT_NODES.map((node) => {
            const isSelected = activeNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNode(node)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#0A2540] text-white shadow-sm ring-2 ring-blue-500/20"
                    : "bg-white text-[#425466] border border-slate-200/90 hover:border-blue-300 hover:text-[#0A2540]"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-blue-400 animate-ping" : "bg-slate-300"}`} />
                <span>{node.name}</span>
              </button>
            );
          })}
        </div>

        {/* ── THE ORBITING PLANETARY NEURAL CANVAS (DESKTOP & TABLET) ── */}
        <div className="hidden md:block relative w-full h-[640px] rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_30px_rgba(10,37,64,0.04)] overflow-hidden mb-10">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

          {/* SVG Orbit Rings & Dynamic Laser Beams */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 640">
            <defs>
              <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="activeBeamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Orbit Ring 1 (Inner) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={175}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Orbit Ring 2 (Outer) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={275}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />

            {/* Connecting Laser Beams to all nodes */}
            {ORBIT_NODES.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const nodeX = centerX + node.radius * Math.cos(rad);
              const nodeY = centerY + node.radius * Math.sin(rad);
              const isSelected = activeNode.id === node.id;

              return (
                <g key={`beam-${node.id}`}>
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={nodeX}
                    y2={nodeY}
                    stroke={isSelected ? "url(#activeBeamGradient)" : "#CBD5E1"}
                    strokeWidth={isSelected ? "2.5" : "1"}
                    strokeOpacity={isSelected ? 1 : 0.4}
                    strokeDasharray={isSelected ? "6 6" : "none"}
                    className={isSelected ? "animate-dash" : ""}
                  />
                  {isSelected && (
                    <circle
                      cx={(centerX + nodeX) / 2}
                      cy={(centerY + nodeY) / 2}
                      r={3.5}
                      fill="#2563EB"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* ── CENTER CORE (THE BREXAL NEURAL ENGINE) ── */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-none"
            style={{ left: `${(centerX / 800) * 100}%`, top: `${(centerY / 640) * 100}%` }}
          >
            {/* Glowing outer rings */}
            <div className="absolute w-40 h-40 rounded-full bg-blue-500/10 animate-ping pointer-events-none" />
            <div className="absolute w-32 h-32 rounded-full bg-blue-500/15 animate-pulse pointer-events-none" />
            
            {/* Core Neural Badge */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#1D4ED8] p-0.5 shadow-[0_0_35px_rgba(37,99,235,0.4)] flex items-center justify-center relative">
              <div className="w-full h-full rounded-[14px] bg-[#0A2540] flex flex-col items-center justify-center p-2 text-white">
                <Brain size={26} className="text-blue-400 mb-0.5" />
                <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-blue-300">
                  BREXAL
                </span>
                <span className="text-[7.5px] font-mono text-emerald-400 font-bold">
                  ● ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* ── SATELLITE ORBIT NODES ── */}
          {ORBIT_NODES.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            const nodeX = centerX + node.radius * Math.cos(rad);
            const nodeY = centerY + node.radius * Math.sin(rad);
            const isSelected = activeNode.id === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(node)}
                onMouseEnter={() => setActiveNode(node)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "scale-110 z-40"
                    : "hover:scale-105"
                }`}
                style={{
                  left: `${(nodeX / 800) * 100}%`,
                  top: `${(nodeY / 640) * 100}%`
                }}
              >
                <div
                  className={`p-2.5 rounded-2xl border transition-all duration-200 flex items-center gap-2.5 shadow-sm ${
                    isSelected
                      ? "bg-white border-[#2563EB] ring-4 ring-blue-500/25 shadow-xl -translate-y-1"
                      : "bg-white/95 border-slate-200/90 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl ${node.iconBg} text-white flex items-center justify-center font-bold font-mono text-xs shadow-xs`}>
                    {node.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left pr-1.5">
                    <div className="text-xs font-black text-[#0A2540] leading-tight">
                      {node.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono font-medium">
                      {node.category}
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}

          {/* ── FLOATING LIVE TELEMETRY RADAR CARD (BOTTOM-RIGHT OF CANVAS) ── */}
          <div className="absolute bottom-6 right-6 z-30 w-80 sm:w-88 rounded-2xl bg-[#0A2540]/95 backdrop-blur-md border border-[#1E3A8A] p-4.5 text-white shadow-2xl text-left transition-all duration-300">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg ${activeNode.iconBg} text-white flex items-center justify-center font-bold text-[10px] font-mono`}>
                  {activeNode.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white leading-tight">
                    {activeNode.name} Telemetry
                  </h4>
                  <span className="text-[10.5px] font-mono text-emerald-400 font-bold">
                    ● {activeNode.metrics.status}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono font-bold">
                eBPF Kernel Socket
              </span>
            </div>

            {/* Metrics 3-box strip */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-xs sm:text-sm font-black text-white font-mono">
                  {activeNode.metrics.primary}
                </div>
                <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                  {activeNode.metrics.primaryLabel}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-xs sm:text-sm font-black text-white font-mono">
                  {activeNode.metrics.secondary}
                </div>
                <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                  {activeNode.metrics.secondaryLabel}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                  {activeNode.metrics.latency}
                </div>
                <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                  Avg Overhead
                </div>
              </div>
            </div>

            <p className="text-[11.5px] text-slate-300 font-normal leading-relaxed">
              {activeNode.details}
            </p>
          </div>

          {/* ── TOP-LEFT LIVE STATUS BADGE ON CANVAS ── */}
          <div className="absolute top-6 left-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-mono font-bold text-[#0A2540] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Autonomous Socket Mesh Active</span>
          </div>

        </div>

        {/* ── MOBILE CARD ADAPTATION (< 768px) ── */}
        <div className="block md:hidden rounded-2xl bg-white border border-slate-200 p-5 mb-8 shadow-sm text-left">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className={`w-10 h-10 rounded-xl ${activeNode.iconBg} text-white flex items-center justify-center font-bold text-sm font-mono`}>
              {activeNode.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0A2540]">
                {activeNode.name}
              </h3>
              <p className="text-xs text-emerald-600 font-bold font-mono">
                ● {activeNode.metrics.status}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs font-black text-[#0A2540] font-mono">
                {activeNode.metrics.primary}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {activeNode.metrics.primaryLabel}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs font-black text-[#0A2540] font-mono">
                {activeNode.metrics.secondary}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {activeNode.metrics.secondaryLabel}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs font-black text-emerald-600 font-mono">
                {activeNode.metrics.latency}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Overhead
              </div>
            </div>
          </div>

          <p className="text-xs text-[#425466] leading-relaxed">
            {activeNode.details}
          </p>
        </div>

        {/* ── BOTTOM ENTERPRISE STAT STRIP (CLEAN 4-PILLAR METRICS) ── */}
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

      {/* ── CSS KEYFRAMES FOR LASER BEAM ANIMATION ── */}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -24;
          }
        }
        .animate-dash {
          animation: dash 1.5s linear infinite;
        }
      `}</style>

    </section>
  );
}
