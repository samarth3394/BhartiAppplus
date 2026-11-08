"use client";

import React, { useEffect, useRef } from "react";

export function StripeGradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 750);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 750;
    };

    window.addEventListener("resize", handleResize);

    // Floating color emitters
    let time = 0;

    const render = () => {
      time += 0.006;
      ctx.clearRect(0, 0, width, height);

      // Create diagonal base transform
      ctx.save();

      // Draw 4 distinct organic floating gradient waves (Cyan, Indigo, Coral, Amber)
      
      // 1. Cyan/Sky Wave (Upper right)
      const x1 = width * 0.75 + Math.sin(time * 0.8) * (width * 0.1);
      const y1 = height * 0.25 + Math.cos(time * 0.6) * (height * 0.12);
      const grad1 = ctx.createRadialGradient(x1, y1, 10, x1, y1, width * 0.55);
      grad1.addColorStop(0, "rgba(0, 212, 255, 0.65)");
      grad1.addColorStop(0.5, "rgba(99, 91, 255, 0.45)");
      grad1.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // 2. Stripe Purple / Indigo Wave (Center diagonal ribbon)
      const x2 = width * 0.6 + Math.cos(time * 0.7) * (width * 0.08);
      const y2 = height * 0.45 + Math.sin(time * 0.9) * (height * 0.14);
      const grad2 = ctx.createRadialGradient(x2, y2, 20, x2, y2, width * 0.6);
      grad2.addColorStop(0, "rgba(122, 115, 255, 0.7)");
      grad2.addColorStop(0.45, "rgba(255, 91, 132, 0.5)");
      grad2.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 3. Vibrant Coral / Rose Wave (Mid-right sweep)
      const x3 = width * 0.85 + Math.sin(time * 0.9 + 1) * (width * 0.09);
      const y3 = height * 0.5 + Math.cos(time * 0.75 + 1) * (height * 0.15);
      const grad3 = ctx.createRadialGradient(x3, y3, 15, x3, y3, width * 0.5);
      grad3.addColorStop(0, "rgba(255, 107, 139, 0.75)");
      grad3.addColorStop(0.5, "rgba(255, 159, 67, 0.55)");
      grad3.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // 4. Sunset Amber / Warm Golden Wave (Lower-right diagonal flow)
      const x4 = width * 0.95 + Math.cos(time * 0.85 + 2) * (width * 0.07);
      const y4 = height * 0.7 + Math.sin(time * 0.65 + 2) * (height * 0.12);
      const grad4 = ctx.createRadialGradient(x4, y4, 10, x4, y4, width * 0.45);
      grad4.addColorStop(0, "rgba(255, 180, 50, 0.7)");
      grad4.addColorStop(0.55, "rgba(255, 91, 132, 0.35)");
      grad4.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad4;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Skewed Canvas Container that replicates Stripe's iconic diagonal flow */}
      <div 
        className="absolute -top-[20%] -right-[15%] w-[130%] h-[140%] transform -rotate-12 origin-top-right filter blur-[60px] md:blur-[85px] opacity-80"
        style={{ willChange: "transform" }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Additional animated CSS floating orbs for extra organic depth */}
      <div className="absolute top-[10%] right-[5%] w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#00D4FF]/40 to-[#635BFF]/30 blur-[75px] animate-pulse pointer-events-none" style={{ animationDuration: "6s" }} />
      <div className="absolute top-[30%] right-[0%] w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-[#FF5B84]/45 via-[#FF9F43]/35 to-transparent blur-[85px] pointer-events-none" />

      {/* Soft White Protective Vignettes (Keeps text on left & navbar on top pristine) */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 lg:w-1/2 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
    </div>
  );
}
