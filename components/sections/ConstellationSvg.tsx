"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clusters, clustersById, edges, nodes } from "@/content/knowledge";

/**
 * SVG der Knowledge-Constellation mit ZOOM: ein Klick auf einen Cluster-Stern
 * fährt per animiertem viewBox in dessen Region hinein und zeigt die
 * Unterkategorien (Satelliten) mit Labels. Klick auf den Hintergrund (oder den
 * „Übersicht"-Button im Parent) zoomt wieder heraus.
 * Sternenfeld + Positionen sind deterministisch (kein Zufall → SSR-stabil).
 */

const STAR_COUNT = 140;
type Star = { x: number; y: number; r: number; o: number };
const STARS: Star[] = Array.from({ length: STAR_COUNT }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233 + 1.7) * 24634.6345;
  const fx = a - Math.floor(a);
  const fy = b - Math.floor(b);
  const fr = (Math.sin(i * 4.531 + 0.3) + 1) / 2;
  return {
    x: +(fx * 100).toFixed(3),
    y: +(fy * 100).toFixed(3),
    r: +(0.12 + fr * 0.22).toFixed(3),
    o: +(0.1 + fr * 0.35).toFixed(3),
  };
});

const CLUSTER_R = 1.9;
const SAT_R = 1.0;
const ZOOM_W = 44; // Fenstergröße im Fokus (kleiner = stärker gezoomt)

type VB = [number, number, number, number];
const OVERVIEW: VB = [0, 0, 100, 100];

function focusViewBox(cx: number, cy: number): VB {
  const w = ZOOM_W;
  const x = Math.max(0, Math.min(100 - w, cx - w / 2));
  const y = Math.max(0, Math.min(100 - w, cy - w / 2));
  return [x, y, w, w];
}

export type ConstellationSvgProps = {
  activeId: string | null;
  litClusters: Set<string>;
  focusedClusterId: string | null;
  onActivate: (id: string | null) => void;
  onSelect: (id: string) => void;
  onFocusCluster: (id: string | null) => void;
};

