"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Server, GitBranch, Bell, Shield, Cpu,
  Clock, Check, X, ArrowRight, ChevronDown,
  Activity, AlertTriangle, Zap, Settings,
  ExternalLink, Search, RefreshCw
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

type ViewId = "services" | "deployments" | "alerts" | "incidents" | "infrastructure";

interface ServiceRow {
  name: string;
  status: "operational" | "degraded" | "warning";
  latency: string;
  errorRate: string;
  rps: string;
  lastCheck: string;
}

interface DeploymentItem {
  service: string;
  version: string;
  env: "production" | "staging" | "canary";
  status: "success" | "in-progress" | "failed" | "rolled-back";
  time: string;
  detail: string;
  author: string;
}

interface AlertItem {
  severity: "critical" | "warning";
  title: string;
  service: string;
  time: string;
  status: "active" | "investigating" | "resolved";
  detail: string;
}

interface IncidentEvent {
  event: string;
  time: string;
  completed: boolean;
}

interface InfraMetric {
  name: string;
  value: number;
  unit: string;
  color: string;
  sparkline: number[];
  peak: string;
  avg: string;
}

/* ═══════════════════════════════════════════════════════════════
   DATA CONSTANTS
   ═══════════════════════════════════════════════════════════════ */

const services: ServiceRow[] = [
  { name: "API Gateway", status: "operational", latency: "12ms", errorRate: "0.02%", rps: "8,421", lastCheck: "2s ago" },
  { name: "Authentication Service", status: "operational", latency: "8ms", errorRate: "0.00%", rps: "3,218", lastCheck: "5s ago" },
  { name: "Payment Service", status: "degraded", latency: "145ms", errorRate: "1.24%", rps: "1,847", lastCheck: "3s ago" },
  { name: "PostgreSQL", status: "operational", latency: "3ms", errorRate: "0.00%", rps: "12,490", lastCheck: "1s ago" },
  { name: "Redis Cache", status: "operational", latency: "0.4ms", errorRate: "0.00%", rps: "45,200", lastCheck: "1s ago" },
  { name: "Background Workers", status: "warning", latency: "—", errorRate: "0.31%", rps: "924", lastCheck: "8s ago" },
];

const deployments: DeploymentItem[] = [
  { service: "API Gateway", version: "v3.12.1", env: "production", status: "success", time: "12 min ago", detail: "14 files changed · 847 tests passed · Build 2m 34s", author: "Sarah K." },
  { service: "Auth Service", version: "v2.8.0", env: "staging", status: "in-progress", time: "2 min ago", detail: "Running integration tests (3/7)", author: "Marcus L." },
  { service: "Payment Service", version: "v1.45.3", env: "production", status: "failed", time: "1h ago", detail: "Health check timeout after 30s · Auto-rollback initiated", author: "DevOps Bot" },
  { service: "Background Workers", version: "v4.2.0", env: "production", status: "success", time: "3h ago", detail: "Zero-downtime rolling update · 3 pods replaced", author: "Alice R." },
  { service: "Redis Cache", version: "v7.2.4", env: "canary", status: "rolled-back", time: "5h ago", detail: "Error rate exceeded 2% threshold · Reverted to v7.2.3", author: "System" },
];

const alerts: AlertItem[] = [
  { severity: "critical", title: "High API Latency Detected", service: "API Gateway", time: "2 min ago", status: "active", detail: "p99 latency: 847ms (threshold: 200ms). Affected endpoints: /api/v2/users, /api/v2/orders. Correlated with deployment v3.12.1." },
  { severity: "warning", title: "CPU Utilization Exceeded 85%", service: "Worker Node 3", time: "8 min ago", status: "investigating", detail: "CPU at 89% for 4 consecutive minutes. Background job queue depth: 2,847. Auto-scaling triggered." },
  { severity: "critical", title: "Database Connection Pool Exhausted", service: "PostgreSQL", time: "15 min ago", status: "resolved", detail: "Max connections reached (100/100). Idle connections reclaimed. Pool restored to 34/100 active." },
  { severity: "warning", title: "Elevated HTTP 500 Error Rate", service: "Payment Service", time: "23 min ago", status: "active", detail: "5xx rate at 1.24% (baseline: 0.05%). Root cause: upstream provider intermittent failures." },
];

