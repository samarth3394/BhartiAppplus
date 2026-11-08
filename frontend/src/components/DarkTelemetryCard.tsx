"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, GitCommit, Radio, Activity } from "lucide-react";

interface RegionData {
  p99: string;
  error: string;
  rps: string;
  status: "HEALTHY" | "NOMINAL";
  proxyLatency: string;
  authLatency: string;
  workerLatency: string;
  workerStatus: string;
}

export function DarkTelemetryCard() {
  const [selectedRegion, setSelectedRegion] = useState<"us-east-1" | "eu-central-1" | "ap-south-1">("us-east-1");
  const [liveP99, setLiveP99] = useState("1.43ms");
  const [liveThroughput, setLiveThroughput] = useState("48.2k/s");

  const regions: Record<"us-east-1" | "eu-central-1" | "ap-south-1", RegionData> = {
    "us-east-1": {
      p99: "1.43ms",
      error: "0.001%",
      rps: "48.2k/s",
      status: "HEALTHY",
      proxyLatency: "0.8ms • 48.2k",
      authLatency: "3.4ms • 4.2k rps",
      workerLatency: "142ms • Degraded",
      workerStatus: "Degraded",
    },
    "eu-central-1": {
      p99: "1.85ms",
      error: "0.000%",
      rps: "32.1k/s",
      status: "HEALTHY",
      proxyLatency: "1.1ms • 32.1k",
      authLatency: "2.9ms • 3.8k rps",
      workerLatency: "18ms • Nominal",
      workerStatus: "Nominal",
    },
    "ap-south-1": {
      p99: "2.12ms",
      error: "0.003%",
      rps: "24.6k/s",
      status: "NOMINAL",
      proxyLatency: "1.4ms • 24.6k",
      authLatency: "4.1ms • 2.9k rps",
      workerLatency: "95ms • Warning",
      workerStatus: "Warning",
    },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const base = selectedRegion === "us-east-1" ? 1.41 : selectedRegion === "eu-central-1" ? 1.83 : 2.09;
      const jitter = (base + Math.random() * 0.05).toFixed(2);
      setLiveP99(`${jitter}ms`);

      const tBase = selectedRegion === "us-east-1" ? 48.2 : selectedRegion === "eu-central-1" ? 32.1 : 24.6;
      const tJitter = (tBase + (Math.random() * 0.4 - 0.2)).toFixed(1);
      setLiveThroughput(`${tJitter}k/s`);
    }, 2400);
    return () => clearInterval(timer);
  }, [selectedRegion]);

  const active = regions[selectedRegion];

  return (
    <div className="w-full max-w-[620px] mx-auto rounded-3xl bg-[#0B0D13] border border-[#1F2433] p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] text-left font-mono">
      
      {/* ── HEADER ROW: REGIONS SELECTOR + STATUS BADGE ── */}
      <div className="flex items-center justify-between pb-6 border-b border-[#1A1F2C]">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141824] border border-[#23293D]">
          {(["us-east-1", "eu-central-1", "ap-south-1"] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                selectedRegion === reg
                  ? "bg-[#3985FF] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        <div className="px-3 py-1 rounded-md border border-[#059669]/60 bg-[#052E1E]/40 text-[#36D399] text-xs font-mono font-bold tracking-wider">
          {active.status}
        </div>
      </div>

      {/* ── 3 METRICS TILES ── */}
      <div className="grid grid-cols-3 gap-3.5 my-5">
        <div className="p-4 rounded-xl bg-[#121622] border border-[#1E2436]">
          <span className="text-[10px] text-slate-400 tracking-wider block mb-1 uppercase font-semibold">
            P99 LATENCY
          </span>
          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {liveP99}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#121622] border border-[#1E2436]">
          <span className="text-[10px] text-slate-400 tracking-wider block mb-1 uppercase font-semibold">
            ERROR RATE
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#36D399] tracking-tight">
            {active.error}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#121622] border border-[#1E2436]">
          <span className="text-[10px] text-slate-400 tracking-wider block mb-1 uppercase font-semibold">
            THROUGHPUT
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#3985FF] tracking-tight">
            {liveThroughput}
          </span>
        </div>
      </div>

      {/* ── TOPOLOGY MESH ELEVATION BOX ── */}
      <div className="p-4 rounded-xl bg-[#121622] border border-[#1E2436] space-y-3 mb-5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold tracking-wider pb-2 border-b border-[#1A1F2C]">
          <span className="flex items-center gap-1.5">
            <Radio size={13} className="text-[#3985FF] animate-pulse" />
            TOPOLOGY MESH ELEVATION
          </span>
          <span className="text-slate-500 text-[10px]">6 ACTIVE NODES</span>
        </div>

        {/* Node 1 */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0B0D13]/70 border border-[#1A1F2C]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#36D399] shadow-[0_0_8px_#36D399]" />
            <span className="text-white text-xs font-semibold">api-edge-proxy</span>
          </div>
          <span className="text-slate-400 text-xs">{active.proxyLatency}</span>
        </div>

        {/* Node 2 */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0B0D13]/70 border border-[#1A1F2C]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#36D399] shadow-[0_0_8px_#36D399]" />
            <span className="text-white text-xs font-semibold">auth-service-v2</span>
          </div>
          <span className="text-slate-400 text-xs">{active.authLatency}</span>
        </div>

        {/* Node 3 (Degraded / Worker with amber alert border) */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1F1710] border border-[#92400E]/70 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B] animate-pulse" />
            <span className="text-white text-xs font-semibold">payment-worker-pool</span>
          </div>
          <span className="text-[#F59E0B] text-xs font-semibold">{active.workerLatency}</span>
        </div>
      </div>

      {/* ── AI ANOMALY DETECTION // MESH CORRELATION ── */}
      <div className="p-4 rounded-xl bg-[#141026] border border-[#7C3AED]/50 mb-5 relative overflow-hidden">
        <div className="flex items-center gap-1.5 text-[#A78BFA] text-[11px] font-bold tracking-wider mb-1.5">
          <Sparkles size={13} className="text-[#A78BFA]" />
          <span>AI ANOMALY DETECTION // MESH CORRELATION</span>
        </div>
        <div className="text-white text-xs sm:text-[13px] font-semibold leading-relaxed mb-1">
          Connection pool saturation on <span className="text-[#60A5FA]">postgres-primary</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Correlated with commit sha:8f2a1b9 (payment retry loop)
        </div>
      </div>

      {/* ── FOOTER ROW: DEPLOYMENT STATUS & CANARY ROLLBACKS ── */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span className="flex items-center gap-1.5">
          <GitCommit size={13} className="text-[#3985FF]" />
          v2.4.1 deployed 4m ago
        </span>
        <span className="text-[#36D399] font-semibold">0 canary rollbacks</span>
      </div>

    </div>
  );
}

