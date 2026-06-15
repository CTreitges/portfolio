"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Gebrandete Fehler-Boundary für Laufzeitfehler (Next 16: Prop heißt
 * `unstable_retry`, nicht mehr `reset`). Die Startseite ist eine Client-Insel
 * (R3F, Clipboard, Motion) — ohne diese Datei landete ein unbehandelter Fehler
 * auf Next.js' ungestyltem Default-Screen. Stil gespiegelt von not-found.tsx.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Im Prod-Standalone landet das in den systemd-Journal-Logs.
    console.error(error);
  }, [error]);

  return (
    <main id="main" tabIndex={-1} className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="aurora pointer-events-none absolute inset-0 opacity-60"
      />
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">
        {"// Fehler"}
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
        Da ist etwas schiefgelaufen
      </h1>
      <p className="mt-4 max-w-md text-text-muted">
        Ein unerwarteter Fehler ist aufgetreten — das liegt nicht an dir. Du
        kannst es gleich noch einmal versuchen.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent-soft"
        >
          Erneut versuchen
        </button>
        <Link
          href="/"
          className="rounded-full border border-border px-6 py-3 text-sm font-medium text-text-muted transition hover:text-text"
        >
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
