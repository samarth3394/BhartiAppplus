"use client";

import React, { useState } from "react";
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
  const [monitorUrl, setMonitorUrl] = useState("https://api.brexal.com/healthz");
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setTimeout(() => {
      setSavingSettings(false);
      setStatusMessage("Synthetic probe configuration updated successfully.");
      setTimeout(() => setStatusMessage(""), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              Uptime & Synthetic Latency
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All Endpoints Operational
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Global heartbeat probes, SSL certificate validation, and multi-region synthetic monitoring.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-emerald-800 text-[12.5px] font-semibold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={15} className="text-emerald-500" /> Availability (30d)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">99.99%</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0A2540] tracking-tight">100.0%</p>
          <span className="text-[11.5px] text-emerald-600 font-semibold mt-2.5 block">● 0 Outages in last 90 days</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={15} className="text-blue-500" /> Avg Response Time
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 uppercase">Fast</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0A2540] tracking-tight">12.4 ms</p>
          <span className="text-[11.5px] text-blue-600 font-semibold mt-2.5 block">↓ 3.2ms faster than p99 SLA</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={15} className="text-purple-500" /> Probe Frequency
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 uppercase">Live</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0A2540] tracking-tight">30s</p>
          <span className="text-[11.5px] text-[#425466] font-medium mt-2.5 block">3 Global probe regions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-500" /> SSL / TLS Status
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">Valid</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0A2540] tracking-tight">TLS 1.3</p>
          <span className="text-[11.5px] text-[#425466] font-medium mt-2.5 block">Auto-renews in 284 days</span>
        </div>
      </div>

      {/* Latency History & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latency Wave Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-[16px] font-bold text-[#0A2540]">Response Time & Latency (Last 24h)</h3>
              <p className="text-[12.5px] text-[#425466]">Synthetic HTTP GET probes from Ashburn (US), Frankfurt (EU), and Singapore (AP)</p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#FAFBFD] text-slate-700 px-3 py-1 rounded-full border border-slate-200/80 self-start sm:self-auto">
              p99: 14.8ms
            </span>
          </div>

          {/* Clean SVG Area Line */}
          <div className="w-full h-44 relative my-4">
            <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="600" y2="40" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#F1F5F9" strokeDasharray="3 3" />
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
              <span className="font-bold text-[#0A2540]">Now (12.4ms)</span>
            </div>
          </div>

          {/* 90-day status bar preview */}
          <div className="pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-[#425466] mb-2.5 font-medium">
              <span>90-Day Continuous Availability History</span>
              <span className="text-emerald-600 font-bold">100.0% Operational</span>
            </div>
            <div className="flex gap-1 h-7">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="flex-1 bg-emerald-400 hover:bg-emerald-500 rounded-[2px] transition-colors cursor-pointer" title={`Day ${i+1}: 100% Operational`} />
              ))}
            </div>
          </div>
        </div>

        {/* Configure Probe Settings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(10,37,64,0.03)] flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#0A2540] mb-1.5 flex items-center gap-2">
              <Settings2 size={17} className="text-[#635BFF]" /> Synthetic Monitor Settings
            </h3>
            <p className="text-[12.5px] text-[#425466] mb-5 leading-relaxed">
              Configure heartbeat target endpoint and automatic incident escalation triggers.
            </p>

            <form onSubmit={saveSettings} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">
                  Health Check Target URL
                </label>
                <input
                  type="url"
                  required
                  value={monitorUrl}
                  onChange={(e) => setMonitorUrl(e.target.value)}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">
                  Alert Trigger Threshold
                </label>
                <select className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 font-semibold transition">
                  <option>Alert after 2 consecutive failures</option>
                  <option>Alert immediately on 1 failure</option>
                  <option>Alert after 5 failures (conservative)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#FAFBFD] rounded-xl border border-slate-200/70">
                <span className="text-[13px] font-semibold text-[#0A2540]">Continuous Synthetic Probes</span>
                <input
                  type="checkbox"
                  checked={monitoringEnabled}
                  onChange={(e) => setMonitoringEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#635BFF] cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-2.5 bg-[#0A2540] hover:bg-[#1A385A] text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_2px_8px_rgba(10,37,64,0.12)] cursor-pointer mt-2 disabled:opacity-50"
              >
                {savingSettings ? "Updating..." : "Update Configuration"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
