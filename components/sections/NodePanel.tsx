"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { KnowledgeCluster, KnowledgeNode } from "@/content/types";

/**
 * Glas-Panel der Konstellation. Zeigt den aktiven Satelliten: Cluster-Label,
 * Name, Beschreibung und (falls vorhanden) den Beweis-Link.
 * Bewusst NICHT am Knoten verankert, sondern als festes Glas-Card im SVG-Rahmen
 * (rechts unten) — entkoppelt vom viewBox-Mapping, robust gegen Letterboxing.
 * Interne Links (/...) via next/link, Anker (#...) als <a>.
 */
export default function NodePanel({
  node,
  cluster,
  onClose,
}: {
  node: KnowledgeNode | null;
  cluster?: KnowledgeCluster;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label={`Details zu ${node.label}`}
          className="glass pointer-events-auto absolute bottom-4 right-4 z-10 w-[min(20rem,calc(100%-2rem))] rounded-2xl border border-border-glow p-5 shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Panel schliessen"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-faint transition-colors hover:border-border-glow hover:text-text"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>

          {cluster && (
            <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
              {cluster.label}
            </p>
          )}

          <h3 className="mt-2 pr-6 font-display text-lg font-semibold text-text">
            {node.label}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            {node.desc}
          </p>

          {node.proof &&
            (node.proof.href?.startsWith("/") ? (
              <Link
                href={node.proof.href}
                className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-accent transition-colors hover:text-accent-soft"
              >
                <span aria-hidden="true">&rarr;</span> {node.proof.text}
              </Link>
            ) : (
              <a
                href={node.proof.href ?? "#setup"}
                className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-accent transition-colors hover:text-accent-soft"
              >
                <span aria-hidden="true">&rarr;</span> {node.proof.text}
              </a>
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
