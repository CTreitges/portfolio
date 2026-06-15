"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener?.("change", callback);
  return () => mq.removeEventListener?.("change", callback);
}

/**
 * Liefert prefers-reduced-motion — HYDRATION-SICHER über useSyncExternalStore:
 * Der Server-Snapshot ist immer `false`, sodass der erste Client-Render dem
 * Server-Render entspricht (kein Mismatch). Nach der Hydration liefert der
 * Client-Snapshot den echten matchMedia-Wert und reagiert auf Änderungen.
 */
export function useReducedMotionMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
