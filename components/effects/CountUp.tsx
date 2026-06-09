"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotionMounted } from "@/lib/animation/useReducedMotionMounted";

/**
 * Zählt eine Zahl beim Sichtbarwerden hoch. Nicht-numerische Werte (z.B.
 * "16.000+", "deklarativ", "Qwen3-VL") werden unverändert angezeigt.
 */
export default function CountUp({
  value,
  durationMs = 1200,
}: {
  value: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotionMounted();
  const [display, setDisplay] = useState(value);

  // Zahl + optionale Suffix/Präfix-Reste extrahieren ("16.000+" → 16000, "+").
  const numeric = value.match(/^([^\d]*)([\d.]+)(.*)$/);

  useEffect(() => {
    if (!inView || !numeric) {
      if (!numeric) setDisplay(value);
      return;
    }
    // reduced-motion: kein Hochzählen, sofort der Endwert.
    if (reduced) {
      setDisplay(value);
      return;
    }
    const prefix = numeric[1];
    const target = parseInt(numeric[2].replace(/\./g, ""), 10);
    const suffix = numeric[3];
    if (Number.isNaN(target)) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(target * eased);
      setDisplay(`${prefix}${cur.toLocaleString("de-DE")}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, numeric, durationMs, reduced]);

  return <span ref={ref}>{display}</span>;
}
