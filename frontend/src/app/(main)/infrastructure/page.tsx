"use client";

import React, { useState } from "react";
import { Server, Cpu, HardDrive, Database, Activity, Network, Terminal, CheckCircle2, Copy, Check } from "lucide-react";

export default function InfrastructurePage() {
  const [period, setPeriod] = useState("1h");
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  const clusterNodes = [
    { id: "node-us-east-1a", name: "Worker Node 01 (Ashburn Core)", status: "Operational", cpu: 32.4, ram: 54.2, disk: 41.0, latency: "11.2ms" },
    { id: "node-us-east-1b", name: "Worker Node 02 (Ashburn Ingress)", status: "Operational", cpu: 38.6, ram: 61.5, disk: 44.8, latency: "13.4ms" },
    { id: "node-eu-west-1a", name: "Worker Node 03 (Frankfurt Gateway)", status: "Operational", cpu: 29.1, ram: 48.0, disk: 38.2, latency: "18.6ms" },
    { id: "node-ap-south-1a", name: "Worker Node 04 (Mumbai Regional)", status: "Operational", cpu: 41.5, ram: 69.4, disk: 46.1, latency: "22.8ms" }
  ];

  const scriptCode = `# Download and authorize Brexal telemetry kernel eBPF probe
curl -sSL https://get.brexal.com/agent.sh | sudo bash -s -- \\
  --cluster-id="cluster-brexal-prod-01" \\
  --token="brexal_live_sec_994a8e2b" \\
  --stream-interval=10s`;

  const copyScript = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              Infrastructure & Node Clusters
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All 4 Nodes Healthy
            </span>
          </div>
          <p className="text-[13.5px] text-[#425466]">
            Hardware utilization, distributed worker nodes, and eBPF kernel socket telemetry agents.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-[#0A2540] text-[13px] font-bold hover:bg-[#FAFBFD] transition shadow-xs cursor-pointer"
          >
            <Terminal size={14} className="text-[#635BFF]" />
            {showGuide ? "Hide Setup Script" : "Agent Ingestion Script"}
          </button>
        </div>
      </div>

      {/* Metric Cards (CPU, RAM, Disk, Network) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={15} className="text-[#635BFF]" /> CPU Utilization
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">Healthy</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0A2540] tracking-tight">34.8%</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-[#635BFF] h-2 rounded-full transition-all duration-500" style={{ width: "34.8%" }}></div>
          </div>
          <span className="text-[11.5px] text-[#425466] mt-2.5 block font-medium">8 vCPUs • AMD EPYC 7763</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={15} className="text-blue-500" /> Memory (RAM)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 uppercase">Optimal</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0A2540] tracking-tight">58.2%</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: "58.2%" }}></div>
          </div>
          <span className="text-[11.5px] text-[#425466] mt-2.5 block font-medium">18.6 GB / 32 GB Allocated</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive size={15} className="text-emerald-500" /> Storage (NVMe)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">42% Used</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0A2540] tracking-tight">212 GB</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: "42.4%" }}></div>
          </div>
          <span className="text-[11.5px] text-[#425466] mt-2.5 block font-medium">500 GB High-Throughput NVMe</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(10,37,64,0.03)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.06)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#425466] uppercase tracking-wider flex items-center gap-1.5">
              <Network size={15} className="text-purple-500" /> Network Mesh
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 uppercase">10 Gbps</span>
          </div>
          <p className="text-3xl font-extrabold text-[#0A2540] tracking-tight">1.8 Gbps</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: "36%" }}></div>
          </div>
          <span className="text-[11.5px] text-[#425466] mt-2.5 block font-medium">42.8 GB In / 118.4 GB Out</span>
        </div>
      </div>

      {/* Cluster Nodes Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(10,37,64,0.03)]">
        <div className="p-5 border-b border-slate-100 bg-[#FAFBFD] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-[15px] font-bold text-[#0A2540] flex items-center gap-2">
            <Server size={17} className="text-[#635BFF]" /> Active Worker Nodes & Fleet Status
          </h2>
          <span className="text-xs font-mono font-bold bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full shadow-xs self-start sm:self-auto">
            Kubernetes v1.30.2
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {clusterNodes.map((node) => (
            <div key={node.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200/70 text-[#0A2540]">
                  <Server size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-[#0A2540] flex items-center gap-2">
                    {node.name}
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                      {node.status}
                    </span>
                  </h3>
                  <span className="text-[11.5px] font-mono text-[#425466]">{node.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 sm:gap-8 text-[12px] pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div>
                  <span className="text-[#425466] block text-[10px] uppercase font-bold tracking-wider">CPU</span>
                  <strong className="text-[#0A2540] font-bold text-[13px]">{node.cpu}%</strong>
                </div>
                <div>
                  <span className="text-[#425466] block text-[10px] uppercase font-bold tracking-wider">RAM</span>
                  <strong className="text-[#0A2540] font-bold text-[13px]">{node.ram}%</strong>
                </div>
                <div>
                  <span className="text-[#425466] block text-[10px] uppercase font-bold tracking-wider">Disk</span>
                  <strong className="text-[#0A2540] font-bold text-[13px]">{node.disk}%</strong>
                </div>
                <div>
                  <span className="text-[#425466] block text-[10px] uppercase font-bold tracking-wider">Latency</span>
                  <strong className="text-emerald-600 font-bold font-mono text-[13px]">{node.latency}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingestion Script Guide (When Toggled) */}
      {showGuide && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(10,37,64,0.03)] animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-[#0A2540] flex items-center gap-2">
              <Terminal size={16} className="text-[#635BFF]" /> Linux Agent Daemon Setup (Bash)
            </h3>
            <button
              onClick={copyScript}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy Command"}
            </button>
          </div>
          <p className="text-[13px] text-[#425466] mb-4">
            Run this one-liner daemon on any Linux VPS or Kubernetes node to stream real-time telemetry with 0.0% CPU penalty:
          </p>
          <pre className="bg-[#0A2540] text-emerald-400 p-4.5 rounded-xl font-mono text-[12.5px] overflow-x-auto leading-relaxed border border-slate-800">
{scriptCode}
          </pre>
        </div>
      )}
    </div>
  );
}
