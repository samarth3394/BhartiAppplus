"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  LayoutDashboard, Zap, MessageSquare, Users,
  KanbanSquare, Bug, Map, Activity, Server,
  Terminal, Wrench, Settings, ChevronDown, ChevronRight,
  Check, X, AlertTriangle, Search, Play, Pause,
  Shield, RefreshCw, ArrowRight, GitBranch, Bell,
  Cpu, HardDrive, Wifi, Sliders, Plus
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

export type FeatureTab =
  | "Dashboard"
  | "AI Copilot"
  | "Inbox"
  | "Teams"
  | "Kanban"
  | "Issues & Bugs"
  | "Roadmap"
  | "Uptime"
  | "Infrastructure"
  | "Logs"
  | "Maintenance"
  | "Settings";

interface NavItem {
  name: FeatureTab;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", icon: LayoutDashboard },
      { name: "AI Copilot", icon: Zap, badge: "AI", badgeColor: "bg-[#3978FF]/20 text-[#3978FF]" },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      { name: "Inbox", icon: MessageSquare, badge: "4", badgeColor: "bg-[#F05252]/20 text-[#F05252]" },
      { name: "Teams", icon: Users },
    ],
  },
  {
    title: "PLANNING",
    items: [
      { name: "Kanban", icon: KanbanSquare },
      { name: "Issues & Bugs", icon: Bug, badge: "2 P0", badgeColor: "bg-[#E8AA42]/20 text-[#E8AA42]" },
      { name: "Roadmap", icon: Map },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { name: "Uptime", icon: Activity, badge: "99.98%", badgeColor: "bg-[#22C78A]/20 text-[#22C78A]" },
      { name: "Infrastructure", icon: Server },
      { name: "Logs", icon: Terminal, badge: "Live", badgeColor: "bg-[#3978FF]/20 text-[#3978FF]" },
      { name: "Maintenance", icon: Wrench },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { name: "Settings", icon: Settings },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   1. DASHBOARD VIEW
   ═══════════════════════════════════════════════════════════════ */
function DashboardView({ onNavigate }: { onNavigate: (tab: FeatureTab) => void }) {
  const [selectedRange, setSelectedRange] = useState("30d");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Executive stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active Incidents", val: "0", sub: "Nominal SLA", color: "text-[#22C78A]", dot: "bg-[#22C78A]" },
          { label: "Resolved (7d)", val: "48", sub: "Auto-mitigated", color: "text-white", dot: "bg-[#3978FF]" },
          { label: "Telemetry Uptime", val: "99.98%", sub: "P99 1.4ms", color: "text-[#22C78A]", dot: "bg-[#22C78A]" },
          { label: "Ingestion Throughput", val: "42.8k", sub: "events/sec", color: "text-[#3978FF]", dot: "bg-[#3978FF]" },
        ].map((item, i) => (
          <div key={i} className="rounded-xl bg-[#0D0F14] border border-[#1E222A] p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#6B7280] tracking-wider">{item.label}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
            </div>
            <div className={`text-2xl font-bold font-mono tracking-tight my-2 ${item.color}`}>{item.val}</div>
            <div className="text-[10px] font-mono text-[#6B7280]">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Latency interactive chart */}
      <div className="rounded-xl bg-[#0D0F14] border border-[#1E222A] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-[#F5F6F8]">Request Latency (p99 • Multi-Region Mesh)</h4>
            <p className="text-[11px] font-mono text-[#6B7280]">Telemetry sampled across 3 global gateway clusters</p>
          </div>
          <div className="flex items-center gap-1 bg-[#151820] p-1 rounded-lg border border-[#1E222A]">
            {["24h", "7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRange(r)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  selectedRange === r ? "bg-[#3978FF] text-white" : "text-[#6B7280] hover:text-[#9298A3]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Curve */}
        <div className="relative h-44 w-full border-b border-l border-[#1E222A] mt-6">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="dashGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3978FF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3978FF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,75 L12,70 L25,72 L38,45 L50,52 L65,22 L80,28 L92,8 L100,12"
              fill="none"
              stroke="#3978FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0,75 L12,70 L25,72 L38,45 L50,52 L65,22 L80,28 L92,8 L100,12 L100,100 L0,100 Z"
              fill="url(#dashGrad)"
              stroke="none"
            />
          </svg>
          <div className="absolute -bottom-5 left-0 text-[10px] font-mono text-[#6B7280]">Oct 1</div>
          <div className="absolute -bottom-5 right-0 text-[10px] font-mono text-[#6B7280]">Oct 30</div>
          <div className="absolute top-0 -left-9 text-[10px] font-mono text-[#6B7280]">12ms</div>
          <div className="absolute bottom-0 -left-7 text-[10px] font-mono text-[#6B7280]">0ms</div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => onNavigate("AI Copilot")}
          className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A] hover:border-[#3978FF]/40 text-left transition-all group"
        >
          <div className="flex items-center gap-2 text-[#3978FF] mb-2 text-xs font-mono">
            <Zap size={14} /> AI Copilot Recommendation
          </div>
          <div className="text-[13px] text-white font-medium">Memory leak patch ready</div>
          <p className="text-[11px] text-[#6B7280] mt-1">Sarah K. commit correlation verified in staging.</p>
        </button>

        <button
          onClick={() => onNavigate("Uptime")}
          className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A] hover:border-[#22C78A]/40 text-left transition-all group"
        >
          <div className="flex items-center gap-2 text-[#22C78A] mb-2 text-xs font-mono">
            <Activity size={14} /> Service Health Monitor
          </div>
          <div className="text-[13px] text-white font-medium">6 Services Online</div>
          <p className="text-[11px] text-[#6B7280] mt-1">Payment Service latency degraded to 145ms.</p>
        </button>

        <button
          onClick={() => onNavigate("Logs")}
          className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A] hover:border-white/20 text-left transition-all group"
        >
          <div className="flex items-center gap-2 text-[#9298A3] mb-2 text-xs font-mono">
            <Terminal size={14} /> Live Stream
          </div>
          <div className="text-[13px] text-white font-medium">eBPF Telemetry Engine</div>
          <p className="text-[11px] text-[#6B7280] mt-1">Sub-second state synchronization active.</p>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. AI COPILOT VIEW
   ═══════════════════════════════════════════════════════════════ */
function CopilotView() {
  const [copilotState, setCopilotState] = useState<"initial" | "generating" | "fixed">("initial");

  const runPatch = () => {
    setCopilotState("generating");
    setTimeout(() => setCopilotState("fixed"), 1400);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E222A]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#3978FF]/15 border border-[#3978FF]/30 flex items-center justify-center text-[#3978FF]">
            <Zap size={14} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Autonomous Remediation Copilot</h4>
            <p className="text-[11px] font-mono text-[#6B7280]">Trained on infrastructure traces, commits & logs</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C78A]/10 border border-[#22C78A]/20 text-[#22C78A] text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C78A] animate-pulse" />
          Live Telemetry Agent
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* User Prompt */}
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-[#1E222A] flex items-center justify-center text-[10px] font-mono text-zinc-300 shrink-0">
            JD
          </div>
          <div className="flex-1 bg-[#151820] border border-[#1E222A] p-3.5 rounded-xl rounded-tl-none text-[12.5px] text-[#D1D5DB]">
            Identify root cause for memory spike on <code className="text-[#3978FF] font-mono">payment_service</code> after deployment #8f2a1b9.
          </div>
        </div>

        {/* Copilot Diagnosis */}
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-[#3978FF]/20 border border-[#3978FF]/40 flex items-center justify-center text-[#3978FF] shrink-0">
            <Zap size={13} />
          </div>
          <div className="flex-1 bg-[#0D0F14] border border-[#1E222A] p-4 rounded-xl rounded-tl-none space-y-3">
            <div className="text-[12.5px] text-zinc-300 leading-relaxed">
              Anomaly isolated: Unbounded WebSocket connection buffer detected in commit by <strong>Sarah K. (3h ago)</strong>.
            </div>

            {/* Code diff */}
            <div className="rounded-lg bg-black border border-[#1E222A] p-3 font-mono text-[11.5px] leading-relaxed">
              <div className="text-[#6B7280] pb-1.5 mb-1.5 border-b border-[#1E222A] flex justify-between text-[10px]">
                <span>src/network/websocket_handler.py</span>
                <span>Commit: #8f2a1b9</span>
              </div>
              <div className="text-[#6B7280]">142 |  async def handle_connection(ws, client_id):</div>
              <div className="bg-[#F05252]/10 text-[#F05252] px-2 py-0.5 rounded -mx-1 mt-1">
                143 -      connection_buffer.append(await ws.receive_bytes())  # UNBOUNDED
              </div>
              {copilotState === "fixed" && (
                <div className="bg-[#22C78A]/10 text-[#22C78A] px-2 py-0.5 rounded -mx-1 mt-1">
                  144 +      await ring_buffer.push_capped(ws, max_bytes=65536)  # FIXED
                </div>
              )}
            </div>

            {/* Actions */}
            {copilotState === "initial" && (
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={runPatch}
                  className="px-3.5 py-1.5 bg-[#3978FF] text-white text-[12px] font-semibold rounded-lg hover:bg-[#2B63E0] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Wrench size={13} /> Synthesize Safe Patch
                </button>
                <button
                  onClick={() => alert("Linear issue generated!")}
                  className="px-3 py-1.5 bg-[#151820] border border-[#1E222A] text-zinc-300 text-[12px] rounded-lg hover:bg-[#1E222A] transition-colors"
                >
                  Create Linear Issue
                </button>
              </div>
            )}

            {copilotState === "generating" && (
              <div className="flex items-center gap-2 py-2 text-xs font-mono text-[#3978FF]">
                <RefreshCw size={13} className="animate-spin" /> Synthesizing patch and running dry tests...
              </div>
            )}

            {copilotState === "fixed" && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#22C78A]">
                  <Check size={14} /> Patch synthesized · 14/14 automated staging checks passed
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("PR #342 created with automated canary verification!")}
                    className="px-3.5 py-1.5 bg-[#22C78A] text-black text-[12px] font-semibold rounded-lg hover:bg-[#1BA874] transition-colors flex items-center gap-1.5"
                  >
                    <GitBranch size={13} /> Create Pull Request #342
                  </button>
                  <button
                    onClick={() => setCopilotState("initial")}
                    className="px-3 py-1.5 text-xs text-[#6B7280] hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. INBOX VIEW
   ═══════════════════════════════════════════════════════════════ */
function InboxView() {
  const [filter, setFilter] = useState<"All" | "Unread" | "Critical">("All");
  const [items, setItems] = useState([
    { id: 1, title: "P0 Alert: PostgreSQL connection pool spike", time: "3m ago", unread: true, sev: "critical", detail: "Pool reached 94/100 active connections on cluster db-primary-01." },
    { id: 2, title: "Deployment v3.12.1 deployed to Production", time: "18m ago", unread: true, sev: "info", detail: "14 commits released by Sarah K. Health checks passed across all 3 regions." },
    { id: 3, title: "Synthetic canary test passed on EU-Central", time: "1h ago", unread: false, sev: "success", detail: "P99 latency checked at 1.1ms. 0 dropped packets." },
    { id: 4, title: "Memory headroom warning on worker-node-03", time: "3h ago", unread: false, sev: "warning", detail: "Available heap dropped below 15%. Auto-scaling scheduled." },
  ]);

  const markAllRead = () => {
    setItems(items.map(it => ({ ...it, unread: false })));
  };

  const filtered = items.filter(it => {
    if (filter === "Unread") return it.unread;
    if (filter === "Critical") return it.sev === "critical";
    return true;
  });

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E222A]">
        <div>
          <h4 className="text-sm font-semibold text-white">Operational Notification Inbox</h4>
          <p className="text-[11px] font-mono text-[#6B7280]">Aggregated telemetry alerts, mentions & releases</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#151820] p-1 rounded-lg border border-[#1E222A]">
            {(["All", "Unread", "Critical"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                  filter === f ? "bg-[#242831] text-white" : "text-[#6B7280] hover:text-[#9298A3]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={markAllRead}
            className="px-2.5 py-1 text-[11px] font-mono text-[#6B7280] hover:text-white transition-colors"
          >
            Mark all read
          </button>
        </div>
      </div>

      <div className="divide-y divide-[#1A1D24] mt-3">
        {filtered.map(item => (
          <div key={item.id} className="py-3 px-3 hover:bg-[#151820]/40 rounded-lg transition-colors flex items-start justify-between group">
            <div className="flex items-start gap-3">
              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                item.sev === "critical" ? "bg-[#F05252]" : item.sev === "warning" ? "bg-[#E8AA42]" : item.sev === "success" ? "bg-[#22C78A]" : "bg-[#3978FF]"
              } ${item.unread ? "animate-pulse ring-2 ring-white/10" : "opacity-60"}`} />
              <div>
                <div className={`text-[13px] ${item.unread ? "text-white font-medium" : "text-[#9298A3]"}`}>{item.title}</div>
                <div className="text-[11px] text-[#6B7280] mt-0.5 leading-relaxed">{item.detail}</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#6B7280] shrink-0 ml-4">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. TEAMS VIEW
   ═══════════════════════════════════════════════════════════════ */
function TeamsView() {
  const [activeRotation, setActiveRotation] = useState("current");

  const roster = [
    { name: "Sarah K.", role: "Lead SRE", shift: "EMEA Primary", onCall: true, tz: "UTC+1", status: "Active" },
    { name: "Marcus L.", role: "DevOps Engineer", shift: "Americas Primary", onCall: true, tz: "UTC-5", status: "Active" },
    { name: "Ganesh V.", role: "Data Infrastructure Lead", shift: "APAC Shadow", onCall: false, tz: "UTC+2", status: "Standby" },
    { name: "Pururaj V.", role: "Platform Architect", shift: "Secondary Escalation", onCall: false, tz: "UTC+5:30", status: "Standby" },
  ];

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E222A]">
        <div>
          <h4 className="text-sm font-semibold text-white">On-Call Engineering Roster</h4>
          <p className="text-[11px] font-mono text-[#6B7280]">SRE escalation rotation & active duty engineers</p>
        </div>
        <div className="flex items-center gap-1 bg-[#151820] p-1 rounded-lg border border-[#1E222A]">
          <button
            onClick={() => setActiveRotation("current")}
            className={`px-2.5 py-1 rounded text-[10px] font-mono ${
              activeRotation === "current" ? "bg-[#3978FF] text-white" : "text-[#6B7280]"
            }`}
          >
            Current Rotation
          </button>
          <button
            onClick={() => setActiveRotation("next")}
            className={`px-2.5 py-1 rounded text-[10px] font-mono ${
              activeRotation === "next" ? "bg-[#3978FF] text-white" : "text-[#6B7280]"
            }`}
          >
            Next Week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {roster.map((m, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#151820] border border-[#242831] flex items-center justify-center font-mono text-sm text-white">
                {m.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-white">{m.name}</span>
                  {m.onCall && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#22C78A]/15 text-[#22C78A] border border-[#22C78A]/30">
                      ON-CALL
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#6B7280]">{m.role} • {m.tz}</div>
                <div className="text-[10px] font-mono text-[#3978FF] mt-0.5">{m.shift}</div>
              </div>
            </div>
            <button
              onClick={() => alert(`Paged ${m.name} via BREXAL PagerDuty integration!`)}
              className="px-2.5 py-1 rounded-md bg-[#151820] hover:bg-[#242831] border border-[#242831] text-[11px] font-mono text-[#D1D5DB] transition-colors"
            >
              Page
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. KANBAN VIEW
   ═══════════════════════════════════════════════════════════════ */
function KanbanView() {
  const [columns] = useState([
    {
      title: "Backlog",
      tasks: [
        { id: "TASK-104", title: "Migrate legacy ingress to Envoy eBPF mesh", tag: "Mesh", prio: "P1" },
        { id: "TASK-105", title: "Automate token rotation on Redis cluster", tag: "Security", prio: "P2" },
      ],
    },
    {
      title: "In Progress",
      tasks: [
        { id: "TASK-102", title: "Cap WebSocket ring buffer in payment worker", tag: "Hotfix", prio: "P0" },
      ],
    },
    {
      title: "In Review",
      tasks: [
        { id: "TASK-098", title: "Implement mutual TLS cert auto-provisioning", tag: "mTLS", prio: "P1" },
      ],
    },
    {
      title: "Done",
      tasks: [
        { id: "TASK-091", title: "Upgrade ClickHouse telemetry cluster to v24.3", tag: "Infra", prio: "P1" },
      ],
    },
  ]);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E222A]">
        <div>
          <h4 className="text-sm font-semibold text-white">SRE Sprint & Incident Board</h4>
          <p className="text-[11px] font-mono text-[#6B7280]">Live synchronized sprint engineering pipeline</p>
        </div>
        <button
          onClick={() => alert("New task draft created!")}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#3978FF] text-white text-[11px] font-mono font-medium hover:bg-[#2B63E0] transition-colors"
        >
          <Plus size={12} /> New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 overflow-x-auto">
        {columns.map((col, idx) => (
          <div key={idx} className="rounded-xl bg-[#0D0F14] border border-[#1E222A] p-3 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-mono uppercase text-[#6B7280] font-semibold">{col.title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#151820] text-[#9298A3]">
                {col.tasks.length}
              </span>
            </div>
            <div className="space-y-2.5 flex-1">
              {col.tasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => alert(`Inspecting ${t.id}: ${t.title}`)}
                  className="p-3 rounded-lg bg-[#151820] border border-[#242831] hover:border-[#3978FF]/40 cursor-pointer transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-[#6B7280]">{t.id}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      t.prio === "P0" ? "bg-[#F05252]/15 text-[#F05252]" : "bg-[#3978FF]/15 text-[#3978FF]"
                    }`}>
                      {t.prio}
                    </span>
                  </div>
                  <div className="text-[12px] text-white font-medium leading-snug">{t.title}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#6B7280] bg-black/40 px-1.5 py-0.5 rounded border border-[#242831]">
                      {t.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. ISSUES & BUGS VIEW
   ═══════════════════════════════════════════════════════════════ */
function IssuesView() {
  const issues = [
    { id: "BUG-201", title: "WebSocket connection leak under high burst load", commit: "#8f2a1b9", prio: "P0", author: "Sarah K.", impact: "+42MB/hr", status: "In Triage" },
    { id: "BUG-202", title: "Payment gateway timeout fallback triggers twice", commit: "#e39a2b1", prio: "P1", author: "DevOps Bot", impact: "+120ms P99", status: "Investigating" },
    { id: "BUG-203", title: "PostgreSQL slow query on /api/v2/audit_trail", commit: "#12c49a0", prio: "P2", author: "Marcus L.", impact: "Query 840ms", status: "Resolved" },
  ];

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E222A]">
        <div>
          <h4 className="text-sm font-semibold text-white">Anomalous Commit Correlation</h4>
          <p className="text-[11px] font-mono text-[#6B7280]">Correlates latency & memory anomalies directly to offending Git commits</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#F05252]/10 text-[#F05252] border border-[#F05252]/20 text-[10px] font-mono">
            1 Active Anomaly
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#1E222A] mt-2">
        {issues.map(iss => (
          <div key={iss.id} className="py-3.5 px-3 rounded-lg hover:bg-[#151820]/40 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                iss.prio === "P0" ? "bg-[#F05252]/15 text-[#F05252] border border-[#F05252]/30" : "bg-[#E8AA42]/15 text-[#E8AA42]"
              }`}>
                {iss.prio}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-white font-medium">{iss.title}</span>
                  <span className="text-[11px] font-mono text-[#3978FF]">{iss.commit}</span>
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">Author: {iss.author} • Impact: {iss.impact}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#9298A3]">{iss.status}</span>
              <button
                onClick={() => alert(`Opening diagnostic diff for ${iss.commit}`)}
                className="px-2.5 py-1 rounded bg-[#151820] hover:bg-[#242831] border border-[#242831] text-[11px] font-mono text-white transition-colors"
              >
                Inspect Diff
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. ROADMAP VIEW
   ═══════════════════════════════════════════════════════════════ */
function RoadmapView() {
  const quarters = [
    {
      quarter: "Q1 2026",
      status: "Shipped",
      items: [
        { title: "eBPF Zero-Overhead Telemetry Mesh", progress: 100 },
        { title: "Sub-millisecond State Synchronization", progress: 100 },
      ],
    },
    {
      quarter: "Q2 2026",
      status: "In Progress",
      items: [
        { title: "Autonomous Rollback Engine with AI Verification", progress: 85 },
        { title: "Multi-Cloud VPC Peering & Mutual mTLS 1.3", progress: 60 },
      ],
    },
    {
      quarter: "Q3 2026",
      status: "Planned",
      items: [
        { title: "Cryptographic Distributed Audit Hash Ledger", progress: 20 },
        { title: "Global Latency Routing via Anycast Edges", progress: 10 },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E222A]">
        <div>
          <h4 className="text-sm font-semibold text-white">Engineering Architecture Roadmap</h4>
          <p className="text-[11px] font-mono text-[#6B7280]">Quarterly deliverables & telemetry milestones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {quarters.map((q, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-white">{q.quarter}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  q.status === "Shipped" ? "bg-[#22C78A]/15 text-[#22C78A]" : q.status === "In Progress" ? "bg-[#3978FF]/15 text-[#3978FF]" : "bg-[#6B7280]/15 text-[#6B7280]"
                }`}>
                  {q.status}
                </span>
              </div>
              <div className="space-y-4 mt-4">
                {q.items.map((it, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[12px] text-zinc-300">
                      <span>{it.title}</span>
                      <span className="font-mono text-[#6B7280]">{it.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#151820] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${it.progress === 100 ? "bg-[#22C78A]" : "bg-[#3978FF]"}`}
                        style={{ width: `${it.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. UPTIME VIEW (SERVICE HEALTH)
   ═══════════════════════════════════════════════════════════════ */
function UptimeView() {
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const services = [
    { name: "API Gateway", status: "Operational", latency: "12ms", errorRate: "0.02%", rps: "8,421", checked: "2s ago" },
    { name: "Authentication Service", status: "Operational", latency: "8ms", errorRate: "0.00%", rps: "3,218", checked: "5s ago" },
    { name: "Payment Service", status: "Degraded", latency: "145ms", errorRate: "1.24%", rps: "1,847", checked: "3s ago" },
    { name: "PostgreSQL Database", status: "Operational", latency: "3ms", errorRate: "0.00%", rps: "12,490", checked: "1s ago" },
    { name: "Redis Cache Cluster", status: "Operational", latency: "0.4ms", errorRate: "0.00%", rps: "45,200", checked: "1s ago" },
    { name: "Background Workers", status: "Warning", latency: "—", errorRate: "0.31%", rps: "924", checked: "8s ago" },
  ];

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E222A]">
        <div>
          <h4 className="text-sm font-semibold text-white">Live Service Health Monitor</h4>
          <p className="text-[11px] font-mono text-[#6B7280]">Real-time probing across 6 core microservices</p>
        </div>
        <div className="flex items-center gap-1 bg-[#151820] p-1 rounded-lg border border-[#1E222A]">
          {["Global", "US-East", "EU-Central", "AP-South"].map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                selectedRegion === r ? "bg-[#3978FF] text-white" : "text-[#6B7280] hover:text-[#9298A3]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-[#1E222A] mt-3">
        <div className="grid grid-cols-[1fr_110px_90px_90px_90px_80px] gap-2 px-3 py-2 text-[10px] font-mono uppercase text-[#6B7280] font-semibold">
          <span>Service</span>
          <span>Status</span>
          <span className="text-right">Latency</span>
          <span className="text-right">Error %</span>
          <span className="text-right">Req/s</span>
          <span className="text-right">Checked</span>
        </div>
        {services.map((s, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_110px_90px_90px_90px_80px] gap-2 px-3 py-3 items-center hover:bg-[#151820]/40 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${
                s.status === "Operational" ? "bg-[#22C78A]" : "bg-[#E8AA42] animate-ping"
              }`} />
              <span className="text-[13px] text-white font-medium">{s.name}</span>
            </div>
            <span className={`text-[11px] font-mono ${
              s.status === "Operational" ? "text-[#22C78A]" : "text-[#E8AA42]"
            }`}>
              {s.status}
            </span>
            <span className="text-[12px] font-mono text-right text-zinc-300">{s.latency}</span>
            <span className={`text-[12px] font-mono text-right ${parseFloat(s.errorRate) > 0.5 ? "text-[#F05252]" : "text-zinc-300"}`}>
              {s.errorRate}
            </span>
            <span className="text-[12px] font-mono text-right text-zinc-300">{s.rps}</span>
            <span className="text-[11px] font-mono text-right text-[#6B7280]">{s.checked}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. INFRASTRUCTURE VIEW
   ═══════════════════════════════════════════════════════════════ */
function InfrastructureView() {
  const [selectedNode, setSelectedNode] = useState("node-01");

  const nodes = [
    { id: "node-01", cpu: 67, mem: 74, disk: 42, net: 31, status: "Healthy" },
    { id: "node-02", cpu: 44, mem: 62, disk: 38, net: 28, status: "Healthy" },
    { id: "node-03", cpu: 89, mem: 88, disk: 55, net: 42, status: "High Load" },
  ];

  const current = nodes.find(n => n.id === selectedNode) || nodes[0];

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E222A]">
        <div>
          <h4 className="text-sm font-semibold text-white">Cluster Resource Utilization</h4>
          <p className="text-[11px] font-mono text-[#6B7280]">Kubernetes node pool telemetry (16 cores, 64GB RAM)</p>
        </div>
        <div className="flex items-center gap-1 bg-[#151820] p-1 rounded-lg border border-[#1E222A]">
          {nodes.map(n => (
            <button
              key={n.id}
              onClick={() => setSelectedNode(n.id)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                selectedNode === n.id ? "bg-[#3978FF] text-white" : "text-[#6B7280] hover:text-[#9298A3]"
              }`}
            >
              {n.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          { label: "CPU LOAD", val: `${current.cpu}%`, icon: Cpu, color: "#3978FF", sub: "16 vCPUs active" },
          { label: "MEMORY", val: `${current.mem}%`, icon: HardDrive, color: "#A855F7", sub: "47.2GB / 64GB" },
          { label: "DISK I/O", val: `${current.disk}%`, icon: Sliders, color: "#22C78A", sub: "NVMe IOPS: 12.4k" },
          { label: "NETWORK", val: `${current.net} Mbps`, icon: Wifi, color: "#06B6D4", sub: "0 dropped packets" },
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-[#6B7280]">{m.label}</span>
                <Icon size={14} style={{ color: m.color }} />
              </div>
              <div className="text-2xl font-bold font-mono text-white my-1">{m.val}</div>
              <div className="h-1.5 w-full bg-[#151820] rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: m.val.replace(" Mbps", ""), backgroundColor: m.color }}
                />
              </div>
              <div className="text-[10px] font-mono text-[#6B7280] mt-2">{m.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. LOGS VIEW (LIVE STREAMING)
   ═══════════════════════════════════════════════════════════════ */
function LogsView() {
  const [isPaused, setIsPaused] = useState(false);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [logs, setLogs] = useState([
    { ts: "14:32:01.214", lvl: "INFO", src: "api-gw", msg: "GET /api/v2/workspaces 200 (1.4ms) [trace_id=8f2a1b9]" },
    { ts: "14:32:01.842", lvl: "WARN", src: "worker-03", msg: "Heap allocation warning: 89% threshold reached" },
    { ts: "14:32:02.109", lvl: "INFO", src: "auth-svc", msg: "mTLS handshake verified sha256:4f81...9c2e" },
    { ts: "14:32:02.491", lvl: "ERROR", src: "payment-svc", msg: "Upstream gateway connection reset by peer (retrying 1/3)" },
    { ts: "14:32:02.910", lvl: "INFO", src: "mesh-ebpf", msg: "Packets routed: 4,891 pkts/sec without kernel context switches" },
  ]);

  const addLog = () => {
    if (isPaused) return;
    const now = new Date();
    const ts = now.toTimeString().split(" ")[0] + "." + Math.floor(Math.random() * 900 + 100);
    const mock = [
      { ts, lvl: "INFO", src: "api-gw", msg: `GET /api/v2/telemetry 200 (${(Math.random() * 2 + 0.8).toFixed(1)}ms)` },
      { ts, lvl: "INFO", src: "redis-cache", msg: "Cache hit: key=session_tenant_941 (0.2ms)" },
      { ts, lvl: "WARN", src: "pg-pool", msg: "Connection pool occupancy: 78/100 connections" },
    ];
    setLogs(prev => [...prev.slice(-8), mock[Math.floor(Math.random() * mock.length)]]);
  };

  useEffect(() => {
    const t = setInterval(addLog, 2200);
    return () => clearInterval(t);
  }, [isPaused]);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E222A]">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-white">Live eBPF Telemetry Log Stream</h4>
          <span className={`w-2 h-2 rounded-full ${isPaused ? "bg-[#E8AA42]" : "bg-[#22C78A] animate-pulse"}`} />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#151820] p-1 rounded-lg border border-[#1E222A]">
            {["ALL", "INFO", "WARN", "ERROR"].map(l => (
              <button
                key={l}
                onClick={() => setFilterLevel(l)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  filterLevel === l ? "bg-[#242831] text-white" : "text-[#6B7280]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#151820] border border-[#242831] text-[11px] font-mono text-[#D1D5DB] hover:text-white"
          >
            {isPaused ? <Play size={11} /> : <Pause size={11} />} {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <div className="mt-3 p-4 rounded-xl bg-black border border-[#1E222A] font-mono text-[11.5px] leading-relaxed flex-1 overflow-y-auto space-y-1.5">
        {logs.map((l, i) => (
          <div key={i} className="flex items-start gap-2 text-zinc-300">
            <span className="text-[#6B7280] select-none">{l.ts}</span>
            <span className={`font-bold select-none ${
              l.lvl === "ERROR" ? "text-[#F05252]" : l.lvl === "WARN" ? "text-[#E8AA42]" : "text-[#3978FF]"
            }`}>
              [{l.lvl}]
            </span>
            <span className="text-[#9298A3] select-none">&lt;{l.src}&gt;</span>
            <span className="text-white flex-1">{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   11. MAINTENANCE VIEW
   ═══════════════════════════════════════════════════════════════ */
function MaintenanceView() {
  const [draining, setDraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const startDrain = () => {
    setDraining(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setDraining(false);
          return 100;
        }
        return p + 25;
      });
    }, 400);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E222A]">
        <div>
          <h4 className="text-sm font-semibold text-white">Cluster Maintenance & Zero-Downtime Rollout</h4>
          <p className="text-[11px] font-mono text-[#6B7280]">Rolling update orchestrator with automatic canary verification</p>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <div className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A] flex items-center justify-between">
          <div>
            <div className="text-[13px] text-white font-medium">Pod Pool Drain Simulation</div>
            <p className="text-[11px] text-[#6B7280]">Gracefully drain connections from Worker Node 03 before host maintenance</p>
            {draining && (
              <div className="mt-2 text-xs font-mono text-[#3978FF]">
                Draining pods: {progress}% complete...
              </div>
            )}
          </div>
          <button
            onClick={startDrain}
            disabled={draining}
            className="px-3.5 py-1.5 rounded-lg bg-[#3978FF] text-white text-[12px] font-mono font-medium hover:bg-[#2B63E0] transition-colors disabled:opacity-50"
          >
            {draining ? "Draining..." : "Simulate Node Drain"}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A]">
          <div className="text-[12px] font-mono uppercase text-[#6B7280] mb-3">Active Canary Rollout</div>
          <div className="flex items-center justify-between text-xs text-white mb-1.5">
            <span>Canary Traffic Allocation: v3.12.1</span>
            <span className="font-mono text-[#22C78A]">25% Traffic Routed</span>
          </div>
          <div className="h-2 w-full bg-[#151820] rounded-full overflow-hidden">
            <div className="h-full bg-[#22C78A] rounded-full" style={{ width: "25%" }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#6B7280]">
            <span>Error threshold: 0.1%</span>
            <span>Auto-rollback trigger: ARMED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   12. SETTINGS VIEW
   ═══════════════════════════════════════════════════════════════ */
function SettingsView() {
  const [mtls, setMtls] = useState(true);
  const [ebpf, setEbpf] = useState(true);
  const [copilotAuto, setCopilotAuto] = useState(true);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E222A]">
        <div>
          <h4 className="text-sm font-semibold text-white">Workspace & Security Configuration</h4>
          <p className="text-[11px] font-mono text-[#6B7280]">Mutual TLS certificates, eBPF telemetry hooks & access tokens</p>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {[
          { title: "Mutual TLS (mTLS) Encryption", desc: "Cryptographic peer certificates for all internal service mesh calls", state: mtls, setter: setMtls },
          { title: "eBPF Low-Level Kernel Hooking", desc: "Sub-millisecond packet introspection without user-space context overhead", state: ebpf, setter: setEbpf },
          { title: "Autonomous AI Copilot Patch Validation", desc: "Synthesize test-verified PR drafts when anomalous stack traces occur", state: copilotAuto, setter: setCopilotAuto },
        ].map((s, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A] flex items-center justify-between">
            <div>
              <div className="text-[13px] text-white font-medium">{s.title}</div>
              <div className="text-[11px] text-[#6B7280] mt-0.5">{s.desc}</div>
            </div>
            <button
              onClick={() => s.setter(!s.state)}
              className={`w-11 h-6 rounded-full transition-colors relative ${s.state ? "bg-[#3978FF]" : "bg-[#242831]"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${s.state ? "left-6" : "left-1"}`} />
            </button>
          </div>
        ))}

        <div className="p-4 rounded-xl bg-[#0D0F14] border border-[#1E222A] flex items-center justify-between">
          <div>
            <div className="text-[13px] text-white font-medium">Session Certificate Fingerprint</div>
            <div className="text-[11px] font-mono text-[#3978FF] mt-0.5">sha256:4f81a7b2...9c2ed810 (Verified)</div>
          </div>
          <button
            onClick={() => alert("Certificate rotated successfully!")}
            className="px-3 py-1.5 rounded-lg bg-[#151820] hover:bg-[#242831] border border-[#242831] text-[11px] font-mono text-white transition-colors"
          >
            Rotate Key
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SHOWCASE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function OperationalShowcase() {
  const [activeTab, setActiveTab] = useState<FeatureTab>("Dashboard");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    OVERVIEW: true,
    COMMUNICATION: true,
    PLANNING: true,
    OPERATIONS: true,
    SYSTEM: true,
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

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

      {/* ──────── Dashboard Frame (Centerpiece) ──────── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.15 }}
        className="w-full max-w-[1280px] mx-auto rounded-2xl overflow-hidden border border-[#242831] shadow-[0_40px_120px_rgba(0,0,0,0.85)] bg-[#101216] flex flex-col"
      >
        {/* ── Chrome Header ── */}
        <div className="h-11 border-b border-[#1E222A] bg-[#0D0F14] flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Traffic Lights */}
            <div className="flex gap-1.5">
              <div className="w-[10px] h-[10px] rounded-full bg-[#F05252]/80" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#E8AA42]/80" />
              <div className="w-[10px] h-[10px] rounded-full bg-[#22C78A]/80" />
            </div>
            {/* Address Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-[#151820] border border-[#1E222A] rounded-md px-3 py-1 text-[11px] font-mono text-[#6B7280]">
              <Search size={11} />
              <span>brexal.io/workspace/{activeTab.toLowerCase().replace(/\s+/g, "-")}</span>
            </div>
          </div>

          {/* Right Header Indicators */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22C78A]/10 border border-[#22C78A]/20 text-[#22C78A] text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C78A] animate-pulse" />
              Connected • 1.4ms
            </span>
            <div className="w-6 h-6 rounded-full bg-[#242831] border border-[#1E222A] flex items-center justify-center text-[10px] font-mono text-white">
              JD
            </div>
          </div>
        </div>

        {/* ── Body: Sidebar + Active View ── */}
        <div className="flex min-h-[580px] md:min-h-[620px]">
          {/* Sidebar */}
          <div className="w-56 md:w-60 border-r border-[#1E222A] bg-[#0A0C10] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            <div className="p-3 space-y-4">
              {navGroups.map((group, gIdx) => {
                const isExpanded = expandedGroups[group.title];
                return (
                  <div key={gIdx} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-mono tracking-wider uppercase text-[#6B7280] hover:text-[#9298A3] transition-colors"
                    >
                      <span>{group.title}</span>
                      {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                    </button>

                    {isExpanded && (
                      <div className="space-y-0.5">
                        {group.items.map(item => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.name;
                          return (
                            <button
                              key={item.name}
                              onClick={() => setActiveTab(item.name)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all ${
                                isActive
                                  ? "bg-[#3978FF]/15 text-white font-semibold border border-[#3978FF]/30 shadow-sm"
                                  : "text-[#9298A3] hover:text-white hover:bg-[#151820]"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <Icon size={14} className={isActive ? "text-[#3978FF]" : "text-[#6B7280]"} />
                                <span className="truncate">{item.name}</span>
                              </div>
                              {item.badge && (
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${item.badgeColor || "bg-[#1E222A] text-[#9298A3]"}`}>
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Feature Stage */}
          <div className="flex-1 bg-[#101216] flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex-1 flex flex-col overflow-y-auto custom-scrollbar"
              >
                {activeTab === "Dashboard" && <DashboardView onNavigate={setActiveTab} />}
                {activeTab === "AI Copilot" && <CopilotView />}
                {activeTab === "Inbox" && <InboxView />}
                {activeTab === "Teams" && <TeamsView />}
                {activeTab === "Kanban" && <KanbanView />}
                {activeTab === "Issues & Bugs" && <IssuesView />}
                {activeTab === "Roadmap" && <RoadmapView />}
                {activeTab === "Uptime" && <UptimeView />}
                {activeTab === "Infrastructure" && <InfrastructureView />}
                {activeTab === "Logs" && <LogsView />}
                {activeTab === "Maintenance" && <MaintenanceView />}
                {activeTab === "Settings" && <SettingsView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ──────── Capability Highlights Under Frame ──────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.4 }}
        className="w-full max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-3 mt-8"
      >
        {[
          { tab: "Dashboard" as FeatureTab, icon: LayoutDashboard, title: "Unified Executive View", desc: "System health & SLA latency mesh" },
          { tab: "AI Copilot" as FeatureTab, icon: Zap, title: "Autonomous Remediation", desc: "Commit-linked patch validation" },
          { tab: "Uptime" as FeatureTab, icon: Activity, title: "Service Health Monitoring", desc: "Multi-region sub-second probing" },
          { tab: "Infrastructure" as FeatureTab, icon: Server, title: "Compute & Storage Mesh", desc: "Live eBPF node resource telemetry" },
          { tab: "Kanban" as FeatureTab, icon: KanbanSquare, title: "Incident Planning Board", desc: "Synchronized engineering workflows" },
        ].map(cap => {
          const Icon = cap.icon;
          const isActive = activeTab === cap.tab;
          return (
            <button
              key={cap.tab}
              onClick={() => setActiveTab(cap.tab)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 group ${
                isActive
                  ? "bg-[#3978FF]/[0.08] border-[#3978FF]/30 shadow-sm"
                  : "bg-[#101216]/60 border-[#242831]/60 hover:border-[#242831] hover:bg-[#101216]"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                isActive ? "bg-[#3978FF]/20 text-[#3978FF]" : "bg-[#151820] text-[#6B7280] group-hover:text-[#9298A3]"
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

      {/* ──────── CTAs ──────── */}
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
          Explore BREXAL Workspace <ArrowRight size={14} />
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
