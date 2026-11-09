"use client";

import React from "react";
import { Check, X, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export function BrexalComparisonSection() {
  const comparisonRows = [
    {
      feature: "CPU & Memory Overhead",
      brexal: "< 0.8% CPU (Zero Penalty via eBPF)",
      brexalHighlight: true,
      datadog: "4% - 8% CPU (Userspace + JMX)",
      newrelic: "3% - 7% CPU (Bytecode injection)",
      dynatrace: "3% - 6% CPU (OneAgent daemon)",
      note: "Measured on 64-core Linux kernel 5.15+ under 120,000 req/sec load."
    },
    {
      feature: "Total Cost of Ownership (TCO)",
      brexal: "10x Lower ($15/node flat, 0 egress tax)",
      brexalHighlight: true,
      datadog: "$$$$ (Per-host + per-metric overages)",
      newrelic: "$$$ (Per-GB ingest traps)",
      dynatrace: "$$$$$ (Host-unit multiplier billing)",
      note: "Predictable cluster node pricing with unlimited metric ingest."
    },
    {
      feature: "Vendor Lock-In & Open Standards",
      brexal: "Zero Lock-In (100% Native OTel & PromQL)",
      brexalHighlight: true,
      datadog: "High (Proprietary DogStatsD & closed APIs)",
      newrelic: "High (Proprietary telemetry forwarder)",
      dynatrace: "High (Proprietary OneAgent protocol)",
      note: "Full CNCF OpenTelemetry v1.32 compliance."
    },
    {
      feature: "Code Modification Required?",
      brexal: "Zero (eBPF Kernel socket autodiscovery)",
      brexalHighlight: true,
      datadog: "Manual SDK imports & config edits",
      newrelic: "Code annotations & bytecode agents",
      dynatrace: "Service injection requiring restarts",
      note: "Drop-in deployment via 1-step Helm chart."
    },
    {
      feature: "AI Root Cause & Causal Analysis",
      brexal: "Autonomous Neural Engine (< 90s Causal Graph)",
      brexalHighlight: true,
      datadog: "Manual dashboard correlation + noisy Watchdog",
      newrelic: "Static threshold alerts & log search",
      dynatrace: "Davis AI (Rule-based correlation)",
      note: "Topological Bayesian causal inference eliminates 95% of alert noise."
    },
    {
      feature: "Data Sovereignty & Self-Hosted Option",
      brexal: "Full BYOC / Self-Hosted in your private VPC",
      brexalHighlight: true,
      datadog: "SaaS Only (All data must leave your network)",
      newrelic: "SaaS Only (Public multi-tenant storage)",
      dynatrace: "Managed SaaS (Strict export limits)",
      note: "SOC-2 Type II & HIPAA compliant VPC deployment."
    },
    {
      feature: "Distributed Tracing Sampling",
      brexal: "100% Tail-based (Never misses an error)",
      brexalHighlight: true,
      datadog: "Head-sampled (Drops up to 80% to cut cost)",
      newrelic: "Sampled ingest to avoid quota fines",
      dynatrace: "Adaptive sampling",
      note: "Evaluates 100% of spans before deciding retention."
    }
  ];

  return (
    <section id="comparison" className="py-16 sm:py-20 md:py-26 px-4 sm:px-10 bg-white border-b border-slate-200/80 relative overflow-hidden font-sans">
      
      <div className="max-w-[1320px] mx-auto text-left relative z-10">
        
        {/* Eyebrow & Headline */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-6 h-[1.5px] bg-[#2563EB]" />
            <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#2563EB] uppercase tracking-widest">
              ENTERPRISE CTO BENCHMARK
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[44px] font-extrabold tracking-[-0.035em] text-[#0A2540] leading-[1.15] mb-3">
            Why Modern Engineering Teams Choose BREXAL.
          </h2>
          <p className="text-sm sm:text-base text-[#425466] leading-relaxed max-w-2xl font-normal">
            Legacy APM tools were engineered for monolithic servers with heavy agent overhead and punitive data ingress taxes. BREXAL delivers kernel-native observability designed for cloud-native architectures.
          </p>
        </div>

        {/* ── RESPONSIVE COMPARISON MATRIX TABLE ── */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-500 w-[28%]">
                    Capability / Metric
                  </th>
                  
                  {/* BREXAL (Featured Column Header) */}
                  <th className="py-4 sm:py-5 px-4 sm:px-6 bg-gradient-to-b from-[#EFF6FF] to-[#DBEAFE]/40 border-x border-[#93C5FD] w-[26%] relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base sm:text-lg font-black text-[#0A2540] tracking-tight">
                        BREXAL
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-mono font-bold tracking-wide">
                        RECOMMENDED
                      </span>
                    </div>
                    <span className="text-[11px] text-[#2563EB] font-bold font-mono">
                      Kernel-Native eBPF
                    </span>
                  </th>

                  <th className="py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm font-extrabold text-[#0A2540] w-[15%]">
                    Datadog
                  </th>
                  <th className="py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm font-extrabold text-[#0A2540] w-[15%]">
                    New Relic
                  </th>
                  <th className="py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm font-extrabold text-[#0A2540] w-[16%]">
                    Dynatrace
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs sm:text-[13.5px]">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Feature Name */}
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#0A2540] align-top">
                      <div>{row.feature}</div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5 font-sans">
                        {row.note}
                      </div>
                    </td>

                    {/* BREXAL (Highlighted Cell) */}
                    <td className="py-4 px-4 sm:px-6 bg-[#F0F7FF]/50 border-x border-[#BFDBFE] font-bold text-[#1D4ED8] align-top">
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="leading-snug">{row.brexal}</span>
                      </div>
                    </td>

                    {/* Datadog */}
                    <td className="py-4 px-4 sm:px-6 text-[#425466] align-top leading-snug">
                      {row.datadog}
                    </td>

                    {/* New Relic */}
                    <td className="py-4 px-4 sm:px-6 text-[#425466] align-top leading-snug">
                      {row.newrelic}
                    </td>

                    {/* Dynatrace */}
                    <td className="py-4 px-4 sm:px-6 text-[#425466] align-top leading-snug">
                      {row.dynatrace}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── BOTTOM ENTERPRISE SAVINGS CALLOUT BANNER ── */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0A2540] via-[#0F3460] to-[#1E3A8A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  Average Annual Customer Savings: $184,000
                </h4>
                <p className="text-xs sm:text-[13px] text-blue-200/80 font-normal">
                  Based on a cluster of 250 microservices moving from Datadog host/custom-metric billing to BREXAL.
                </p>
              </div>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
            >
              <span>Calculate Your Cloud Savings</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

