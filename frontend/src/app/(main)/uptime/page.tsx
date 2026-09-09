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
        <div className="w-5 h-5 border-2 border-[#333] border-t-[#EDEDED] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.04] shrink-0">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED] mb-1">Uptime Monitoring</h1>
          <p className="text-[13px] text-[#888]">Track application availability, response times, and incidents.</p>
        </div>
        
        {statusData?.is_up ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-white/[0.08] text-[#888] rounded-md text-[13px] font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            All Systems Operational
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-red-500/20 text-red-400 rounded-md text-[13px] font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
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
                <div key={period} className="bg-[#111] border border-white/[0.06] p-5 rounded-xl flex flex-col">
                  <span className="text-[#888] font-medium text-[11px] mb-2 uppercase tracking-wider">{period} Uptime</span>
                  <div className="flex items-baseline gap-1 mt-auto">
                    <span className={`text-4xl font-semibold tracking-tight ${isPerfect ? 'text-[#EDEDED]' : 'text-orange-400'}`}>
                      {stat.uptime_pct}%
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#555] mt-2 flex items-center gap-1.5">
                    <Clock size={12} />
                    Avg: {stat.avg_response_ms}ms
                  </div>
                </div>
              );
            })}
          </div>

          {/* Uptime Graph */}
          <div className="bg-[#111] border border-white/[0.06] p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={16} className="text-[#888]" />
              <h2 className="text-[14px] font-medium text-[#EDEDED]">Response Time (24h)</h2>
            </div>
            <div className="h-[260px] w-full">
              {historyData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[#555] text-[13px]">No data available yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis 
                      dataKey="checked_at" 
                      tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      stroke="#444"
                      fontSize={11}
                      tickMargin={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#444" 
                      fontSize={11}
                      tickFormatter={(tick) => `${tick}ms`}
                      axisLine={false}
                      tickLine={false}
                      width={45}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff10', borderRadius: '6px', fontSize: '12px', color: '#EDEDED' }}
                      itemStyle={{ color: '#EDEDED' }}
                      labelFormatter={(label) => new Date(label as string).toLocaleString()}
                      cursor={{ stroke: '#ffffff10' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="response_time_ms" 
                      stroke="#555" 
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 4, fill: '#EDEDED', stroke: '#111' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Incidents List */}
          <div className="bg-[#111] border border-white/[0.06] rounded-xl flex-1 flex flex-col">
            <div className="flex items-center gap-2 p-5 border-b border-white/[0.04]">
              <History size={16} className="text-[#888]" />
              <h2 className="text-[14px] font-medium text-[#EDEDED]">Recent Incidents</h2>
            </div>
            
            <div className="p-5 flex-1">
              {incidents.length === 0 ? (
                <div className="text-center py-12 text-[#555] flex flex-col items-center">
                  <CheckCircle2 size={32} className="text-[#333] mb-3" />
                  <p className="text-[13px]">No incidents recorded.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="p-4 bg-[#0a0a0a] border border-white/[0.04] rounded-lg border-l-2 border-l-red-500/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle size={14} className="text-red-400" />
                            <h3 className="text-[13px] font-medium text-[#EDEDED]">Service Downtime</h3>
                          </div>
                          <p className="text-[11px] text-[#666] mb-3 font-mono">
                            Started: {new Date(incident.started_at).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${incident.resolved_at ? 'bg-[#111] text-[#888] border border-white/[0.08]' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          {incident.resolved_at ? 'Resolved' : 'Active'}
                        </span>
                      </div>

                      {incident.ai_analysis && (
                        <div className="mt-3 p-3 bg-[#111] border border-white/[0.04] rounded-md">
                          <div className="text-[10px] text-[#888] font-medium mb-1.5 uppercase tracking-wider flex items-center gap-1">
                            AI Root Cause Analysis
                          </div>
                          <p className="text-[13px] text-[#EDEDED] leading-relaxed">
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
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-white/[0.06] p-5 rounded-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings2 size={16} className="text-[#888]" />
                <h2 className="text-[14px] font-medium text-[#EDEDED]">Configuration</h2>
              </div>
            </div>

            <form onSubmit={saveSettings} className="space-y-5 flex-1 flex flex-col">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#888] uppercase tracking-wider mb-1.5">Endpoint URL</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                    <input
                      type="url"
                      placeholder="https://yourapp.com"
                      value={monitorUrl}
                      onChange={(e) => setMonitorUrl(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] text-[#EDEDED] rounded-lg py-2 pl-9 pr-3 outline-none focus:border-white/20 transition-colors text-[13px]"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-white/[0.04] rounded-lg">
                  <div>
                    <h4 className="text-[13px] font-medium text-[#EDEDED]">Active Monitoring</h4>
                    <p className="text-[11px] text-[#666] mt-0.5">Ping endpoint every 5 minutes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={monitoringEnabled}
                      onChange={(e) => setMonitoringEnabled(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#EDEDED] after:border-gray-300 after:border-0 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#EDEDED] peer-checked:after:bg-[#111]"></div>
                  </label>
                </div>
              </div>

              <div className="mt-auto pt-5 border-t border-white/[0.04]">
                <button 
                  type="submit" 
                  disabled={savingSettings}
                  className="w-full py-2 bg-white hover:bg-[#e5e5e5] text-black font-medium text-[13px] rounded-lg transition disabled:opacity-50"
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
