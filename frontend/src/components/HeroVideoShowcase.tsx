"use client";

import React, { useRef, useState } from "react";
import { Play, Pause, Sparkles, Volume2, VolumeX, ShieldCheck, Cpu } from "lucide-react";

export function HeroVideoShowcase() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className="relative w-full rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/90 p-3 sm:p-4 shadow-[0_20px_50px_-12px_rgba(50,50,93,0.14),0_10px_20px_-8px_rgba(0,0,0,0.06)] group overflow-hidden select-none"
    >
      {/* ── CARD HEADER ── */}
      <div className="flex items-center justify-between px-3 py-2 mb-2 border-b border-slate-100 font-mono text-[11px] text-[#627D98]">
        <div className="flex items-center gap-2 font-semibold text-[#0A2540]">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
          <span>AUTONOMOUS CO-PILOT // CREATION TOUCH</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-[10px] font-bold">
            BREXAL AI
          </span>
        </div>
      </div>

      {/* ── VIDEO CONTAINER ── */}
      <div 
        className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-inner"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src="/videos/creation-touch.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        />

        {/* Ambient top vignette */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
          <span>HUMAN + AI SYNERGY</span>
        </div>

        {/* Floating Sound Toggle */}
        <button
          onClick={toggleMute}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>

        {/* Center Play/Pause Overlay Indicator on Hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg">
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
          </div>
        </div>

        {/* Bottom Floating Telemetry Annotations */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-[9.5px] font-mono text-slate-200">
            <Cpu size={11} className="text-[#00D4FF]" />
            <span>Autonomous Intelligence</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-[9.5px] font-mono text-slate-200">
            <ShieldCheck size={11} className="text-[#36D399]" />
            <span>SRE Control Verified</span>
          </div>
        </div>
      </div>

      {/* ── CARD FOOTER ── */}
      <div className="px-3 pt-3 flex items-center justify-between text-[11px] font-mono text-[#627D98]">
        <span className="flex items-center gap-1.5 text-[#0A2540] font-medium">
          <Sparkles size={12} className="text-[#635BFF]" />
          Intelligence, engineered to move
        </span>
        <span className="text-[#059669] font-semibold">
          Live 60 FPS Video Stream
        </span>
      </div>
    </div>
  );
}
