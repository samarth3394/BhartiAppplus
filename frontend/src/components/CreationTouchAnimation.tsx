"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Cpu, Activity, ShieldCheck } from "lucide-react";

export function CreationTouchAnimation() {
  const [ripples, setRipples] = useState<Array<{ id: number; scale: number }>>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Trigger interactive ripple wave from the touch contact point (51.5%, 41.8%)
  const handleTouchClick = () => {
    const newRipple = { id: Date.now(), scale: 1 };
    setRipples((prev) => [...prev.slice(-3), newRipple]);
  };

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden bg-[#F8FAFC] border border-slate-200/80 shadow-[0_20px_50px_-15px_rgba(50,50,93,0.09),0_10px_20px_-8px_rgba(0,0,0,0.04)] group select-none cursor-pointer"
      onClick={handleTouchClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* ── 1. BASE PHOTOREALISTIC CREATION IMAGE (Exact Reference) ── */}
      <div className="relative w-full aspect-[3/2] max-h-[460px] overflow-hidden flex items-center justify-center">
        <motion.div
          className="w-full h-full relative"
          animate={{
            scale: isHovered ? 1.02 : 1,
            y: isHovered ? -3 : 0,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Visual Image */}
          <img
            src="/images/robot-human-touch.jpg"
            alt="Human hand and robot hand touching index fingers with glowing holographic interface"
            className="w-full h-full object-cover object-center"
          />

          {/* Gentle vignette to blend naturally into light theme canvas */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* ── 2. DYNAMIC ANIMATED HOLOGRAPHIC RIPPLE OVERLAY AT CONTACT POINT ── */}
        {/* Exact touchpoint center: left 51.5%, top 41.8% */}
        <div 
          className="absolute z-20 pointer-events-none"
          style={{ left: "51.5%", top: "41.8%", transform: "translate(-50%, -50%)" }}
        >
          
          {/* Continuous Radiant Holographic Waves (Matching the concentric rings in the image) */}
          <motion.div
            className="absolute rounded-full border border-[#00D4FF]/60"
            style={{ width: "90px", height: "90px", left: "-45px", top: "-45px" }}
            animate={{
              scale: [1, 2.2, 3.4],
              opacity: [0.8, 0.4, 0],
              borderWidth: ["2px", "1.5px", "0.5px"],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              ease: "easeOut",
            }}
          />

          <motion.div
            className="absolute rounded-full border border-white/80"
            style={{ width: "90px", height: "90px", left: "-45px", top: "-45px" }}
            animate={{
              scale: [1, 2.0, 3.0],
              opacity: [0.9, 0.3, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              delay: 1.1,
              ease: "easeOut",
            }}
          />

          <motion.div
            className="absolute rounded-full border border-[#635BFF]/50"
            style={{ width: "90px", height: "90px", left: "-45px", top: "-45px" }}
            animate={{
              scale: [1, 1.8, 2.6],
              opacity: [0.7, 0.2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              delay: 2.1,
              ease: "easeOut",
            }}
          />

          {/* Central Luminous Holographic Disc Core */}
          <motion.div
            className="w-14 h-14 rounded-full bg-radial from-[#D8F5FF] via-[#6FE3FF]/80 to-[#00B4D8]/30 blur-[2px] shadow-[0_0_24px_rgba(0,212,255,0.7)]"
            style={{ transform: "translate(-50%, -50%)" }}
            animate={{
              scale: isHovered ? [1.1, 1.35, 1.15] : [1, 1.2, 1],
              opacity: isHovered ? [0.85, 1, 0.85] : [0.7, 0.95, 0.7],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut",
            }}
          />

          {/* Central Bright Star Point */}
          <div 
            className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#FFFFFF] absolute"
            style={{ left: "-5px", top: "-5px" }}
          />

          {/* Click Ripple Bursts */}
          {ripples.map((rip) => (
            <motion.div
              key={rip.id}
              className="absolute rounded-full border-2 border-[#00D4FF]"
              style={{ width: "80px", height: "80px", left: "-40px", top: "-40px" }}
              initial={{ scale: 0.6, opacity: 1 }}
              animate={{ scale: 3.8, opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          ))}

        </div>

        {/* ── 3. FLOATING TECHNICAL ANNOTATION BADGES ── */}
        {/* Robot Side Badge (Lower-Left) */}
        <motion.div 
          className="absolute left-4 bottom-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm font-mono text-[11px] text-[#0A2540]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-5 h-5 rounded-lg bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
            <Cpu size={12} />
          </div>
          <div>
            <span className="block text-[9px] text-[#627D98] uppercase font-semibold">BREXAL AI COPILOT</span>
            <span className="font-bold text-[#0A2540]">Autonomous Remediation</span>
          </div>
        </motion.div>

        {/* Human Side Badge (Lower-Right) */}
        <motion.div 
          className="absolute right-4 bottom-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm font-mono text-[11px] text-[#0A2540]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-5 h-5 rounded-lg bg-[#059669]/10 text-[#059669] flex items-center justify-center">
            <ShieldCheck size={12} />
          </div>
          <div>
            <span className="block text-[9px] text-[#627D98] uppercase font-semibold">SRE / DEVOPS TEAM</span>
            <span className="font-bold text-[#0A2540]">Human Operational Control</span>
          </div>
        </motion.div>

        {/* Top Status Ticker */}
        <div className="absolute top-3 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/70 font-mono text-[10px] text-[#0A2540] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          <span className="font-semibold">HUMAN + AI TOUCHPOINT</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#635BFF] font-bold">INTELLIGENCE, ENGINEERED TO MOVE</span>
        </div>

      </div>

      {/* ── 4. SUBTLE FOOTER BAR INSIDE THE CARD ── */}
      <div className="px-5 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-[#627D98]">
        <span className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#00D4FF]" />
          Click or hover to pulse holographic neural interface
        </span>
        <span className="text-[#059669] font-semibold hidden md:inline">
          99.99% Observability Mesh Synchronized
        </span>
      </div>

    </div>
  );
}
