"use client";

import React, { useState } from "react";
import { Terminal, Search, AlertCircle, Clock, Globe, Laptop, ChevronRight, X, AlertTriangle, Info, CheckCircle2, Copy, Check } from "lucide-react";

type LogEntry = {
  id: string;
  level: "error" | "warn" | "info";
  message: string;
  stack: string;
  url: string;
  ip: string;
  timestamp: string;
  status_code: number;
};

const DEFAULT_LOGS: LogEntry[] = [
  {
    id: "log-101",
    level: "error",
    message: "ConnectionRefusedError: [Errno 111] Connection refused to 10.0.4.12:5432 (Postgres Primary Pool)",
    stack: `File "/app/core/database.py", line 84, in get_db_connection\n    conn = pool.acquire(timeout=2.0)\n  File "/usr/local/lib/python3.11/asyncpg/pool.py", line 421, in acquire\n    raise exceptions.PoolTimeoutError("Connection acquisition timed out after 2.0s")`,
    url: "/api/v1/telemetry/ingest",
    ip: "172.31.28.14",
    timestamp: "2 mins ago",
    status_code: 500
  },
  {
    id: "log-102",
    level: "warn",
    message: "RateLimitExceeded: Client key 'brexal_live_884' crossed burst threshold of 2,500 req/s",
    stack: `RateLimiter: Ingress IP 104.28.19.44 exceeded token bucket allocation.\nAction: Temporarily throttled client with HTTP 429 Too Many Requests (retry-after: 30s).`,
    url: "/v1/ai/inference",
    ip: "104.28.19.44",
    timestamp: "8 mins ago",
    status_code: 429
  },
  {
    id: "log-103",
    level: "error",
    message: "BadGatewayError: Microservice 'auth-service' worker pod did not reply within 1,500ms timeout",
    stack: `ReverseProxyGateway: Upstream envoy proxy failed to reach internal pod 10.0.8.21:8080.\nSocket error: Operation timed out during token verification handshake.`,
    url: "/api/auth/verify",
    ip: "10.0.8.21",
    timestamp: "24 mins ago",
    status_code: 502
  },
  {
    id: "log-104",
    level: "info",
    message: "HealthProbeCheck: Endpoint /healthz responding with 200 OK (latency 11.2ms)",
    stack: `Synthetic Probe: Ashburn multi-region ping monitor validated 100% operational status.\nZero packet loss detected across all 3 ingress probes.`,
    url: "/healthz",
    ip: "34.201.12.98",
    timestamp: "45 mins ago",
    status_code: 200
  },
  {
    id: "log-105",
    level: "info",
    message: "SSLAutoRenewal: TLS certificate renewal successfully provisioned for wildcard *.brexal.com",
    stack: `ACME Engine: Automated challenge verified via Cloudflare DNS-01.\nNew expiration date registered: 2027-11-05T00:00:00Z.`,
    url: "/cron/cert-renewal",
    ip: "127.0.0.1",
    timestamp: "1 hour ago",
    status_code: 200
  }
];

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(DEFAULT_LOGS);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(DEFAULT_LOGS[0]);
  const [copied, setCopied] = useState(false);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.message.toLowerCase().includes(search.toLowerCase()) ||
                          l.url.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "all" || l.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getLevelBadge = (level: string, code: number) => {
    switch (level) {
      case "error":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 uppercase font-mono">{code} ERROR</span>;
      case "warn":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 uppercase font-mono">{code} WARN</span>;
      case "info":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase font-mono">{code} INFO</span>;
      default:
        return null;
    }
  };

  const copyStack = () => {
    if (selectedLog) {
      navigator.clipboard.writeText(selectedLog.stack);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] font-sans max-w-[1440px] mx-auto pb-4">
      {/* Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              Centralized Live Logs & Traces
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Streaming Active
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Real-time structured stacktraces, upstream status codes, and distributed microservice audit events.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 shrink-0">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search logs by error string, route, or stacktrace..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200/90 text-[#0A2540] text-[13px] rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 font-medium transition shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-[#FAFBFD] p-1 rounded-xl border border-slate-200/90 text-xs font-semibold shadow-2xs">
            {["all", "error", "warn", "info"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  levelFilter === lvl 
                    ? "bg-white text-[#0A2540] font-bold shadow-xs border border-slate-200/60" 
                    : "text-[#425466] hover:text-[#0A2540]"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Split View */}
      <div className="flex flex-1 gap-5 overflow-hidden">
        {/* Log Stream List */}
        <div className={`flex flex-col border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,37,64,0.03)] transition-all duration-200 ${selectedLog ? 'w-full lg:w-1/2' : 'w-full'}`}>
          <div className="p-3.5 bg-[#FAFBFD] border-b border-slate-200/80 flex justify-between items-center text-[11px] font-bold text-[#425466] uppercase tracking-wider">
            <span>Log Events ({filteredLogs.length})</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Feed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                onClick={() => setSelectedLog(log)}
                className={`p-4 cursor-pointer hover:bg-slate-50/70 transition-all ${
                  selectedLog?.id === log.id ? 'bg-[#635BFF]/5 border-l-4 border-l-[#635BFF]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {getLevelBadge(log.level, log.status_code)}
                    <span className="text-[12px] font-mono font-bold text-[#0A2540]">{log.url}</span>
                  </div>
                  <span className="text-[11px] text-[#425466] font-mono">{log.timestamp}</span>
                </div>

                <p className="text-[13px] font-semibold text-[#0A2540] leading-snug line-clamp-1 font-mono">
                  {log.message}
                </p>

                <div className="flex items-center gap-3.5 mt-2 text-[11px] text-[#425466] font-mono">
                  <span>Host: {log.ip}</span>
                  <span>Span: {log.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Log Detail Inspector */}
        {selectedLog && (
          <div className="hidden lg:flex flex-col w-1/2 border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,37,64,0.03)] animate-in fade-in duration-150">
            <div className="p-4 bg-[#FAFBFD] border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[14px] text-[#0A2540]">Event Details & Stacktrace</h3>
                <span className="text-[11px] font-mono text-[#425466]">{selectedLog.id}</span>
              </div>
              <button 
                onClick={() => setSelectedLog(null)} 
                className="p-1.5 hover:bg-slate-200/70 rounded-lg text-slate-500 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider block mb-1.5">Status & Route</span>
                <div className="flex items-center gap-2">
                  {getLevelBadge(selectedLog.level, selectedLog.status_code)}
                  <code className="bg-[#FAFBFD] text-[#0A2540] border border-slate-200/80 px-2.5 py-1 rounded-md text-xs font-mono font-bold">
                    {selectedLog.url}
                  </code>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider block mb-1.5">Message</span>
                <p className="text-[13px] font-bold text-[#0A2540] bg-[#FAFBFD] p-3.5 rounded-xl border border-slate-200/80 font-mono leading-relaxed">
                  {selectedLog.message}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider block">Stacktrace & Debug Output</span>
                  <button
                    onClick={copyStack}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#635BFF] hover:underline cursor-pointer"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy Stack"}
                  </button>
                </div>
                <pre className="bg-[#0A2540] text-emerald-400 p-4.5 rounded-xl font-mono text-[11.5px] overflow-x-auto leading-relaxed border border-slate-800">
                  {selectedLog.stack}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-[12px]">
                <div>
                  <span className="text-[#425466] block text-[10.5px] uppercase font-bold tracking-wider">Client / Pod IP</span>
                  <strong className="text-[#0A2540] font-mono text-[13px]">{selectedLog.ip}</strong>
                </div>
                <div>
                  <span className="text-[#425466] block text-[10.5px] uppercase font-bold tracking-wider">Recorded At</span>
                  <strong className="text-[#0A2540] text-[13px]">{selectedLog.timestamp}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
