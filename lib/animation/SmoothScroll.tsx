"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { ScrollTrigger, registerGsap } from "./gsap";
import { useReducedMotionMounted } from "./useReducedMotionMounted";

/**
 * Lenis-Smooth-Scroll als Root-Wrapper, synchronisiert mit GSAP ScrollTrigger.
 * Bei prefers-reduced-motion bleibt natives Scrollen aktiv (kein Lenis-Smoothing).
 */
function LenisGsapBridge() {
  const lenis = useLenis();
  useEffect(() => {
    registerGsap();
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);
  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hydration-sicher: erster Render IMMER mit Lenis (== Server), erst nach Mount
  // bei reduced-motion auf natives Scrollen zurückfallen.
  const reduced = useReducedMotionMounted();

  if (reduced) return <>{children}</>;

  return (
    // anchors:true ist PFLICHT: ohne sie blockiert Lenis native Anker-Sprünge
    // (#projekte etc.) — Hero-CTAs und Header-Nav wären tot (Bug 2026-06-11).
    <ReactLenis root options={{ lerp: 0.12, smoothWheel: true, anchors: true }}>
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
