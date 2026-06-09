"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { clusters, clustersById, nodes } from "@/content/knowledge";
import { prefersReducedMotion } from "@/lib/animation/gsap";
import ConstellationSvg from "./ConstellationSvg";
import NodePanel from "./NodePanel";

/**
 * Interaktive Desktop-Konstellation (wird vom Aufrufer nur ab md+ gerendert).
 * Orchestriert: Hover/Fokus-State, dauerhaft geoeffnetes Panel (Klick/Enter/Space),
 * und das „Zuenden" der Cluster nacheinander beim Scroll-in-View.
 *
 * SSR-/Hydration-Sicherheit: Der erste (Server- wie Client-)Render zeigt ALLE
 * Cluster sichtbar — identisch zum reduced-motion-Ersatzzustand. Erst NACH dem
 * Mount (useEffect) wird, falls Motion erlaubt, auf „dunkel" zurueckgesetzt und
 * beim In-View gestaffelt eingezuendet. Dadurch kein Server/Client-Mismatch.
 */

const ALL_CLUSTER_IDS = clusters.map((c) => c.id);
const STAGGER_MS = 180;

export default function KnowledgeConstellation() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-120px" });

  // Start: alle gezuendet (== Server-Render == reduced-motion-Fallback).
  const [lit, setLit] = useState<Set<string>>(
    () => new Set(ALL_CLUSTER_IDS),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedCluster, setFocusedCluster] = useState<string | null>(null);

  const focusCluster = useCallback((id: string | null) => {
    setFocusedCluster(id);
    setSelectedId(null);
  }, []);

  // Nach dem Mount entscheiden, ob animiert wird. Vor In-View: dunkel.
  const animateRef = useRef(false);
  useEffect(() => {
    if (prefersReducedMotion()) {
      animateRef.current = false;
      setLit(new Set(ALL_CLUSTER_IDS));
      return;
    }
    animateRef.current = true;
    setLit(new Set()); // dunkel, bis In-View
  }, []);

  // Stagger-Zuendung sobald in View (nur wenn animiert).
  useEffect(() => {
    if (!inView || !animateRef.current) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    ALL_CLUSTER_IDS.forEach((id, i) => {
      timers.push(
        setTimeout(() => {
          setLit((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
          });
        }, i * STAGGER_MS),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  // Panel-Steuerung. Klick auf bereits aktiven Knoten schliesst (Toggle).
  const handleSelect = useCallback((id: string) => {
    setSelectedId((cur) => (cur === id ? null : id));
  }, []);
  const closePanel = useCallback(() => setSelectedId(null), []);

  // Escape schliesst das Panel.
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  // Panel zeigt: ausgewaehlter Knoten hat Vorrang vor gehovertem.
  const panelId = selectedId ?? activeId;
  const panelNode = panelId
    ? nodes.find((n) => n.id === panelId) ?? null
    : null;
  const panelCluster = panelNode
    ? clustersById.get(panelNode.clusterId)
    : undefined;

  // Hervorhebung folgt ebenfalls „selected vor hovered".
  const highlightId = selectedId ?? activeId;

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface/40">
        {/* dezenter Aurora-Schimmer hinter den Sternen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
        >
          <div className="aurora absolute inset-0" />
        </div>

        <ConstellationSvg
          activeId={highlightId}
          litClusters={lit}
          focusedClusterId={focusedCluster}
          onActivate={setActiveId}
          onSelect={handleSelect}
          onFocusCluster={focusCluster}
        />

        <NodePanel
          node={panelNode}
          cluster={panelCluster}
          onClose={closePanel}
        />

        {/* Bedien-Hinweis */}
        <p className="pointer-events-none absolute left-4 top-4 max-w-[15rem] font-mono text-[0.7rem] leading-relaxed text-text-faint">
          {focusedCluster
            ? "Sternpunkt anklicken für Details · Hintergrund für Übersicht."
            : "Cluster anklicken zum Hineinzoomen · Sternpunkt für Details."}
        </p>

        {/* Übersicht-Button (nur im Zoom) */}
        {focusedCluster && (
          <button
            type="button"
            onClick={() => focusCluster(null)}
            className="absolute right-4 top-4 rounded-full border border-border bg-surface/80 px-3 py-1.5 font-mono text-xs text-text-muted backdrop-blur transition-colors hover:border-border-glow hover:text-accent"
          >
            ← Übersicht
          </button>
        )}
      </div>
    </div>
  );
}
