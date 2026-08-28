"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";

type Word = {
  text: string;
  z: number;
  y?: number;
  scale?: number;
  accent?: boolean;
};

const WORDS: Word[] = [
  { text: "EDIT", z: -2, scale: 1.15 },
  { text: "FRAME", z: -14, scale: 1 },
  { text: "STORY", z: -28, scale: 1.05, accent: true },
  { text: "CODE", z: -42, scale: 1.2 },
  { text: "BUILD", z: -56, scale: 1 },
  { text: "FUTURE", z: -72, scale: 1.1 },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setMobile(mq.matches);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return mobile;
}

/** Smooth scroll progress 0 → 1 across the transition section height */
function useScrollProgress(sectionId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      setProgress(p);
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sectionId]);

  return progress;
}

function CinematicCamera({ progress, reduced }: { progress: number; reduced: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    if (reduced) {
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Camera travels from z=12 toward z=-80 as progress goes 0→1
    const z = THREE.MathUtils.lerp(12, -80, progress);
    // Subtle vertical drift + slight lateral for cinematic feel
    const y = Math.sin(progress * Math.PI * 1.2) * 0.35;
    const x = Math.sin(progress * Math.PI * 0.6) * 0.45;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3.2, delta);

    target.current.set(0, 0, z - 18);
    camera.lookAt(target.current);
  });

  return null;
}

function WordMesh({
  word,
  progress,
  index,
  mobile,
}: {
  word: Word;
  progress: number;
  index: number;
  mobile: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: word.accent ? "#e8a84a" : "#f5f5f0",
        roughness: 0.35,
        metalness: 0.15,
        emissive: word.accent ? "#e8a84a" : "#1a1a18",
        emissiveIntensity: word.accent ? 0.22 : 0.04,
      }),
    [word.accent],
  );

  // Distance-based opacity / scale for depth-of-field feel
  useFrame(() => {
    if (!ref.current) return;
    const camZ = 12 + progress * -92; // approximate camera z
    const dist = Math.abs(word.z - camZ);
    // Peak visibility when camera is near the word
    const near = 1 - Math.min(1, Math.abs(dist - 8) / 22);
    const opacity = 0.15 + near * 0.85;
    ref.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (m && "opacity" in m) {
          m.transparent = true;
          m.opacity = opacity;
        }
      }
    });
    // Slight scale breathe when in focus
    const s = (word.scale ?? 1) * (1 + near * 0.04);
    ref.current.scale.setScalar(s * (mobile ? 0.72 : 1));
  });

  const size = mobile ? 1.35 : 2.1;

  return (
    <group ref={ref} position={[0, word.y ?? 0, word.z]}>
      <Float
        speed={0.6 + index * 0.08}
        rotationIntensity={0.05}
        floatIntensity={0.12}
        floatingRange={[-0.08, 0.08]}
      >
        <Text
          font="https://cdn.jsdelivr.net/fontsource/fonts/instrument-sans@5.2.5/latin-600-normal.woff"
          fontSize={size}
          letterSpacing={-0.045}
          anchorX="center"
          anchorY="middle"
          material={material}
          maxWidth={20}
        >
          {word.text}
        </Text>
      </Float>
    </group>
  );
}

function SceneContent({
  progress,
  reduced,
  mobile,
}: {
  progress: number;
  reduced: boolean;
  mobile: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#0c0c0e"]} />
      <fog attach="fog" args={["#0c0c0e", 8, 55]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 8]} intensity={1.1} color="#fff8f0" />
      <directionalLight position={[-5, -2, -4]} intensity={0.35} color="#a0b0ff" />
      <pointLight position={[0, 2, -20]} intensity={0.6} color="#e8a84a" distance={40} />

      <PerspectiveCamera makeDefault fov={mobile ? 48 : 42} near={0.1} far={120} position={[0, 0, 12]} />
      <CinematicCamera progress={progress} reduced={reduced} />

      {WORDS.map((w, i) => (
        <WordMesh key={w.text} word={w} progress={progress} index={i} mobile={mobile} />
      ))}
    </>
  );
}

/**
 * Full-bleed 3D typography sequence.
 * Mount inside a tall sticky section; scroll drives the camera through the words.
 */
export function CinematicCanvas({ sectionId = "scene-transform" }: { sectionId?: string }) {
  const progress = useScrollProgress(sectionId);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Defer canvas until after first paint for LCP
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  if (reduced) {
    // Pure CSS fallback already exists in the page — hide WebGL
    return null;
  }

  if (!ready) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <Canvas
        dpr={mobile ? [1, 1.25] : [1, 1.75]}
        gl={{
          antialias: !mobile,
          alpha: false,
          powerPreference: mobile ? "low-power" : "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <SceneContent progress={progress} reduced={reduced} mobile={mobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
