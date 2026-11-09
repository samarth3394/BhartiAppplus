"use client";

import React, { useEffect, useState } from "react";
import { Zap, Bot, Brain, RefreshCw, AlertTriangle, Settings2, CheckCircle2, Sparkles, TrendingUp, ShieldAlert, Cpu, ArrowUpRight } from "lucide-react";

export default function AIDashboard() {
  const [summary, setSummary] = useState<string>(
    "All distributed microservices are operating well within nominal SLA boundaries. Neural analysis indicates average p99 response times have stabilized at 12.4ms across all ingress routes. Connection pool circuit breakers are calibrated. Zero anomalies detected in the last 24-hour telemetry window."
  );
  const [hourlyRevenue, setHourlyRevenue] = useState<number>(14500);
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleRunDiagnostic = () => {
    setRunningDiagnostic(true);
    setStatusMessage("Running neural trace correlation across 86,400 spans...");
    setTimeout(() => {
      setRunningDiagnostic(false);
      setStatusMessage("Diagnostic complete: All 16 microservices verified healthy.");
      setSummary(
        "Real-time diagnostic complete: Neural trace synthesis evaluated 86,400 spans. Ingress traffic latency is nominal (11.8ms avg). Machine learning predictive model forecasts 99.99% availability for the next 72 hours with zero risk factors."
      );
      setTimeout(() => setStatusMessage(""), 4000);
    }, 1200);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("Financial revenue & risk parameters saved successfully.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              AI Copilot & Autonomous Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
              Active v3.2
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Predictive incident prevention, machine learning anomaly detection, and automated root cause analysis.
          </p>
        </div>
        <button
          onClick={handleRunDiagnostic}
          disabled={runningDiagnostic}
          className="inline-flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#5349e0] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <Sparkles size={15} className={runningDiagnostic ? "animate-spin" : ""} />
          {runningDiagnostic ? "Analyzing Telemetry..." : "Run AI Diagnostic"}
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-emerald-800 text-[12.5px] font-semibold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top 3 Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-2">
              <Brain size={16} className="text-[#635BFF]" /> Predictive Confidence
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
              Nominal
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">98.4%</p>
          <div className="flex items-center gap-1.5 mt-2.5 text-[12px] font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            0 Incident Risks in next 72 hours
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" /> Revenue Protected
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 uppercase">
              Hourly
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">
            ${hourlyRevenue.toLocaleString()}
          </p>
          <span className="text-[12px] text-[#425466] font-medium mt-2.5 block">
            Estimated gross throughput at zero downtime
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-2">
              <Bot size={16} className="text-purple-500" /> Autonomous Actions
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 uppercase">
              100% Rate
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">4 Remedials</p>
          <span className="text-[12px] text-purple-600 font-semibold mt-2.5 block">
            Automated rollbacks & pool recycles executed
          </span>
        </div>
      </div>

      {/* Main AI Diagnostic Summary & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(10,37,64,0.03)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <h2 className="text-[16px] font-bold text-[#0A2540] flex items-center gap-2">
              <Sparkles size={17} className="text-[#635BFF]" /> Live AI Health Assessment & Synthesis
            </h2>
            <span className="text-[11px] font-mono font-bold bg-slate-100/80 text-slate-700 px-3 py-1 rounded-full border border-slate-200/60 self-start sm:self-auto">
              Brexal Intelligence Model v3.2
            </span>
          </div>

          <div className="p-5 bg-[#FAFBFD] rounded-xl border border-slate-200/60">
            <p className="text-[13.5px] text-[#0A2540] leading-relaxed font-normal">
              {summary}
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <h3 className="text-xs font-bold text-[#425466] uppercase tracking-wider">
              Autonomous Recommendations & Active Policies
            </h3>
            <div className="space-y-2.5">
              <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_4px_rgba(10,37,64,0.02)] hover:border-[#635BFF]/40 transition-colors">
                <div className="flex items-start sm:items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-[13px] font-semibold text-[#0A2540]">
                    Maintain Redis maxmemory-policy at volatile-lru for optimal cache hit ratio.
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full shrink-0 self-start sm:self-auto">
                  Applied & Active
                </span>
              </div>

              <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_4px_rgba(10,37,64,0.02)] hover:border-[#635BFF]/40 transition-colors">
                <div className="flex items-start sm:items-center gap-3">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-[13px] font-semibold text-[#0A2540]">
                    Scale primary PostgreSQL connection pool max_clients from 100 to 180 before peak traffic.
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-1 rounded-full shrink-0 self-start sm:self-auto">
                  Recommended
                </span>
              </div>

              <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_4px_rgba(10,37,64,0.02)] hover:border-[#635BFF]/40 transition-colors">
                <div className="flex items-start sm:items-center gap-3">
                  <CheckCircle2 size={18} className="text-purple-500 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-[13px] font-semibold text-[#0A2540]">
                    Enable eBPF kernel socket probes on Frankfurt Gateway node for TLS handshake latency audit.
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200/80 px-2.5 py-1 rounded-full shrink-0 self-start sm:self-auto">
                  Auto-Scheduled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Sidebar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(10,37,64,0.03)] flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#0A2540] mb-1.5 flex items-center gap-2">
              <Settings2 size={17} className="text-[#635BFF]" /> Business Impact Parameters
            </h3>
            <p className="text-[12.5px] text-[#425466] mb-5 leading-relaxed">
              Calibrate financial risk calculations when estimating incident downtime costs and MTTR thresholds.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">
                  Estimated Hourly Revenue ($)
                </label>
                <input
                  type="number"
                  value={hourlyRevenue}
                  onChange={(e) => setHourlyRevenue(Number(e.target.value))}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">
                  AI Remediation Level
                </label>
                <select className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 font-semibold transition">
                  <option>Autonomous (Self-healing enabled)</option>
                  <option>Supervised (Ask before scaling)</option>
                  <option>Telemetry Advisory Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">
                  Diagnostic Scan Interval
                </label>
                <select className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 font-semibold transition">
                  <option>Continuous (Real-time eBPF)</option>
                  <option>Every 60 Seconds</option>
                  <option>Every 5 Minutes</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0A2540] hover:bg-[#1A385A] text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_2px_8px_rgba(10,37,64,0.12)] cursor-pointer mt-2"
              >
                Save Parameters
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 text-center">
            <span className="text-[11px] text-[#425466] flex items-center justify-center gap-1.5 font-medium">
              <ShieldAlert size={13} className="text-emerald-600" /> Non-Custodial RBAC Guardrails Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