const incidentTimeline: IncidentEvent[] = [
  { event: "Anomaly detected in API Gateway latency", time: "14:23:01 UTC", completed: true },
  { event: "Incident INC-4892 created automatically", time: "14:23:04 UTC", completed: true },
  { event: "AI investigation started — analyzing telemetry", time: "14:23:06 UTC", completed: true },
  { event: "Root cause identified: connection pool saturation", time: "14:23:18 UTC", completed: true },
  { event: "On-call engineer Sarah K. notified via PagerDuty", time: "14:23:19 UTC", completed: true },
  { event: "Resolution: pool limit increased, connections drained", time: "14:31:42 UTC", completed: false },
];

const infraMetrics: InfraMetric[] = [
  { name: "CPU", value: 67, unit: "%", color: "#3978FF", sparkline: [52, 48, 55, 62, 58, 71, 65, 59, 72, 68, 74, 67], peak: "74%", avg: "62%" },
  { name: "Memory", value: 74, unit: "%", color: "#A855F7", sparkline: [65, 68, 66, 70, 69, 72, 71, 73, 72, 74, 73, 74], peak: "76%", avg: "70%" },
  { name: "Disk I/O", value: 42, unit: "%", color: "#22C78A", sparkline: [30, 35, 28, 45, 38, 42, 55, 40, 36, 44, 39, 42], peak: "55%", avg: "39%" },
  { name: "Network", value: 31, unit: "Mbps", color: "#06B6D4", sparkline: [18, 25, 22, 35, 28, 42, 31, 26, 38, 30, 34, 31], peak: "42", avg: "28" },
];

const sidebarNav: { id: ViewId; icon: typeof Server; label: string }[] = [
  { id: "services", icon: Server, label: "Services" },
  { id: "deployments", icon: GitBranch, label: "Deploys" },
  { id: "alerts", icon: Bell, label: "Alerts" },
  { id: "incidents", icon: Shield, label: "Incidents" },
  { id: "infrastructure", icon: Cpu, label: "Infra" },
];

const capabilityHighlights: { id: ViewId; icon: typeof Activity; title: string; desc: string }[] = [
  { id: "services", icon: Activity, title: "Unified Service Health", desc: "Understand the status of every service in real time." },
  { id: "deployments", icon: GitBranch, title: "Deployment Intelligence", desc: "Track releases, rollbacks and deployment failures." },
  { id: "alerts", icon: Bell, title: "Intelligent Alerting", desc: "Detect anomalies before they become incidents." },
  { id: "incidents", icon: Shield, title: "Incident Intelligence", desc: "Understand root causes and accelerate resolution." },
  { id: "infrastructure", icon: Cpu, title: "Infrastructure Visibility", desc: "Monitor compute, memory, storage and network." },
];

const TIME_RANGES = ["1h", "6h", "24h", "7d"] as const;

