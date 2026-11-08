"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CreationTouchAnimation() {
  const [touchState, setTouchState] = useState<"approaching" | "touching" | "holding">("approaching");
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; vx: number; vy: number }>>([]);
  const [pulseCount, setPulseCount] = useState(0);

  // Spark burst generator when fingers touch
  const triggerSparkBurst = () => {
    const newSparks = Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 45 + 15;
      const colors = ["#635BFF", "#00D4FF", "#FFAA2C", "#FF5B84", "#FFFFFF"];
      return {
        id: Date.now() + i,
        x: 0,
        y: 0,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      };
    });
    setSparks(newSparks);
    setPulseCount((prev) => prev + 1);
  };

  // Continuous rhythmic touch & breathe cycle
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const cycle = () => {
      // 1. Move hands close together
      setTouchState("touching");
      triggerSparkBurst();

      // 2. Hold in touch connection
      timeout = setTimeout(() => {
        setTouchState("holding");

        // 3. Ease slightly back then re-approach
        timeout = setTimeout(() => {
          setTouchState("approaching");
          timeout = setTimeout(cycle, 2200);
        }, 3200);
      }, 700);
    };

    const initialDelay = setTimeout(cycle, 1200);
    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] flex items-center justify-center overflow-hidden select-none pointer-events-none">
      
      {/* Ambient background soft glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[380px] h-[380px] rounded-full bg-gradient-to-r from-[#635BFF]/10 via-[#00D4FF]/10 to-[#FFAA2C]/10 blur-3xl opacity-70" />
      </div>

      {/* SVG Canvas for High-Precision Michelangelo Creation Hands */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full max-w-[1100px] overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* ── HUMAN HAND GRADIENTS (Natural Skin Tones) ── */}
          <linearGradient id="humanSkin" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#DF9B78" />
            <stop offset="40%" stopColor="#EDAF8C" />
            <stop offset="70%" stopColor="#F5C4A8" />
            <stop offset="100%" stopColor="#FDE3D2" />
          </linearGradient>

          <linearGradient id="humanShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B87352" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8A4A2F" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="humanFingerHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5C4A8" />
            <stop offset="85%" stopColor="#FFF2EA" />
            <stop offset="100%" stopColor="#FFE0CE" />
          </linearGradient>

          {/* ── ROBOT HAND GRADIENTS (Cybernetic White, Chrome & Glow) ── */}
          <linearGradient id="robotPlates" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F1F5F9" />
            <stop offset="80%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="robotJoints" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id="robotGoldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>

          {/* ── ENERGY PULSE GLOW FILTERS ── */}
          <filter id="touchSparkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="14" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="circuitGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ════════════════════════════════════════════════════════════════
            1. HUMAN HAND (LEFT SIDE) - Extends towards (500, 250)
            ════════════════════════════════════════════════════════════════ */}
        <motion.g
          animate={{
            x: touchState === "touching" || touchState === "holding" ? 22 : 0,
            y: touchState === "touching" ? -2 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 18,
            mass: 1.1,
          }}
        >
          {/* Human Arm & Forearm extending from left canvas */}
          <path
            d="M -60 210 C 60 205, 160 215, 250 225 C 290 230, 320 238, 345 242 C 340 275, 305 310, 240 318 C 150 328, 50 335, -60 340 Z"
            fill="url(#humanSkin)"
          />
          {/* Arm lower contour shadow for depth */}
          <path
            d="M -60 315 C 60 315, 170 305, 250 295 C 290 290, 325 285, 345 282 C 335 305, 295 318, 240 322 C 140 330, 40 338, -60 340 Z"
            fill="url(#humanShadow)"
            opacity="0.35"
          />

          {/* Wrist Tendon & Palm */}
          <path
            d="M 340 238 C 360 238, 385 235, 410 240 C 425 244, 435 252, 440 262 C 430 282, 405 292, 375 288 C 355 285, 342 278, 338 270 Z"
            fill="url(#humanSkin)"
          />

          {/* Thumb (Curled inward naturally) */}
          <path
            d="M 370 245 C 385 248, 400 258, 408 270 C 402 278, 390 282, 380 276 C 372 268, 365 256, 370 245 Z"
            fill="url(#humanSkin)"
            stroke="#DF9B78"
            strokeWidth="1.2"
          />

          {/* Curled Middle, Ring & Pinky Fingers (Softly tucked) */}
          <g>
            {/* Middle finger curled */}
            <path
              d="M 425 252 C 445 256, 458 266, 452 276 C 445 284, 430 282, 420 274 Z"
              fill="url(#humanSkin)"
              stroke="#D28864"
              strokeWidth="1"
            />
            {/* Ring finger curled */}
            <path
              d="M 415 264 C 435 270, 444 280, 438 288 C 430 294, 418 290, 410 282 Z"
              fill="url(#humanSkin)"
              stroke="#D28864"
              strokeWidth="1"
            />
            {/* Pinky finger curled */}
            <path
              d="M 400 274 C 418 280, 426 290, 420 296 C 412 300, 402 296, 395 288 Z"
              fill="url(#humanSkin)"
              stroke="#D28864"
              strokeWidth="1"
            />
          </g>

          {/* ── THE HUMAN INDEX FINGER (Gracefully Extended to touch at 498, 248) ── */}
          <g>
            {/* Base Knuckle to Mid Joint */}
            <path
              d="M 410 240 C 428 238, 445 238, 460 241 C 460 252, 445 254, 425 252 Z"
              fill="url(#humanSkin)"
            />
            {/* Mid Joint to Fingertip */}
            <path
              d="M 458 241 C 472 242, 488 244, 497 248 C 499 249, 499 251, 496 253 C 484 256, 468 255, 456 252 Z"
              fill="url(#humanFingerHighlight)"
            />
            {/* Fingernail Detail */}
            <path
              d="M 488 246 C 493 247, 496 248, 496 250 C 493 251, 488 250, 487 248 Z"
              fill="#FFFFFF"
              opacity="0.65"
            />
            {/* Subtle knuckle creases */}
            <line x1="432" y1="241" x2="433" y2="249" stroke="#DF9B78" strokeWidth="1.2" opacity="0.6" />
            <line x1="462" y1="243" x2="463" y2="251" stroke="#DF9B78" strokeWidth="1.2" opacity="0.6" />
          </g>
        </motion.g>

        {/* ════════════════════════════════════════════════════════════════
            2. ROBOT / CYBORG HAND (RIGHT SIDE) - Extends towards (502, 248)
            ════════════════════════════════════════════════════════════════ */}
        <motion.g
          animate={{
            x: touchState === "touching" || touchState === "holding" ? -22 : 0,
            y: touchState === "touching" ? -2 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 18,
            mass: 1.1,
          }}
        >
          {/* Cybernetic Forearm Chassis extending from right canvas */}
          <path
            d="M 1060 205 C 940 210, 840 218, 750 228 C 710 233, 680 240, 655 245 C 660 278, 695 312, 760 320 C 850 328, 950 335, 1060 338 Z"
            fill="url(#robotPlates)"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />

          {/* Carbon Fiber Under-layer / Structural Inset */}
          <path
            d="M 1040 225 C 950 230, 860 238, 770 246 C 730 250, 705 255, 685 260 C 690 285, 720 298, 770 304 C 850 310, 940 315, 1040 318 Z"
            fill="url(#robotJoints)"
          />

          {/* Futuristic Glowing Circuit Traces along the robot arm */}
          <motion.path
            d="M 1020 235 L 890 245 L 810 250 L 740 255 L 680 258"
            fill="none"
            stroke="#00D4FF"
            strokeWidth="2.5"
            filter="url(#circuitGlow)"
            animate={{
              opacity: [0.6, 1, 0.6],
              strokeWidth: [2.2, 3.2, 2.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: "easeInOut",
            }}
          />

          <motion.path
            d="M 980 295 L 870 290 L 790 282 L 730 275 L 670 270"
            fill="none"
            stroke="#635BFF"
            strokeWidth="2"
            filter="url(#circuitGlow)"
            animate={{
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.8,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          {/* Articulated Mechanical Wrist Ball Joint */}
          <circle cx="652" cy="258" r="22" fill="url(#robotJoints)" stroke="#475569" strokeWidth="2" />
          <circle cx="652" cy="258" r="14" fill="#0F172A" stroke="#00D4FF" strokeWidth="1.5" opacity="0.8" />

          {/* Robot Palm Chassis Plates */}
          <path
            d="M 645 238 C 625 238, 600 236, 580 240 C 565 244, 555 252, 550 262 C 560 282, 585 292, 615 288 C 635 285, 648 278, 652 270 Z"
            fill="url(#robotPlates)"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />

          {/* Segmented Robotic Knuckle Accents */}
          <circle cx="585" cy="242" r="5" fill="#334155" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="575" cy="255" r="4.5" fill="#334155" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="578" cy="268" r="4" fill="#334155" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="585" cy="280" r="3.5" fill="#334155" stroke="#CBD5E1" strokeWidth="1" />

          {/* Curled Robotic Fingers with mechanical segmentation */}
          <g>
            {/* Middle Finger Joint */}
            <path
              d="M 570 252 C 550 256, 538 266, 544 276 C 550 282, 564 280, 574 272 Z"
              fill="url(#robotPlates)"
              stroke="#64748B"
              strokeWidth="1.2"
            />
            {/* Ring Finger Joint */}
            <path
              d="M 578 264 C 558 270, 550 280, 556 288 C 562 292, 574 288, 582 280 Z"
              fill="url(#robotPlates)"
              stroke="#64748B"
              strokeWidth="1.2"
            />
            {/* Pinky Finger Joint */}
            <path
              d="M 588 274 C 572 280, 566 290, 572 296 C 578 298, 588 294, 594 286 Z"
              fill="url(#robotPlates)"
              stroke="#64748B"
              strokeWidth="1.2"
            />
          </g>

          {/* ── THE ROBOT INDEX FINGER (Articulated & Extended to touch at 502, 248) ── */}
          <g>
            {/* Segment 1: Base to Knuckle */}
            <path
              d="M 580 240 C 562 238, 546 239, 532 242 C 532 252, 546 254, 565 252 Z"
              fill="url(#robotPlates)"
              stroke="#64748B"
              strokeWidth="1"
            />
            {/* Knuckle Seam with Gold/Cyan Accent */}
            <rect x="544" y="240" width="3" height="12" rx="1" fill="url(#robotGoldAccent)" />

            {/* Segment 2: Knuckle to Tip */}
            <path
              d="M 534 241 C 520 242, 506 245, 503 248 C 501 249, 501 251, 504 253 C 516 256, 530 254, 542 252 Z"
              fill="url(#robotPlates)"
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Optical Sensor Ring at Fingertip */}
            <circle cx="504" cy="249" r="2.8" fill="#00D4FF" filter="url(#circuitGlow)" />
            <circle cx="504" cy="249" r="1.4" fill="#FFFFFF" />

            {/* Glowing trace line along the robot index finger */}
            <line
              x1="578"
              y1="246"
              x2="508"
              y2="249"
              stroke="#00D4FF"
              strokeWidth="1.8"
              opacity="0.9"
              filter="url(#circuitGlow)"
            />
          </g>
        </motion.g>

        {/* ════════════════════════════════════════════════════════════════
            3. TOUCH INTERACTION & SPARK BURST AT (500, 249)
            ════════════════════════════════════════════════════════════════ */}
        <g transform="translate(500, 249)">
          
          {/* Subtle Electric Lightning Arc just before touching */}
          <AnimatePresence>
            {touchState === "approaching" && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.2, 0.9, 0] }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <path
                  d="M -12 0 Q -6 -5, 0 1 Q 6 -4, 12 0"
                  fill="none"
                  stroke="#00D4FF"
                  strokeWidth="2"
                  filter="url(#circuitGlow)"
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Touch Moment Glow Shockwave */}
          <AnimatePresence>
            {(touchState === "touching" || touchState === "holding") && (
              <motion.g
                key={`spark-${pulseCount}`}
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: [1, 2.4], opacity: [1, 0] }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <circle r="22" fill="none" stroke="#635BFF" strokeWidth="3" opacity="0.8" filter="url(#touchSparkGlow)" />
                <circle r="36" fill="none" stroke="#00D4FF" strokeWidth="2" opacity="0.6" filter="url(#touchSparkGlow)" />
                <circle r="50" fill="none" stroke="#FFAA2C" strokeWidth="1" opacity="0.4" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Central Brilliant Star / Light Spark Point */}
          <motion.g
            animate={{
              scale: touchState === "touching" ? [1, 1.8, 1.3] : [1, 1.15, 1],
              opacity: touchState === "touching" ? 1 : 0.85,
            }}
            transition={{
              duration: touchState === "touching" ? 0.6 : 1.8,
              repeat: touchState === "touching" ? 0 : Infinity,
              ease: "easeInOut",
            }}
          >
            {/* 4-Point Star Rays */}
            <path
              d="M 0 -22 L 3 -4 L 22 0 L 3 4 L 0 22 L -3 4 L -22 0 L -3 -4 Z"
              fill="#FFFFFF"
              filter="url(#touchSparkGlow)"
            />
            {/* Center Core */}
            <circle r="6" fill="#FFFFFF" />
            <circle r="12" fill="#00D4FF" opacity="0.5" filter="url(#touchSparkGlow)" />
          </motion.g>

          {/* Particle Sparks Bursting Outwards */}
          {sparks.map((spark) => (
            <motion.circle
              key={spark.id}
              cx={0}
              cy={0}
              r={spark.size}
              fill={spark.color}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: spark.vx * 1.6,
                y: spark.vy * 1.6,
                opacity: 0,
                scale: 0.2,
              }}
              transition={{
                duration: 0.9,
                ease: "easeOut",
              }}
            />
          ))}

        </g>
      </svg>

      {/* Floating Status Pill: "INTELLIGENCE ENGINEERED TO MOVE // HUMAN + AI" */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs font-mono text-[10.5px] text-[#0A2540] pointer-events-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
        <span className="font-semibold text-[#0A2540]">HUMAN + AUTONOMOUS AI</span>
        <span className="text-slate-300">•</span>
        <span className="text-[#635BFF] font-bold">INTELLIGENCE, ENGINEERED TO MOVE</span>
      </div>

    </div>
  );
}