export default function ConstellationSvg({
  activeId,
  litClusters,
  focusedClusterId,
  onActivate,
  onSelect,
  onFocusCluster,
}: ConstellationSvgProps) {
  const activeNode = activeId
    ? nodes.find((n) => n.id === activeId) ?? null
    : null;
  const activeClusterId = activeNode?.clusterId ?? null;

  const spokes = useMemo(
    () =>
      nodes.map((n) => {
        const c = clustersById.get(n.clusterId);
        return c ? { id: n.id, x1: n.x, y1: n.y, x2: c.x, y2: c.y } : null;
      }),
    []
  );

  // ── viewBox-Animation (rAF) ────────────────────────────────────────────
  const focusCluster = focusedClusterId
    ? clustersById.get(focusedClusterId)
    : null;
  const target: VB = focusCluster
    ? focusViewBox(focusCluster.x, focusCluster.y)
    : OVERVIEW;
  const [vb, setVb] = useState<VB>(OVERVIEW);
  const cur = useRef<VB>(OVERVIEW);
  const raf = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const from = cur.current;
    const start = performance.now();
    const dur = 600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      const next: VB = [
        from[0] + (target[0] - from[0]) * e,
        from[1] + (target[1] - from[1]) * e,
        from[2] + (target[2] - from[2]) * e,
        from[3] + (target[3] - from[3]) * e,
      ];
      cur.current = next;
      setVb(next);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target[0], target[1], target[2], target[3]]);

  const zoomed = focusedClusterId !== null;

  return (
    <svg
      viewBox={vb.join(" ")}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      role="group"
      aria-label="Interaktive Wissens-Konstellation — Cluster anklicken zum Hineinzoomen"
    >
      <defs>
        <radialGradient id="kc-star-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent-soft)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </radialGradient>
      </defs>

      {/* Hintergrund-Klickfläche: zoomt heraus */}
      <rect
        x={0}
        y={0}
        width={100}
        height={100}
        fill="transparent"
        onClick={() => onFocusCluster(null)}
      />

      {/* Sternenfeld */}
      <g aria-hidden="true">
        {STARS.map((s, i) => (
          <circle
            key={`star-${i}`}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="var(--color-text-faint)"
            opacity={s.o}
          />
        ))}
      </g>

      {/* Cluster-Kanten */}
      <g aria-hidden="true">
        {edges.map((e, i) => {
          const a = clustersById.get(e.from);
          const b = clustersById.get(e.to);
          if (!a || !b) return null;
          const active =
            activeClusterId != null &&
            (e.from === activeClusterId || e.to === activeClusterId);
          const rel =
            zoomed && (e.from === focusedClusterId || e.to === focusedClusterId);
          return (
            <line
              key={`edge-${e.from}-${e.to}-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={
                active || rel
                  ? "var(--color-accent)"
                  : "var(--color-border-glow)"
              }
              strokeWidth={active || rel ? 0.4 : 0.2}
              opacity={zoomed && !rel ? 0.12 : active || rel ? 0.85 : 0.4}
              vectorEffect="non-scaling-stroke"
              style={{ transition: "stroke 0.3s ease, opacity 0.3s ease" }}
            />
          );
        })}
      </g>

      {/* Satellit → Cluster-Speichen */}
      <g aria-hidden="true">
        {spokes.map((s) => {
          if (!s) return null;
          const node = nodes.find((n) => n.id === s.id)!;
          const active = s.id === activeId;
          const inFocus = zoomed && node.clusterId === focusedClusterId;
          return (
            <line
              key={`spoke-${s.id}`}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke={
                active || inFocus
                  ? "var(--color-accent-soft)"
                  : "var(--color-border)"
              }
              strokeWidth={active ? 0.3 : 0.15}
              opacity={zoomed && !inFocus ? 0.08 : active || inFocus ? 0.6 : 0.28}
              vectorEffect="non-scaling-stroke"
              style={{ transition: "stroke 0.3s ease, opacity 0.3s ease" }}
            />
          );
        })}
      </g>

      {/* Cluster-Sterne (klickbar → Zoom) */}
      <g>
        {clusters.map((c) => {
          const lit = litClusters.has(c.id);
          const isFocused = c.id === focusedClusterId;
          const dim = zoomed ? !isFocused : activeClusterId != null && activeClusterId !== c.id;
          const labelRight = c.x > 70;
          return (
            <g
              key={c.id}
              tabIndex={0}
              role="button"
              aria-label={`Cluster ${c.label}${isFocused ? " (geöffnet)" : " — hineinzoomen"}`}
              onClick={() => onFocusCluster(isFocused ? null : c.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onFocusCluster(isFocused ? null : c.id);
                }
              }}
              className="cursor-pointer outline-none"
              style={{
                opacity: lit ? (dim ? 0.35 : 1) : 0,
                transition:
                  "opacity 0.6s var(--ease-out-quint), transform 0.6s var(--ease-out-quint)",
              }}
            >
              <circle
                cx={c.x}
                cy={c.y}
                r={CLUSTER_R * 3.2}
                fill="var(--color-accent)"
                opacity={lit ? (isFocused ? 0.18 : 0.1) : 0}
                style={{ transition: "opacity 0.5s ease" }}
              />
              <circle
                cx={c.x}
                cy={c.y}
                r={CLUSTER_R}
                fill="url(#kc-star-core)"
                stroke="var(--color-accent-soft)"
                strokeWidth={0.2}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={labelRight ? c.x - CLUSTER_R - 1.2 : c.x + CLUSTER_R + 1.2}
                y={c.y + 1}
                textAnchor={labelRight ? "end" : "start"}
                className="fill-[var(--color-text)] font-display"
                style={{ fontSize: 3, fontWeight: 600, letterSpacing: "0.02em" }}
              >
                {c.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Satelliten (Unterkategorien) */}
      <g>
        {nodes.map((n) => {
          const lit = litClusters.has(n.clusterId);
          const isActive = n.id === activeId;
          const inFocus = zoomed && n.clusterId === focusedClusterId;
          const hiddenByZoom = zoomed && !inFocus;
          const showLabel = isActive || inFocus;
          return (
            <g
              key={n.id}
              tabIndex={hiddenByZoom ? -1 : 0}
              role="button"
              aria-label={`${n.label} — ${n.desc}`}
              onMouseEnter={() => onActivate(n.id)}
              onMouseLeave={() => onActivate(null)}
              onFocus={() => onActivate(n.id)}
              onBlur={() => onActivate(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(n.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(n.id);
                }
              }}
              className="cursor-pointer outline-none [&:focus-visible_circle.kc-hit]:stroke-[var(--color-accent)]"
              style={{
                opacity: lit ? (hiddenByZoom ? 0.1 : 1) : 0,
                pointerEvents: hiddenByZoom ? "none" : "auto",
                transition: "opacity 0.5s var(--ease-out-quint)",
              }}
            >
              <circle
                className="kc-hit"
                cx={n.x}
                cy={n.y}
                r={SAT_R * 3}
                fill="transparent"
                stroke="transparent"
                strokeWidth={0.3}
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={SAT_R * 2.4}
                fill="var(--color-accent)"
                opacity={isActive ? 0.16 : 0}
                style={{ transition: "opacity 0.3s ease" }}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={isActive ? SAT_R * 1.25 : SAT_R}
                fill={isActive ? "var(--color-accent-soft)" : "var(--color-accent)"}
                opacity={isActive ? 1 : 0.78}
                style={{ transition: "r 0.25s ease, fill 0.25s ease" }}
              />
              {showLabel && (
                <text
                  x={n.x}
                  y={n.y - SAT_R - 1.4}
                  textAnchor="middle"
                  className="fill-[var(--color-text)] font-sans"
                  style={{ fontSize: 2.1, fontWeight: 600 }}
                >
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
