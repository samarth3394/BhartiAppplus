"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── 1. Scene & Renderer Setup ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.075);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.5, 6.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // ── 2. 3D Holographic Network Globe ──
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner wireframe sphere
    const sphereGeo = new THREE.IcosahedronGeometry(2.2, 3);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // Outer lattice ring
    const outerRingGeo = new THREE.TorusGeometry(3.2, 0.015, 16, 100);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2.5;
    globeGroup.add(outerRing);

    // Secondary equatorial ring
    const secRingGeo = new THREE.TorusGeometry(2.8, 0.01, 16, 80);
    const secRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.2,
    });
    const secRing = new THREE.Mesh(secRingGeo, secRingMat);
    secRing.rotation.y = Math.PI / 4;
    secRing.rotation.x = Math.PI / 3;
    globeGroup.add(secRing);

    // ── 3. Data Flow Nodes (Vertices Points) ──
    const nodeCount = 180;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);

    const colorWhite = new THREE.Color(0xffffff);
    const colorCyan = new THREE.Color(0x38bdf8);
    const colorEmerald = new THREE.Color(0x34d399);

    for (let i = 0; i < nodeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.2 + (Math.random() - 0.5) * 0.2;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

      // Color variation (monochrome with cyan/emerald telemetry accents)
      const choice = Math.random();
      const c = choice > 0.7 ? colorCyan : choice > 0.4 ? colorEmerald : colorWhite;
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));

    const nodeMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    globeGroup.add(nodePoints);

    // ── 4. Deep Space Constellation Particles ──
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 24;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // ── 5. Camera Waypoints for Scroll Fly-Through ──
    // As the user scrolls from 0 to 1, camera flies across these waypoints in 3D space
    const waypoints = [
      { progress: 0.00, pos: new THREE.Vector3(0, 1.2, 6.8), look: new THREE.Vector3(0, 0, 0), rotZ: 0 },
      { progress: 0.25, pos: new THREE.Vector3(2.8, -0.6, 5.2), look: new THREE.Vector3(0, -0.4, 0), rotZ: -0.1 },
      { progress: 0.50, pos: new THREE.Vector3(-3.2, 0.4, 4.8), look: new THREE.Vector3(0, 0, 0), rotZ: 0.12 },
      { progress: 0.75, pos: new THREE.Vector3(1.8, 1.8, 4.4), look: new THREE.Vector3(-0.3, 0, 0), rotZ: -0.08 },
      { progress: 1.00, pos: new THREE.Vector3(0, 3.6, 6.2), look: new THREE.Vector3(0, 0, 0), rotZ: 0 },
    ];

    let targetCamPos = new THREE.Vector3().copy(waypoints[0].pos);
    let targetLookAt = new THREE.Vector3().copy(waypoints[0].look);
    const currentLookAt = new THREE.Vector3().copy(waypoints[0].look);

    // Mouse Gyro tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const p = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      // Find waypoint bracket
      for (let i = 0; i < waypoints.length - 1; i++) {
        const w1 = waypoints[i];
        const w2 = waypoints[i + 1];
        if (p >= w1.progress && p <= w2.progress) {
          const t = (p - w1.progress) / (w2.progress - w1.progress);
          // Ease in-out
          const easeT = t * t * (3 - 2 * t);
          targetCamPos.lerpVectors(w1.pos, w2.pos, easeT);
          targetLookAt.lerpVectors(w1.look, w2.look, easeT);
          break;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Trigger initial scroll sync
    handleScroll();

    // ── 6. Render Animation Loop ──
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Rotate 3D globe and rings continuously
      globeGroup.rotation.y = elapsedTime * 0.08;
      globeGroup.rotation.x = Math.sin(elapsedTime * 0.04) * 0.15;
      outerRing.rotation.z = elapsedTime * 0.05;
      secRing.rotation.z = -elapsedTime * 0.07;

      // Gentle starfield drift
      starPoints.rotation.y = -elapsedTime * 0.015;

      // Smooth Camera Fly-Through Interpolation (lerp)
      const desiredPos = new THREE.Vector3(
        targetCamPos.x + mouseX * 0.45,
        targetCamPos.y - mouseY * 0.35,
        targetCamPos.z
      );
      camera.position.lerp(desiredPos, 0.06);

      const desiredLook = new THREE.Vector3(
        targetLookAt.x + mouseX * 0.2,
        targetLookAt.y - mouseY * 0.15,
        targetLookAt.z
      );
      currentLookAt.lerp(desiredLook, 0.06);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // ── 7. Cleanup ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      sphereGeo.dispose();
      sphereMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      secRingGeo.dispose();
      secRingMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-85"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
}
