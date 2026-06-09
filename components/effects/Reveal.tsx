"use client";

import { motion } from "motion/react";
import { createElement, type ReactNode } from "react";
import { useReducedMotionMounted } from "@/lib/animation/useReducedMotionMounted";

/**
 * Einmaliger whileInView-Reveal (kein Re-Trigger).
 * Bei reduced-motion: schlichtes, sofort sichtbares Element OHNE Motion-Gating
 * (kein opacity:0-Hängenbleiben). Ohne reduced-motion: Fade/Slide beim Scrollen.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduced = useReducedMotionMounted();

  if (reduced) {
    // Statisch sichtbar — garantiert kein verstecktes opacity:0.
    return createElement(as, { className }, children);
  }

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
