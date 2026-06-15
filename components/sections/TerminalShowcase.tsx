"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { prefersReducedMotion } from "@/lib/animation/gsap";
import { terminalTabs } from "@/content/setup";
import type { TerminalLine } from "@/content/setup";

/**
 * Stilisiertes Terminal-Fenster mit Tabs, das echte Abläufe per Typewriter
 * nachspielt. Ein einziger rAF-Loop zählt die Gesamtzahl getippter Zeichen
 * (deterministisch via performance.now()), Render leitet daraus die sichtbaren
 * Zeilen ab. Bei prefers-reduced-motion: alles sofort vollständig.
 */

const MS_PER_CHAR = 22;
/** Phantom-Zeichen pro Zeilenumbruch = kurze Pause zwischen den Zeilen. */
const LINE_PAUSE_CHARS = 10;

const KIND_CLASS: Record<TerminalLine["kind"], string> = {
  prompt: "text-accent",
  comment: "text-text-faint",
  out: "text-text-muted",
  ok: "text-success",
};

/** Effektive Tipp-Länge einer Zeile inkl. Zeilenpause. */
function lineCost(line: TerminalLine): number {
  return line.text.length + LINE_PAUSE_CHARS;
}

function totalCost(lines: TerminalLine[]): number {
  return lines.reduce((sum, l) => sum + lineCost(l), 0);
}

/** Blinkender Block-Cursor (CSS-Utility animate-blink aus globals.css). */
function Cursor() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-[1.05em] w-[0.55ch] animate-blink bg-accent align-text-bottom"
    />
  );
}

export default function TerminalShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [replayNonce, setReplayNonce] = useState(0);
  const [revealed, setRevealed] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-80px" });

  const tab = terminalTabs[activeIndex] ?? terminalTabs[0];
  const lines = tab.lines;
  const total = totalCost(lines);

  useEffect(() => {
    // Bei jedem (Re-)Start von vorn.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Animations-Reset bei (Re-)Start (in-view-gesteuert)
    setRevealed(0);
    if (!inView) return;

    const activeLines = terminalTabs[activeIndex]?.lines ?? [];
    const target = totalCost(activeLines);

    // Reduced Motion: keine Animation, sofort vollständig.
    if (prefersReducedMotion()) {
      setRevealed(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const chars = Math.min(target, Math.floor((now - start) / MS_PER_CHAR));
      setRevealed(chars);
      if (chars < target) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, activeIndex, replayNonce]);

  const done = revealed >= total;

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-xl border border-border bg-surface-2 font-mono shadow-[0_18px_50px_-24px_var(--color-bg)]"
    >
      {/* Fenster-Chrome: Ampelpunkte + Titelzeile */}
      <div className="flex items-center gap-2 border-b border-border bg-bg/60 px-4 py-2.5">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-danger/60" />
          <span className="h-3 w-3 rounded-full bg-warn/60" />
          <span className="h-3 w-3 rounded-full bg-success/60" />
        </span>
        <span className="ml-2 truncate text-xs text-text-faint">
          christof@maschinenraum: ~/claude-code
        </span>
        <button
          type="button"
          onClick={() => setReplayNonce((n) => n + 1)}
          aria-label="Ablauf neu abspielen"
          title="Neu abspielen"
          className="ml-auto rounded-md px-2 py-1 text-text-faint transition-colors hover:bg-surface hover:text-accent"
        >
          <span aria-hidden className="text-sm">
            &#x21bb;
          </span>
        </button>
      </div>

      {/* Tab-Leiste */}
      <div className="flex flex-wrap gap-1 border-b border-border bg-surface/50 px-2 py-1.5">
        {terminalTabs.map((t, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-pressed={active}
              className={`rounded-md px-3 py-1 text-xs transition-colors ${
                active
                  ? "bg-accent/10 text-accent"
                  : "text-text-faint hover:bg-surface hover:text-text-muted"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Inhalt: getippte Zeilen */}
      <div className="min-h-[14rem] space-y-1 p-4 text-sm leading-relaxed sm:min-h-[15rem]">
        {(() => {
          // Sichtbare Zeilen + Zeichen-Anzahl pro Zeile vorab bestimmen.
          const visible: { line: TerminalLine; shownChars: number }[] = [];
          let consumed = 0;
          for (const line of lines) {
            const lineStart = consumed;
            consumed += lineCost(line);
            if (revealed <= lineStart) break; // noch nicht erreicht
            const shownChars = Math.min(
              line.text.length,
              revealed - lineStart,
            );
            visible.push({ line, shownChars });
          }

          // Cursor sitzt — solange getippt wird — am Ende der letzten
          // sichtbaren Zeile (auch während der Pause zwischen zwei Zeilen,
          // kein Flackern). Nach Abschluss eigene geparkte Zeile.
          const cursorIndex = !done ? visible.length - 1 : -1;

          return (
            <>
              {visible.map(({ line, shownChars }, i) => (
                <div
                  key={`${tab.id}-${i}`}
                  className={`whitespace-pre-wrap break-words ${KIND_CLASS[line.kind]}`}
                >
                  {line.kind === "prompt" && (
                    <span className="select-none">$ </span>
                  )}
                  {line.text.slice(0, shownChars)}
                  {i === cursorIndex && <Cursor />}
                </div>
              ))}

              {done && (
                <div key={`${tab.id}-cursor`} className="text-accent">
                  <span className="select-none">$ </span>
                  <Cursor />
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
