import Link from "next/link";
import Section from "@/components/ui/Section";
import SpotlightCard from "@/components/effects/SpotlightCard";
import Reveal from "@/components/effects/Reveal";
import Chip from "@/components/ui/Chip";
import { researchDocs } from "@/content/research";

/**
 * Research-Showcase — Karten zu den HTML-Recherche-Dokumenten.
 * (Phase 5 ergänzt den Vollbild-Viewer unter /research/[slug].)
 */
export default function ResearchSection() {
  return (
    <Section
      id="research"
      eyebrow="// RECHERCHE ALS PRODUKT"
      title="HTML-Recherchen"
      intro="Mit einem eigenen Design-System (research-pitch) baue ich aufwändige, eigenständige HTML-Dokumente — Vergleiche, Konzepte, Leitfäden. Komplett offline, jeweils eine einzige Datei."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {researchDocs.map((d, i) => (
          <Reveal key={d.slug} delay={i * 0.05}>
            <Link
              href={`/research/${d.slug}`}
              className="group block h-full"
              aria-label={`${d.title} ansehen`}
            >
            <SpotlightCard className="flex h-full flex-col p-6">
              {/* Browser-Frame-Andeutung */}
              <div className="mb-4 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warn/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-2 truncate font-mono text-[11px] text-text-faint">
                  {d.file}
                </span>
              </div>
              {/* Vorschau-Thumbnail (scrollt langsam beim Hover) */}
              <div className="mb-4 overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/research-thumbs/${d.slug}.jpg`}
                  alt=""
                  loading="lazy"
                  width={1280}
                  height={800}
                  className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="font-display text-lg font-semibold">{d.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                {d.desc}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {d.sections ? <Chip>{d.sections} Sektionen</Chip> : null}
                {d.lines ? <Chip>{d.lines.toLocaleString("de-DE")} Zeilen</Chip> : null}
                {d.sizeKB ? <Chip>{d.sizeKB} KB</Chip> : null}
              </div>
              <p className="mt-3 font-mono text-xs text-accent transition-colors group-hover:text-accent-soft">
                Ansehen →
              </p>
            </SpotlightCard>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
