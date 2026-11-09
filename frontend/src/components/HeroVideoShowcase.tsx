"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck, Sparkles, Terminal, Cpu } from "lucide-react";

export function HeroVideoShowcase() {
  const [liveLatency, setLiveLatency] = useState("0.84ms");
  const [nodesHealthy, setNodesHealthy] = useState("1,420 / 1,420");

  useEffect(() => {
    const interval = setInterval(() => {
      const lat = (0.81 + Math.random() * 0.06).toFixed(2);
      setLiveLatency(`${lat}ms`);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center overflow-visible select-none py-4">
      
      {/* 
        Enlarged Seamless Video Animation (Human & Robotic Hand Touching):
        1. Pure white color matching with feathered boundaries.
        2. Seamless blending into the canvas.
      */}
      <div 
        className="relative w-full flex items-center justify-center scale-100 md:scale-105 lg:scale-110 transform-gpu"
        style={{
          maskImage: "radial-gradient(ellipse 90% 82% at center, black 50%, rgba(0,0,0,0.6) 78%, transparent 98%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 82% at center, black 50%, rgba(0,0,0,0.6) 78%, transparent 98%)",
        }}
      >
        <video
          key="creation-touch-enlarged"
          src="/videos/creation-touch.mp4?v=5"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto max-h-[560px] lg:max-h-[640px] object-contain mix-blend-multiply pointer-events-none"
          style={{
            filter: "brightness(1.23) contrast(1.19) saturate(1.05)",
          }}
        />

        {/* Soft feathered edge diffusion vignettes to eliminate rectangular edges */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
      </div>

      {/* ─── Senior Web Designer Floating Telemetry Badges ─── */}
      
      {/* Top Floating Telemetry Capsule */}
      <div className="absolute top-4 sm:top-8 right-2 sm:right-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-3 transition-transform hover:-translate-y-0.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-xs">
          <Activity size={16} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Live Telemetry Ingress</span>
          </div>
          <div className="text-[13px] font-bold text-[#0F172A] font-mono flex items-center gap-1.5">
            <span>p99 Latency:</span>
            <span className="text-[#635BFF]">{liveLatency}</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating AI Root-Cause Diagnostic Pill */}
      <div className="absolute bottom-4 sm:bottom-8 left-2 sm:left-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.06),0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-3 transition-transform hover:-translate-y-0.5">
        <div className="w-8 h-8 rounded-xl bg-[#635BFF]/10 border border-[#635BFF]/20 flex items-center justify-center text-[#635BFF] shadow-xs">
          <Sparkles size={16} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#635BFF]">BREXAL AI Copilot</span>
          </div>
          <div className="text-[12.5px] font-bold text-[#0F172A] flex items-center gap-1.5">
            <span>Autonomous Health:</span>
            <span className="text-emerald-600 font-mono font-semibold">100% Nominal</span>
          </div>
        </div>
      </div>

      {/* Center-Right Secondary Floating Microchip Pill */}
      <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-full px-3.5 py-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.05)] items-center gap-2 font-mono text-[11px] text-slate-700">
        <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
        <span className="font-semibold text-slate-900">eBPF Sensor:</span>
        <span className="text-slate-500 font-bold">Zero Kernel Drops</span>
      </div>

    </div>
  );
}
