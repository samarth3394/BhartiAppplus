"use client";

import React from "react";

export function HeroVideoShowcase() {
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden pointer-events-none select-none">
      
      {/* 
        Seamless Video Animation Integration:
        1. Color Matching: filter brightness & contrast transforms the studio grey background to pure #ffffff.
        2. Blending: mix-blend-multiply ensures the light background dissolves seamlessly into the white page.
        3. Blurry Feathered Edges: 24px soft directional gradients and an elliptical feather mask eliminate any box edge.
      */}
      <div 
        className="relative w-full flex items-center justify-center"
        style={{
          maskImage: "radial-gradient(ellipse 84% 74% at center, black 40%, rgba(0,0,0,0.5) 68%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(ellipse 84% 74% at center, black 40%, rgba(0,0,0,0.5) 68%, transparent 92%)",
        }}
      >
        <video
          key="creation-touch-v2"
          src="/videos/creation-touch.mp4?v=2"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto max-h-[520px] object-contain mix-blend-multiply"
          style={{
            filter: "brightness(1.23) contrast(1.19) saturate(1.05)",
          }}
        />

        {/* Soft feathered edge diffusion vignettes to eliminate any rectangular borders */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
      </div>

    </div>
  );
}
