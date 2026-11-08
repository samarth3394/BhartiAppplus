"use client";

import React from "react";

export function HeroVideoShowcase() {
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* 
        Pure, seamless, borderless video animation.
        - Muted, looping, auto-playing without audio or player controls.
        - mix-blend-multiply blends the light background seamlessly into the page.
      */}
      <video
        src="/videos/creation-touch.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto max-h-[500px] object-contain mix-blend-multiply"
      />
    </div>
  );
}
