import Link from "next/link";
import type { Metadata } from "next";
import SmoothScroll from "@/lib/animation/SmoothScroll";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import SiteFooter from "@/components/layout/SiteFooter";
import Reveal from "@/components/effects/Reveal";
import { studium } from "@/content/studium";

export const metadata: Metadata = {
  title: "Studienleistungen — Christof Treitges",
};

export default function StudienleistungenPage() {
  return (
    <SmoothScroll>
      <NoiseOverlay />
      <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-5 pb-16 pt-10">
        <Link
          href="/#werdegang"
          className="font-mono text-sm text-text-muted hover:text-accent"
        >
          ← Zurück zum Portfolio
        </Link>

        <header className="mt-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {"// STUDIENLEISTUNGEN"}
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Studienleistungen
          </h1>
          <p className="mt-3 font-mono text-sm text-text-faint">
            Bachelor-Studiengang Informatik · {studium.hochschule}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted">
            {studium.intro}
          </p>

          <div className="mt-6 inline-flex items-baseline gap-2 rounded-xl border border-border bg-surface px-4 py-3">
            <span className="font-display text-3xl font-semibold text-accent">
              {studium.lpErreicht}
            </span>
            <span className="font-mono text-sm text-text-faint">
              von {studium.lpGesamt} LP absolviert
            </span>
          </div>
        </header>

        <section className="mt-10">
          <p className="mb-4 font-mono text-xs uppercase tracking-wider text-text-faint">
            Ausgewählte Module
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {studium.module.map((m, i) => (
              <Reveal key={m.titel} delay={0.03 * i}>
                <div className="flex h-full items-center justify-between gap-4 rounded-xl border border-border bg-bg/40 p-4">
                  <div>
                    <p className="text-sm font-medium leading-snug text-text">
                      {m.titel}
                    </p>
                    <p className="mt-1 font-mono text-xs text-text-faint">
                      {m.lp} LP
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg border border-accent/30 px-2.5 py-1 font-mono text-sm text-accent">
                    {m.note}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <p className="mt-8 max-w-xl text-xs leading-relaxed text-text-faint">
          Auszug aus der offiziellen Notenbescheinigung der Universität Trier.
          Deutsche Notenskala — 1,0 ist die Bestnote.
        </p>
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
