"use client";

import React, { useState } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Layers,
  Lock,
  Maximize2,
  Minimize2,
  Radio,
  Search,
  Shield,
  Sparkles,
  Wifi,
  Zap,
} from "lucide-react";

export function StripeProductShowcase() {
  const [mobileAck, setMobileAck] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Exact 34-bar vertical histogram profile matching Image 4
  const tokenHistogram = [
    12, 18, 22, 28, 32, 25, 42, 58, 62, 45, 
    38, 50, 72, 85, 96, 68, 74, 52, 60, 48, 
    35, 40, 55, 65, 78, 88, 92, 70, 60, 52, 
    64, 76, 58, 48
  ];

  return (
    <section id="modular-showcase" className="py-20 md:py-32 px-6 sm:px-10 bg-white border-b border-slate-200/80">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] font-mono text-[11px] font-bold tracking-wider uppercase mb-4">
            Unified Product Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-[#0A2540] leading-[1.1] font-display mb-4">
            A modular suite of observability and telemetry products.
          </h2>
          <p className="text-base sm:text-lg text-[#425466] font-normal leading-relaxed">
            From distributed edge telemetry and incident terminals to automated usage meters and SLA monitoring, BREXAL connects your entire operational lifecycle.
          </p>
        </div>

        {/* 2 Flagship Showcase Modules matching the user's reference screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ════════════ MODULE 1: GLOBAL TELEMETRY & TERMINAL (LEFT) ════════════ */}
          <div className="rounded-3xl bg-[#F6F9FC] border border-slate-200/80 p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all group">
            
            {/* Header: Title + Purple Expand Button */}
            <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2540] font-display max-w-md leading-snug">
                Accept and optimise payments globally – online and in person
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
              
              {/* Vibrant Ambient Gradient Backdrop matching screenshot (#FFAA2C -> #FF5B84 -> #635BFF) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFAA2C]/45 via-[#FF5B84]/40 to-[#635BFF]/45 filter blur-3xl opacity-85 pointer-events-none transform scale-110" />

              {/* Overlapping Realistic Product UIs: Handheld Device on Left, Browser Window on Right */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                
                {/* 1. Realistic Handheld Mobile/POS Terminal (Left side, standing on white dock) */}
                <div className="absolute left-1 sm:left-4 -bottom-4 w-[210px] sm:w-[230px] z-20">
                  {/* Outer Device Chassis */}
                  <div className="rounded-[32px] bg-white border-[4px] border-[#0A0A0A] p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]">
                    
                    {/* Device Top Speaker */}
                    <div className="w-12 h-1 rounded-full bg-slate-300 mx-auto mb-2" />

                    {/* Terminal Display Content */}
                    <div className="bg-white rounded-[22px] p-3 text-center border border-slate-100 flex flex-col items-center">
                      
                      {/* Contactless Wave Icon */}
                      <div className="my-1 text-[#0A2540]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8.5 16.5a5 5 0 0 1 0-7" />
                          <path d="M5 19a9 9 0 0 1 0-14" />
                          <path d="M12 14a2 2 0 0 1 0-3" />
                        </svg>
                      </div>

                      <span className="text-[10px] font-sans text-slate-500 mt-1">Showflix に支払う</span>
                      <div className="text-xl font-bold font-sans text-[#0A2540] my-0.5">JP¥5,000</div>
                      <span className="text-[8.5px] text-slate-400 leading-tight">
                        タップ、挿入、またはスワイプして支払う
                      </span>

                      {/* Small Order Summary */}
                      <div className="w-full mt-3 pt-2 border-t border-slate-100 text-[9px] font-sans text-slate-600 space-y-1 text-left">
                        <div className="flex justify-between">
                          <span>ギフトカード</span>
                          <span>JP¥5,000</span>
                        </div>
                        <div className="flex justify-between font-bold text-[#0A2540] pt-0.5">
                          <span>合計</span>
                          <span>JP¥5,000</span>
                        </div>
                      </div>

                      {/* Purple Action Button */}
                      <button
                        onClick={() => setMobileAck(!mobileAck)}
                        className={`w-full mt-3 py-2 rounded-xl text-[11px] font-bold font-sans transition-all ${
                          mobileAck
                            ? "bg-[#059669] text-white shadow-xs"
                            : "bg-[#635BFF] text-white hover:bg-[#5349e0] shadow-sm"
                        }`}
                      >
                        {mobileAck ? "✓ 承認済み" : "続行"}
                      </button>
                    </div>

                  </div>

                  {/* White Dock Stand with Soft Ambient Drop Shadow */}
                  <div className="w-[170px] h-4 bg-white/90 border border-slate-200 rounded-b-2xl mx-auto shadow-md" />
                </div>

                {/* 2. Realistic Browser Checkout Window (Right side) */}
                <div className="absolute right-0 sm:right-2 top-3 sm:top-5 w-[330px] sm:w-[420px] rounded-2xl bg-white border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] z-10 overflow-hidden text-left font-sans">
                  
                  {/* Browser Chrome Bar with macOS Traffic Lights & Lock */}
                  <div className="px-4 py-2.5 bg-[#FAFBFC] border-b border-slate-200/70 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] text-slate-500 font-mono">
                      <Lock size={10} className="text-slate-400" />
                      <span>showflixapp.com/checkout</span>
                    </div>
                    <div className="w-4" />
                  </div>

                  {/* Browser Content */}
                  <div className="p-4 sm:p-5 space-y-4">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold tracking-wider text-[#0A2540]">SHOWFLIX</span>
                      <span className="text-[10px] font-mono text-slate-400">brexal-telemetry: secure</span>
                    </div>

                    {/* Email Form */}
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-1">メールアドレス</label>
                      <input 
                        type="text" 
                        readOnly 
                        value="taro.yamada@example.com" 
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-[#0A2540] bg-slate-50/50"
                      />
                    </div>

                    {/* Quick Pay: Link & Apple Pay */}
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-1.5 rounded-lg bg-[#00D924] text-white text-[11px] font-bold flex items-center justify-center gap-1">
                        <span>● link</span>
                      </button>
                      <button className="py-1.5 rounded-lg bg-black text-white text-[11px] font-semibold flex items-center justify-center gap-1">
                        <span>Pay</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 my-1 text-[10px] text-slate-400">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span>または</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Payment Radio Methods */}
                    <div className="space-y-1.5 text-xs text-[#0A2540]">
                      <div className="p-2.5 rounded-xl border border-[#635BFF]/50 bg-[#F6F9FC]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2 font-semibold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-[#635BFF]" />
                            カード (Credit Card)
                          </span>
                          <span className="text-[10px] text-slate-400">Visa, MC, Amex</span>
                        </div>
                        <input 
                          type="text" 
                          readOnly 
                          value="•••• •••• •••• 4242" 
                          className="w-full px-2 py-1 rounded border border-slate-200 text-[11px] font-mono bg-white text-slate-700 mb-1"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" readOnly value="12 / 28" className="px-2 py-1 rounded border border-slate-200 text-[10px] font-mono bg-white text-slate-700" />
                          <input type="text" readOnly value="CVC •••" className="px-2 py-1 rounded border border-slate-200 text-[10px] font-mono bg-white text-slate-700" />
                        </div>
                      </div>

                      <div className="p-2 rounded-lg border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full border border-slate-300" />
                          PayPay
                        </span>
                        <span className="text-[10px] text-slate-400">QRコード決済</span>
                      </div>
                    </div>

                    {/* Right Summary Callout: Showflix streaming plan */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-bold text-xs">
                          S
                        </div>
                        <div>
                          <div className="text-[10.5px] font-bold text-[#0A2540]">ストリーミング月額サブスクリプション</div>
                          <span className="text-[9px] text-slate-400">JP¥1,886 / 月</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#0A2540]">JP¥2,074</span>
                    </div>

                    {/* Purple Submit Button */}
                    <button className="w-full py-2.5 rounded-xl bg-[#635BFF] text-white text-[12px] font-bold hover:bg-[#5349e0] transition-colors shadow-xs">
                      続行 (Complete telemetry check)
                    </button>

                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* ════════════ MODULE 2: USAGE METERS & 30-DAY HISTOGRAM (RIGHT) ════════════ */}
          <div className="rounded-3xl bg-[#F6F9FC] border border-slate-200/80 p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all group">
            
            {/* Header: Title + Purple Expand Button */}
            <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2540] font-display max-w-md leading-snug">
                Enable any billing model
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
              
              {/* Vibrant Ambient Gradient Backdrop matching screenshot */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#635BFF]/35 via-[#9B7BFF]/30 to-[#FF5B84]/30 filter blur-3xl opacity-85 pointer-events-none transform scale-110" />

              {/* Floating Card 1: Pro Plan & Usage Meter (Matching screenshot exactly) */}
              <div className="relative z-10 rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(50,50,93,0.08),0_4px_12px_rgba(0,0,0,0.04)] text-left hover:border-slate-300 transition-all font-sans">
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center font-bold">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0A2540]">Pro Plan</h4>
                    <span className="text-[11.5px] text-[#627D98]">Billed monthly</span>
                  </div>
                </div>

                <div className="space-y-0.5 mb-3.5">
                  <span className="text-[11px] font-sans text-[#627D98] uppercase font-semibold">Tokens</span>
                  <div className="text-lg font-mono font-bold text-[#0A2540]">₹0.95 per 1,000 units</div>
                </div>

                {/* Usage meter with beautiful Stripe gradient bar */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#627D98] mb-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 21h5v-5" />
                    </svg>
                    <span>Usage meter</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#635BFF] via-[#FF5B84] to-[#FFAA2C]"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>

              </div>

              {/* Floating Card 2: 30-Day Vertical Histogram Bar Chart (Matching screenshot exactly) */}
              <div className="relative z-10 rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_10px_30px_rgba(50,50,93,0.08),0_4px_12px_rgba(0,0,0,0.04)] text-left hover:border-slate-300 transition-all font-sans">
                
                <div className="mb-2">
                  <span className="text-[11px] text-[#627D98] font-semibold block">
                    Tokens used in the last 30 days
                  </span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0A2540] tracking-tight mt-0.5">
                    1,985,256,834
                  </div>
                </div>

                {/* 34 vertical bars matching the Stripe screenshot */}
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
                          Day {idx + 1}: {(val * 62.4).toFixed(0)}M
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
