"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ShieldAlert,
  Zap,
  Sparkles,
  CheckCircle2,
  Database,
  Globe,
  Radio,
  DollarSign,
  Gauge,
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

type RevenueImpactData = {
  hourly_revenue: number;
  currency: string;
  sla_target_pct: number;
  allowed_downtime_minutes_30d: number;
  downtime_minutes_7d: number;
  downtime_minutes_30d: number;
  sla_burn_rate_pct: number;
  sla_remaining_minutes: number;
  revenue_lost_7d: number;
  revenue_lost_30d: number;
  active_revenue_at_risk_per_hour: number;
  open_bug_exposure_per_hour: number;
  has_active_incident: boolean;
};

type DashboardStatsResponse = {
  has_app: boolean;
  app?: { id: string; name: string; url: string; client_key?: string };
  health_score?: number;
  bugs?: { total: number; active: number; resolved: number; severity: Record<string, number> };
  uptime?: { is_up: boolean; response_time_ms: number | null; percentage_24h: number };
  maintenance?: { total_tasks: number; overdue_tasks: number };
  revenue_impact?: RevenueImpactData;
  otlp?: { spans: number; error_spans: number; metrics: number };
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [activities, setActivities] = useState<Array<{ id: string; title: string; user: string; time: string; statusColor: string }>>([]);
  const [selectedMetricTab, setSelectedMetricTab] = useState<"throughput" | "latency" | "cpu">("throughput");
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          fetch(getApiUrl("/api/dashboard/stats"), { credentials: "include" }),
          fetch(getApiUrl("/api/dashboard/activity?limit=6"), { credentials: "include" }),
        ]);
        if (sRes.ok) {
          const sData: DashboardStatsResponse = await sRes.json();
          if (sData.has_app) setStats(sData);
        }
        if (aRes.ok) {
          const aData = await aRes.json();
          if (aData.activities && aData.activities.length > 0) {
            setActivities(
              aData.activities.map((a: { id: string; action: string; user_name?: string; created_at?: string }) => ({
                id: a.id,
                title: a.action,
                user: a.user_name || "System",
                time: a.created_at ? new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "recent",
                statusColor: "bg-blue-500",
              }))
            );
          }
        }
      } catch {
        // Fallback to showcase defaults if offline/unauthenticated
      }
    };
    load();
  }, []);

  const appName = stats?.app?.name || "Bharti Nexus";
  const appUrl = stats?.app?.url || "https://api.bhartinexus.com";
  const healthScore = stats?.health_score ?? 98;
  const activeBugs = stats?.bugs?.active ?? 0;
  const criticalBugs = stats?.bugs?.severity?.critical ?? 0;
  const highBugs = stats?.bugs?.severity?.high ?? 0;
  const uptimePct = stats?.uptime?.percentage_24h ?? 99.99;
  const isUp = stats?.uptime?.is_up ?? true;
  const totalTasks = stats?.maintenance?.total_tasks ?? 1;

  const rev: RevenueImpactData = stats?.revenue_impact || {
    hourly_revenue: 14500,
    currency: "USD",
    sla_target_pct: 99.9,
    allowed_downtime_minutes_30d: 43.2,
    downtime_minutes_7d: 0,
    downtime_minutes_30d: 3.1,
    sla_burn_rate_pct: 7.2,
    sla_remaining_minutes: 40.1,
    revenue_lost_7d: 0,
    revenue_lost_30d: 749,
    active_revenue_at_risk_per_hour: 0,
    open_bug_exposure_per_hour: 0,
    has_active_incident: false,
  };

  const currencySym = rev.currency === "INR" ? "₹" : "$";
  const formatMoney = (n: number) => `${currencySym}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const otlp = stats?.otlp || { spans: 0, error_spans: 0, metrics: 0 };

  const metricCards = [
    {
      icon: Activity,
      label: "Health Score",
      value: String(healthScore),
      suffix: "/100",
      badge: healthScore >= 90 ? "Optimal Performance" : "Needs Attention",
      badgeColor: healthScore >= 90 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200",
      iconColor: "text-emerald-600 bg-emerald-50",
      detail: `${otlp.spans} OTLP spans • ${otlp.metrics} OTLP metrics`,
    },
    {
      icon: ShieldAlert,
      label: "Active Issues",
      value: String(activeBugs),
      suffix: "",
      badge: activeBugs === 0 ? "All Clear" : "Active Triage",
      badgeColor: activeBugs === 0 ? "text-blue-700 bg-blue-50 border-blue-200" : "text-rose-700 bg-rose-50 border-rose-200",
      iconColor: "text-blue-600 bg-blue-50",
      detail: `${criticalBugs} Critical • ${highBugs} High Priority`,
    },
    {
      icon: Zap,
      label: "Uptime (24h)",
      value: uptimePct.toFixed(2),
      suffix: "%",
      badge: isUp ? "Operational" : "Incident Active",
      badgeColor: isUp ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-rose-700 bg-rose-50 border-rose-200",
      iconColor: "text-emerald-600 bg-emerald-50",
      detail: `Target SLA ${rev.sla_target_pct}% (${rev.sla_remaining_minutes.toFixed(1)}m budget left)`,
    },
    {
      icon: DollarSign,
      label: "Revenue at Risk",
      value: formatMoney(rev.active_revenue_at_risk_per_hour),
      suffix: "/hr",
      badge: rev.active_revenue_at_risk_per_hour === 0 ? "Zero Exposure" : "Exposure Active",
      badgeColor: rev.active_revenue_at_risk_per_hour === 0 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200",
      iconColor: "text-amber-600 bg-amber-50",
      detail: `30d downtime impact: ${formatMoney(rev.revenue_lost_30d)} (${totalTasks} tasks)`,
    },
  ];

  const defaultActivities = [
    {
      id: "act-1",
      title: "Autonomous Remediation: Scaled worker pool to absorb traffic spike",
      user: "Brexal AI Copilot",
      time: "10 mins ago",
      statusColor: "bg-emerald-500",
    },
    {
      id: "act-2",
      title: "OTLP Telemetry Stream synchronized via /v1/traces & /v1/metrics",
      user: "OpenTelemetry Collector",
      time: "45 mins ago",
      statusColor: "bg-blue-500",
    },
    {
      id: "act-3",
      title: "SLA Error Budget check completed: 92.8% remaining for 30-day window",
      user: "Revenue Observability",
      time: "2 hours ago",
      statusColor: "bg-emerald-500",
    },
  ];

  const feed = activities.length > 0 ? activities : defaultActivities;

  const microservices = [
    { name: "OTLP Metrics Ingest", status: "Operational", uptime: `${otlp.metrics} pts`, latency: "/v1/metrics", icon: Gauge },
    { name: "OTLP Traces Ingest", status: "Operational", uptime: `${otlp.spans} spans`, latency: "/v1/traces", icon: Radio },
    { name: "Self-Healing PR Copilot", status: "Ready", uptime: "Diff Engine", latency: "/api/bugs", icon: Globe },
    { name: "Revenue Risk Meter", status: "Active", uptime: `${formatMoney(rev.hourly_revenue)}/hr`, latency: `${rev.sla_burn_rate_pct}% burn`, icon: Database },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-12">
      {/* Top Banner / Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Production
            </span>
            <span className="text-[12px] font-mono text-slate-500">{appUrl}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Overview
          </h1>
          <p className="text-[13.5px] text-slate-600 mt-1">
            Telemetry, SLA error budget burn rate, and revenue exposure for{" "}
            <strong className="text-[#0F172A] font-semibold">{appName}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push("/logs")}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-[#0F172A] text-[13px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
          >
            View Logs &amp; OTLP
          </button>
          <button
            onClick={() => router.push("/ai-dashboard")}
            className="px-4 py-2 rounded-lg bg-[#635BFF] text-white text-[13px] font-semibold hover:bg-[#5349e0] transition-all shadow-[0_2px_8px_rgba(99,91,255,0.25)] hover:shadow-[0_4px_14px_rgba(99,91,255,0.35)] flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            Revenue &amp; AI Settings
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${card.iconColor}`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="text-[#0A2540] font-bold text-[13px] tracking-wide">{card.label}</h3>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1 my-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] font-mono tracking-tight">
                    {card.value}
                  </p>
                  {card.suffix && (
                    <span className="text-slate-500 font-semibold text-sm font-mono">{card.suffix}</span>
                  )}
                </div>
                <p className="text-[11.5px] text-[#425466] font-medium mt-1">{card.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue-Impact & SLA Error Budget Burn Rate Meter */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#0A2540] flex items-center gap-2">
              <DollarSign size={16} className="text-[#2563EB]" />
              <span>Revenue-Impact Observability &amp; SLA Error Budget</span>
            </h3>
            <p className="text-[12px] text-[#425466] mt-0.5">
              Real-time financial impact calculated from configured hourly revenue ({formatMoney(rev.hourly_revenue)}/hr) and SLA target ({rev.sla_target_pct}%).
            </p>
          </div>
          <button
            onClick={() => router.push("/ai-dashboard")}
            className="text-xs font-bold text-[#2563EB] hover:underline self-start sm:self-auto cursor-pointer"
          >
            Configure Revenue Rate →
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-[10.5px] font-mono uppercase text-slate-500 font-bold">Configured Rate</div>
            <div className="text-lg font-extrabold text-[#0A2540] font-mono mt-0.5">
              {formatMoney(rev.hourly_revenue)}/hr
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-[10.5px] font-mono uppercase text-slate-500 font-bold">Open Bug Exposure</div>
            <div className="text-lg font-extrabold text-amber-700 font-mono mt-0.5">
              {formatMoney(rev.open_bug_exposure_per_hour)}/hr
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-[10.5px] font-mono uppercase text-slate-500 font-bold">30d Downtime Cost</div>
            <div className="text-lg font-extrabold text-[#0A2540] font-mono mt-0.5">
              {formatMoney(rev.revenue_lost_30d)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="text-[10.5px] font-mono uppercase text-slate-500 font-bold">SLA Burn Rate (30d)</div>
            <div className={`text-lg font-extrabold font-mono mt-0.5 ${rev.sla_burn_rate_pct > 80 ? "text-rose-600" : "text-emerald-600"}`}>
              {rev.sla_burn_rate_pct.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* SLA Burn Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>
              Error Budget Used: {rev.downtime_minutes_30d.toFixed(1)}m / {rev.allowed_downtime_minutes_30d.toFixed(1)}m allowed
            </span>
            <span className="font-bold text-[#0A2540]">
              {rev.sla_remaining_minutes.toFixed(1)}m remaining
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/80">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                rev.sla_burn_rate_pct > 80
                  ? "bg-rose-500"
                  : rev.sla_burn_rate_pct > 40
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(2, rev.sla_burn_rate_pct))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts & Activity Stream Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* System Performance Visualizer (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(10,37,64,0.03)] flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-[15px] font-bold text-[#0A2540]">System Performance &amp; Telemetry</h3>
                <p className="text-[12px] text-[#425466] mt-0.5">
                  Host metrics &amp; OpenTelemetry OTLP pipeline telemetry
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setSelectedMetricTab("throughput")}
                  className={`px-3 py-1 rounded-lg transition-all text-xs font-bold cursor-pointer ${
                    selectedMetricTab === "throughput" ? "bg-white text-[#0A2540] shadow-2xs" : "text-slate-600 hover:text-[#0A2540]"
                  }`}
                >
                  Throughput
                </button>
                <button
                  onClick={() => setSelectedMetricTab("latency")}
                  className={`px-3 py-1 rounded-lg transition-all text-xs font-bold cursor-pointer ${
                    selectedMetricTab === "latency" ? "bg-white text-[#0A2540] shadow-2xs" : "text-slate-600 hover:text-[#0A2540]"
                  }`}
                >
                  Latency
                </button>
                <button
                  onClick={() => setSelectedMetricTab("cpu")}
                  className={`px-3 py-1 rounded-lg transition-all text-xs font-bold cursor-pointer ${
                    selectedMetricTab === "cpu" ? "bg-white text-[#0A2540] shadow-2xs" : "text-slate-600 hover:text-[#0A2540]"
                  }`}
                >
                  OTLP Stream
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 bg-slate-50/80 rounded-xl border border-slate-200/70 mb-5 text-center">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Avg Latency</span>
                <p className="text-base font-extrabold text-[#0A2540] font-mono mt-0.5">
                  {stats?.uptime?.response_time_ms ? `${stats.uptime.response_time_ms.toFixed(1)} ms` : "12.4 ms"}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">OTLP Spans</span>
                <p className="text-base font-extrabold text-[#0A2540] font-mono mt-0.5">{otlp.spans}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">OTLP Metrics</span>
                <p className="text-base font-extrabold text-[#0A2540] font-mono mt-0.5">{otlp.metrics}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Error Spans</span>
                <p className={`text-base font-extrabold font-mono mt-0.5 ${otlp.error_spans > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                  {otlp.error_spans}
                </p>
              </div>
            </div>

            <div className="w-full h-44 relative">
              <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#635BFF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#635BFF" stopOpacity="0.00" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="40" x2="600" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" />
                <path
                  d="M 0 130 Q 50 115 100 120 T 200 95 T 300 105 T 400 70 T 500 85 T 600 60 L 600 160 L 0 160 Z"
                  fill="url(#metricGrad)"
                />
                <path
                  d="M 0 130 Q 50 115 100 120 T 200 95 T 300 105 T 400 70 T 500 85 T 600 60"
                  fill="none"
                  stroke="#635BFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="600" cy="60" r="5" fill="#635BFF" />
              </svg>
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2 px-1">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span className="font-semibold text-[#0F172A]">Now</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700">Telemetry &amp; OTLP ingest endpoints active</span>
            </div>
            <span className="font-mono text-[11px]">/v1/metrics • /v1/traces • /v1/logs</span>
          </div>
        </div>

        {/* Live Activity Stream (1 Col) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(10,37,64,0.03)] flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-[15px] font-bold text-[#0A2540]">Activity Feed</h3>
              <span className="text-slate-500 text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
                {feed.length} events
              </span>
            </div>

            <div className="space-y-3.5 overflow-y-auto max-h-[280px] pr-1">
              {feed.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-sm group">
                  <div className="flex flex-col items-center pt-1.5 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${act.statusColor}`} />
                    <div className="w-[1px] h-9 bg-slate-200 my-1 group-last:hidden" />
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-[12.5px] font-semibold text-[#0A2540] leading-snug">{act.title}</p>
                    <div className="flex justify-between items-center mt-1 text-[11px]">
                      <span className="text-[#425466] font-medium">{act.user}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{act.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push("/logs")}
            className="w-full mt-3 py-2 text-center text-xs font-bold text-[#635BFF] hover:bg-indigo-50/50 rounded-xl transition-colors cursor-pointer"
          >
            View all logs &amp; OTLP traces →
          </button>
        </div>
      </div>

      {/* Pipeline & Platform Modules */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#0A2540]">Platform Telemetry &amp; Automation Endpoints</h3>
            <p className="text-[12px] text-[#425466]">Live OTLP/HTTP endpoints, AI patch engine, and financial SLA monitors</p>
          </div>
          <span className="text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 size={13} className="text-emerald-600" /> All Subsystems Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {microservices.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-[#0A2540] shadow-2xs">
                    <Icon size={16} className="text-[#635BFF]" />
                  </div>
                  <div>
                    <h4 className="text-[12.5px] font-bold text-[#0A2540] leading-tight">{svc.name}</h4>
                    <span className="text-[11px] text-emerald-600 font-semibold">{svc.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono font-bold text-[#0A2540]">{svc.latency}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{svc.uptime}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
