"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Search, AlertCircle, Clock, Globe, Laptop, ChevronRight, X, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

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
    message: "RateLimitExceeded: Client key 'app_live_884' crossed burst threshold of 2,500 req/s",
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
    stack: `Synthetic Probe: Ashburn multi-region ping monitor validated 100% operational status.\nZero packet loss detected.`,
    url: "/healthz",
    ip: "34.201.12.98",
    timestamp: "45 mins ago",
    status_code: 200
  },
  {
    id: "log-105",
    level: "info",
    message: "SSLAutoRenewal: TLS certificate renewal successfully provisioned for wildcard *.bhartinexus.com",
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

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.message.toLowerCase().includes(search.toLowerCase()) ||
                          l.url.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "all" || l.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getLevelBadge = (level: string, code: number) => {
    switch (level) {
      case "error":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase font-mono">{code} ERROR</span>;
      case "warn":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase font-mono">{code} WARN</span>;
      case "info":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase font-mono">{code} INFO</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] font-sans max-w-[1440px] mx-auto pb-4">
      {/* Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-1">Centralized Live Logs</h1>
          <p className="text-[13.5px] text-slate-600">Real-time structured stacktraces, upstream status codes, and distributed microservice logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Streaming Ingest Active
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search logs by error, endpoint, or stacktrace..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 text-[#0F172A] text-[13px] rounded-lg pl-9 pr-3 py-2 outline-none focus:border-[#635BFF] font-medium transition-colors shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            {["all", "error", "warn", "info"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1 rounded-md capitalize transition-all ${levelFilter === lvl ? "bg-white text-[#0F172A] shadow-xs" : "text-slate-600 hover:text-[#0F172A]"}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Split View */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Log Stream List */}
        <div className={`flex flex-col border border-slate-200 bg-white rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 ${selectedLog ? 'w-full lg:w-1/2' : 'w-full'}`}>
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Log Events ({filteredLogs.length})</span>
            <span>Realtime Feed</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                onClick={() => setSelectedLog(log)}
                className={`p-4 cursor-pointer hover:bg-slate-50/80 transition-colors ${selectedLog?.id === log.id ? 'bg-blue-50/60 border-l-4 border-l-[#635BFF]' : ''}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {getLevelBadge(log.level, log.status_code)}
                    <span className="text-[11px] font-mono font-bold text-slate-700">{log.url}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                </div>

                <p className="text-[13px] font-semibold text-[#0F172A] leading-snug line-clamp-1 font-mono">
                  {log.message}
                </p>

                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                  <span>Host: {log.ip}</span>
                  <span>ID: {log.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Log Detail Inspector */}
        {selectedLog && (
          <div className="hidden lg:flex flex-col w-1/2 border border-slate-200 bg-white rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[14px] text-[#0F172A]">Event Details</h3>
                <span className="text-[11px] font-mono text-slate-500">{selectedLog.id}</span>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status & Endpoint</span>
                <div className="flex items-center gap-2">
                  {getLevelBadge(selectedLog.level, selectedLog.status_code)}
                  <code className="bg-slate-100 text-[#0F172A] px-2 py-0.5 rounded text-xs font-mono font-semibold">
                    {selectedLog.url}
                  </code>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message</span>
                <p className="text-[13.5px] font-bold text-[#0F172A] bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono">
                  {selectedLog.message}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Stacktrace & Debug Output</span>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[11.5px] overflow-x-auto leading-relaxed">
                  {selectedLog.stack}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-[12px]">
                <div>
                  <span className="text-slate-400 block text-[10.5px] uppercase font-bold">Client IP</span>
                  <strong className="text-[#0F172A] font-mono">{selectedLog.ip}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10.5px] uppercase font-bold">Recorded At</span>
                  <strong className="text-[#0F172A]">{selectedLog.timestamp}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
