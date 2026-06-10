"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotionMounted } from "@/lib/animation/useReducedMotionMounted";

/**
 * Dezente Lese-Fortschritts-Linie am oberen Rand (2px, Accent→Glow).
 * Hydration-sicher: Server und erster Client-Render zeigen scaleX(0);
 * bei prefers-reduced-motion verschwindet sie nach dem Mount.
 */
export default function ScrollProgress() {
  const reduced = useReducedMotionMounted();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-accent to-glow"
      style={{ scaleX }}
    />
  );
}
