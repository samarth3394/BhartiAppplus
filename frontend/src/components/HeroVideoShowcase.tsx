"use client";

import React from "react";

export function HeroVideoShowcase() {
  return (
    <div className="relative w-full h-full max-w-[1600px] mx-auto flex items-center justify-center overflow-hidden pointer-events-none select-none">
      
      {/* 
        Panoramic Seamless Video Animation:
        - Scaled up so the Human Hand emerges naturally from behind the left-side text.
        - Touchpoint and electric sparks occur at center/middle-right.
        - Robot hand reaches in from the right.
        - Background is pure #ffffff via brightness/contrast + mix-blend-multiply.
        - Soft radial and edge vignettes eliminate all rectangular boundaries.
      */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{
          maskImage: "radial-gradient(ellipse 90% 80% at center, black 45%, rgba(0,0,0,0.6) 75%, transparent 98%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at center, black 45%, rgba(0,0,0,0.6) 75%, transparent 98%)",
        }}
      >
        <video
          key="creation-touch-panoramic"
          src="/videos/creation-touch.mp4?v=3"
          autoPlay
          loop
          muted
          playsInline
          className="w-full min-w-[1000px] md:min-w-[1300px] lg:min-w-[1500px] h-auto max-h-[640px] md:max-h-[720px] object-contain mix-blend-multiply opacity-95 transition-all"
          style={{
            filter: "brightness(1.23) contrast(1.19) saturate(1.05)",
          }}
        />

        {/* Soft feathered edge diffusion vignettes to eliminate any borders */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/70 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/70 to-transparent pointer-events-none" />
      </div>

    </div>
  );
}
