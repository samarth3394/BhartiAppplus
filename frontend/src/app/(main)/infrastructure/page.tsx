"use client";

import React, { useEffect, useState } from "react";
import { Server, Cpu, HardDrive, Database, Activity, RefreshCw } from "lucide-react";

export default function InfrastructurePage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1h");

  const [showGuide, setShowGuide] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/server/metrics?period=${period}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [period]);

  const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : { cpu_percent: 0, ram_percent: 0, disk_percent: 0 };

  const getStatusColor = (value: number) => {
    if (value > 85) return "text-red-400 bg-red-500/20";
    if (value > 70) return "text-orange-400 bg-orange-500/20";
    return "text-emerald-400 bg-emerald-500/20";
  };
  
  const getProgressColor = (value: number) => {
    if (value > 85) return "bg-red-500";
    if (value > 70) return "bg-orange-500";
    return "bg-emerald-500";
  };

  const calculateAverage = (key: string) => {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, curr) => acc + (curr[key] || 0), 0);
    return (sum / metrics.length).toFixed(1);
  };

  const scriptCode = `#!/bin/bash
# BhartiAppPlus Server Metrics Ingestion Script

API_KEY="YOUR_API_CLIENT_KEY"
URL="http://YOUR_SERVER_IP:5000/api/ingest/metrics"

CPU=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{print 100 - $1}')
RAM=$(free | awk '/Mem/{printf("%.2f", $3/$2 * 100)}')
DISK=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

curl -X POST $URL \\
  -H "X-Nexvora-Key: $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d "{\\"cpu_percent\\": $CPU, \\"ram_percent\\": $RAM, \\"disk_percent\\": $DISK}"
`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Server size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Infrastructure Metrics</h1>
            <p className="text-zinc-400">Monitor CPU, Memory, and Disk usage of your app's servers.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowGuide(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition"
          >
            Integration Guide
          </button>
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-black/50 border border-white/10 text-white rounded-xl py-2 px-4 outline-none focus:border-blue-500/50 transition-colors appearance-none"
          >
            <option value="1h">Last 1 Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button 
            onClick={fetchMetrics}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition"
          >
            <RefreshCw size={20} className={loading ? "animate-spin text-blue-400" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CPU Card */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu size={20} className="text-blue-400" /> CPU Usage
            </h2>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(latestMetric.cpu_percent)}`}>
              {latestMetric.cpu_percent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-3 mb-6 overflow-hidden">
            <div className={`h-full ${getProgressColor(latestMetric.cpu_percent)} transition-all duration-1000`} style={{ width: `${latestMetric.cpu_percent}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Average ({period})</span>
            <span className="text-white font-medium">{calculateAverage('cpu_percent')}%</span>
          </div>
        </div>

        {/* Memory Card */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database size={20} className="text-purple-400" /> Memory (RAM)
            </h2>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(latestMetric.ram_percent)}`}>
              {latestMetric.ram_percent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-3 mb-6 overflow-hidden">
            <div className={`h-full ${getProgressColor(latestMetric.ram_percent)} transition-all duration-1000`} style={{ width: `${latestMetric.ram_percent}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Average ({period})</span>
            <span className="text-white font-medium">{calculateAverage('ram_percent')}%</span>
          </div>
        </div>

        {/* Disk Card */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HardDrive size={20} className="text-orange-400" /> Disk IO
            </h2>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(latestMetric.disk_percent)}`}>
              {latestMetric.disk_percent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-3 mb-6 overflow-hidden">
            <div className={`h-full ${getProgressColor(latestMetric.disk_percent)} transition-all duration-1000`} style={{ width: `${latestMetric.disk_percent}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Average ({period})</span>
            <span className="text-white font-medium">{calculateAverage('disk_percent')}%</span>
          </div>
        </div>
      </div>

      {/* Metrics History (Mock Graph Visualization) */}
      <div className="flex-1 bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity size={20} className="text-emerald-400" /> Metrics Timeline
        </h2>
        
        {metrics.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-zinc-500 border border-dashed border-white/5 rounded-xl">
            No metrics data available for this period.
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto custom-scrollbar flex items-end gap-2 pb-2 h-48">
            {metrics.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end group relative min-w-[24px]">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3 whitespace-nowrap z-10 transition-opacity pointer-events-none shadow-xl">
                  <div className="text-xs text-zinc-400 mb-1">{new Date(m.timestamp).toLocaleString()}</div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-400 font-medium">CPU: {m.cpu_percent.toFixed(1)}%</span>
                    <span className="text-purple-400 font-medium">RAM: {m.ram_percent.toFixed(1)}%</span>
                  </div>
                </div>
                
                {/* Stacked bars for CPU and RAM (Simplified Visualization) */}
                <div className="w-full bg-white/5 rounded-t-sm flex flex-col justify-end overflow-hidden" style={{ height: '100%' }}>
                  {/* CPU portion */}
                  <div className="w-full bg-blue-500/50 hover:bg-blue-400 transition-colors" style={{ height: `${m.cpu_percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Integration Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950">
              <h2 className="text-xl font-bold text-white">Server Integration Guide</h2>
              <button onClick={() => setShowGuide(false)} className="text-zinc-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 text-zinc-300">
              <p>To start monitoring your server, you need to run a small bash script via cron job that collects metrics and sends them to BhartiAppPlus.</p>
              
              <div className="space-y-2">
                <h3 className="text-white font-semibold">1. Create the script file</h3>
                <p className="text-sm">Connect to your server via SSH and create a file named <code>metrics.sh</code>:</p>
                <pre className="bg-black p-4 rounded-xl border border-white/10 overflow-x-auto text-sm text-blue-400">
                  <code>nano metrics.sh</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-semibold">2. Copy and Paste</h3>
                <p className="text-sm">Paste the following code into the file. Replace <code className="text-white">YOUR_API_CLIENT_KEY</code> with your App's Client Key (found in Settings):</p>
                <pre className="bg-black p-4 rounded-xl border border-white/10 overflow-x-auto text-sm text-zinc-300">
                  <code>{scriptCode}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-semibold">3. Make it executable & Set up Cron Job</h3>
                <p className="text-sm">Make the script executable and add it to your crontab to run every 5 minutes:</p>
                <pre className="bg-black p-4 rounded-xl border border-white/10 overflow-x-auto text-sm text-emerald-400">
                  <code>
                    chmod +x metrics.sh{'\n'}
                    crontab -e{'\n'}
                    # Add this line at the bottom:{'\n'}
                    */5 * * * * /path/to/metrics.sh
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
