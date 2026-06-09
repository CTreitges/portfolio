"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SpotlightCard from "@/components/effects/SpotlightCard";
import { clusters, nodes } from "@/content/knowledge";

/**
 * Kategorie-Explorer (Master-Detail) — klar und scanbar:
 * links die 8 Kategorien, rechts die Unterkategorien der gewählten Kategorie
 * mit Beschreibung und Beweis-Link. Ersetzt die frühere Konstellation
 * (zu unübersichtlich). Mobil: Kategorien als scrollbare Pills oben, Detail darunter.
 */
function ProofLink({ href, text }: { href: string; text: string }) {
  const cls =
    "mt-2 inline-block font-mono text-xs text-accent transition-colors hover:text-accent-soft";
  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      → {text}
    </Link>
  ) : (
    <a href={href} className={cls}>
      → {text}
    </a>
  );
}

export default function KnowledgeExplorer() {
  const [active, setActive] = useState(clusters[0].id);
  const cluster = clusters.find((c) => c.id === active) ?? clusters[0];
  const sats = nodes.filter((n) => n.clusterId === active);

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,17rem)_1fr]">
      {/* Kategorien */}
      <div
        aria-label="KI-Wissens-Kategorien"
        className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0"
      >
        {clusters.map((c) => {
          const sel = c.id === active;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={sel}
              onClick={() => setActive(c.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition-colors md:w-full ${
                sel
                  ? "border-accent/50 bg-accent/10 text-text"
                  : "border-border bg-surface text-text-muted hover:border-border-glow hover:text-text"
              }`}
            >
              <span
                aria-hidden
                className={`h-2 w-2 shrink-0 rounded-full transition-shadow ${
                  sel
                    ? "bg-accent shadow-[0_0_10px_var(--color-accent)]"
                    : "bg-text-faint"
                }`}
              />
              <span className="whitespace-nowrap md:whitespace-normal">
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail der gewählten Kategorie */}
      <SpotlightCard className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={cluster.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-text">
              <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
              {cluster.label}
            </h3>
            {cluster.blurb && (
              <p className="mt-1.5 text-sm text-text-muted">{cluster.blurb}</p>
            )}

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {sats.map((n) => (
                <li
                  key={n.id}
                  className="rounded-xl border border-border bg-bg/40 p-4"
                >
                  <p className="text-sm font-medium text-text">{n.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-faint">
                    {n.desc}
                  </p>
                  {n.proof && (
                    <ProofLink
                      href={n.proof.href ?? "#setup"}
                      text={n.proof.text}
                    />
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </SpotlightCard>
    </div>
  );
}
