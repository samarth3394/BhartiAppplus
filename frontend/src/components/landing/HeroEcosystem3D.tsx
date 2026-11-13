"use client";

import React, { Component, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import {
  CORE_LINK_NODE_IDS,
  ORBIT_RINGS,
  SIGNAL_LINK_NODE_IDS,
  TECH_NODES,
  type OrbitRingConfig,
  type TechNodeConfig,
} from "./heroEcosystemData";

interface HeroEcosystem3DProps {
  className?: string;
}

interface NodePositionMap {
  [id: string]: THREE.Vector3;
}

const CURVE_SEGMENTS = 28;

function computeOrbitWorldPosition(
  orbit: OrbitRingConfig,
  angle: number,
  floatY: number,
  out: THREE.Vector3,
  eulerScratch: THREE.Euler
): THREE.Vector3 {
  out.set(Math.cos(angle) * orbit.radius, floatY, Math.sin(angle) * orbit.radius);
  eulerScratch.set(orbit.tilt[0], orbit.tilt[1], orbit.tilt[2]);
  out.applyEuler(eulerScratch);
  return out;
}

/* ═══════════════════════════════════════════════════════════════
   1. REFINED 3D PRECISION RINGS SURROUNDING CENTRAL BREXAL CORE
   ═══════════════════════════════════════════════════════════════ */
function BrexalCoreRings({
  reducedMotion,
  hasHoveredNode,
}: {
  reducedMotion: boolean;
  hasHoveredNode: boolean;
}) {
  const outerPrecisionRingRef = useRef<THREE.Mesh>(null);
  const innerAccentRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();

    if (outerPrecisionRingRef.current) {
      outerPrecisionRingRef.current.rotation.z = t * 0.08;
    }
    if (innerAccentRingRef.current) {
      innerAccentRingRef.current.rotation.z = -t * 0.05;
    }
  });

  return (
    <group rotation={[0.5, 0, 0]}>
      {/* Concentric Blue & Lavender 3D Precision Rings framing the BREXAL medallion */}
      <mesh ref={outerPrecisionRingRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.05, 1.066, 96]} />
        <meshBasicMaterial
          color="#93C5FD"
          transparent
          opacity={hasHoveredNode ? 0.7 : 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={innerAccentRingRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[1.22, 1.232, 96]} />
        <meshBasicMaterial
          color="#C4B5FD"
          transparent
          opacity={hasHoveredNode ? 0.5 : 0.32}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. THREE HARMONIOUS ORBITAL TRACK RINGS
   ═══════════════════════════════════════════════════════════════ */
function OrbitTrackRing({ orbit }: { orbit: OrbitRingConfig }) {
  return (
    <group rotation={orbit.tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbit.radius, 0.0075, 12, 160]} />
        <meshBasicMaterial
          color={orbit.ringColor}
          transparent
          opacity={orbit.ringOpacity}
        />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. ORBITING 3D NODE ANCHOR + CAMERA-PROJECTED SVG SYNC
   ═══════════════════════════════════════════════════════════════ */
function OrbitNodeAnchor({
  node,
  positionsRef,
  onSyncOverlay,
  hoveredId,
  reducedMotion,
}: {
  node: TechNodeConfig;
  positionsRef: React.MutableRefObject<NodePositionMap>;
  onSyncOverlay: (
    id: string,
    sx: number,
    sy: number,
    scale: number,
    opacity: number,
    zIdx: number
  ) => void;
  hoveredId: string | null;
  reducedMotion: boolean;
}) {
  const anchorDotRef = useRef<THREE.Mesh>(null);
  const scratchRef = useRef({
    euler: new THREE.Euler(),
    pos: new THREE.Vector3(),
    projected: new THREE.Vector3(),
  });

  const isHovered = hoveredId === node.id;
  const orbit = ORBIT_RINGS[node.orbitIndex];

  useEffect(() => {
    const { euler, pos } = scratchRef.current;
    computeOrbitWorldPosition(
      orbit,
      node.angleOffset,
      Math.sin(node.floatPhase) * 0.05,
      pos,
      euler
    );
    positionsRef.current[node.id] = pos.clone();
  }, [node.angleOffset, node.floatPhase, node.id, orbit, positionsRef]);

  useFrame(({ clock, camera, size }) => {
    const t = reducedMotion ? 0 : clock.getElapsedTime();
    const angle = node.angleOffset + t * orbit.speed;
    const floatY = Math.sin(t * 0.85 + node.floatPhase) * 0.055;
    const { euler, pos, projected } = scratchRef.current;

    computeOrbitWorldPosition(orbit, angle, floatY, pos, euler);

    if (!positionsRef.current[node.id]) {
      positionsRef.current[node.id] = pos.clone();
    } else {
      positionsRef.current[node.id].copy(pos);
    }

    if (anchorDotRef.current) {
      anchorDotRef.current.position.copy(pos);
    }

    if (size.width > 0 && size.height > 0) {
      projected.copy(pos).project(camera);
      const sx = (projected.x * 0.5 + 0.5) * size.width;
      const sy = (-projected.y * 0.5 + 0.5) * size.height;

      const normalizedDepth = THREE.MathUtils.clamp((pos.z + 4.2) / 8.4, 0, 1);
      const depthScale = isHovered ? 1.0 : 0.85 + normalizedDepth * 0.18;
      const depthOpacity = isHovered ? 1 : 0.68 + normalizedDepth * 0.32;
      const zIdx = isHovered ? 120 : Math.round(15 + normalizedDepth * 40);

      onSyncOverlay(node.id, sx, sy, depthScale, depthOpacity, zIdx);
    }
  });

  return (
    <mesh ref={anchorDotRef} visible={Boolean(node.hasCoreLink) || isHovered}>
      <sphereGeometry args={[0.028, 10, 10]} />
      <meshBasicMaterial
        color={isHovered ? "#2563EB" : "#94A3B8"}
        transparent
        opacity={isHovered ? 0.65 : 0.35}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. CENTRAL CORE SCREEN-SPACE PROJECTION SYNC
   ═══════════════════════════════════════════════════════════════ */
function CoreOverlayProjector({
  coreDomRef,
}: {
  coreDomRef: React.RefObject<HTMLDivElement | null>;
}) {
  const scratchRef = useRef(new THREE.Vector3());

  useFrame(({ camera, size }) => {
    const el = coreDomRef.current;
    if (!el || size.width === 0 || size.height === 0) return;
    const projected = scratchRef.current;
    projected.set(0, 0, 0).project(camera);
    const dx = projected.x * 0.5 * size.width;
    const dy = -projected.y * 0.5 * size.height;
    el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) translate(-50%, -50%)`;
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   5. ENGINEERED CONNECTION SYSTEM (SELECTED NODES -> BREXAL CORE)
   ═══════════════════════════════════════════════════════════════ */
function CoreConnectionSystem({
  positionsRef,
  hoveredId,
  reducedMotion,
}: {
  positionsRef: React.MutableRefObject<NodePositionMap>;
  hoveredId: string | null;
  reducedMotion: boolean;
}) {
  const signalMeshRef = useRef<THREE.InstancedMesh>(null);
  const linesGroupRef = useRef<THREE.Group>(null);

  const scratchRef = useRef<{
    dummy: THREE.Object3D;
    control: THREE.Vector3;
    pointOnCurve: THREE.Vector3;
    coreAnchor: THREE.Vector3;
    coreLines: Array<{
      nodeId: string;
      baseColor: string;
      positions: Float32Array;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      line: THREE.Line;
    }>;
    hoverLine: {
      positions: Float32Array;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      line: THREE.Line;
    } | null;
  }>({
    dummy: new THREE.Object3D(),
    control: new THREE.Vector3(),
    pointOnCurve: new THREE.Vector3(),
    coreAnchor: new THREE.Vector3(0, 0, 0),
    coreLines: [],
    hoverLine: null,
  });

  useEffect(() => {
    const group = linesGroupRef.current;
    const scratch = scratchRef.current;
    if (!group) return;

    const coreLines = CORE_LINK_NODE_IDS.map((nodeId, idx) => {
      const node = TECH_NODES.find((n) => n.id === nodeId);
      const baseColor = node?.linkColor || (idx % 2 === 0 ? "#CBD5E1" : "#BFDBFE");
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array((CURVE_SEGMENTS + 1) * 3);
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.LineBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.42,
      });
      const line = new THREE.Line(geometry, material);
      group.add(line);
      return { nodeId, baseColor, positions, geometry, material, line };
    });

    const hoverGeom = new THREE.BufferGeometry();
    const hoverPos = new Float32Array((CURVE_SEGMENTS + 1) * 3);
    hoverGeom.setAttribute("position", new THREE.BufferAttribute(hoverPos, 3));
    const hoverMat = new THREE.LineBasicMaterial({
      color: "#2563EB",
      transparent: true,
      opacity: 0.65,
    });
    const hoverLineObj = new THREE.Line(hoverGeom, hoverMat);
    hoverLineObj.visible = false;
    group.add(hoverLineObj);

    scratch.coreLines = coreLines;
    scratch.hoverLine = {
      positions: hoverPos,
      geometry: hoverGeom,
      material: hoverMat,
      line: hoverLineObj,
    };

    const signalMesh = signalMeshRef.current;
    if (signalMesh) {
      const c = new THREE.Color();
      SIGNAL_LINK_NODE_IDS.forEach((_, idx) => {
        c.set(idx % 2 === 0 ? "#2563EB" : "#7C3AED");
        signalMesh.setColorAt(idx, c);
      });
      if (signalMesh.instanceColor) {
        signalMesh.instanceColor.needsUpdate = true;
      }
    }

    return () => {
      coreLines.forEach((item) => {
        group.remove(item.line);
        item.geometry.dispose();
        item.material.dispose();
      });
      group.remove(hoverLineObj);
      hoverGeom.dispose();
      hoverMat.dispose();
      scratch.coreLines = [];
      scratch.hoverLine = null;
    };
  }, []);

  useFrame(({ clock }) => {
    const t = reducedMotion ? 0 : clock.getElapsedTime();
    const posMap = positionsRef.current;
    const { dummy, control, pointOnCurve, coreAnchor, coreLines, hoverLine } =
      scratchRef.current;

    let signalIndex = 0;

    for (let i = 0; i < coreLines.length; i++) {
      const conn = coreLines[i];
      const nodePos = posMap[conn.nodeId];
      if (!nodePos) continue;

      const isActive = hoveredId === conn.nodeId;
      conn.material.color.set(isActive ? "#2563EB" : conn.baseColor);
      conn.material.opacity = isActive ? 0.72 : 0.36;

      control.copy(nodePos).multiplyScalar(0.5);
      control.y += 0.55;

      for (let s = 0; s <= CURVE_SEGMENTS; s++) {
        const u = s / CURVE_SEGMENTS;
        const inv = 1 - u;
        pointOnCurve
          .set(0, 0, 0)
          .addScaledVector(nodePos, inv * inv)
          .addScaledVector(control, 2 * inv * u)
          .addScaledVector(coreAnchor, u * u);
        conn.positions[s * 3] = pointOnCurve.x;
        conn.positions[s * 3 + 1] = pointOnCurve.y;
        conn.positions[s * 3 + 2] = pointOnCurve.z;
      }
      conn.geometry.attributes.position.needsUpdate = true;

      if (signalMeshRef.current && SIGNAL_LINK_NODE_IDS.includes(conn.nodeId)) {
        const u = reducedMotion ? 0.45 : (t * 0.22 + signalIndex * 0.27) % 1;
        const inv = 1 - u;
        pointOnCurve
          .set(0, 0, 0)
          .addScaledVector(nodePos, inv * inv)
          .addScaledVector(control, 2 * inv * u)
          .addScaledVector(coreAnchor, u * u);
        dummy.position.copy(pointOnCurve);
        const fade = Math.sin(u * Math.PI);
        dummy.scale.setScalar(0.75 + fade * 0.45);
        dummy.updateMatrix();
        signalMeshRef.current.setMatrixAt(signalIndex, dummy.matrix);
        signalIndex++;
      }
    }

    if (signalMeshRef.current) {
      signalMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (hoverLine) {
      const hoveredHasStaticLine = hoveredId
        ? CORE_LINK_NODE_IDS.includes(hoveredId)
        : false;
      if (hoveredId && !hoveredHasStaticLine && posMap[hoveredId]) {
        const target = posMap[hoveredId];
        control.copy(target).multiplyScalar(0.5);
        control.y += 0.52;

        for (let s = 0; s <= CURVE_SEGMENTS; s++) {
          const u = s / CURVE_SEGMENTS;
          const inv = 1 - u;
          pointOnCurve
            .set(0, 0, 0)
            .addScaledVector(target, inv * inv)
            .addScaledVector(control, 2 * inv * u)
            .addScaledVector(coreAnchor, u * u);
          hoverLine.positions[s * 3] = pointOnCurve.x;
          hoverLine.positions[s * 3 + 1] = pointOnCurve.y;
          hoverLine.positions[s * 3 + 2] = pointOnCurve.z;
        }
        hoverLine.geometry.attributes.position.needsUpdate = true;
        hoverLine.line.visible = true;
      } else {
        hoverLine.line.visible = false;
      }
    }
  });

  return (
    <group>
      <group ref={linesGroupRef} />
      <instancedMesh
        ref={signalMeshRef}
        args={[undefined, undefined, SIGNAL_LINK_NODE_IDS.length]}
      >
        <sphereGeometry args={[0.032, 10, 10]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.85} />
      </instancedMesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. SCENE ENTRANCE GROUP + COMPOSED ARCHITECTURAL CAMERA
   ═══════════════════════════════════════════════════════════════ */
function SceneEntranceWrapper({
  reducedMotion,
  children,
}: {
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const startTimeRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    if (reducedMotion) {
      group.scale.setScalar(1);
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = clock.getElapsedTime();
    }
    const elapsed = clock.getElapsedTime() - startTimeRef.current;
    const progress = THREE.MathUtils.clamp(elapsed / 0.95, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    group.scale.setScalar(0.88 + eased * 0.12);
  });

  return <group ref={groupRef}>{children}</group>;
}

function CameraRig({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const { camera, pointer, size } = useThree();
  const initializedRef = useRef(false);
  const targetVecRef = useRef(new THREE.Vector3());

  useFrame(() => {
    const aspect = size.width > 0 && size.height > 0 ? size.width / size.height : 1.4;
    const isNarrow = size.width > 0 && size.width < 640;
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(40 / 2));
    const neededZForWidth = (isNarrow ? 4.4 : 4.65) / (tanHalfFov * Math.min(aspect, 1.45));
    const baseZ = Math.max(isNarrow ? 10.2 : 9.8, neededZForWidth);
    const baseY = baseZ * (isNarrow ? 0.34 : 0.27);

    if (!initializedRef.current || reducedMotion) {
      camera.position.set(0, baseY, baseZ);
      camera.lookAt(0, -0.04, 0);
      initializedRef.current = true;
      return;
    }

    const targetX = pointer.x * 0.2;
    const targetY = baseY + pointer.y * 0.14;

    targetVecRef.current.set(targetX, targetY, baseZ);
    camera.position.lerp(targetVecRef.current, 0.045);
    camera.position.setZ(baseZ);
    camera.lookAt(0, -0.04, 0);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   7. WEBGL FALLBACK BOUNDARY
   ═══════════════════════════════════════════════════════════════ */
class WebGLErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function StaticEcosystemFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-transparent">
      <div className="w-28 h-28 rounded-full bg-white border border-slate-200/90 shadow-[0_12px_32px_rgba(15,23,42,0.06)] flex flex-col items-center justify-center mb-8 font-['Sora',sans-serif]">
        <span className="text-sm font-semibold tracking-[0.26em] text-[#0A2540] pl-[0.26em]">
          BREXAL
        </span>
        <span className="w-6 h-[1.5px] my-1.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" />
        <span className="text-[7px] font-medium tracking-[0.18em] uppercase text-[#64748B] text-center">
          INTELLIGENT OBSERVABILITY
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5 max-w-md">
        {TECH_NODES.map((node) => (
          <img
            key={node.id}
            src={node.logo}
            alt={node.name}
            title={node.name}
            loading="lazy"
            className="w-7 h-7 object-contain"
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. MAIN EXPORTED COMPONENT (ARCHITECTURAL TELEMETRY OBSERVATORY)
   ═══════════════════════════════════════════════════════════════ */
export function HeroEcosystem3D({ className = "" }: HeroEcosystem3DProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(1280);
  const positionsRef = useRef<NodePositionMap>({});
  const coreDomRef = useRef<HTMLDivElement>(null);
  const domNodeMapRef = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const setNodeDomRef = useCallback((id: string) => {
    return (el: HTMLDivElement | null) => {
      if (el) {
        domNodeMapRef.current.set(id, el);
      } else {
        domNodeMapRef.current.delete(id);
      }
    };
  }, []);

  const syncNodeOverlay = useCallback(
    (
      id: string,
      sx: number,
      sy: number,
      scale: number,
      opacity: number,
      zIdx: number
    ) => {
      const el = domNodeMapRef.current.get(id);
      if (!el) return;
      el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      el.style.opacity = `${opacity.toFixed(3)}`;
      el.style.zIndex = `${zIdx}`;
    },
    []
  );

  const isMobile = viewportWidth > 0 && viewportWidth < 640;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setHoveredId(null);
      }}
      className={`relative w-full rounded-2xl sm:rounded-3xl border border-[#D6D8DE] bg-gradient-to-b from-[#F7F6F2] via-white to-[#EEF2FF]/35 shadow-[0_20px_50px_rgba(16,28,53,0.07)] p-2 sm:p-4 overflow-hidden ${className}`}
    >
      {/* ── TOP OBSERVATORY HUD BAR ── */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 border-b border-[#E2E4E9] bg-white/80 backdrop-blur-xs rounded-xl mb-1 sm:mb-2 text-[10px] sm:text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
          <span className="font-semibold text-[#101114] uppercase tracking-wider">
            Kernel Mesh 3.0
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[#5B5F6B]">
          <span>LATENCY: <strong className="text-[#101114]">0.12ms</strong></span>
          <span>•</span>
          <span>CLUSTER SYNC: <strong className="text-[#059669]">100%</strong></span>
          <span>•</span>
          <span>THROUGHPUT: <strong className="text-[#425CF5]">250M/s</strong></span>
        </div>
        <div className="flex items-center gap-1 text-[#425CF5] font-semibold">
          <span className="hidden sm:inline text-[9px] uppercase tracking-wider bg-[#EEF2FF] px-2 py-0.5 rounded-full border border-[#C7BDF7]/50">
            18 Nodes Active
          </span>
        </div>
      </div>

      {/* ── 3D CANVAS VIEWPORT ── */}
      <div className="relative w-full h-[270px] sm:h-[400px] lg:h-[440px] bg-transparent overflow-visible">
        <WebGLErrorBoundary fallback={<StaticEcosystemFallback />}>
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 2.65, 9.8], fov: 40, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ background: "transparent" }}
            className="w-full h-full"
          >
            <ambientLight intensity={1.35} color="#ffffff" />
            <directionalLight position={[4, 8, 6]} intensity={0.85} color="#ffffff" />

            <CameraRig reducedMotion={prefersReducedMotion} />
            <CoreOverlayProjector coreDomRef={coreDomRef} />

            <SceneEntranceWrapper reducedMotion={prefersReducedMotion}>
              <BrexalCoreRings
                reducedMotion={prefersReducedMotion}
                hasHoveredNode={hoveredId !== null}
              />

              {ORBIT_RINGS.map((orbit) => (
                <OrbitTrackRing key={orbit.index} orbit={orbit} />
              ))}

              <CoreConnectionSystem
                positionsRef={positionsRef}
                hoveredId={hoveredId}
                reducedMotion={prefersReducedMotion}
              />

              {TECH_NODES.map((node) => (
                <OrbitNodeAnchor
                  key={node.id}
                  node={node}
                  positionsRef={positionsRef}
                  onSyncOverlay={syncNodeOverlay}
                  hoveredId={hoveredId}
                  reducedMotion={prefersReducedMotion}
                />
              ))}
            </SceneEntranceWrapper>
          </Canvas>
        </WebGLErrorBoundary>

        {/* Camera-Projected Editorial SVG & HUD Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          
          {/* Subtle Architectural Telemetry Coordinates (Swiss Grid Accents) */}
          <div className="hidden sm:block absolute top-1 left-2 font-mono text-[9px] font-semibold text-[#8B8F9A] tracking-wider uppercase opacity-80">
            [01 // INGRESS]
          </div>
          <div className="hidden sm:block absolute top-1 right-2 font-mono text-[9px] font-semibold text-[#8B8F9A] tracking-wider uppercase opacity-80">
            [02 // MESH]
          </div>
          <div className="hidden sm:block absolute bottom-1 left-2 font-mono text-[9px] font-semibold text-[#8B8F9A] tracking-wider uppercase opacity-80">
            [03 // RUNTIMES]
          </div>
          <div className="hidden sm:block absolute bottom-1 right-2 font-mono text-[9px] font-semibold text-[#8B8F9A] tracking-wider uppercase opacity-80">
            [04 // TELEMETRY]
          </div>

          {/* Central Architectural BREXAL Core — HIGH CONTRAST MIDNIGHT TITANIUM SUPERCORE */}
          <div
            ref={coreDomRef}
            className="absolute top-1/2 left-1/2 select-none"
            style={{
              zIndex: 65,
              transform: "translate3d(0px, 0px, 0) translate(-50%, -50%)",
            }}
          >
            <div
              className="brexal-node-pop relative flex flex-col items-center justify-center w-[92px] h-[92px] sm:w-[130px] sm:h-[130px] rounded-full bg-gradient-to-br from-[#101C35] via-[#101114] to-[#0A0D18] text-white border-2 border-[#425CF5]/70 shadow-[0_20px_50px_rgba(16,28,53,0.45),0_0_36px_rgba(66,92,245,0.35)]"
              style={{ animationDelay: "0.12s" }}
            >
              {/* Outer Rotating Concentric Telemetry Radar Ring with Gold & Cobalt Sparks */}
              <div className="absolute -inset-2.5 sm:-inset-3.5 rounded-full border border-dashed border-[#425CF5]/50 animate-[spin_45s_linear_infinite] pointer-events-none" />
              <div className="absolute -inset-1 sm:-inset-1.5 rounded-full border border-[#C8A96B]/30 pointer-events-none" />
              
              {/* Precision Titanium Degree Tick Marks */}
              <div className="absolute top-1 text-[6px] font-mono font-bold text-[#C8A96B] tracking-widest">
                0°
              </div>
              <div className="absolute bottom-1 text-[6px] font-mono font-bold text-[#8B8F9A] tracking-widest">
                180°
              </div>

              {/* BREXAL Focal Typography in Crisp Pure White */}
              <span className="font-['Sora',sans-serif] text-[11px] sm:text-[15px] font-bold tracking-[0.24em] text-white pl-[0.24em] leading-none drop-shadow-xs">
                BREXAL
              </span>
              
              {/* Active Core Gradient Spine */}
              <span className="w-5 sm:w-7 h-[2px] my-1 sm:my-1.5 rounded-full bg-gradient-to-r from-[#425CF5] via-[#C7BDF7] to-[#425CF5]" />
              
              <span className="font-['Sora',sans-serif] text-[5px] sm:text-[7px] font-semibold tracking-[0.16em] uppercase text-[#C7BDF7] text-center max-w-[68px] sm:max-w-[100px] leading-tight">
                AUTONOMOUS MESH
              </span>

              {/* Micro eBPF Telemetry Badge with Glowing Beacon */}
              <div className="mt-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-[5.5px] sm:text-[6.5px] font-mono font-bold text-[#6EE7B7] uppercase tracking-wider">
                  MESH ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* 17 Engineered Architecture Medallion Technology Nodes */}
          {TECH_NODES.map((node, index) => {
            const isHovered = hoveredId === node.id;
            const layerBaseDelay =
              node.orbitIndex === 0 ? 0.34 : node.orbitIndex === 1 ? 0.52 : 0.7;
            const popDelay = layerBaseDelay + (index % 8) * 0.045;

            return (
              <div
                key={node.id}
                ref={setNodeDomRef(node.id)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredId(isHovered ? null : node.id);
                }}
                className="absolute top-0 left-0 pointer-events-auto select-none"
                style={{ zIndex: 20, opacity: 0 }}
              >
                <div
                  className="brexal-node-pop relative flex items-center justify-center"
                  style={{ animationDelay: `${popDelay.toFixed(2)}s` }}
                >
                  {/* High-Fidelity Editorial HUD Tooltip on Hover */}
                  <motion.div
                    initial={false}
                    animate={
                      isHovered
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 6, scale: 0.94 }
                    }
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#101C35] text-white border border-[#425CF5]/50 shadow-[0_10px_26px_rgba(0,0,0,0.4)] z-50 flex items-center gap-2"
                  >
                    <span className="font-['Sora',sans-serif] text-[11px] font-semibold text-white">
                      {node.name}
                    </span>
                    <span className="text-[9px] font-mono font-medium text-[#C7BDF7] bg-white/10 px-1.5 py-0.5 rounded">
                      {node.category}
                    </span>
                    <span className="text-[9px] font-mono font-semibold text-[#10B981]">
                      ● 0.1ms Sync
                    </span>
                  </motion.div>

                  {/* Tactile High-Contrast Architectural Pod with Authentic Brand SVG */}
                  <div
                    tabIndex={0}
                    aria-label={`${node.name} — ${node.category}`}
                    onFocus={() => setHoveredId(node.id)}
                    onBlur={() => setHoveredId(null)}
                    className={`cursor-pointer relative flex items-center justify-center rounded-xl sm:rounded-2xl bg-white border-2 border-[#D6D8DE] shadow-[0_8px_20px_rgba(16,28,53,0.1)] transition-all duration-300 ease-out focus:outline-none ${
                      isMobile ? "w-8 h-8 p-1.5" : "w-10 h-10 sm:w-11 sm:h-11 p-2"
                    } ${
                      isHovered
                        ? "scale-[1.3] border-[#425CF5] shadow-[0_16px_36px_rgba(66,92,245,0.3)] ring-2 ring-[#425CF5]/30 z-30"
                        : "hover:border-[#425CF5]/60 hover:shadow-md"
                    }`}
                  >
                    <img
                      src={node.logo}
                      alt={node.name}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                    {/* Micro Live Status Beacon */}
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-white shadow-xs" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM OBSERVATORY TELEMETRY TICKER ── */}
      <div className="mt-1 pt-1.5 border-t border-[#E2E4E9] flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-[#5B5F6B] px-2">
        <div className="flex items-center gap-2">
          <span className="text-[#101114] font-semibold">SOCKET ADAPTER:</span>
          <span className="text-[#425CF5]">eBPF_XDP_V4</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span>PACKET LOSS: <strong className="text-[#059669]">0.000%</strong></span>
          <span>•</span>
          <span>ROOT CAUSE: <strong className="text-[#C8A96B]">AUTOMATED</strong></span>
        </div>
        <div className="text-[#059669] font-semibold">
          ● REAL-TIME TELEMETRY
        </div>
      </div>
    </div>
  );
}

export default HeroEcosystem3D;
