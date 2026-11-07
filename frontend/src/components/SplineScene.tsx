"use client";

import React, { useEffect, useRef, useState } from "react";
import { Application } from "@splinetool/runtime";
import { Zap, RotateCw } from "lucide-react";

interface SplineSceneProps {
  sceneUrl?: string;
  className?: string;
}

export function SplineScene({
  sceneUrl = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
  className = "",
}: SplineSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const splineAppRef = useRef<Application | null>(null);

  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const app = new Application(canvas);
    splineAppRef.current = app;

    app
      .load(sceneUrl)
      .then(() => {
        if (!isMounted) return;
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Spline 3D Scene fallback:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    // Scroll-driven camera rotation
    const handleScroll = () => {
      if (!containerRef.current || !splineAppRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress while element is in view (-1 to 1)
      const visibleProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const clamped = Math.max(0, Math.min(1, visibleProgress));

      // Rotate camera or scene based on scroll
      try {
        const camera = splineAppRef.current.findObjectByName("Camera");
        if (camera) {
          camera.rotation.y = (clamped - 0.5) * Math.PI * 0.5;
          camera.rotation.x = -0.2 + (clamped - 0.5) * 0.3;
        }
      } catch {
        // Ignore if camera object name varies
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
      try {
        app.dispose();
      } catch {
        // Ignore dispose cleanup error if any
      }
    };
  }, [sceneUrl]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden bg-black/60 border border-white/[0.08] flex items-center justify-center ${className}`}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#090b0e] z-10">
          <div className="w-12 h-12 rounded-full border border-white/20 border-t-white animate-spin flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xs font-mono text-zinc-400 tracking-wider uppercase">
            Loading Interactive 3D Device...
          </span>
        </div>
      )}

      {/* Offline/Error Fallback Hologram */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#090b0e] z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
            <Zap size={24} className="text-white" />
          </div>
          <h4 className="text-white font-medium text-base mb-1">
            Autonomous 3D Telemetry Node
          </h4>
          <p className="text-xs text-zinc-400 max-w-xs font-normal">
            Real-time interactive hardware node synchronized with low-latency edge probes.
          </p>
          <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Hardware Node Active
          </div>
        </div>
      )}

      {/* Control Overlay Hint */}
      {!loading && !error && (
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] font-mono text-zinc-400 backdrop-blur-md pointer-events-none flex items-center gap-1.5">
          <RotateCw size={11} className="text-zinc-500" />
          <span>Interactive 3D • Drag to rotate & scroll to zoom</span>
        </div>
      )}
    </div>
  );
}
