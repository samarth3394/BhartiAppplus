"use client";

import React, { useEffect, useState } from "react";
import { Zap, Bot, Brain, RefreshCw, AlertTriangle, Settings2, CheckCircle2 } from "lucide-react";

export default function AIDashboard() {
  const [summary, setSummary] = useState<string>("");
  const [prediction, setPrediction] = useState<any>(null);
  const [hourlyRevenue, setHourlyRevenue] = useState<number>(0);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai-dashboard/summary", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSummary(typeof data.summary === 'string' ? data.summary : data.summary?.report || "");
      }
    } catch (err) {
      console.error("Failed to fetch AI summary", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchPrediction = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/predictions/latest", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setPrediction(data.prediction);
      }
    } catch (err) {
      console.error("Failed to fetch prediction", err);
    }
  };

  const runPrediction = async () => {
    setLoadingPrediction(true);
    try {
      const res = await fetch("http://localhost:5000/api/predictions/run", { 
        method: "POST",
        credentials: "include" 
      });
      if (res.ok) {
        await fetchPrediction();
      }
    } catch (err) {
      console.error("Failed to run prediction", err);
    } finally {
      setLoadingPrediction(false);
    }
  };

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai-dashboard/settings", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setHourlyRevenue(data.hourly_revenue);
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/ai-dashboard/settings", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hourly_revenue: hourlyRevenue })
      });
      if (res.ok) {
        setSettingsMessage("Settings saved successfully.");
        setTimeout(() => setSettingsMessage(""), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchPrediction();
  }, []);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] shrink-0">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED] mb-1">AI Copilot</h1>
          <p className="text-[13px] text-[#888]">Intelligent insights, predictive analytics, and automated summaries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Column: AI Summary & Settings */}
        <div className="xl:col-span-2 space-y-4">
          
          {/* AI CTO Summary */}
          <div className="bg-[#111] border border-white/[0.06] p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity pointer-events-none">
              <Brain size={120} className="text-white" />
            </div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-[#888]" />
                <h2 className="text-[14px] font-medium text-[#EDEDED]">Executive Summary</h2>
              </div>
              <button 
                onClick={fetchSummary}
                disabled={loadingSummary}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/[0.08] text-[#EDEDED] rounded-lg text-[13px] font-medium transition disabled:opacity-50"
              >
                {loadingSummary ? <RefreshCw size={14} className="animate-spin text-[#888]" /> : <Zap size={14} className="text-[#888]" />}
                {summary ? "Regenerate" : "Generate"}
              </button>
            </div>

            <div className="relative z-10 min-h-[160px] bg-[#0a0a0a] border border-white/[0.04] rounded-lg p-5 text-[#EDEDED] leading-relaxed whitespace-pre-wrap text-[13px]">
              {loadingSummary ? (
                <div className="flex items-center gap-3 text-[#888] animate-pulse font-medium">
                  <Brain size={16} className="animate-pulse" />
                  Analyzing telemetry, issues, and performance metrics...
                </div>
              ) : summary ? (
                summary
              ) : (
                <div className="text-[#555] flex flex-col items-center justify-center h-full text-center py-6">
                  <p className="font-medium text-[#888] mb-1">No summary generated yet</p>
                  <p className="text-[12px]">Click generate to analyze current workspace data.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-[#111] border border-white/[0.06] p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-5">
              <Settings2 size={16} className="text-[#888]" />
              <h2 className="text-[14px] font-medium text-[#EDEDED]">Financial Parameters</h2>
            </div>
            
            <form onSubmit={saveSettings} className="flex items-end gap-3 max-w-lg">
              <div className="flex-1">
                <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider mb-1.5">
                  Hourly Revenue Impact
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] text-[13px]">$</span>
                  <input
                    type="number"
                    value={hourlyRevenue}
                    onChange={(e) => setHourlyRevenue(Number(e.target.value))}
                    disabled={loadingSettings}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 pl-7 pr-3 outline-none focus:border-white/20 transition-colors text-[13px]"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={savingSettings || loadingSettings}
                className="px-4 py-2 bg-white hover:bg-[#e5e5e5] text-black font-medium text-[13px] rounded-lg transition disabled:opacity-50"
              >
                {savingSettings ? "Saving..." : "Save Parameters"}
              </button>
            </form>
            {settingsMessage && (
              <p className="mt-3 flex items-center gap-1.5 text-[12px] text-emerald-400 font-medium">
                <CheckCircle2 size={14} /> {settingsMessage}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Failure Prediction */}
        <div className="space-y-4">
          <div className="bg-[#111] border border-white/[0.06] p-6 rounded-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#888]" />
                <h2 className="text-[14px] font-medium text-[#EDEDED]">Failure Prediction</h2>
              </div>
              <button 
                onClick={runPrediction}
                disabled={loadingPrediction}
                className="p-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/[0.08] rounded-md text-[#EDEDED] transition disabled:opacity-50"
                title="Run Analysis"
              >
                <RefreshCw size={14} className={loadingPrediction ? "animate-spin text-[#888]" : ""} />
              </button>
            </div>

            {loadingPrediction ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-0 border-2 border-white/[0.04] rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-[#888] animate-pulse text-[12px] font-medium">Running Prediction Models...</p>
              </div>
            ) : prediction ? (
              <div className="flex-1 flex flex-col space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-[#0a0a0a] border border-white/[0.04] rounded-xl">
                  <span className="text-[11px] font-medium text-[#888] uppercase tracking-wider mb-2">Failure Probability</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-bold tracking-tight ${
                      prediction.confidence_percentage > 70 ? 'text-red-400' :
                      prediction.confidence_percentage > 40 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {prediction.confidence_percentage}
                    </span>
                    <span className="text-xl font-medium text-[#555]">%</span>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-[11px] font-medium text-[#888] uppercase tracking-wider">Suggested Actions</h3>
                  <div className="p-4 bg-[#1a1a1a] border border-white/[0.04] rounded-lg text-[#EDEDED] text-[13px] leading-relaxed">
                    {prediction.action_suggested || "Monitor system closely."}
                  </div>
                </div>
                
                <div className="text-[11px] text-[#555] text-center font-mono">
                  Updated: {new Date(prediction.created_at).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 py-12">
                <AlertTriangle size={32} className="text-[#333] mb-3" />
                <p className="text-[#888] text-[13px] font-medium mb-1">No predictions run yet</p>
                <p className="text-[#555] text-[12px]">Analyze current workspace data to predict failures.</p>
                <button 
                  onClick={runPrediction}
                  className="mt-5 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/[0.08] text-[#EDEDED] rounded-lg text-[12px] font-medium transition"
                >
                  Run Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
