"use client";

import React, { useEffect, useState } from "react";
import { Activity, Globe, CheckCircle2, XCircle, AlertTriangle, Settings2, History, Clock, ShieldCheck, Zap } from "lucide-react";

type UptimeCheck = {
  timestamp: string;
  response_time: number;
  status_code: number;
  status: "up" | "down";
};

const DEFAULT_CHECKS: UptimeCheck[] = [
  { timestamp: "21:55", response_time: 11.8, status_code: 200, status: "up" },
  { timestamp: "21:56", response_time: 12.1, status_code: 200, status: "up" },
  { timestamp: "21:57", response_time: 14.5, status_code: 200, status: "up" },
  { timestamp: "21:58", response_time: 12.0, status_code: 200, status: "up" },
  { timestamp: "21:59", response_time: 13.2, status_code: 200, status: "up" },
  { timestamp: "22:00", response_time: 11.9, status_code: 200, status: "up" },
  { timestamp: "22:01", response_time: 12.4, status_code: 200, status: "up" },
  { timestamp: "22:02", response_time: 12.0, status_code: 200, status: "up" },
  { timestamp: "22:03", response_time: 13.1, status_code: 200, status: "up" },
  { timestamp: "22:04", response_time: 12.8, status_code: 200, status: "up" },
  { timestamp: "22:05", response_time: 12.2, status_code: 200, status: "up" },
  { timestamp: "22:06", response_time: 12.4, status_code: 200, status: "up" },
];

export default function UptimePage() {
  const [monitorUrl, setMonitorUrl] = useState("https://api.bhartinexus.com/healthz");
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setTimeout(() => {
      setSavingSettings(false);
      alert("Monitoring configuration saved!");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-1">Uptime & Latency Monitoring</h1>
          <p className="text-[13.5px] text-slate-600">Synthetic global heartbeat checks, SSL certificate validation, and incident logs.</p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[13px] font-bold shadow-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          All Endpoints Operational
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity size={15} className="text-emerald-500" /> Availability (30d)
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">99.99%</p>
          <span className="text-[11.5px] text-emerald-600 font-semibold mt-1 inline-block">● 0 Outages in 30 days</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Clock size={15} className="text-blue-500" /> Avg Response Time
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">12.4 ms</p>
          <span className="text-[11.5px] text-blue-600 font-semibold mt-1 inline-block">↓ 3.2ms faster than SLA</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap size={15} className="text-purple-500" /> Check Frequency
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">60s</p>
          <span className="text-[11.5px] text-slate-500 font-semibold mt-1 inline-block">Multi-region probes active</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={15} className="text-emerald-500" /> SSL / TLS Status
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Valid</p>
          <span className="text-[11.5px] text-slate-500 font-semibold mt-1 inline-block">Expires in 284 days</span>
        </div>
      </div>

      {/* Latency History & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latency Wave Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-[#0F172A]">Response Time & Latency (Last 24h)</h3>
              <p className="text-[12px] text-slate-500">Synthetic HTTP GET probes from Ashburn, Frankfurt, and Singapore</p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              p99: 14.8ms
            </span>
          </div>

          {/* Clean SVG Area Line */}
          <div className="w-full h-44 relative my-4">
            <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="600" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" />
              <path
                d="M 0 110 Q 50 100 100 105 T 200 95 T 300 90 T 400 98 T 500 85 T 600 88 L 600 160 L 0 160 Z"
                fill="url(#uptimeGrad)"
              />
              <path
                d="M 0 110 Q 50 100 100 105 T 200 95 T 300 90 T 400 98 T 500 85 T 600 88"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="600" cy="88" r="4.5" fill="#10B981" />
            </svg>
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2 px-1">
              <span>24h ago</span>
              <span>18h ago</span>
              <span>12h ago</span>
              <span>6h ago</span>
              <span className="font-bold text-[#0F172A]">Now (12.4ms)</span>
            </div>
          </div>

          {/* 90-day status bar preview */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
              <span>90 Days Uptime History</span>
              <span className="text-emerald-600 font-bold">100.0% Operational</span>
            </div>
            <div className="flex gap-1 h-7">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="flex-1 bg-emerald-400 hover:bg-emerald-500 rounded-xs transition-colors" title={`Day ${i+1}: 100% Operational`} />
              ))}
            </div>
          </div>
        </div>

        {/* Configure Probe Settings */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-1 flex items-center gap-2">
              <Settings2 size={16} className="text-[#635BFF]" /> Monitor Settings
            </h3>
            <p className="text-[12px] text-slate-500 mb-4">Configure heartbeat target and notification triggers</p>

            <form onSubmit={saveSettings} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Health Check Target URL
                </label>
                <input
                  type="url"
                  required
                  value={monitorUrl}
                  onChange={(e) => setMonitorUrl(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-[13px] outline-none focus:border-[#635BFF] font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Alert Trigger Threshold
                </label>
                <select className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-[13px] outline-none focus:border-[#635BFF] font-medium">
                  <option>Alert after 2 consecutive failures</option>
                  <option>Alert immediately on 1 failure</option>
                  <option>Alert after 5 failures (conservative)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[13px] font-semibold text-[#0F172A]">Continuous Monitoring</span>
                <input
                  type="checkbox"
                  checked={monitoringEnabled}
                  onChange={(e) => setMonitoringEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#635BFF]"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-[13px] font-semibold transition shadow-xs"
              >
                {savingSettings ? "Saving..." : "Update Configuration"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
