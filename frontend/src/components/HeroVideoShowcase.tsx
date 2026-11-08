"use client";

import React from "react";

export function HeroVideoShowcase() {
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden pointer-events-none select-none">
      
      {/* 
        Enlarged Seamless Video Animation (Filling the space beside the text):
        1. Pure & borderless (No frames, no cards, no borders, no audio).
        2. Increased Size: Fills the hero space grandly with max-h-[620px] and scale expansion.
        3. Color Matching: filter brightness & contrast transforms the studio grey background to pure #ffffff.
        4. Blending: mix-blend-multiply ensures the light background dissolves seamlessly into the white page.
        5. Blurry Feathered Edges: radial-gradient mask + directional gradient vignettes blur out all 4 outer edges.
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
          className="w-full h-auto max-h-[560px] lg:max-h-[640px] object-contain mix-blend-multiply"
          style={{
            filter: "brightness(1.23) contrast(1.19) saturate(1.05)",
          }}
        />

        {/* Soft feathered edge diffusion vignettes to eliminate any rectangular borders */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
      </div>

    </div>
  );
}
