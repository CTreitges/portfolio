import Link from "next/link";
import Section from "@/components/ui/Section";
import SpotlightCard from "@/components/effects/SpotlightCard";
import Reveal from "@/components/effects/Reveal";
import Chip from "@/components/ui/Chip";
import { miniTools, projects } from "@/content/projects";
import type { Project } from "@/content/types";

// CTA: auf Touch-Geräten (kein Hover) dauerhaft sichtbar, sonst erst bei Hover.
const ctaCls =
  "mt-4 inline-flex items-center gap-1 text-sm text-accent opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100";

function MetaBlock({ p, max }: { p: Project; max: number }) {
  return (
    <>
      {p.headlineMetric && (
        <div className="mb-3 flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-accent">
            {p.headlineMetric.value}
          </span>
          <span className="text-xs text-text-faint">
            {p.headlineMetric.label}
          </span>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {p.stack.slice(0, max).map((s) => (
          <span
            key={s}
            className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-text-faint"
          >
            {s}
          </span>
        ))}
      </div>
      <span className={ctaCls}>Case-Study →</span>
    </>
  );
}

/** Karten-Thumb (16:10, feste Maße → CLS 0); nutzt das research-thumbs-Muster. */
function CardThumb({ p }: { p: Project }) {
  const shot = p.screenshots?.[0];
  if (!shot) return null;
  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element -- bewusst kein next/image: Optimizer-Pfad läge vor dem Auth-Gate */}
      <img
        src={shot.thumb ?? shot.src}
        alt={shot.alt}
        loading="lazy"
        decoding="async"
        width={800}
        height={500}
        className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    </div>
  );
}

function ProjectHead({ p }: { p: Project }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        {p.flagship && (
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-soft">
            ★ Aushängeschild
          </span>
        )}
        <h3 className="font-display text-xl font-semibold text-text">
          {p.title}
        </h3>
      </div>
      <Chip tone={p.relevance === "Lokale KI" ? "accent" : "default"}>
        {p.relevance}
      </Chip>
    </div>
  );
}

/** Maßgeschneiderte „Für die IT-Fabrik"-Zeile direkt auf der Karte (Scan-Ebene). */
function ItFabrikLine({ p }: { p: Project }) {
  if (!p.itFabrikShort) return null;
  return (
    <p className="mt-3 border-l-2 border-accent/40 pl-3 text-xs leading-relaxed text-text-muted">
      <span className="font-semibold text-accent-soft">Für die IT-Fabrik: </span>
      {p.itFabrikShort}
    </p>
  );
}

/** Volle Breite, 2-spaltig — fürs Aushängeschild. */
function FlagshipCard({ p }: { p: Project }) {
  return (
    <SpotlightCard as="article" className="group">
      <Link
        href={`/projekte/${p.slug}`}
        className="grid gap-6 p-6 md:grid-cols-[1fr_16rem] md:gap-8 md:p-8"
        aria-label={`${p.title} — Case-Study öffnen`}
      >
        <div>
          <ProjectHead p={p} />
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            {p.tagline}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-faint">
            {p.summary}
          </p>
          <ItFabrikLine p={p} />
          {p.currentStatus && (
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-text-faint">
              Stand: {p.currentStatus}
            </p>
          )}
        </div>
        <div className="flex flex-col justify-center border-t border-border pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <CardThumb p={p} />
          <MetaBlock p={p} max={7} />
        </div>
      </Link>
    </SpotlightCard>
  );
}

function ProjectCard({ p, featured }: { p: Project; featured: boolean }) {
  return (
    <SpotlightCard as="article" className="group h-full">
      <Link
        href={`/projekte/${p.slug}`}
        className="flex h-full flex-col p-6"
        aria-label={`${p.title} — Case-Study öffnen`}
      >
        <CardThumb p={p} />
        <ProjectHead p={p} />
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          {p.tagline}
        </p>
        {featured && (
          <p className="mt-3 text-sm leading-relaxed text-text-faint">
            {p.summary}
          </p>
        )}
        <ItFabrikLine p={p} />
        {p.currentStatus && (
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-text-faint">
            Stand: {p.currentStatus}
          </p>
        )}
        <div className="mt-auto pt-5">
          <MetaBlock p={p} max={featured ? 6 : 4} />
        </div>
      </Link>
    </SpotlightCard>
  );
}

export default function ProjectsGrid() {
  const flagship = projects.find((p) => p.flagship);
  const others = projects.filter((p) => !p.flagship && !p.hidden);

  return (
    <Section
      id="projekte"
      eyebrow="// ARBEITSPROBEN"
      title="Projekte"
      intro="Acht Projekte — von lokaler KI-Dokumentenverarbeitung über produktive Büro-Automatisierung bis zur deklarativen Infrastruktur. Jede Karte führt zu einer Case-Study mit Architektur und Wirkung."
    >
      {flagship && (
        <Reveal>
          <div className="mb-4">
            <FlagshipCard p={flagship} />
          </div>
        </Reveal>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.04}>
            <ProjectCard p={p} featured={p.featured} />
          </Reveal>
        ))}
      </div>

      {/* Kleinere öffentliche Repos ohne Case-Study-Anspruch */}
      <Reveal delay={0.08}>
        <div className="mt-8 rounded-2xl border border-border bg-surface/50 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-text-faint">
            Außerdem auf GitHub
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {miniTools.map((t) => (
              <a
                key={t.name}
                href={t.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group/tool flex h-full items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-glow"
              >
                <div>
                  <span className="font-display text-sm font-semibold text-text">
                    {t.name}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    {t.desc}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {t.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-text-faint"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  aria-hidden
                  className="shrink-0 text-text-faint transition-colors group-hover/tool:text-accent"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
