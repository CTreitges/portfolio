"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { studiumBackHref } from "@/lib/studium-back";

/**
 * Zurück-Link der Studienleistungen-Seite. Führt zu dem Abschnitt zurück, von
 * dessen Button aus die Seite geöffnet wurde (?from=about|werdegang) — Default
 * Werdegang. next/link versieht den Pfad automatisch mit dem basePath.
 */
export default function StudiumBackLink() {
  const href = studiumBackHref(useSearchParams().get("from"));
  return (
    <Link
      href={href}
      className="font-mono text-sm text-text-muted hover:text-accent"
    >
      ← Zurück zum Portfolio
    </Link>
  );
}
