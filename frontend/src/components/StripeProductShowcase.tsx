"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertOctagon,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  GitCommit,
  Layers,
  Lock,
  Maximize2,
  Radio,
  Search,
  Server,
  Shield,
  Sparkles,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";

export function StripeProductShowcase() {
  const [mobileAck, setMobileAck] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Exact 34-bar vertical histogram profile matching Stripe layout, representing daily telemetry ingestion in millions
  const tokenHistogram = [
    12, 18, 22, 28, 32, 25, 42, 58, 62, 45, 
    38, 50, 72, 85, 96, 68, 74, 52, 60, 48, 
    35, 40, 55, 65, 78, 88, 92, 70, 60, 52, 
    64, 76, 58, 48
  ];

  return (
    <section id="modular-showcase" className="py-20 md:py-32 px-6 sm:px-10 bg-white border-b border-slate-200/80">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] font-mono text-[11px] font-bold tracking-wider uppercase mb-4">
            Unified Observability Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-[#0A2540] leading-[1.1] font-display mb-4">
            A modular platform engineered for modern infrastructure.
          </h2>
          <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed">
            From mobile on-call incident paging and millisecond distributed tracing to automated capacity meters and AI root-cause remediation, BREXAL protects every layer of your stack.
          </p>
        </div>

        {/* 2 Flagship Showcase Modules matching the Stripe design layout tailored 100% for BREXAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ════════════ MODULE 1: ON-CALL MOBILE PAGING + BROWSER TRACING (LEFT) ════════════ */}
          <div className="rounded-3xl bg-[#F6F9FC] border border-slate-200/80 p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all group">
            
            {/* Header: Title + Purple Expand Button */}
            <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2540] font-display max-w-md leading-snug">
                Detect and resolve incidents anywhere – on-call and in browser
              </h3>
              <button 
                className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center hover:bg-[#5349e0] transition-colors shadow-xs shrink-0"
                title="Expand module view"
                aria-label="Expand"
              >
                <Maximize2 size={15} />
              </button>
            </div>

            {/* Visual Stage with Ambient Warm Gradient Backdrop */}
            <div className="relative w-full h-[520px] sm:h-[560px] flex items-center justify-center overflow-hidden rounded-2xl">
              
              {/* Vibrant Ambient Gradient Backdrop matching Stripe layout (#FFAA2C -> #FF5B84 -> #635BFF) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFAA2C]/45 via-[#FF5B84]/40 to-[#635BFF]/45 filter blur-3xl opacity-85 pointer-events-none transform scale-110" />

              {/* Overlapping Realistic Product UIs: Handheld Mobile Device on Left, Trace Browser on Right */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                
                {/* 1. Realistic Handheld Mobile On-Call Terminal (Standing on white dock) */}
                <div className="absolute left-1 sm:left-4 -bottom-4 w-[210px] sm:w-[230px] z-20">
                  {/* Outer Device Chassis */}
                  <div className="rounded-[32px] bg-white border-[4px] border-[#0A0A0A] p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]">
                    
                    {/* Device Speaker */}
                    <div className="w-12 h-1 rounded-full bg-slate-300 mx-auto mb-2" />

                    {/* Terminal Display Content */}
                    <div className="bg-white rounded-[22px] p-3 text-center border border-slate-100 flex flex-col items-center font-sans">
                      
                      {/* Pulse Icon */}
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center my-1">
                        <AlertOctagon size={18} className="animate-pulse" />
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase font-semibold">BREXAL SRE PAGER</span>
                      <div className="text-base font-bold text-[#0A2540] my-0.5">P0 Critical Incident</div>
                      <span className="text-[9px] text-red-600 font-semibold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                        payment-worker-pool
                      </span>

                      {/* Incident Metrics Summary */}
                      <div className="w-full mt-3 pt-2 border-t border-slate-100 text-[9.5px] font-mono text-slate-600 space-y-1.5 text-left">
                        <div className="flex justify-between">
                          <span>P99 Spike</span>
                          <span className="font-bold text-red-600">142ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Error Rate</span>
                          <span className="font-bold text-red-600">1.18%</span>
                        </div>
                        <div className="flex justify-between text-[#0A2540] font-semibold pt-0.5 border-t border-slate-100">
                          <span>Affected RPS</span>
                          <span>1,820 req/s</span>
                        </div>
                      </div>

                      {/* Interactive Mitigation Button */}
                      <button
                        onClick={() => setMobileAck(!mobileAck)}
                        className={`w-full mt-3 py-2 rounded-xl text-[11px] font-bold font-sans transition-all flex items-center justify-center gap-1.5 ${
                          mobileAck
                            ? "bg-[#059669] text-white shadow-xs"
                            : "bg-[#635BFF] text-white hover:bg-[#5349e0] shadow-sm"
                        }`}
                      >
                        {mobileAck ? (
                          <>
                            <Check size={12} /> Mitigated
                          </>
                        ) : (
                          "Acknowledge & Fix"
                        )}
                      </button>
                    </div>

                  </div>

                  {/* White Dock Stand with Soft Ambient Drop Shadow */}
                  <div className="w-[170px] h-4 bg-white/90 border border-slate-200 rounded-b-2xl mx-auto shadow-md" />
                </div>

                {/* 2. Realistic Browser Distributed Trace Console (Right side) */}
                <div className="absolute right-0 sm:right-2 top-3 sm:top-5 w-[330px] sm:w-[420px] rounded-2xl bg-white border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] z-10 overflow-hidden text-left font-sans">
                  
                  {/* Browser Chrome Bar with macOS Traffic Lights & URL */}
                  <div className="px-4 py-2.5 bg-[#FAFBFC] border-b border-slate-200/70 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] text-slate-500 font-mono">
                      <Lock size={10} className="text-slate-400" />
                      <span>brexal.io/traces/checkout-flow-8f2a</span>
                    </div>
                    <div className="w-4" />
                  </div>

                  {/* Browser Content: Live Trace Spans & AI Root Cause */}
                  <div className="p-4 sm:p-5 space-y-3.5">
                    
                    {/* Header: Service Trace ID */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-[#0A2540]">checkout-gateway-api</div>
                        <span className="text-[10px] font-mono text-slate-400">Trace ID: span_8f2a1b9c</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        DEGRADED (142ms)
                      </span>
                    </div>

                    {/* Cascading Spans Breakdown */}
                    <div className="space-y-1.5 font-mono text-[10.5px]">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                          <span className="text-[#0A2540] font-medium">api-edge-proxy</span>
                        </div>
                        <span className="text-slate-500">0.8ms</span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                          <span className="text-[#0A2540] font-medium">auth-service-v2</span>
                        </div>
                        <span className="text-slate-500">3.4ms</span>
                      </div>

                      {/* Problem Child Span (Amber Highlight) */}
                      <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-300 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-[#0A2540] font-bold">payment-worker-pool</span>
                        </div>
                        <span className="text-amber-700 font-bold">142ms (Root Cause)</span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                          <span className="text-[#0A2540] font-medium">postgres-primary-mesh</span>
                        </div>
                        <span className="text-slate-500">0.8ms</span>
                      </div>
                    </div>

                    {/* AI Copilot Diagnosis Callout */}
                    <div className="p-2.5 rounded-xl bg-[#635BFF]/5 border border-[#635BFF]/20 flex items-start gap-2.5">
                      <Sparkles size={14} className="text-[#635BFF] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10.5px] font-bold text-[#0A2540]">BREXAL AI Root Cause Copilot</div>
                        <p className="text-[9.5px] text-slate-600 leading-snug">
                          Connection pool saturation detected following commit <span className="font-mono font-semibold text-[#635BFF]">sha:8f2a1b9</span>. 42 worker threads waiting.
                        </p>
                      </div>
                    </div>

                    {/* Purple Submit Action Button */}
                    <button className="w-full py-2.5 rounded-xl bg-[#635BFF] text-white text-[11.5px] font-bold hover:bg-[#5349e0] transition-colors shadow-xs flex items-center justify-center gap-2">
                      <Zap size={13} /> Execute Autonomous Pool Expansion
                    </button>

                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* ════════════ MODULE 2: AUTONOMOUS CAPACITY & 30-DAY HISTOGRAM (RIGHT) ════════════ */}
          <div className="rounded-3xl bg-[#F6F9FC] border border-slate-200/80 p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all group">
            
            {/* Header: Title + Purple Expand Button */}
            <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2540] font-display max-w-md leading-snug">
                Autonomous capacity scaling and SLO reliability
              </h3>
              <button 
                className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center hover:bg-[#5349e0] transition-colors shadow-xs shrink-0"
                title="Expand module view"
                aria-label="Expand"
              >
                <Maximize2 size={15} />
              </button>
            </div>

            {/* Visual Stage with Ambient Purple Gradient Backdrop */}
            <div className="relative w-full h-[520px] sm:h-[560px] flex flex-col justify-center gap-5 overflow-hidden rounded-2xl p-4 sm:p-6">
              
              {/* Vibrant Ambient Gradient Backdrop matching Stripe layout */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#635BFF]/35 via-[#9B7BFF]/30 to-[#FF5B84]/30 filter blur-3xl opacity-85 pointer-events-none transform scale-110" />

              {/* Floating Card 1: Enterprise Telemetry Plan & Usage Meter */}
              <div className="relative z-10 rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(50,50,93,0.08),0_4px_12px_rgba(0,0,0,0.04)] text-left hover:border-slate-300 transition-all font-sans">
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center font-bold">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0A2540]">Enterprise Telemetry Tier</h4>
                    <span className="text-[11.5px] text-[#627D98]">99.99% Availability & SLO Guarantee</span>
                  </div>
                </div>

                <div className="space-y-0.5 mb-3.5">
                  <span className="text-[11px] font-sans text-[#627D98] uppercase font-semibold">Telemetry Ingestion Rate</span>
                  <div className="text-lg font-mono font-bold text-[#0A2540]">₹0.85 per 10,000 trace spans</div>
                </div>

                {/* Usage meter with beautiful Stripe gradient bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-sans text-[#627D98] mb-1.5">
                    <span className="flex items-center gap-1.5 text-[#0A2540] font-semibold">
                      <Activity size={12} className="text-[#635BFF]" />
                      Live Ingestion Bandwidth Meter
                    </span>
                    <span className="font-bold font-mono text-[#635BFF]">68% quota used</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#635BFF] via-[#FF5B84] to-[#FFAA2C]"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>

              </div>

              {/* Floating Card 2: 30-Day Vertical Histogram Bar Chart */}
              <div className="relative z-10 rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(50,50,93,0.08),0_4px_12px_rgba(0,0,0,0.04)] text-left hover:border-slate-300 transition-all font-sans">
                
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[11px] text-[#627D98] font-semibold block uppercase font-mono">
                      Telemetry events analyzed in last 30 days
                    </span>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0A2540] tracking-tight mt-0.5">
                      4,892,108,420
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#059669]/10 text-[#059669] text-xs font-mono font-bold">
                    +18.4% MoM
                  </span>
                </div>

                {/* 34 vertical bars matching the Stripe layout */}
                <div className="h-28 w-full flex items-end justify-between gap-1 pt-4">
                  {tokenHistogram.map((val, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="flex-1 bg-[#635BFF] hover:bg-[#5349e0] rounded-t-sm transition-all cursor-pointer relative group/bar"
                      style={{ height: `${val}%` }}
                    >
                      {hoveredBar === idx && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#0A2540] text-white text-[9px] font-mono whitespace-nowrap z-30 shadow-md">
                          Day {idx + 1}: {(val * 4.8).toFixed(1)}M events
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#627D98] pt-2 border-t border-slate-100 mt-2">
                  <span>Day 1 (12.4M)</span>
                  <span>Day 15 (85.2M)</span>
                  <span>Day 30 (Peak 96.0M)</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
