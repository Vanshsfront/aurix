"use client";

import { useMemo, useRef, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PRODUCTS } from "@/lib/products";
import { useFlavour } from "@/context/FlavourProvider";

const ORDER = PRODUCTS.map((p) => p.slug);

// Can proportions, derived from the label aspect (1370 x 995) so the wrap is
// not distorted: bodyHeight / circumference = labelH / labelW.
const RADIUS = 1;
const BODY_H = 2 * Math.PI * RADIUS * (995 / 1370); // ≈ 4.56 — a slim can
const NECK_H = 0.24;
const FADE_SECONDS = 0.7;

const GOLD = "#b89248";

export function Can({
  interactive = true,
  animate = true,
}: {
  interactive?: boolean;
  animate?: boolean;
}) {
  const tex = useTexture({
    rasmalai: "/textures/labels/rasmalai.png",
    gulab: "/textures/labels/gulab.png",
    "masala-chai": "/textures/labels/masala-chai.png",
    top: "/textures/can-top.png",
  });

  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const { active } = useFlavour();

  const labelTextures = useMemo(
    () => ORDER.map((slug) => tex[slug as keyof typeof tex] as THREE.Texture),
    [tex],
  );

  useLayoutEffect(() => {
    for (const t of [...labelTextures, tex.top]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = maxAniso;
      t.needsUpdate = true;
    }
  }, [labelTextures, tex.top, maxAniso]);

  // Label material with a two-texture crossfade baked into the shader.
  const bodyMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: labelTextures[Math.max(0, ORDER.indexOf(active))],
      metalness: 0.25,
      roughness: 0.52,
      envMapIntensity: 1.1,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uMapB = { value: m.map };
      shader.uniforms.uMix = { value: 0 };
      shader.fragmentShader =
        "uniform sampler2D uMapB;\nuniform float uMix;\n" +
        shader.fragmentShader.replace(
          "#include <map_fragment>",
          /* glsl */ `
        #ifdef USE_MAP
          vec4 aColor = texture2D( map, vMapUv );
          vec4 bColor = texture2D( uMapB, vMapUv );
          vec4 sampledDiffuseColor = mix( aColor, bColor, uMix );
          diffuseColor *= sampledDiffuseColor;
        #endif
        `,
        );
      m.userData.shader = shader;
    };
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelTextures]);

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(GOLD),
        metalness: 0.8,
        roughness: 0.35,
        envMapIntensity: 1.2,
      }),
    [],
  );

  const lidMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: tex.top,
      metalness: 0.9,
      roughness: 0.32,
      envMapIntensity: 1,
    });
    return m;
  }, [tex.top]);

  // Cylinder material order: [side, top, bottom].
  const bodyMaterials = useMemo(
    () => [bodyMat, goldMat, goldMat],
    [bodyMat, goldMat],
  );
  const lidMaterials = useMemo(
    () => [goldMat, lidMat, goldMat],
    [goldMat, lidMat],
  );

  const outer = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const displayed = useRef(Math.max(0, ORDER.indexOf(active)));
  const mix = useRef(0);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);

    // Continuous slow rotation + gentle bob.
    if (spinner.current && animate) {
      spinner.current.rotation.y += d * 0.18;
      spinner.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.07;
    }

    // Pointer parallax (skipped for the static / non-interactive variant).
    if (outer.current) {
      const px = interactive && animate ? state.pointer.x : 0;
      const py = interactive && animate ? state.pointer.y : 0;
      outer.current.rotation.x = THREE.MathUtils.lerp(
        outer.current.rotation.x,
        -py * 0.18,
        0.05,
      );
      outer.current.rotation.z = THREE.MathUtils.lerp(
        outer.current.rotation.z,
        px * 0.08,
        0.05,
      );
    }

    // Crossfade the label when the active flavour changes.
    const shader = bodyMat.userData.shader as
      | { uniforms: { uMapB: { value: THREE.Texture }; uMix: { value: number } } }
      | undefined;
    const target = ORDER.indexOf(active);
    if (shader && target >= 0 && target !== displayed.current) {
      shader.uniforms.uMapB.value = labelTextures[target];
      mix.current = Math.min(1, mix.current + d / FADE_SECONDS);
      shader.uniforms.uMix.value = mix.current;
      if (mix.current >= 1) {
        bodyMat.map = labelTextures[target];
        displayed.current = target;
        mix.current = 0;
        shader.uniforms.uMix.value = 0;
      }
    }
  });

  return (
    <group ref={outer} rotation={[0.04, 0, 0]}>
      <group ref={spinner} rotation={[0, 2.7, 0]}>
        {/* Body — carries the wrap label */}
        <mesh material={bodyMaterials} castShadow>
          <cylinderGeometry args={[RADIUS, RADIUS, BODY_H, 96, 1]} />
        </mesh>

        {/* Top neck taper */}
        <mesh
          material={goldMat}
          position={[0, BODY_H / 2 + NECK_H / 2, 0]}
        >
          <cylinderGeometry args={[RADIUS * 0.8, RADIUS, NECK_H, 96, 1, true]} />
        </mesh>

        {/* Lid with the gold can-top */}
        <mesh
          material={lidMaterials}
          position={[0, BODY_H / 2 + NECK_H + 0.02, 0]}
        >
          <cylinderGeometry args={[RADIUS * 0.8, RADIUS * 0.8, 0.05, 96]} />
        </mesh>

        {/* Bottom base taper */}
        <mesh
          material={goldMat}
          position={[0, -BODY_H / 2 - 0.09, 0]}
        >
          <cylinderGeometry args={[RADIUS, RADIUS * 0.86, 0.18, 96, 1]} />
        </mesh>
      </group>
    </group>
  );
}
