"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Activity, 
  ShieldAlert, 
  Zap, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  BarChart3, 
  RefreshCw,
  CheckCircle2,
  Server,
  Database,
  Globe,
  Radio,
  ExternalLink,
  Plus
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [appName, setAppName] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [selectedMetricTab, setSelectedMetricTab] = useState<"throughput" | "latency" | "cpu">("throughput");
  const router = useRouter();

  // Realistic Fake App Information
  const fakeApp = {
    name: "Bharti Nexus",
    env: "Production Cluster (us-east-1)",
    url: "https://api.bhartinexus.com",
    role: "ADMIN",
    status: "HEALTHY",
    version: "v2.4.1-rc3"
  };

  const metricCards = [
    {
      icon: Activity,
      label: "Health Score",
      value: "98",
      suffix: "/100",
      badge: "Optimal Performance",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-600 bg-emerald-50",
      detail: "+1.8% vs last 7 days"
    },
    {
      icon: ShieldAlert,
      label: "Active Issues",
      value: "0",
      suffix: "",
      badge: "All Clear",
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
      iconColor: "text-blue-600 bg-blue-50",
      detail: "0 Critical • 0 High Priority"
    },
    {
      icon: Zap,
      label: "Uptime (24h)",
      value: "99.99",
      suffix: "%",
      badge: "Zero Downtime",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-600 bg-emerald-50",
      detail: "Target SLA 99.9% Exceeded"
    },
    {
      icon: Clock,
      label: "Maintenance",
      value: "1",
      suffix: "Scheduled",
      badge: "Zero Impact",
      badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
      iconColor: "text-amber-600 bg-amber-50",
      detail: "DB vacuum scheduled 02:00 UTC"
    }
  ];

  const fakeActivities = [
    {
      id: "act-1",
      title: "Autonomous Remediation: Scaled ECS worker pool to 8 nodes to absorb traffic spike",
      user: "Brexal AI Copilot",
      time: "10 mins ago",
      type: "ai",
      statusColor: "bg-emerald-500"
    },
    {
      id: "act-2",
      title: "Deployed release candidate build v2.4.1 to production cluster",
      user: "Samarth Choudhar",
      time: "45 mins ago",
      type: "deploy",
      statusColor: "bg-blue-500"
    },
    {
      id: "act-3",
      title: "Latency normalized: p99 dropped from 68ms back down to 14.2ms",
      user: "SRE Monitor Engine",
      time: "2 hours ago",
      type: "metric",
      statusColor: "bg-emerald-500"
    },
    {
      id: "act-4",
      title: "Updated monitoring alert thresholds & PagerDuty notification webhook",
      user: "Samarth Choudhar",
      time: "4 hours ago",
      type: "settings",
      statusColor: "bg-slate-400"
    },
    {
      id: "act-5",
      title: "SSL certificate renewed across 12 edge cloud endpoints",
      user: "Cloudflare Edge Agent",
      time: "6 hours ago",
      type: "security",
      statusColor: "bg-emerald-500"
    },
    {
      id: "act-6",
      title: "Created app: Bharti Nexus (Production Cluster)",
      user: "Samarth Choudhar",
      time: "2 days ago",
      type: "init",
      statusColor: "bg-indigo-500"
    }
  ];

  const microservices = [
    { name: "API Gateway (Edge Envoy)", status: "Operational", uptime: "99.99%", latency: "8.4ms", icon: Globe },
    { name: "Auth & Identity Mesh", status: "Operational", uptime: "100%", latency: "5.1ms", icon: ShieldAlert },
    { name: "Distributed Tracing Ingest", status: "Operational", uptime: "99.98%", latency: "14.2ms", icon: Radio },
    { name: "PostgreSQL Primary Cluster", status: "Operational", uptime: "99.99%", latency: "11.0ms", icon: Database },
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
            <span className="text-[12px] font-mono text-slate-500">v2.4.1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Overview
          </h1>
          <p className="text-[13.5px] text-slate-600 mt-1">
            Metrics, telemetry stream and autonomous activity for <strong className="text-[#0F172A] font-semibold">{fakeApp.name}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => router.push('/logs')} 
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-[#0F172A] text-[13px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
          >
            View Logs
          </button>
          <button 
            onClick={() => router.push('/ai-dashboard')} 
            className="px-4 py-2 rounded-lg bg-[#635BFF] text-white text-[13px] font-semibold hover:bg-[#5349e0] transition-all shadow-[0_2px_8px_rgba(99,91,255,0.25)] hover:shadow-[0_4px_14px_rgba(99,91,255,0.35)] flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            Ask AI
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
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] font-mono tracking-tight">{card.value}</p>
                  {card.suffix && (
                    <span className="text-slate-500 font-semibold text-sm font-mono">{card.suffix}</span>
                  )}
                </div>
                <p className="text-[11.5px] text-[#425466] font-medium mt-1">
                  {card.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Activity Stream Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* System Performance Visualizer (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(10,37,64,0.03)] flex flex-col justify-between min-h-[390px]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-[15px] font-bold text-[#0A2540] flex items-center gap-2">
                  System Performance & Telemetry
                </h3>
                <p className="text-[12px] text-[#425466] mt-0.5">Continuous telemetry collected over the last 24 hours</p>
              </div>

              {/* Metric switcher tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                <button 
                  onClick={() => setSelectedMetricTab("throughput")}
                  className={`px-3 py-1 rounded-lg transition-all text-xs font-bold ${selectedMetricTab === "throughput" ? "bg-white text-[#0A2540] shadow-2xs" : "text-slate-600 hover:text-[#0A2540]"}`}
                >
                  Throughput
                </button>
                <button 
                  onClick={() => setSelectedMetricTab("latency")}
                  className={`px-3 py-1 rounded-lg transition-all text-xs font-bold ${selectedMetricTab === "latency" ? "bg-white text-[#0A2540] shadow-2xs" : "text-slate-600 hover:text-[#0A2540]"}`}
                >
                  p99 Latency
                </button>
                <button 
                  onClick={() => setSelectedMetricTab("cpu")}
                  className={`px-3 py-1 rounded-lg transition-all text-xs font-bold ${selectedMetricTab === "cpu" ? "bg-white text-[#0A2540] shadow-2xs" : "text-slate-600 hover:text-[#0A2540]"}`}
                >
                  CPU / Mem
                </button>
              </div>
            </div>

            {/* Quick Metrics Summary Strip (2x2 on mobile, 4 across on sm+) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 bg-slate-50/80 rounded-xl border border-slate-200/70 mb-5 text-center">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Avg Latency</span>
                <p className="text-base font-extrabold text-[#0A2540] font-mono mt-0.5">12.4 ms</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Throughput</span>
                <p className="text-base font-extrabold text-[#0A2540] font-mono mt-0.5">2,840 req/s</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">CPU Avg</span>
                <p className="text-base font-extrabold text-[#0A2540] font-mono mt-0.5">34.8%</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Error Rate</span>
                <p className="text-base font-extrabold text-emerald-600 font-mono mt-0.5">0.008%</p>
              </div>
            </div>

            {/* Realistic High-Grade Area Chart (SVG) */}
            <div className="w-full h-44 relative">
              <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#635BFF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#635BFF" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" />

                {/* Shaded Area */}
                <path
                  d="M 0 130 Q 50 115 100 120 T 200 95 T 300 105 T 400 70 T 500 85 T 600 60 L 600 160 L 0 160 Z"
                  fill="url(#metricGrad)"
                />

                {/* Foreground Stroke */}
                <path
                  d="M 0 130 Q 50 115 100 120 T 200 95 T 300 105 T 400 70 T 500 85 T 600 60"
                  fill="none"
                  stroke="#635BFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Active Pulse Dot on Latest Point */}
                <circle cx="600" cy="60" r="5" fill="#635BFF" />
                <circle cx="600" cy="60" r="10" fill="#635BFF" opacity="0.25" className="animate-ping" />
              </svg>

              {/* Timeline labels */}
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
              <span className="font-semibold text-slate-700">Telemetry engine synchronized</span>
            </div>
            <span className="font-mono text-[11px]">86,400 data points collected</span>
          </div>
        </div>

        {/* Live Activity Stream (1 Col) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(10,37,64,0.03)] flex flex-col justify-between min-h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-[15px] font-bold text-[#0A2540]">
                Activity Feed
              </h3>
              <span className="text-slate-500 text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
                {fakeActivities.length} events
              </span>
            </div>

            <div className="space-y-3.5 overflow-y-auto max-h-[300px] pr-1">
              {fakeActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-sm group">
                  <div className="flex flex-col items-center pt-1.5 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${act.statusColor}`} />
                    <div className="w-[1px] h-9 bg-slate-200 my-1 group-last:hidden" />
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-[12.5px] font-semibold text-[#0A2540] leading-snug">
                      {act.title}
                    </p>
                    <div className="flex justify-between items-center mt-1 text-[11px]">
                      <span className="text-[#425466] font-medium flex items-center gap-1.5">
                        {act.user === "Samarth Choudhar" && (
                          <img src="/avatars/samarth.png" alt="" className="w-4 h-4 rounded-full object-cover border border-slate-200" />
                        )}
                        {act.user}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{act.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => router.push('/logs')}
            className="w-full mt-3 py-2 text-center text-xs font-bold text-[#635BFF] hover:bg-indigo-50/50 rounded-xl transition-colors border border-transparent hover:border-indigo-100"
          >
            View all audit logs →
          </button>
        </div>
      </div>

      {/* Microservices & Infrastructure Mesh Health */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#0A2540]">Microservices & Mesh Health</h3>
            <p className="text-[12px] text-[#425466]">Distributed components running across US East and EU Central clusters</p>
          </div>
          <span className="text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 size={13} className="text-emerald-600" /> All Services Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {microservices.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between shadow-2xs">
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
