import type { ResearchDoc } from "./types";

/**
 * Research-Showcase — eigene Single-File-HTML-Recherche-Dokumente.
 * Die HTML-Dateien liegen unter public/research-docs/ und sind durch das
 * Auth-Gate (proxy.ts) geschützt — direkter Abruf ohne Session wird umgeleitet.
 * Inhaltlich unbedenklich: generische „Gewerbehalle", kein Personen-/Vereinsbezug.
 */
export const researchDocs: ResearchDoc[] = [
  {
    slug: "schliessystem-vergleich",
    title: "Schließsystem-Vergleich",
    file: "schliessystem-vergleich.html",
    lines: 3312,
    sections: 17,
    sizeKB: 178,
    desc: "Umfassender Produkt- und Systemvergleich für die Zutrittslösung einer 1.100-m²-Gewerbehalle — Hardware-Karten, Vergleichstabellen, Tier-Varianten, Risiken, Bestellliste. Goldstandard meines research-pitch-Designsystems.",
    desktopOnly: true,
  },
  {
    slug: "unifi-access",
    title: "UniFi-Access-Übersicht",
    file: "unifi-access.html",
    lines: 2230,
    sections: 16,
    sizeKB: 148,
    desc: "Konfigurator und Entscheidungshilfe für ein UniFi-Access-Zutrittssystem: Auftrag, Vorgehen, Komponentenwahl, Verkabelung und Endergebnis — von der Anforderung bis zur Bestellliste.",
    desktopOnly: true,
  },
  {
    slug: "cowork-guide",
    title: "Claude-Cowork-Guide",
    file: "cowork-guide.html",
    sections: 19,
    sizeKB: 730,
    desc: "Ein 19-Sektionen-Leitfaden, der Laien den produktiven Umgang mit einem KI-Assistenten erklärt — inkl. Workflow-Diagramm, Copy-Vorlagen und FAQ. Komplett offline, eine einzige HTML-Datei.",
    desktopOnly: true,
  },
];

export const researchBySlug = new Map(researchDocs.map((d) => [d.slug, d]));
