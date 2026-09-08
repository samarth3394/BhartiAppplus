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
    if (value > 85) return "text-red-400 bg-red-500/10";
    if (value > 70) return "text-amber-400 bg-amber-500/10";
    return "text-emerald-400 bg-emerald-500/10";
  };
  
  const getProgressColor = (value: number) => {
    if (value > 85) return "bg-red-500";
    if (value > 70) return "bg-amber-500";
    return "bg-[#EDEDED]";
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
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4 pb-4 border-b border-white/[0.04]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED] mb-1">Infrastructure Metrics</h1>
          <p className="text-[13px] text-[#888]">Monitor CPU, Memory, and Disk usage of your app's servers.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowGuide(true)}
            className="px-3 py-1.5 bg-[#111] border border-white/[0.08] hover:bg-[#1a1a1a] text-[#EDEDED] text-[13px] font-medium rounded-lg transition"
          >
            Integration Guide
          </button>
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-[#111] border border-white/[0.08] text-[#EDEDED] text-[13px] rounded-lg py-1.5 px-3 outline-none focus:border-white/20 transition-colors appearance-none"
          >
            <option value="1h">Last 1 Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button 
            onClick={fetchMetrics}
            className="p-1.5 bg-[#111] hover:bg-[#1a1a1a] text-[#EDEDED] rounded-lg border border-white/[0.08] transition"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-[#888]" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU Card */}
        <div className="bg-[#111] border border-white/[0.06] p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-medium text-[#EDEDED] flex items-center gap-2">
              <Cpu size={16} className="text-[#666]" /> CPU Usage
            </h2>
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${getStatusColor(latestMetric.cpu_percent)}`}>
              {latestMetric.cpu_percent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-[#222] rounded-full h-1.5 mb-4 overflow-hidden">
            <div className={`h-full ${getProgressColor(latestMetric.cpu_percent)} transition-all duration-1000`} style={{ width: `${latestMetric.cpu_percent}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#666]">Average ({period})</span>
            <span className="text-[#EDEDED] font-medium">{calculateAverage('cpu_percent')}%</span>
          </div>
        </div>

        {/* Memory Card */}
        <div className="bg-[#111] border border-white/[0.06] p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-medium text-[#EDEDED] flex items-center gap-2">
              <Database size={16} className="text-[#666]" /> Memory (RAM)
            </h2>
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${getStatusColor(latestMetric.ram_percent)}`}>
              {latestMetric.ram_percent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-[#222] rounded-full h-1.5 mb-4 overflow-hidden">
            <div className={`h-full ${getProgressColor(latestMetric.ram_percent)} transition-all duration-1000`} style={{ width: `${latestMetric.ram_percent}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#666]">Average ({period})</span>
            <span className="text-[#EDEDED] font-medium">{calculateAverage('ram_percent')}%</span>
          </div>
        </div>

        {/* Disk Card */}
        <div className="bg-[#111] border border-white/[0.06] p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-medium text-[#EDEDED] flex items-center gap-2">
              <HardDrive size={16} className="text-[#666]" /> Disk IO
            </h2>
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${getStatusColor(latestMetric.disk_percent)}`}>
              {latestMetric.disk_percent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-[#222] rounded-full h-1.5 mb-4 overflow-hidden">
            <div className={`h-full ${getProgressColor(latestMetric.disk_percent)} transition-all duration-1000`} style={{ width: `${latestMetric.disk_percent}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#666]">Average ({period})</span>
            <span className="text-[#EDEDED] font-medium">{calculateAverage('disk_percent')}%</span>
          </div>
        </div>
      </div>

      {/* Metrics History (Mock Graph Visualization) */}
      <div className="flex-1 bg-[#111] border border-white/[0.06] p-5 rounded-xl flex flex-col">
        <h2 className="text-[14px] font-medium text-[#EDEDED] mb-4 flex items-center gap-2">
          <Activity size={16} className="text-[#666]" /> Metrics Timeline
        </h2>
        
        {metrics.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[#555] border border-dashed border-white/[0.04] rounded-lg text-[13px]">
            No metrics data available for this period.
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto custom-scrollbar flex items-end gap-[2px] pb-2 h-48">
            {metrics.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end group relative min-w-[20px]">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-[#1a1a1a] border border-white/[0.08] rounded-md p-2 whitespace-nowrap z-10 transition-opacity pointer-events-none shadow-xl">
                  <div className="text-[10px] text-[#888] mb-1">{new Date(m.timestamp).toLocaleString()}</div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-[#EDEDED] font-medium">CPU: {m.cpu_percent.toFixed(1)}%</span>
                    <span className="text-[#888] font-medium">RAM: {m.ram_percent.toFixed(1)}%</span>
                  </div>
                </div>
                
                {/* Stacked bars for CPU and RAM (Simplified Visualization) */}
                <div className="w-full bg-[#222] rounded-t-[1px] flex flex-col justify-end overflow-hidden" style={{ height: '100%' }}>
                  {/* CPU portion */}
                  <div className="w-full bg-[#555] group-hover:bg-[#888] transition-colors" style={{ height: `${m.cpu_percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Integration Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/[0.08] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
              <h2 className="text-[15px] font-medium text-[#EDEDED]">Server Integration Guide</h2>
              <button onClick={() => setShowGuide(false)} className="text-[#666] hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 text-[#888] text-[13px]">
              <p>To start monitoring your server, you need to run a small bash script via cron job that collects metrics and sends them to BhartiAppPlus.</p>
              
              <div className="space-y-2">
                <h3 className="text-[#EDEDED] font-medium text-[14px]">1. Create the script file</h3>
                <p>Connect to your server via SSH and create a file named <code className="bg-[#222] px-1 py-0.5 rounded text-[#EDEDED]">metrics.sh</code>:</p>
                <pre className="bg-[#0a0a0a] p-4 rounded-lg border border-white/[0.04] overflow-x-auto text-[#EDEDED] font-mono text-[12px]">
                  <code>nano metrics.sh</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="text-[#EDEDED] font-medium text-[14px]">2. Copy and Paste</h3>
                <p>Paste the following code into the file. Replace <code className="bg-[#222] px-1 py-0.5 rounded text-[#EDEDED]">YOUR_API_CLIENT_KEY</code> with your App's Client Key (found in Settings):</p>
                <pre className="bg-[#0a0a0a] p-4 rounded-lg border border-white/[0.04] overflow-x-auto text-[#888] font-mono text-[12px] leading-relaxed">
                  <code>{scriptCode}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="text-[#EDEDED] font-medium text-[14px]">3. Make it executable & Set up Cron Job</h3>
                <p>Make the script executable and add it to your crontab to run every 5 minutes:</p>
                <pre className="bg-[#0a0a0a] p-4 rounded-lg border border-white/[0.04] overflow-x-auto text-[#888] font-mono text-[12px] leading-relaxed">
                  <code>
                    chmod +x metrics.sh{'\n'}
                    crontab -e{'\n'}
                    <span className="text-[#555]"># Add this line at the bottom:</span>{'\n'}
                    <span className="text-[#EDEDED]">*/5 * * * * /path/to/metrics.sh</span>
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
