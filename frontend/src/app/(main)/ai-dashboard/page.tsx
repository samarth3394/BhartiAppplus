"use client";

import React, { useEffect, useState } from "react";
import { Zap, Bot, Brain, RefreshCw, AlertTriangle, Settings2, CheckCircle2, Sparkles, TrendingUp, ShieldAlert } from "lucide-react";

export default function AIDashboard() {
  const [summary, setSummary] = useState<string>(
    "All distributed microservices are operating well within nominal SLA boundaries. Neural analysis indicates average p99 response times have stabilized at 12.4ms across all ingress routes. Connection pool circuit breakers are calibrated. Zero anomalies detected in the last 24-hour telemetry window."
  );
  const [hourlyRevenue, setHourlyRevenue] = useState<number>(14500);
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleRunDiagnostic = () => {
    setRunningDiagnostic(true);
    setStatusMessage("Running neural trace correlation...");
    setTimeout(() => {
      setRunningDiagnostic(false);
      setStatusMessage("Diagnostic complete: All 16 microservices verified healthy.");
      setSummary(
        "Real-time diagnostic complete: Neural trace synthesis evaluated 86,400 spans. Ingress traffic latency is nominal (11.8ms avg). Machine learning predictive model forecasts 99.99% availability for the next 72 hours."
      );
      setTimeout(() => setStatusMessage(""), 4000);
    }, 1200);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("Financial revenue parameters saved.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-1">AI Copilot & Autonomous Intelligence</h1>
          <p className="text-[13.5px] text-slate-600">Predictive incident prevention, machine learning anomaly detection, and automated root cause analysis.</p>
        </div>
        <button
          onClick={handleRunDiagnostic}
          disabled={runningDiagnostic}
          className="flex items-center gap-1.5 bg-[#635BFF] hover:bg-[#5349e0] text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition-all shadow-[0_2px_8px_rgba(99,91,255,0.25)] disabled:opacity-50"
        >
          <Sparkles size={15} />
          {runningDiagnostic ? "Analyzing Telemetry..." : "Run AI Diagnostic"}
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-600" />
          {statusMessage}
        </div>
      )}

      {/* Top 3 Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Brain size={16} className="text-[#635BFF]" /> Predictive Confidence
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">98.4%</p>
          <span className="text-[11.5px] text-emerald-600 font-semibold mt-1 inline-block">
            ● 0 Incident Risks in next 72 hours
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp size={16} className="text-blue-500" /> Revenue Protected
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">${hourlyRevenue.toLocaleString()}</p>
          <span className="text-[11.5px] text-slate-500 font-semibold mt-1 inline-block">
            Estimated gross hourly throughput
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Bot size={16} className="text-purple-500" /> Autonomous Actions
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">4 Remedials</p>
          <span className="text-[11.5px] text-purple-600 font-semibold mt-1 inline-block">
            100% successful auto-recoveries
          </span>
        </div>
      </div>

      {/* Main AI Diagnostic Summary & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-[15px] font-bold text-[#0F172A] flex items-center gap-2">
              <Sparkles size={16} className="text-[#635BFF]" /> Live AI Health Assessment & Executive Report
            </h2>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
              Brexal Intelligence Model v3.2
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[13.5px] text-slate-800 leading-relaxed font-normal">
              {summary}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Autonomous Recommendations
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-[13px] font-semibold text-[#0F172A]">
                    Keep Redis maxmemory-policy at volatile-lru for optimal cache hit ratio.
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Applied
                </span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-[13px] font-semibold text-[#0F172A]">
                    Scale primary PostgreSQL connection pool max_clients from 100 to 180.
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Sidebar */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#0F172A] mb-1 flex items-center gap-2">
              <Settings2 size={16} className="text-[#635BFF]" /> Business Impact Parameters
            </h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Calibrate financial risk calculations when estimating incident downtime costs.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Estimated Hourly Revenue ($)
                </label>
                <input
                  type="number"
                  value={hourlyRevenue}
                  onChange={(e) => setHourlyRevenue(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-[13px] outline-none focus:border-[#635BFF] font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  AI Remediation Level
                </label>
                <select className="w-full bg-white border border-slate-200 text-[#0F172A] rounded-lg py-2 px-3 text-[13px] outline-none focus:border-[#635BFF] font-medium">
                  <option>Autonomous (Self-healing enabled)</option>
                  <option>Supervised (Ask before scaling)</option>
                  <option>Telemetry Advisory Only</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-[13px] font-semibold transition shadow-xs"
              >
                Save AI Settings
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