/* ═══════════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function StatusDot({ status }: { status: "operational" | "degraded" | "warning" | "critical" | "active" | "resolved" | "investigating" }) {
  const colors: Record<string, string> = {
    operational: "bg-[#22C78A]",
    degraded: "bg-[#E8AA42]",
    warning: "bg-[#E8AA42]",
    critical: "bg-[#F05252]",
    active: "bg-[#F05252]",
    investigating: "bg-[#E8AA42]",
    resolved: "bg-[#22C78A]",
  };
  const shouldPulse = status === "active" || status === "investigating" || status === "degraded";
  return (
    <span className="relative flex h-2 w-2">
      {shouldPulse && <span className={`absolute inset-0 rounded-full ${colors[status]} opacity-40 animate-ping`} />}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[status]}`} />
    </span>
  );
}

function Sparkline({ data, color, width = 120, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 2;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = pad + ((max - v) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPath = `M0,${height} L${points.split(" ").map((p, i) => (i === 0 ? p : `L${p}`)).join(" ")} L${width},${height} Z`
    .replace("LL", "L");

  return (
    <svg width={width} height={height} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#sg-${color.replace("#", "")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CircularGauge({ value, color, size = 72 }: { value: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1A1D24" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
    </svg>
  );
}

const statusLabel: Record<string, { text: string; class: string }> = {
  operational: { text: "Operational", class: "text-[#22C78A]" },
  degraded: { text: "Degraded", class: "text-[#E8AA42]" },
  warning: { text: "Warning", class: "text-[#E8AA42]" },
};

const deployStatusConfig: Record<string, { text: string; color: string; bg: string }> = {
  success: { text: "Deployed", color: "text-[#22C78A]", bg: "bg-[#22C78A]/10" },
  "in-progress": { text: "In Progress", color: "text-[#3978FF]", bg: "bg-[#3978FF]/10" },
  failed: { text: "Failed", color: "text-[#F05252]", bg: "bg-[#F05252]/10" },
  "rolled-back": { text: "Rolled Back", color: "text-[#E8AA42]", bg: "bg-[#E8AA42]/10" },
};

const envBadgeClass: Record<string, string> = {
  production: "border-[#22C78A]/30 text-[#22C78A]",
  staging: "border-[#3978FF]/30 text-[#3978FF]",
  canary: "border-[#E8AA42]/30 text-[#E8AA42]",
};

/* ═══════════════════════════════════════════════════════════════
   VIEW: SERVICE HEALTH
   ═══════════════════════════════════════════════════════════════ */

