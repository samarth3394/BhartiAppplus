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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">AI Copilot</h1>
            <p className="text-zinc-400">Intelligent insights, predictive analytics, and automated CTO summaries.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: AI Summary & Settings */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* AI CTO Summary */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Brain size={120} className="text-purple-500" />
            </div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <Brain size={20} className="text-purple-400" />
                <h2 className="text-xl font-bold text-white">CTO Executive Summary</h2>
              </div>
              <button 
                onClick={fetchSummary}
                disabled={loadingSummary}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
              >
                {loadingSummary ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                {summary ? "Regenerate Summary" : "Generate Summary"}
              </button>
            </div>

            <div className="relative z-10 min-h-[150px] bg-black/50 border border-white/5 rounded-xl p-6 text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">
              {loadingSummary ? (
                <div className="flex items-center gap-3 text-purple-400 animate-pulse">
                  <Brain size={20} className="animate-bounce" />
                  Analyzing app telemetry, bugs, and uptime...
                </div>
              ) : summary ? (
                summary
              ) : (
                <div className="text-zinc-500 flex flex-col items-center justify-center h-full text-center">
                  <p>No summary generated yet.</p>
                  <p className="text-xs mt-1">Click the button above to generate a comprehensive AI report.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 size={20} className="text-blue-400" />
              <h2 className="text-xl font-bold text-white">AI Financial Parameters</h2>
            </div>
            
            <form onSubmit={saveSettings} className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Estimated Hourly Revenue Impact ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                  <input
                    type="number"
                    value={hourlyRevenue}
                    onChange={(e) => setHourlyRevenue(Number(e.target.value))}
                    disabled={loadingSettings}
                    className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-3 pl-8 pr-4 outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={savingSettings || loadingSettings}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition disabled:opacity-50"
              >
                {savingSettings ? "Saving..." : "Save Parameters"}
              </button>
            </form>
            {settingsMessage && (
              <p className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 size={16} /> {settingsMessage}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Failure Prediction */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-orange-400" />
                <h2 className="text-xl font-bold text-white">Failure Prediction</h2>
              </div>
              <button 
                onClick={runPrediction}
                disabled={loadingPrediction}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-zinc-300 transition disabled:opacity-50"
                title="Run Analysis"
              >
                <RefreshCw size={18} className={loadingPrediction ? "animate-spin" : ""} />
              </button>
            </div>

            {loadingPrediction ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-orange-400 animate-pulse font-medium">Running Prediction Models...</p>
              </div>
            ) : prediction ? (
              <div className="flex-1 flex flex-col space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-black/40 border border-white/5 rounded-2xl">
                  <span className="text-sm font-medium text-zinc-400 mb-2">Failure Probability</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-6xl font-black tracking-tighter ${
                      prediction.confidence_percentage > 70 ? 'text-red-500' :
                      prediction.confidence_percentage > 40 ? 'text-orange-500' : 'text-emerald-500'
                    }`}>
                      {prediction.confidence_percentage}
                    </span>
                    <span className="text-2xl text-zinc-500">%</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">Suggested Actions</h3>
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-200 text-sm">
                    {prediction.action_suggested || "Monitor system closely."}
                  </div>
                </div>
                
                <div className="text-xs text-zinc-500 text-center">
                  Last updated: {new Date(prediction.created_at).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <AlertTriangle size={48} className="text-zinc-600 mb-4" />
                <p className="text-zinc-400">No predictions run yet.</p>
                <button 
                  onClick={runPrediction}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition"
                >
                  Run Initial Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
