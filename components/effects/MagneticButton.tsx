"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

/**
 * Magnetic Button: zieht sich beim Hover sanft zum Cursor (max ~8px),
 * spring-released. Rendert als Link (href) oder Button (onClick).
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "filled",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "filled" | "ghost";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  function onEnter() {
    // Maße ändern sich beim Hover nicht — einmal cachen statt pro Frame messen.
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  }
  function onMove(e: React.MouseEvent) {
    const r = rectRef.current;
    if (!r) return;
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    x.set(Math.max(-8, Math.min(8, mx * 0.3)));
    y.set(Math.max(-8, Math.min(8, my * 0.3)));
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const styles =
    variant === "filled"
      ? "bg-accent text-bg hover:bg-accent-soft"
      : "border border-border text-text hover:border-border-glow hover:text-accent-soft";

  const inner = (
    <motion.div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors ${styles} ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {inner}
        </a>
      );
    }
    // Hash-Anker als plain <a>: ein Next-Link würde den Klick selbst
    // preventDefault-en und am Lenis-Anchor-Handler vorbeinavigieren.
    if (href.startsWith("#")) {
      return <a href={href}>{inner}</a>;
    }
    return <Link href={href}>{inner}</Link>;
  }
  return (
    <button type="button" onClick={onClick}>
      {inner}
    </button>
  );
}
