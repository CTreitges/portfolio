"use client";

import { useRef, type ReactNode } from "react";

/**
 * Karte mit Spotlight-Border: ein radialer Glow folgt der Maus entlang der
 * Border (CSS-Variablen --mx/--my). Reine CSS-Animation, kein JS-Loop.
 */
export default function SpotlightCard({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "a";
}) {
  const ref = useRef<HTMLElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const Tag = as as "div";

  function onEnter() {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  }
  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    const r = rectRef.current;
    if (!el || !r) return;
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      className={`spotlight-card ${className}`}
    >
      {children}
    </Tag>
  );
}
