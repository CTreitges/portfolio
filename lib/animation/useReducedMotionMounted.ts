"use client";

import { useEffect, useState } from "react";

/**
 * Liefert prefers-reduced-motion — aber HYDRATION-SICHER: der erste Render
 * (Server wie Client) gibt immer `false` zurück, erst nach dem Mount wird der
 * echte Wert gesetzt. So entspricht der erste Client-Render dem Server-Render
 * (kein Mismatch), und Animationen werden erst danach abgeschaltet.
 */
export function useReducedMotionMounted(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}
