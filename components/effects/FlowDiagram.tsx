"use client";

import { useMemo } from "react";
import type { FlowSpec } from "@/content/types";
import { useReducedMotionMounted } from "@/lib/animation/useReducedMotionMounted";

/**
 * Wiederverwendbares Architektur-Diagramm aus einer FlowSpec.
 * Lane = Spalte (Datenfluss von links nach rechts). Kanten als Bézier-Pfade,
 * animierte Datenpakete via SVG animateMotion (bei reduced-motion aus).
 * Genutzt von Case-Studies, Setup und Lab — ein Vokabular für alle.
 */

const LANE_W = 200;
const ROW_H = 96;
const BOX_W = 158;
const BOX_H = 62;
const PAD = 24;

const accentColor: Record<string, string> = {
  cyan: "var(--color-accent)",
  violet: "var(--color-glow)",
  muted: "var(--color-text-faint)",
};

export default function FlowDiagram({
  spec,
  label = "Architektur-Diagramm",
}: {
  spec: FlowSpec;
  label?: string;
}) {
  const reduced = useReducedMotionMounted();

  const { positions, width, height } = useMemo(() => {
    const lanes = new Map<number, string[]>();
    for (const n of spec.nodes) {
      const arr = lanes.get(n.lane) ?? [];
      arr.push(n.id);
      lanes.set(n.lane, arr);
    }
    const laneIdx = [...lanes.keys()].sort((a, b) => a - b);
    const maxRows = Math.max(...[...lanes.values()].map((a) => a.length));
    const h = maxRows * ROW_H + PAD * 2;
    const w = laneIdx.length * LANE_W + PAD * 2;
    const pos = new Map<string, { x: number; y: number }>();
    laneIdx.forEach((lane, li) => {
      const ids = lanes.get(lane)!;
      ids.forEach((id, ri) => {
        const x = PAD + li * LANE_W + (LANE_W - BOX_W) / 2;
        const laneH = ids.length * ROW_H;
        const y =
          PAD + (h - PAD * 2 - laneH) / 2 + ri * ROW_H + (ROW_H - BOX_H) / 2;
        pos.set(id, { x, y });
      });
    });
    return { positions: pos, width: w, height: h };
  }, [spec]);

  function edgePath(fromId: string, toId: string) {
    const a = positions.get(fromId);
    const b = positions.get(toId);
    if (!a || !b) return "";
    const x1 = a.x + BOX_W;
    const y1 = a.y + BOX_H / 2;
    const x2 = b.x;
    const y2 = b.y + BOX_H / 2;
    // Rücklauf-Kanten (rechts → links) eleganter biegen:
    if (x2 <= x1) {
      const midY = Math.min(y1, y2) - 46;
      return `M ${x1} ${y1} C ${x1 + 60} ${midY}, ${x2 - 60} ${midY}, ${x2} ${y2}`;
    }
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <desc>
        {`Stationen: ${spec.nodes
          .slice()
          .sort((a, b) => a.lane - b.lane)
          .map((n) => n.label)
          .join(" · ")}.`}
      </desc>
      <defs>
        <marker
          id="fd-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-border-glow)" />
        </marker>
      </defs>

      {/* Kanten */}
      {spec.edges.map((e, i) => {
        const d = edgePath(e.from, e.to);
        if (!d) return null;
        const id = `fd-${e.from}-${e.to}-${i}`;
        return (
          <g key={id}>
            <path
              id={id}
              d={d}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={1.5}
              markerEnd="url(#fd-arrow)"
            />
            {e.label && (
              <text
                className="fill-[var(--color-text-faint)] font-mono"
                style={{ fontSize: 11 }}
                dy={-6}
              >
                <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
                  {e.label}
                </textPath>
              </text>
            )}
            {e.animated && !reduced && (
              <circle r={3.5} fill="var(--color-accent)">
                <animateMotion dur="2.4s" repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}

      {/* Knoten */}
      {spec.nodes.map((n) => {
        const p = positions.get(n.id);
        if (!p) return null;
        const stroke = n.accent
          ? accentColor[n.accent]
          : "var(--color-border)";
        return (
          <g key={n.id}>
            <rect
              x={p.x}
              y={p.y}
              width={BOX_W}
              height={BOX_H}
              rx={10}
              fill="var(--color-surface)"
              stroke={stroke}
              strokeWidth={n.accent ? 1.5 : 1}
            />
            <text
              x={p.x + BOX_W / 2}
              y={p.y + (n.sub ? 26 : BOX_H / 2 + 4)}
              textAnchor="middle"
              className="fill-[var(--color-text)] font-sans"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              {n.label}
            </text>
            {n.sub && (
              <text
                x={p.x + BOX_W / 2}
                y={p.y + 43}
                textAnchor="middle"
                className="fill-[var(--color-text-faint)] font-mono"
                style={{ fontSize: 10 }}
              >
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
