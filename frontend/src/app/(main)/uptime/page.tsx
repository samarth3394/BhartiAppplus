"use client";

import React, { useEffect, useState } from "react";
import { Activity, Globe, CheckCircle2, XCircle, AlertTriangle, Settings2, History, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UptimePage() {
  const [statusData, setStatusData] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monitorUrl, setMonitorUrl] = useState("");
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchUptimeData = async () => {
    try {
      const [statusRes, incidentsRes, historyRes] = await Promise.all([
        fetch("http://localhost:5000/api/uptime/status", { credentials: "include" }),
        fetch("http://localhost:5000/api/uptime/incidents", { credentials: "include" }),
        fetch("http://localhost:5000/api/uptime/history?period=24h", { credentials: "include" })
      ]);

      if (statusRes.ok) {
        const sData = await statusRes.json();
        setStatusData(sData);
        setMonitorUrl(sData.app?.url || "");
        setMonitoringEnabled(sData.app?.settings?.monitoring_enabled ?? true);
      }
      
      if (incidentsRes.ok) {
        const iData = await incidentsRes.json();
        setIncidents(iData.incidents || []);
      }

      if (historyRes.ok) {
        const hData = await historyRes.json();
        setHistoryData(hData.checks || []);
      }
    } catch (err) {
      console.error("Failed to fetch uptime data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUptimeData();
    const interval = setInterval(fetchUptimeData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("http://localhost:5000/api/uptime/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: monitorUrl, monitoring_enabled: monitoringEnabled }),
      });
      if (res.ok) {
        fetchUptimeData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Activity size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Uptime Monitoring</h1>
            <p className="text-zinc-400">Track application availability, response times, and incidents.</p>
          </div>
        </div>
        
        {statusData?.is_up ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            All Systems Operational
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full font-medium">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            Service Outage Detected
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Stats & Configuration */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Uptime Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {['24h', '7d', '30d'].map((period) => {
              const stat = statusData?.stats?.[period] || { uptime_pct: 0, avg_response_ms: 0 };
              const isPerfect = stat.uptime_pct >= 99.9;
              return (
                <div key={period} className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col">
                  <span className="text-zinc-400 font-medium text-sm mb-2 uppercase tracking-wider">{period} Uptime</span>
                  <div className="flex items-baseline gap-1 mt-auto">
                    <span className={`text-4xl font-bold tracking-tight ${isPerfect ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {stat.uptime_pct}%
                    </span>
                  </div>
                  <div className="text-sm text-zinc-500 mt-2 flex items-center gap-1">
                    <Clock size={14} />
                    Avg: {stat.avg_response_ms}ms
                  </div>
                </div>
              );
            })}
          </div>

          {/* Uptime Graph */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={20} className="text-zinc-400" />
              <h2 className="text-xl font-bold text-white">Response Time (24h)</h2>
            </div>
            <div className="h-[300px] w-full">
              {historyData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-500">No data available yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis 
                      dataKey="checked_at" 
                      tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      stroke="#71717a"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#71717a" 
                      fontSize={12}
                      tickFormatter={(tick) => `${tick}ms`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff10', borderRadius: '8px' }}
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="response_time_ms" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Incidents List */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex-1">
            <div className="flex items-center gap-2 mb-6">
              <History size={20} className="text-zinc-400" />
              <h2 className="text-xl font-bold text-white">Recent Incidents</h2>
            </div>
            
            {incidents.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 flex flex-col items-center">
                <CheckCircle2 size={48} className="text-emerald-500/20 mb-4" />
                <p>No incidents recorded.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="p-4 bg-black/40 border border-white/5 rounded-xl border-l-2 border-l-red-500">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle size={16} className="text-red-400" />
                          <h3 className="font-semibold text-white">Service Downtime</h3>
                        </div>
                        <p className="text-sm text-zinc-400 mb-3">
                          Started: {new Date(incident.started_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${incident.resolved_at ? 'bg-zinc-800 text-zinc-300' : 'bg-red-500/20 text-red-400'}`}>
                        {incident.resolved_at ? 'Resolved' : 'Active'}
                      </span>
                    </div>

                    {incident.ai_analysis && (
                      <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="text-xs text-purple-400 font-medium mb-1 uppercase tracking-wider flex items-center gap-1">
                          AI Root Cause Analysis
                        </div>
                        <p className="text-sm text-purple-200">
                          {incident.ai_analysis.root_cause || "No clear root cause identified."}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings2 size={20} className="text-blue-400" />
                <h2 className="text-xl font-bold text-white">Configuration</h2>
              </div>
            </div>

            <form onSubmit={saveSettings} className="space-y-6 flex-1 flex flex-col">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Endpoint URL</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="url"
                      placeholder="https://yourapp.com"
                      value={monitorUrl}
                      onChange={(e) => setMonitorUrl(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500/50 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl">
                  <div>
                    <h4 className="font-medium text-zinc-200">Active Monitoring</h4>
                    <p className="text-xs text-zinc-500 mt-1">Ping endpoint every 5 minutes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={monitoringEnabled}
                      onChange={(e) => setMonitoringEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <button 
                  type="submit" 
                  disabled={savingSettings}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition disabled:opacity-50"
                >
                  {savingSettings ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
