"use client";

import React, { useEffect, useState } from "react";
import { Server, Cpu, HardDrive, Database, Activity, RefreshCw, Network, Terminal, CheckCircle2 } from "lucide-react";

export default function InfrastructurePage() {
  const [period, setPeriod] = useState("1h");
  const [showGuide, setShowGuide] = useState(false);

  const clusterNodes = [
    { id: "node-us-east-1a", name: "Worker Node 01 (Ashburn Core)", status: "Operational", cpu: 32.4, ram: 54.2, disk: 41.0, latency: "11.2ms" },
    { id: "node-us-east-1b", name: "Worker Node 02 (Ashburn Ingress)", status: "Operational", cpu: 38.6, ram: 61.5, disk: 44.8, latency: "13.4ms" },
    { id: "node-eu-west-1a", name: "Worker Node 03 (Frankfurt Gateway)", status: "Operational", cpu: 29.1, ram: 48.0, disk: 38.2, latency: "18.6ms" },
    { id: "node-ap-south-1a", name: "Worker Node 04 (Mumbai Regional)", status: "Operational", cpu: 41.5, ram: 69.4, disk: 46.1, latency: "22.8ms" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mb-1">Infrastructure & Clusters</h1>
          <p className="text-[13.5px] text-slate-600">Hardware utilization, distributed worker nodes, and telemetry ingestion agents.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            4 Cluster Nodes Healthy
          </span>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[#0F172A] text-xs font-semibold hover:bg-slate-50 transition shadow-xs"
          >
            {showGuide ? "Hide Setup Script" : "Agent Ingestion Script"}
          </button>
        </div>
      </div>

      {/* Metric Cards (CPU, RAM, Disk, Network) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={15} className="text-[#635BFF]" /> CPU Utilization
            </span>
            <span className="text-xs font-bold text-emerald-600">Healthy</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">34.8%</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-[#635BFF] h-2 rounded-full" style={{ width: "34.8%" }}></div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-medium">8 vCPUs • 2.80 GHz AMD EPYC</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={15} className="text-blue-500" /> Memory (RAM)
            </span>
            <span className="text-xs font-bold text-blue-600">Optimal</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">58.2%</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "58.2%" }}></div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-medium">18.6 GB / 32 GB Allocated</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive size={15} className="text-emerald-500" /> Storage (NVMe)
            </span>
            <span className="text-xs font-bold text-emerald-600">42% Used</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">212 GB</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "42.4%" }}></div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-medium">500 GB High-Throughput NVMe</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Network size={15} className="text-purple-500" /> Network Throughput
            </span>
            <span className="text-xs font-bold text-purple-600">Gigabit Mesh</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">1.8 Gbps</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "36%" }}></div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-medium">42.8 GB In / 118.4 GB Out</span>
        </div>
      </div>

      {/* Cluster Nodes Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2">
            <Server size={16} className="text-[#635BFF]" /> Active Worker Nodes
          </h2>
          <span className="text-xs font-mono font-bold bg-white border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
            Kubernetes v1.30.2
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {clusterNodes.map((node) => (
            <div key={node.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[#0F172A]">
                  <Server size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[13.5px] text-[#0F172A] flex items-center gap-2">
                    {node.name}
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {node.status}
                    </span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">{node.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-[12px]">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">CPU</span>
                  <strong className="text-[#0F172A] font-bold">{node.cpu}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">RAM</span>
                  <strong className="text-[#0F172A] font-bold">{node.ram}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Disk</span>
                  <strong className="text-[#0F172A] font-bold">{node.disk}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Latency</span>
                  <strong className="text-emerald-600 font-bold font-mono">{node.latency}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingestion Script Guide (When Toggled) */}
      {showGuide && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[14px] font-bold text-[#0F172A] mb-2 flex items-center gap-2">
            <Terminal size={15} className="text-[#635BFF]" /> Linux Agent Daemon Setup (Bash)
          </h3>
          <p className="text-[12.5px] text-slate-600 mb-3">Run this one-liner daemon on any Linux VPS or Kubernetes pod to stream real-time telemetry:</p>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[12px] overflow-x-auto">
{`# 1. Download and authorize BhartiAppPlus telemetry agent
curl -sSL https://get.bhartinexus.com/agent.sh | sudo bash -s -- \\
  --app-id="app-bharti-nexus" \\
  --token="bharti_live_sec_994a8e2b" \\
  --stream-interval=10s`}
          </pre>
        </div>
      )}
    </div>
  );
}
