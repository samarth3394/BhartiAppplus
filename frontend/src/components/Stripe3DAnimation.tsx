"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function Stripe3DAnimation() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. High-density 3D Plane Mesh for Smooth Wave Displacement
    const geometry = new THREE.PlaneGeometry(16, 12, 120, 90);
    const pos = geometry.attributes.position;
    const count = pos.count;

    // Create custom vertex colors (Cyan, Royal Indigo, Hot Coral, Golden Sunset)
    const colors = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Normalized coordinates [0, 1] across diagonal plane
      const u = (x + 8) / 16;
      const v = (y + 6) / 12;
      const diagonal = u * 0.6 + (1 - v) * 0.4;

      // Color 1: Soft Sky Blue / Cyan (0.2, 0.75, 1.0)
      // Color 2: Stripe Royal Indigo (0.39, 0.36, 1.0)
      // Color 3: Vibrant Hot Coral / Magenta (1.0, 0.32, 0.55)
      // Color 4: Radiant Golden Amber (1.0, 0.65, 0.18)
      let r = 0, g = 0, b = 0;

      if (diagonal < 0.30) {
        const t = diagonal / 0.30;
        r = 0.2 * (1 - t) + 0.39 * t;
        g = 0.75 * (1 - t) + 0.36 * t;
        b = 1.0;
      } else if (diagonal < 0.65) {
        const t = (diagonal - 0.30) / 0.35;
        r = 0.39 * (1 - t) + 1.0 * t;
        g = 0.36 * (1 - t) + 0.32 * t;
        b = 1.0 * (1 - t) + 0.55 * t;
      } else {
        const t = (diagonal - 0.65) / 0.35;
        r = 1.0;
        g = 0.32 * (1 - t) + 0.68 * t;
        b = 0.55 * (1 - t) + 0.18 * t;
      }

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Shader / Physical Material with Vertex Colors and smooth double side
    const material = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      transparent: true,
      opacity: 0.95,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -0.52;
    mesh.rotation.y = 0.22;
    mesh.rotation.z = -0.28;
    mesh.position.set(2.4, -0.3, 0);
    scene.add(mesh);

    // 3. Dynamic Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x635bff, 1.2);
    dirLight2.position.set(-4, -2, 4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xff5b84, 1.5, 15);
    pointLight.position.set(3, 2, 3);
    scene.add(pointLight);

    // 4. Mouse Interactivity Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 5. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 750;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // 6. 3D Wave Animation Loop
    let startTime = performance.now();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001 * 0.85;

      // Smooth mouse follow
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      mesh.rotation.x = -0.55 + currentMouseY * 0.3;
      mesh.rotation.y = 0.25 + currentMouseX * 0.3;

      // Displace 3D vertices using compounded multi-frequency harmonic sine waves
      const positions = geometry.attributes.position;

      for (let i = 0; i < count; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];

        // Complex 3D fluid wave equations
        const wave1 = Math.sin(ox * 0.65 + elapsedTime * 1.5) * Math.cos(oy * 0.5 + elapsedTime * 1.2) * 0.95;
        const wave2 = Math.sin((ox + oy) * 0.45 + elapsedTime * 1.8) * 0.55;
        const wave3 = Math.cos(Math.sqrt(ox * ox + oy * oy) * 0.6 - elapsedTime * 1.4) * 0.35;

        const newZ = wave1 + wave2 + wave3;
        positions.setZ(i, newZ);
      }

      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full absolute inset-0"
        style={{ transform: "scale(1.08)" }}
      />

      {/* Subtle edge blend so typography on the far left has solid contrast while the ribbon shines behind the right side */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-white via-white/70 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/90 via-white/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
    </div>
  );
}
