"use client";

/**
 * Cinematic scroll-driven 3D typography.
 *
 * Architecture (performance-first):
 * - Scroll progress lives in a ref (never setState in the hot path)
 * - frameloop="demand" + invalidate() only while section is in view
 * - Shared materials, no per-frame React reconciliation
 * - Troika SDF text (sharp at any scale, worker-generated atlas)
 * - Reduced-motion / low-power / offscreen → no WebGL
 */

import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import { Text, PerspectiveCamera } from "@react-three/drei";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  createContext,
  useContext,
  type MutableRefObject,
} from "react";
import * as THREE from "three";

/* ---------- Types & data ---------- */

type Word = {
  text: string;
  z: number;
  scale: number;
  accent?: boolean;
};

const WORDS: Word[] = [
  { text: "EDIT", z: 0, scale: 1.2 },
  { text: "FRAME", z: -16, scale: 1.05 },
  { text: "STORY", z: -32, scale: 1.15, accent: true },
  { text: "CODE", z: -48, scale: 1.25 },
  { text: "BUILD", z: -64, scale: 1.05 },
  { text: "FUTURE", z: -80, scale: 1.15 },
];

const CAM_START_Z = 14;
const CAM_END_Z = -92;

type ProgressStore = {
  progress: number; // 0–1
  activeIndex: number;
};

const ProgressCtx = createContext<MutableRefObject<ProgressStore> | null>(null);

/* ---------- Hooks ---------- */

function usePrefersReducedMotion() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setV(mq.matches);
    const fn = () => setV(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return v;
}

function useIsMobile() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setV(mq.matches);
    const fn = () => setV(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return v;
}

/**
 * Writes scroll progress into a ref. Does NOT set React state every frame.
 * Optionally reports active word index at a throttled rate for UI chrome.
 */
function useScrollProgressRef(
  sectionId: string,
  store: MutableRefObject<ProgressStore>,
  onActiveChange?: (index: number) => void,
) {
  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    let raf = 0;
    let lastActive = -1;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      const p = scrolled / total;
      store.current.progress = p;

      // Which word is nearest to camera
      const camZ = THREE.MathUtils.lerp(CAM_START_Z, CAM_END_Z, p);
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < WORDS.length; i++) {
        const d = Math.abs(WORDS[i].z - camZ);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      store.current.activeIndex = best;
      if (best !== lastActive) {
        lastActive = best;
        onActiveChange?.(best);
      }

      invalidate(); // demand-loop: render only when progress changes
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
  }, [sectionId, store, onActiveChange]);
}

/* ---------- Scene pieces ---------- */

function CinematicCamera({ mobile }: { mobile: boolean }) {
  const store = useContext(ProgressCtx)!;
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const p = store.current.progress;
    const z = THREE.MathUtils.lerp(CAM_START_Z, CAM_END_Z, p);
    // Gentle cinematic drift — not random noise
    const x = Math.sin(p * Math.PI) * (mobile ? 0.25 : 0.55);
    const y = Math.sin(p * Math.PI * 1.4) * (mobile ? 0.15 : 0.32);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 4, delta);

    look.current.set(0, 0, z - 20);
    camera.lookAt(look.current);
  });

  return null;
}

function WordMesh({ word, index, mobile }: { word: Word; index: number; mobile: boolean }) {
  const store = useContext(ProgressCtx)!;
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  // MeshBasicMaterial: cheaper than Standard, still looks premium with fog + color
  const color = word.accent ? "#e8a84a" : "#f2f1ec";

  useFrame(() => {
    if (!group.current || !matRef.current) return;
    const p = store.current.progress;
    const camZ = THREE.MathUtils.lerp(CAM_START_Z, CAM_END_Z, p);
    const dist = Math.abs(word.z - camZ);

    // Focus falloff: sharp near camera, soft far away
    const focus = 1 - Math.min(1, Math.abs(dist - 6) / 18);
    const opacity = 0.08 + focus * 0.92;
    matRef.current.opacity = opacity;

    // Scale up slightly when in focus (architectural presence)
    const base = word.scale * (mobile ? 0.68 : 1);
    const s = base * (1 + focus * 0.06);
    group.current.scale.setScalar(s);

    // Tiny parallax offset on X based on depth
    group.current.position.x = (word.z * 0.002) * Math.sin(p * Math.PI);
  });

  const size = mobile ? 1.4 : 2.2;

  return (
    <group ref={group} position={[0, 0, word.z]}>
      <Text
        font="https://cdn.jsdelivr.net/fontsource/fonts/instrument-sans@5.2.5/latin-600-normal.woff"
        fontSize={size}
        letterSpacing={-0.05}
        anchorX="center"
        anchorY="middle"
        maxWidth={24}
        textAlign="center"
        overflowWrap="normal"
        whiteSpace="nowrap"
      >
        {word.text}
        <meshBasicMaterial
          ref={matRef}
          color={color}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </Text>
    </group>
  );
}

function Scene({ mobile }: { mobile: boolean }) {
  return (
    <>
      <color attach="background" args={["#0c0c0e"]} />
      <fog attach="fog" args={["#0c0c0e", mobile ? 10 : 12, mobile ? 42 : 52]} />

      <PerspectiveCamera
        makeDefault
        fov={mobile ? 50 : 40}
        near={0.1}
        far={140}
        position={[0, 0, CAM_START_Z]}
      />
      <CinematicCamera mobile={mobile} />

      {WORDS.map((w, i) => (
        <WordMesh key={w.text} word={w} index={i} mobile={mobile} />
      ))}
    </>
  );
}

/* ---------- Public component ---------- */

export function CinematicCanvas({
  sectionId = "scene-transform",
  onActiveWord,
}: {
  sectionId?: string;
  onActiveWord?: (index: number, word: string) => void;
}) {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const store = useRef<ProgressStore>({ progress: 0, activeIndex: 0 });

  // Defer WebGL until after first paint (protect LCP)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Only run the GL loop while the section is near the viewport
  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "20% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sectionId]);

  const handleActive = useMemo(
    () => (index: number) => {
      onActiveWord?.(index, WORDS[index]?.text ?? "");
    },
    [onActiveWord],
  );

  useScrollProgressRef(sectionId, store, handleActive);

  if (reduced || !mounted || !inView) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={mobile ? [1, 1.25] : [1, 1.5]}
        gl={{
          antialias: !mobile,
          alpha: false,
          powerPreference: mobile ? "low-power" : "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ProgressCtx.Provider value={store}>
          <Suspense fallback={null}>
            <Scene mobile={mobile} />
          </Suspense>
        </ProgressCtx.Provider>
      </Canvas>
    </div>
  );
}

/** Export word list for the 2D overlay / a11y layer */
export const CINEMATIC_WORDS = WORDS.map((w) => w.text);
