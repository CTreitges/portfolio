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

  useEffect(() => {
    // Regex MUSS im Effect leben: ein match()-Array in den Deps wäre bei
    // jedem Render ein neues Objekt → Effect-Loop, Animation startet endlos
    // neu und die Zahlen hängen flackernd bei 0 (Bug 2026-06-10).
    const numeric = value.match(/^([^\d]*)([\d.]+)(.*)$/);
    const target = numeric ? parseInt(numeric[2].replace(/\./g, ""), 10) : NaN;

    // Kein Hochzählen möglich/gewünscht → einfach den Endwert zeigen.
    if (!inView || !numeric || Number.isNaN(target) || reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Endwert ohne Animation; Teil der Animations-Steuerung
      setDisplay(value);
      return;
    }

    const prefix = numeric[1];
    const suffix = numeric[3];
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(target * eased);
      // Am Ende exakt den Originalwert setzen (Formatierung bleibt identisch).
      setDisplay(
        t < 1 ? `${prefix}${cur.toLocaleString("de-DE")}${suffix}` : value
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs, reduced]);

  return <span ref={ref}>{display}</span>;
}
