import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SmoothScroll from "@/lib/animation/SmoothScroll";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import SiteFooter from "@/components/layout/SiteFooter";
import FlowDiagram from "@/components/effects/FlowDiagram";
import CountUp from "@/components/effects/CountUp";
import Chip from "@/components/ui/Chip";
import Reveal from "@/components/effects/Reveal";
import ScreenshotGallery from "@/components/ui/ScreenshotGallery";
import { projects, projectsBySlug } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projectsBySlug.get(slug);
  return { title: p ? `${p.title} — Case-Study` : "Projekt" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projectsBySlug.get(slug);
  if (!p) notFound();

  const idx = projects.findIndex((x) => x.slug === slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  const cs = p.caseStudy;

  return (
    <SmoothScroll>
      <NoiseOverlay />
      <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-5 pb-16 pt-10">
        <Link
          href="/#projekte"
          className="font-mono text-sm text-text-muted hover:text-accent"
        >
          ← Zurück zum Portfolio
        </Link>

        {/* Kopf */}
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="accent">{p.relevance}</Chip>
            <Chip>{p.status}</Chip>
            {cs.aiCore && <Chip tone="violet">KI im Kern</Chip>}
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">
            {p.title}
          </h1>
          <p className="mt-3 text-lg text-text-muted">{p.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-text-faint"
              >
                {s}
              </span>
            ))}
          </div>
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block font-mono text-sm text-accent hover:text-accent-soft"
            >
              ↗ Quellcode auf GitHub
            </a>
          )}
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noreferrer"
              className={`mt-4 inline-block font-mono text-sm text-accent hover:text-accent-soft${
                p.repo ? " ml-4" : ""
              }`}
            >
              ↗ Live ansehen
            </a>
          )}
        </header>

        {/* So kam ich dazu */}
        {p.origin && (
          <div className="mt-8 rounded-2xl border border-border bg-surface/50 p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-accent">
              So kam ich dazu
            </p>
            <p className="mt-2 leading-relaxed text-text-muted">{p.origin}</p>
          </div>
        )}

        {/* Problem */}
        <Block title="Problem">
          {cs.problem.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </Block>

        {/* Ansatz */}
        <Block title="Ansatz">
          {cs.approach.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </Block>

        {/* Einblicke (Screenshots mit Dummy-Daten) */}
        {p.screenshots && p.screenshots.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Einblicke</h2>
            <Reveal>
              <div className="mt-4">
                <ScreenshotGallery shots={p.screenshots} />
              </div>
            </Reveal>
          </section>
        )}

        {/* Architektur */}
        {cs.architecture && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Architektur</h2>
            <Reveal>
              <div
                tabIndex={0}
                role="group"
                aria-label="Architektur-Diagramm, horizontal scrollbar"
                className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface/50 p-4"
              >
                <div className="min-w-[600px]">
                  <FlowDiagram
                    spec={cs.architecture}
                    label={`Architektur von ${p.title}`}
                  />
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* Metriken */}
        <section className="mt-12 grid grid-cols-3 gap-3">
          {cs.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-border bg-surface p-4 text-center"
            >
              <div className="font-display text-2xl font-bold text-accent">
                <CountUp value={m.value} />
              </div>
              <div className="mt-1 text-xs text-text-faint">{m.label}</div>
            </div>
          ))}
        </section>

        {/* Ergebnis */}
        <Block title="Ergebnis">
          <ul className="space-y-2">
            {cs.results.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Block>

        {/* Entwicklung (optionale Projekt-Timeline) */}
        {cs.timeline && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Entwicklung</h2>
            <ol className="mt-4 space-y-3 border-l border-border pl-5">
              {cs.timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.45rem] top-1.5 h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
                  <span className="font-mono text-xs text-accent">
                    {t.period}
                  </span>
                  <p className="text-sm leading-relaxed text-text-muted">
                    {t.text}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* IT-Fabrik-Relevanz */}
        <section className="mt-12">
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-accent">
              Warum relevant für ein KMU-Systemhaus
            </p>
            <p className="mt-2 leading-relaxed text-text">{cs.itFabrik}</p>
          </div>
        </section>

        {/* Learnings */}
        <Block title="Learnings">
          <ul className="space-y-2">
            {cs.learnings.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-glow-soft">✦</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Block>

        {cs.screenshotNote && (
          <p className="mt-8 font-mono text-xs text-text-faint">
            Hinweis: {cs.screenshotNote}
          </p>
        )}

        {/* Prev / Next */}
        <nav className="mt-16 flex items-center justify-between border-t border-border pt-6 text-sm">
          <Link
            href={`/projekte/${prev.slug}`}
            className="text-text-muted hover:text-accent"
          >
            ← {prev.title}
          </Link>
          <Link
            href={`/projekte/${next.slug}`}
            className="text-text-muted hover:text-accent"
          >
            {next.title} →
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-text-muted">
        {children}
      </div>
    </section>
  );
}
