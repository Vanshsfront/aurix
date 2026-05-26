"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { Can } from "./Can";
import { scrollStore } from "@/lib/scrollStore";

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Per-section can size (whole-page progress → scale).
const SCALE_POINTS: [number, number][] = [
  [0.0, 0.74], // hero — smaller
  [0.12, 0.78], // brand
  [0.4, 0.58], // benefits — small, fits inside the ring
  [0.57, 0.88], // gulab beat
  [0.71, 0.88], // chai beat
  [0.86, 0.72], // shop
  [1.0, 0.72],
];

function interp(p: number, pts: [number, number][]) {
  if (p <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (p <= pts[i][0]) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      return lerp(y0, y1, smooth((p - x0) / (x1 - x0)));
    }
  }
  return pts[pts.length - 1][1];
}

/**
 * Wraps the can and choreographs it by whole-page scroll progress:
 * resizes per section, travels left for the shop, rolls on Z while scrolling,
 * and tilts / scales toward the cursor (hover).
 */
function ScrollRig() {
  const g = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!g.current) return;
    const p = scrollStore.progress;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 900;

    // Travel left for the shop (rise on mobile instead).
    const e = smooth(clamp01((p - 0.78) / 0.1));
    const targetX = isMobile ? 0 : -2.6 * e;
    const targetY = isMobile ? 0.7 * e : 0;

    // Hover proximity: distance from cursor to the can's screen position.
    const canNormX = targetX / 5.5;
    const dist = Math.hypot(scrollStore.px - canNormX, scrollStore.py);
    const hover = clamp01(1 - dist / 0.5);
    scrollStore.hover += (hover - scrollStore.hover) * 0.1;

    // Per-section scale, grown slightly on hover.
    const targetScale = interp(p, SCALE_POINTS) * (1 + 0.07 * scrollStore.hover);

    // Z-roll driven by scroll (upright at the start/middle/end) + cursor.
    const targetZ =
      Math.sin(p * Math.PI * 2) * 0.16 + scrollStore.px * 0.12 * scrollStore.hover;
    // Tilt toward the cursor.
    const targetTiltX = -scrollStore.py * 0.22 * (0.4 + scrollStore.hover);
    const targetTiltY = scrollStore.px * 0.25 * scrollStore.hover;

    g.current.position.x = lerp(g.current.position.x, targetX, 0.07);
    g.current.position.y = lerp(g.current.position.y, targetY, 0.07);
    const s = lerp(g.current.scale.x, targetScale, 0.08);
    g.current.scale.setScalar(s);
    g.current.rotation.z = lerp(g.current.rotation.z, targetZ, 0.06);
    g.current.rotation.x = lerp(g.current.rotation.x, targetTiltX, 0.06);
    g.current.rotation.y = lerp(g.current.rotation.y, targetTiltY, 0.06);
  });

  return (
    <group ref={g}>
      <Can interactive={false} animate scrollFlavour />
    </group>
  );
}

export function ExperienceCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10.5], fov: 35 }}
        style={{ background: "transparent" }}
      >
        <AdaptiveDpr pixelated={false} />

        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 6]} intensity={2.4} color="#fff0e8" />
        <directionalLight position={[0, 1, 9]} intensity={1.5} color="#fff" />
        <spotLight
          position={[-5, 3, -6]}
          angle={0.7}
          penumbra={1}
          intensity={3.2}
          color="#e6a48f"
        />
        <pointLight position={[-4, -2, 4]} intensity={0.5} color="#a9b6d6" />

        <Suspense fallback={null}>
          <ScrollRig />
          <Environment resolution={256}>
            <Lightformer intensity={2} position={[0, 4, 2]} scale={[8, 3, 1]} color="#fff0e8" />
            <Lightformer intensity={1.4} position={[4, 1, 3]} scale={[3, 6, 1]} color="#f0c2b0" />
            <Lightformer intensity={1.2} position={[-5, 0, 2]} scale={[3, 6, 1]} color="#d18f7e" />
            <Lightformer intensity={0.8} position={[0, -3, -3]} scale={[6, 4, 1]} color="#5a3a32" />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
