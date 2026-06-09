"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/animation/gsap";

/**
 * Dezentes 3D-Partikelfeld als Hero-Hintergrund (rein clientseitig, via
 * next/dynamic mit { ssr:false } laden). Liegt HINTER dem CSS-Aurora.
 *
 * Verhalten:
 * - prefers-reduced-motion ODER kleiner Viewport (<768px) -> rendert NICHTS
 *   (return null). Der Aufrufer zeigt dann allein den Aurora-Hintergrund.
 * - Partikel-Positionen deterministisch (Goldener-Winkel-Spirale, Index-basiert)
 *   -> kein Hydration-Mismatch, stabil ueber Re-Renders.
 * - Maus-Parallax gedaempft; Drift ueber geklammerte Delta-Akkumulation.
 * - Performance: dpr-Cap 1.5, gl alpha, frameloop pausiert wenn document.hidden.
 */

const PARTICLE_COUNT = 420;
const SPREAD = 9; // Radius der Punktwolke in der XY-Ebene
const DEPTH = 6; // Streuung entlang Z
const GOLDEN_ANGLE = 2.399963229728653; // pi * (3 - sqrt(5))

// Akzentfarben aus dem Token-Set (Cyan / Violett). THREE.Color uebernimmt die
// sRGB->Linear-Konvertierung (three Color-Management seit r152 standardmaessig
// an), damit die Farben nicht ausgewaschen wirken.
const COLOR_CYAN = new THREE.Color("#22d3ee");
const COLOR_VIOLET = new THREE.Color("#8b5cf6");

function PointField() {
  const pointsRef = useRef<THREE.Points>(null);
  // Normalisierte Mausposition (-1..1), via window-Listener gefuettert, weil
  // pointer-events-none R3Fs eigenes state.pointer tot legt.
  const pointer = useRef({ x: 0, y: 0 });
  const rotation = useRef(0);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Goldener-Winkel-Spirale (Sonnenblumen-Verteilung) - gleichmaessig,
      // deterministisch, ohne Zufall.
      const t = i / PARTICLE_COUNT;
      const radius = SPREAD * Math.sqrt(t);
      const theta = i * GOLDEN_ANGLE;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      // Z aus Index gestreut (deterministischer Pseudo-Versatz via Trig).
      const z = (Math.sin(i * 1.37) * 0.5 + Math.cos(i * 0.91) * 0.5) * DEPTH;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const c = i % 2 === 0 ? COLOR_CYAN : COLOR_VIOLET;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geom, material: mat };
  }, []);

  // Ressourcen beim Unmount freigeben.
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Maus-Parallax: window-weiter Listener (passive), schreibt in Ref.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const p = pointsRef.current;
    if (!p) return;
    // Geklammerte Delta gegen Spruenge nach frameloop-Pause / langen Frames.
    const dt = Math.min(delta, 0.05);

    // Langsame Eigenrotation um Z (driftendes Feld).
    rotation.current += dt * 0.04;
    p.rotation.z = rotation.current;

    // Gedaempfte Neigung zur Maus (Parallax).
    const targetX = pointer.current.y * 0.18;
    const targetY = pointer.current.x * 0.18;
    p.rotation.x += (targetX - p.rotation.x) * dt * 2.2;
    p.rotation.y += (targetY - p.rotation.y) * dt * 2.2;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}

export default function HeroBackdrop() {
  const [enabled, setEnabled] = useState(false);
  // frameloop pausiert bei verstecktem Tab (Visibility-API).
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    // Gate erst clientseitig auswerten (kein SSR-Read).
    const smallViewport = window.matchMedia("(max-width: 767px)").matches;
    if (prefersReducedMotion() || smallViewport) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    setFrameloop(document.hidden ? "never" : "always");
    function onVisibility() {
      setFrameloop(document.hidden ? "never" : "always");
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!enabled) return null;

  // Positionierung auf dem Wrapper: R3F setzt am Canvas-Container inline
  // `position: relative` (schlaegt die Tailwind-.absolute-Klasse). Der Wrapper
  // traegt absolute/inset-0/-z-10, das relative Canvas-Div fuellt ihn aus.
  // Spiegelt das Muster von AuroraBackdrop.
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={frameloop}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 12], fov: 60 }}
      >
        <PointField />
      </Canvas>
    </div>
  );
}
