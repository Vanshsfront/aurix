"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import { Can } from "./Can";

/**
 * The floating AURIX can. Transparent canvas so the page background shows.
 * Reflections come from inline Lightformers (no external HDR / network).
 */
export default function CanScene({
  interactive = true,
  animate = true,
}: {
  interactive?: boolean;
  animate?: boolean;
}) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10.5], fov: 35 }}
      style={{ background: "transparent" }}
    >
      <AdaptiveDpr pixelated={false} />

      <ambientLight intensity={0.9} />
      {/* Key light, upper front */}
      <directionalLight position={[4, 6, 6]} intensity={2.4} color="#fff4dc" />
      {/* Front fill so the label reads clearly */}
      <directionalLight position={[0, 1, 9]} intensity={1.6} color="#fff" />
      {/* Warm gold rim from behind */}
      <spotLight
        position={[-5, 3, -6]}
        angle={0.7}
        penumbra={1}
        intensity={3}
        color="#e6b864"
      />
      {/* Cool fill to separate from the dark background */}
      <pointLight position={[-4, -2, 4]} intensity={0.6} color="#9fb4d8" />

      <Suspense fallback={null}>
        <Can interactive={interactive} animate={animate} />

        <Environment resolution={256}>
          <Lightformer
            intensity={2}
            position={[0, 4, 2]}
            scale={[8, 3, 1]}
            color="#fff6e2"
          />
          <Lightformer
            intensity={1.4}
            position={[4, 1, 3]}
            scale={[3, 6, 1]}
            color="#f0d49a"
          />
          <Lightformer
            intensity={1.1}
            position={[-5, 0, 2]}
            scale={[3, 6, 1]}
            color="#cf9a52"
          />
          <Lightformer
            intensity={0.8}
            position={[0, -3, -3]}
            scale={[6, 4, 1]}
            color="#5a4a2e"
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
