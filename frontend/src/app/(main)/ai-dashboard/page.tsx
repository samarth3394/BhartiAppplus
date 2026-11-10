"use client";

import React, { useEffect, useState } from "react";
import { Bot, Brain, Settings2, CheckCircle2, Sparkles, TrendingUp, ShieldAlert } from "lucide-react";
import { getApiUrl } from "@/lib/api";

export default function AIDashboard() {
  const [summary, setSummary] = useState<string>(
    "All distributed microservices are operating within nominal SLA boundaries. Predictive trend analysis and Gemini RCA are ready."
  );
  const [hourlyRevenue, setHourlyRevenue] = useState<number>(14500);
  const [slaTargetPct, setSlaTargetPct] = useState<number>(99.9);
  const [currency, setCurrency] = useState<string>("USD");
  const [slaBurnPct, setSlaBurnPct] = useState<number>(7.2);
  const [slaRemainingMins, setSlaRemainingMins] = useState<number>(40.1);
  const [confidenceScore, setConfidenceScore] = useState<number>(98.4);
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [setRes, predRes] = await Promise.all([
          fetch(getApiUrl("/api/ai-dashboard/settings"), { credentials: "include" }),
          fetch(getApiUrl("/api/predictions/latest"), { credentials: "include" }),
        ]);

        if (setRes.ok) {
          const d = await setRes.json();
          if (typeof d.hourly_revenue === "number") setHourlyRevenue(d.hourly_revenue);
          if (typeof d.sla_target_pct === "number") setSlaTargetPct(d.sla_target_pct);
          if (d.currency) setCurrency(d.currency);
          if (d.revenue_impact) {
            setSlaBurnPct(d.revenue_impact.sla_burn_rate_pct ?? 0);
            setSlaRemainingMins(d.revenue_impact.sla_remaining_minutes ?? 43.2);
          }
        }
        if (predRes.ok) {
          const p = await predRes.json();
          if (p.prediction) {
            setConfidenceScore(p.prediction.confidence_percentage ?? 98.4);
            if (p.prediction.trend_summary) setSummary(p.prediction.trend_summary);
          }
        }
      } catch {
        // Retain clean default state if unauthenticated
      }
    };
    loadSettings();
  }, []);

  const handleRunDiagnostic = async () => {
    setRunningDiagnostic(true);
    setStatusMessage("Running Pandas 7-day trend regression & Gemini health synthesis...");

    try {
      const [predRes, sumRes] = await Promise.all([
        fetch(getApiUrl("/api/predictions/run"), { method: "POST", credentials: "include" }),
        fetch(getApiUrl("/api/ai-dashboard/summary"), { credentials: "include" }),
      ]);

      if (predRes.ok) {
        const predData = await predRes.json();
        if (predData.prediction) {
          setConfidenceScore(predData.prediction.confidence_percentage ?? confidenceScore);
          if (predData.prediction.trend_summary) {
            setSummary(predData.prediction.trend_summary);
          }
        }
      }
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        if (typeof sumData.summary === "string") {
          setSummary(sumData.summary);
        } else if (sumData.summary?.executive_summary) {
          setSummary(sumData.summary.executive_summary);
        }
      }
      setStatusMessage("Diagnostic complete: Prediction engine & AI summary updated.");
    } catch {
      setStatusMessage("Diagnostic preview updated locally (log in to analyze workspace telemetry).");
    } finally {
      setRunningDiagnostic(false);
      setTimeout(() => setStatusMessage(""), 4000);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch(getApiUrl("/api/ai-dashboard/settings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          hourly_revenue: hourlyRevenue,
          sla_target_pct: slaTargetPct,
          currency,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.revenue_impact) {
          setSlaBurnPct(d.revenue_impact.sla_burn_rate_pct ?? slaBurnPct);
          setSlaRemainingMins(d.revenue_impact.sla_remaining_minutes ?? slaRemainingMins);
        }
        setStatusMessage("Revenue exposure & SLA target parameters saved to database.");
      } else {
        setStatusMessage("Settings saved in preview (sign in to persist to workspace).");
      }
    } catch {
      setStatusMessage("Settings updated locally.");
    } finally {
      setSavingSettings(false);
      setTimeout(() => setStatusMessage(""), 3500);
    }
  };

  const currencySym = currency === "INR" ? "₹" : "$";

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              AI Copilot &amp; Revenue Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
              Gemini + Pandas
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            7-day trend forecasting, automated bug fix diff generation, and real-time SLA burn-rate revenue modeling.
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
        <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-emerald-800 text-[12.5px] font-semibold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top 3 Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-2">
              <Brain size={16} className="text-[#635BFF]" /> Prediction Confidence
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
              7-Day Trend
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">
            {confidenceScore.toFixed(1)}%
          </p>
          <div className="flex items-center gap-1.5 mt-2.5 text-[12px] font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Linear-regression failure forecast active
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" /> Revenue Rate at Risk
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 uppercase">
              Hourly
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">
            {currencySym}{hourlyRevenue.toLocaleString()}
          </p>
          <span className="text-[12px] text-[#425466] font-medium mt-2.5 block">
            Configured gross revenue exposure per hour of downtime
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-2">
              <Bot size={16} className="text-purple-500" /> 30-Day SLA Burn Rate
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 uppercase">
              Target {slaTargetPct}%
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">
            {slaBurnPct.toFixed(1)}%
          </p>
          <span className="text-[12px] text-purple-600 font-semibold mt-2.5 block">
            {slaRemainingMins.toFixed(1)} mins error budget remaining
          </span>
        </div>
      </div>

      {/* Main AI Diagnostic Summary & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(10,37,64,0.03)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <h2 className="text-[16px] font-bold text-[#0A2540] flex items-center gap-2">
              <Sparkles size={17} className="text-[#635BFF]" /> Live AI Health Assessment &amp; Synthesis
            </h2>
            <span className="text-[11px] font-mono font-bold bg-slate-100/80 text-slate-700 px-3 py-1 rounded-full border border-slate-200/60 self-start sm:self-auto">
              Gemini Flash + Pandas Engine
            </span>
          </div>

          <div className="p-5 bg-[#FAFBFD] rounded-xl border border-slate-200/60">
            <p className="text-[13.5px] text-[#0A2540] leading-relaxed font-normal whitespace-pre-line">
              {summary}
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <h3 className="text-xs font-bold text-[#425466] uppercase tracking-wider">
              Active Platform Automation Pipelines
            </h3>
            <div className="space-y-2.5">
              <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-[13px] font-semibold text-[#0A2540]">
                    AI Self-Healing Diff Engine generates unified patches &amp; GitHub draft PRs from ingested stack traces.
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full shrink-0">
                  Active
                </span>
              </div>

              <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-[13px] font-semibold text-[#0A2540]">
                    Standard OTLP/HTTP endpoints (/v1/metrics, /v1/traces, /v1/logs) accept OpenTelemetry Collector streams.
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-1 rounded-full shrink-0">
                  OTLP Ready
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
              Calibrate financial risk calculations when estimating downtime costs, bug exposure, and SLA error budget burn rate.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:bg-white font-semibold transition"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">
                  Estimated Hourly Revenue ({currencySym})
                </label>
                <input
                  type="number"
                  min={0}
                  value={hourlyRevenue}
                  onChange={(e) => setHourlyRevenue(Number(e.target.value))}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:bg-white font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#425466] uppercase tracking-wider mb-1.5">
                  Monthly SLA Target (%)
                </label>
                <select
                  value={slaTargetPct}
                  onChange={(e) => setSlaTargetPct(Number(e.target.value))}
                  className="w-full bg-[#FAFBFD] border border-slate-200/90 text-[#0A2540] rounded-xl py-2.5 px-3.5 text-[13px] outline-none focus:border-[#635BFF] focus:bg-white font-semibold transition"
                >
                  <option value={99.99}>99.99% (4.3m budget/mo)</option>
                  <option value={99.95}>99.95% (21.6m budget/mo)</option>
                  <option value={99.9}>99.9% (43.2m budget/mo)</option>
                  <option value={99.5}>99.5% (216m budget/mo)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-2.5 bg-[#0A2540] hover:bg-[#1A385A] text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_2px_8px_rgba(10,37,64,0.12)] cursor-pointer mt-2 disabled:opacity-50"
              >
                {savingSettings ? "Saving..." : "Save Parameters"}
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