function ServiceHealthView({ hoveredRow, setHoveredRow }: { hoveredRow: number | null; setHoveredRow: (v: number | null) => void }) {
  return (
    <div className="flex flex-col gap-0">
      {/* Table Header */}
      <div className="grid grid-cols-[1fr_100px_80px_72px_80px_64px] gap-2 px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-[#6B7280] border-b border-[#1E222A]">
        <span>Service</span>
        <span>Status</span>
        <span className="text-right">Latency</span>
        <span className="text-right">Error %</span>
        <span className="text-right">Req/s</span>
        <span className="text-right">Checked</span>
      </div>
      {/* Service Rows */}
      {services.map((svc, i) => (
        <motion.div
          key={svc.name}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          onMouseEnter={() => setHoveredRow(i)}
          onMouseLeave={() => setHoveredRow(null)}
          className={`grid grid-cols-[1fr_100px_80px_72px_80px_64px] gap-2 px-4 py-3 items-center border-b border-[#1A1D24]/60 cursor-default transition-colors duration-150 ${
            hoveredRow === i ? "bg-[#151820]" : "bg-transparent"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <StatusDot status={svc.status} />
            <span className={`text-[13px] transition-colors ${hoveredRow === i ? "text-[#F5F6F8]" : "text-[#D1D5DB]"}`}>{svc.name}</span>
          </div>
          <span className={`text-[11px] font-mono ${statusLabel[svc.status].class}`}>{statusLabel[svc.status].text}</span>
          <span className={`text-[12px] font-mono text-right ${svc.latency === "—" ? "text-[#6B7280]" : svc.status === "degraded" ? "text-[#E8AA42]" : "text-[#9298A3]"}`}>{svc.latency}</span>
          <span className={`text-[12px] font-mono text-right ${parseFloat(svc.errorRate) > 0.5 ? "text-[#F05252]" : "text-[#9298A3]"}`}>{svc.errorRate}</span>
          <span className="text-[12px] font-mono text-right text-[#9298A3]">{svc.rps}</span>
          <span className="text-[11px] font-mono text-right text-[#6B7280]">{svc.lastCheck}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIEW: DEPLOYMENTS
   ═══════════════════════════════════════════════════════════════ */

function DeploymentView({ expandedIdx, setExpandedIdx }: { expandedIdx: number | null; setExpandedIdx: (v: number | null) => void }) {
  return (
    <div className="flex flex-col gap-0.5 px-1">
      {deployments.map((dep, i) => {
        const cfg = deployStatusConfig[dep.status];
        const isOpen = expandedIdx === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <button
              onClick={() => setExpandedIdx(isOpen ? null : i)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors duration-150 group ${isOpen ? "bg-[#151820]" : "hover:bg-[#151820]/60"}`}
            >
              {/* Status icon */}
              <div className={`w-7 h-7 rounded-md ${cfg.bg} flex items-center justify-center shrink-0`}>
                {dep.status === "success" && <Check size={13} className={cfg.color} />}
                {dep.status === "in-progress" && <RefreshCw size={13} className={`${cfg.color} animate-spin`} />}
                {dep.status === "failed" && <X size={13} className={cfg.color} />}
                {dep.status === "rolled-back" && <RefreshCw size={13} className={cfg.color} />}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#F5F6F8] font-medium truncate">{dep.service}</span>
                  <span className="text-[11px] font-mono text-[#6B7280]">{dep.version}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${envBadgeClass[dep.env]}`}>{dep.env}</span>
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">{dep.time} · {dep.author}</div>
              </div>
              {/* Status badge */}
              <span className={`text-[11px] font-mono ${cfg.color} shrink-0`}>{cfg.text}</span>
              <ChevronDown size={14} className={`text-[#6B7280] transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-[52px] mr-4 mb-2 px-3 py-2.5 rounded-md bg-[#0D0F14] border border-[#1E222A] text-[11px] font-mono text-[#9298A3] leading-relaxed">
                    {dep.detail}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIEW: ALERTS
   ═══════════════════════════════════════════════════════════════ */

function AlertView({ expandedIdx, setExpandedIdx }: { expandedIdx: number | null; setExpandedIdx: (v: number | null) => void }) {
  return (
    <div className="flex flex-col gap-1 px-1">
      {alerts.map((alert, i) => {
        const isOpen = expandedIdx === i;
        const sevColor = alert.severity === "critical" ? "#F05252" : "#E8AA42";
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <button
              onClick={() => setExpandedIdx(isOpen ? null : i)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-start gap-3 transition-colors duration-150 ${isOpen ? "bg-[#151820]" : "hover:bg-[#151820]/60"}`}
            >
              {/* Severity indicator */}
              <div className="mt-0.5 shrink-0 flex flex-col items-center gap-1">
                <AlertTriangle size={14} style={{ color: sevColor }} />
                <span className="text-[9px] font-mono uppercase font-semibold" style={{ color: sevColor }}>
                  {alert.severity === "critical" ? "CRIT" : "WARN"}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-[#F5F6F8] font-medium">{alert.title}</div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6B7280]">
                  <span>{alert.service}</span>
                  <span className="text-[#3A3F4B]">·</span>
                  <span>{alert.time}</span>
                  <span className="text-[#3A3F4B]">·</span>
                  <span className="flex items-center gap-1">
                    <StatusDot status={alert.status as "active" | "investigating" | "resolved"} />
                    <span className="capitalize">{alert.status}</span>
                  </span>
                </div>
              </div>
              <ChevronDown size={14} className={`text-[#6B7280] transition-transform duration-200 mt-1 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-[44px] mr-4 mb-2 px-3 py-2.5 rounded-md bg-[#0D0F14] border border-[#1E222A] text-[11px] text-[#9298A3] leading-relaxed">
                    {alert.detail}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIEW: INCIDENT TIMELINE
   ═══════════════════════════════════════════════════════════════ */

function IncidentView({ selectedIdx, setSelectedIdx }: { selectedIdx: number; setSelectedIdx: (v: number) => void }) {
  return (
    <div className="px-4">
      {/* Incident header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-mono text-[#F5F6F8] font-semibold">INC-4892</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F05252]/10 text-[#F05252] border border-[#F05252]/20">Active</span>
        </div>
        <span className="text-[11px] font-mono text-[#6B7280]">Duration: 8m 41s</span>
      </div>
      {/* Timeline */}
      <div className="relative ml-3">
        {/* Vertical line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[#242831]" />
        {incidentTimeline.map((evt, i) => {
          const isSelected = selectedIdx === i;
          const isLast = i === incidentTimeline.length - 1;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => setSelectedIdx(i)}
              className={`relative flex items-start gap-4 pb-5 w-full text-left group transition-colors ${isLast ? "pb-0" : ""}`}
            >
              {/* Dot */}
              <div className={`relative z-10 w-[11px] h-[11px] rounded-full border-2 shrink-0 mt-0.5 transition-all ${
                evt.completed
                  ? isSelected ? "bg-[#22C78A] border-[#22C78A] shadow-[0_0_6px_rgba(34,199,138,0.4)]" : "bg-[#22C78A] border-[#22C78A]"
                  : "bg-[#08090B] border-[#E8AA42] shadow-[0_0_6px_rgba(232,170,66,0.3)]"
              }`} />
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={`text-[12.5px] transition-colors ${isSelected ? "text-[#F5F6F8]" : "text-[#D1D5DB] group-hover:text-[#F5F6F8]"}`}>
                  {evt.event}
                </div>
                <div className="text-[10px] font-mono text-[#6B7280] mt-0.5">{evt.time}</div>
              </div>
              {/* Check/In-Progress */}
              <div className="shrink-0 mt-0.5">
                {evt.completed ? (
                  <Check size={13} className="text-[#22C78A]" />
                ) : (
                  <div className="w-3 h-3 rounded-full border-2 border-[#E8AA42] border-t-transparent animate-spin" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
      {/* Selected event detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-4 p-3 rounded-lg bg-[#0D0F14] border border-[#1E222A]"
        >
          <div className="text-[11px] font-mono text-[#6B7280] mb-1">Event Detail</div>
          <div className="text-[12px] text-[#D1D5DB] leading-relaxed">
            {incidentTimeline[selectedIdx].event}
            <span className="text-[#6B7280]"> — {incidentTimeline[selectedIdx].time}</span>
          </div>
          {selectedIdx === 3 && (
            <div className="mt-2 text-[11px] font-mono text-[#3978FF]">
              Root cause: PostgreSQL connection pool saturation (100/100 max)
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIEW: INFRASTRUCTURE
   ═══════════════════════════════════════════════════════════════ */

function InfrastructureView() {
  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280]">Cluster: us-east-1</span>
        <span className="text-[10px] font-mono text-[#6B7280]">4 nodes · 16 cores</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {infraMetrics.map((metric, i) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A] hover:border-[#2A2F3A] transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280]">{metric.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[18px] font-semibold font-mono text-[#F5F6F8]">{metric.value}</span>
                <span className="text-[11px] font-mono text-[#6B7280]">{metric.unit}</span>
              </div>
            </div>
            {/* Gauge + Sparkline row */}
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <div className="relative">
                  <CircularGauge value={metric.value} color={metric.color} size={56} />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-semibold text-[#9298A3] rotate-90">
                    {metric.unit === "%" ? `${metric.value}%` : metric.value}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <Sparkline data={metric.sparkline} color={metric.color} width={100} height={24} />
              </div>
            </div>
            {/* Peak/Avg */}
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-[#1A1D24]">
              <span className="text-[10px] font-mono text-[#6B7280]">Peak: <span className="text-[#9298A3]">{metric.peak}{metric.unit === "Mbps" ? " Mbps" : ""}</span></span>
              <span className="text-[10px] font-mono text-[#6B7280]">Avg: <span className="text-[#9298A3]">{metric.avg}{metric.unit === "Mbps" ? " Mbps" : ""}</span></span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT — OPERATIONAL SHOWCASE
   ═══════════════════════════════════════════════════════════════ */

export function OperationalShowcase() {
  const [activeView, setActiveView] = useState<ViewId>("services");
  const [timeRange, setTimeRange] = useState<(typeof TIME_RANGES)[number]>("24h");
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);
  const [expandedDeploy, setExpandedDeploy] = useState<number | null>(null);
  const [selectedIncident, setSelectedIncident] = useState(3);

  const dashboardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const handleCapabilityClick = useCallback((viewId: ViewId) => {
    setActiveView(viewId);
    dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const viewTitles: Record<ViewId, string> = {
    services: "Service Health Monitor",
    deployments: "Recent Deployments",
    alerts: "Active Alerts",
    incidents: "Incident Timeline",
    infrastructure: "Infrastructure Overview",
  };

  const viewSubtitles: Record<ViewId, string> = {
    services: `${services.length} services monitored`,
    deployments: `${deployments.length} recent deployments`,
    alerts: `${alerts.filter(a => a.status === "active").length} active alerts`,
    incidents: "INC-4892 · Active",
    infrastructure: "Cluster health metrics",
  };

  const metricCards = [
    { label: "Active Services", value: "6", sub: "All regions", color: "#22C78A" },
    { label: "Active Alerts", value: "4", sub: "2 critical", color: "#F05252" },
    { label: "Deploys Today", value: "12", sub: "2 failed", color: "#3978FF" },
    { label: "Uptime (30d)", value: "99.97%", sub: "SLA met", color: "#22C78A" },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 sm:px-8 md:px-12 lg:px-20 mt-36 relative"
      style={{ isolation: "isolate", zIndex: 10 }}
      id="operational-intelligence"
    >
      {/* ──────── Section Header ──────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3978FF]/[0.08] border border-[#3978FF]/20 text-[11px] font-mono tracking-wider text-[#3978FF] mb-5 uppercase">
          <Activity size={12} />
          Operational Intelligence
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#F5F6F8] mb-4 leading-[1.12] max-w-3xl mx-auto text-balance">
          Everything happening across your infrastructure. One intelligent view.
        </h2>
        <p className="text-[#9298A3] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          From application performance to infrastructure health, BREXAL brings your entire engineering ecosystem into a unified observability experience.
        </p>
      </motion.div>

      {/* ──────── Dashboard Frame ──────── */}
      <motion.div
        ref={dashboardRef}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 }}
        className="w-full max-w-[1200px] mx-auto rounded-xl overflow-hidden border border-[#242831] shadow-[0_40px_120px_rgba(0,0,0,0.8)] bg-[#101216]"
      >
        {/* ── Browser Chrome ── */}
        <div className="h-11 border-b border-[#1E222A] bg-[#0D0F14] flex items-center px-4 gap-4 shrink-0">
          {/* Traffic lights */}
          <div className="flex gap-1.5 shrink-0">
            <div className="w-[10px] h-[10px] rounded-full bg-[#F05252]/70" />
            <div className="w-[10px] h-[10px] rounded-full bg-[#E8AA42]/70" />
            <div className="w-[10px] h-[10px] rounded-full bg-[#22C78A]/70" />
          </div>
          {/* URL bar */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-[#151820] border border-[#1E222A] rounded-md px-3 py-1 max-w-xs w-full">
              <Search size={11} className="text-[#6B7280] shrink-0" />
              <span className="text-[11px] font-mono text-[#6B7280] truncate">brexal.io/operations</span>
            </div>
          </div>
          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <Bell size={14} className="text-[#6B7280]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#F05252]" />
            </div>
            <div className="w-6 h-6 rounded-full bg-[#242831] flex items-center justify-center text-[10px] font-mono text-[#9298A3]">JD</div>
          </div>
        </div>

        {/* ── App Body: Sidebar + Main ── */}
        <div className="flex min-h-[520px] md:min-h-[560px]">
          {/* Sidebar — desktop only */}
          <div className="hidden md:flex w-[52px] border-r border-[#1E222A] bg-[#0D0F14] flex-col items-center py-3 gap-1 shrink-0">
            {sidebarNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  title={item.label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 relative group ${
                    isActive
                      ? "bg-[#3978FF]/10 text-[#3978FF]"
                      : "text-[#6B7280] hover:text-[#9298A3] hover:bg-[#151820]"
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-[#3978FF]" />}
                  <Icon size={16} />
                  {/* Tooltip */}
                  <span className="absolute left-full ml-2 px-2 py-1 rounded bg-[#1A1D24] border border-[#242831] text-[10px] font-mono text-[#D1D5DB] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                    {item.label}
                  </span>
                </button>
              );
            })}
            <div className="flex-1" />
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#9298A3] hover:bg-[#151820] transition-all">
              <Settings size={15} />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-[#101216] overflow-hidden">
            {/* Content Header — time range + view title */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E222A] bg-[#101216] shrink-0">
              <div>
                <h3 className="text-[14px] font-semibold text-[#F5F6F8]">{viewTitles[activeView]}</h3>
                <p className="text-[11px] font-mono text-[#6B7280] mt-0.5">{viewSubtitles[activeView]}</p>
              </div>
              {/* Time Range Selector */}
              <div className="flex items-center gap-1 bg-[#0D0F14] border border-[#1E222A] rounded-md p-0.5">
                {TIME_RANGES.map((tr) => (
                  <button
                    key={tr}
                    onClick={() => setTimeRange(tr)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all duration-150 ${
                      timeRange === tr
                        ? "bg-[#242831] text-[#F5F6F8]"
                        : "text-[#6B7280] hover:text-[#9298A3]"
                    }`}
                  >
                    {tr}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Tab Bar */}
            <div className="flex md:hidden items-center gap-1 px-4 py-2 border-b border-[#1E222A] overflow-x-auto">
              {sidebarNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono whitespace-nowrap transition-all shrink-0 ${
                      activeView === item.id
                        ? "bg-[#3978FF]/10 text-[#3978FF] border border-[#3978FF]/20"
                        : "text-[#6B7280] hover:text-[#9298A3]"
                    }`}
                  >
                    <Icon size={12} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 py-4 border-b border-[#1E222A]/60">
              {metricCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                  className="px-3.5 py-3 rounded-lg bg-[#0D0F14] border border-[#1E222A]"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mb-1.5">{card.label}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-semibold font-mono text-[#F5F6F8] tracking-tight">{card.value}</span>
                  </div>
                  <div className="text-[10px] font-mono mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: card.color }} />
                    <span className="text-[#6B7280]">{card.sub}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View Content Area */}
            <div className="flex-1 overflow-y-auto py-3" style={{ minHeight: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeView === "services" && (
                    <ServiceHealthView hoveredRow={hoveredService} setHoveredRow={setHoveredService} />
                  )}
                  {activeView === "deployments" && (
                    <DeploymentView expandedIdx={expandedDeploy} setExpandedIdx={setExpandedDeploy} />
                  )}
                  {activeView === "alerts" && (
                    <AlertView expandedIdx={expandedAlert} setExpandedIdx={setExpandedAlert} />
                  )}
                  {activeView === "incidents" && (
                    <IncidentView selectedIdx={selectedIncident} setSelectedIdx={setSelectedIncident} />
                  )}
                  {activeView === "infrastructure" && (
                    <InfrastructureView />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ──────── Capability Highlights ──────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.4 }}
        className="w-full max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-3 mt-8"
      >
        {capabilityHighlights.map((cap) => {
          const Icon = cap.icon;
          const isActive = activeView === cap.id;
          return (
            <button
              key={cap.id}
              onClick={() => handleCapabilityClick(cap.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 group ${
                isActive
                  ? "bg-[#3978FF]/[0.06] border-[#3978FF]/25"
                  : "bg-[#101216]/60 border-[#242831]/60 hover:border-[#242831] hover:bg-[#101216]"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                isActive ? "bg-[#3978FF]/15 text-[#3978FF]" : "bg-[#151820] text-[#6B7280] group-hover:text-[#9298A3]"
              }`}>
                <Icon size={16} />
              </div>
              <h4 className={`text-[13px] font-medium mb-1 transition-colors ${isActive ? "text-[#F5F6F8]" : "text-[#D1D5DB]"}`}>
                {cap.title}
              </h4>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">{cap.desc}</p>
            </button>
          );
        })}
      </motion.div>

      {/* ──────── CTA ──────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="flex items-center justify-center gap-4 mt-10"
      >
        <a
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#3978FF] text-white text-[13px] font-semibold hover:bg-[#2B63E0] transition-colors shadow-[0_4px_20px_rgba(57,120,255,0.25)]"
        >
          Explore BREXAL <ArrowRight size={14} />
        </a>
        <a
          href="#features"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#242831] text-[#9298A3] text-[13px] font-medium hover:text-[#F5F6F8] hover:border-[#3A3F4B] transition-colors"
        >
          See How It Works
        </a>
      </motion.div>
    </section>
  );
}

