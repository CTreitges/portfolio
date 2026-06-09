"use client";

import Link from "next/link";
import { useState } from "react";
import type { ResearchDoc } from "@/content/types";

/**
 * Vollbild-Viewer für ein research-pitch-HTML-Dokument.
 * Das Dokument liegt unter /research-docs/<file> (auth-geschützt durch proxy.ts)
 * und wird in einem sandboxed iframe geladen. allow-same-origin ist nötig, damit
 * der same-origin-Request die Session-Cookie mitschickt (sonst blockt das Gate);
 * die Dokumente sind eigene, vertrauenswürdige Single-File-HTMLs.
 * Mobil: Hinweis + Click-to-Load (die Dokumente sind groß und desktop-optimiert).
 */
export default function ResearchViewer({ doc }: { doc: ResearchDoc }) {
  const [loadMobile, setLoadMobile] = useState(false);
  const src = `/research-docs/${doc.file}`;

  return (
    <div className="flex h-dvh flex-col bg-bg">
      {/* Top-Bar */}
      <div className="flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-2.5 backdrop-blur">
        <Link
          href="/#research"
          className="font-mono text-sm text-text-muted transition-colors hover:text-accent"
        >
          ← Zurück
        </Link>
        <span className="truncate font-display text-sm font-semibold text-text">
          {doc.title}
        </span>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="ml-auto font-mono text-xs text-text-muted transition-colors hover:text-accent"
        >
          In neuem Tab ↗
        </a>
      </div>

      {/* Desktop: iframe direkt */}
      <iframe
        src={src}
        title={doc.title}
        sandbox="allow-scripts allow-same-origin allow-popups"
        className="hidden flex-1 md:block"
      />

      {/* Mobil: Click-to-Load (große, desktop-optimierte Dokumente) */}
      <div className="flex flex-1 flex-col md:hidden">
        {loadMobile ? (
          <iframe
            src={src}
            title={doc.title}
            sandbox="allow-scripts allow-same-origin allow-popups"
            className="flex-1"
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm leading-relaxed text-text-muted">
              Dieses Dokument ist für große Bildschirme optimiert
              {doc.sizeKB ? ` (~${doc.sizeKB} KB)` : ""}.
            </p>
            <button
              type="button"
              onClick={() => setLoadMobile(true)}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg"
            >
              Trotzdem laden
            </button>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-accent-soft"
            >
              oder in neuem Tab öffnen ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
