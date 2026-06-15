import Link from "next/link";
import { site } from "@/content/site";

/**
 * Schlichter, gut lesbarer Rahmen für die öffentlichen Rechtstexte
 * (Impressum/Datenschutz). Bewusst ohne die schweren Hero-Effekte — diese
 * Seiten sind vor dem Auth-Gate erreichbar und sollen nüchtern wirken.
 */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main" tabIndex={-1} className="mx-auto min-h-dvh max-w-2xl px-5 py-16">
      <Link
        href="/"
        className="font-mono text-xs text-text-faint transition-colors hover:text-accent-soft"
      >
        ← Zurück zum Portfolio
      </Link>
      <h1 className="mt-6 font-display text-3xl font-bold text-text">{title}</h1>
      {updated ? (
        <p className="mt-2 text-xs text-text-faint">Stand: {updated}</p>
      ) : null}
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-text-muted">
        {children}
      </div>
      <p className="mt-12 border-t border-border pt-6 font-mono text-xs text-text-faint">
        {site.name} · {site.contact.email}
      </p>
    </main>
  );
}

/** Abschnitt mit Überschrift innerhalb einer Rechtstext-Seite. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="font-display text-base font-semibold text-text">
        {heading}
      </h2>
      {children}
    </section>
  );
}
