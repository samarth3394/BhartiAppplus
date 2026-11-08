"use client";

import React from "react";

export function HeroVideoShowcase() {
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden pointer-events-none select-none">
      
      {/* 
        Seamless Video Animation Integration:
        1. Color Matching: filter brightness & contrast transforms the video's studio grey background to pure #ffffff.
        2. Blending: mix-blend-multiply ensures any remaining background completely dissolves into the white page.
        3. Blurry Feathered Edges: radial-gradient mask + directional gradient vignettes blur out all 4 outer edges.
      */}
      <div 
        className="relative w-full flex items-center justify-center"
        style={{
          maskImage: "radial-gradient(ellipse 88% 78% at center, black 45%, rgba(0,0,0,0.6) 72%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse 88% 78% at center, black 45%, rgba(0,0,0,0.6) 72%, transparent 95%)",
        }}
      >
        <video
          src="/videos/creation-touch.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto max-h-[520px] object-contain mix-blend-multiply"
          style={{
            filter: "brightness(1.22) contrast(1.18) saturate(1.05)",
          }}
        />

        {/* Soft feathered edge diffusion vignettes to eliminate any rectangular borders */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
      </div>

    </div>
  );
}
