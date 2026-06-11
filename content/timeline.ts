import type { TimelineEntry } from "./types";

/**
 * Zwei Spuren: "haupt" = Werdegang (Interview Frage 1, real),
 * "ki" = KI-Lernreise (Interview D, 2026-06-09).
 * Antichronologisch (neuestes zuerst, deutsche CV-Konvention), lückenlos.
 * Studium bewusst neutral, ohne Abschluss-Aussage (User-Entscheidung).
 */
export const timeline: TimelineEntry[] = [
  // ── Hauptspur (real, neuestes zuerst) ─────────────────────────────
  {
    period: "seit 09/2025",
    title: "Kleingewerbe IT-Dienstleistungen",
    desc: "Eigene IT-Dienstleistungen — der Schritt in die hauptberufliche Richtung.",
    tags: ["IT-Dienstleistung"],
    type: "selbststaendig",
    track: "haupt",
  },
  {
    period: "seit 2023",
    title: "Kleingewerbe Musikveranstaltungen",
    desc: "Veranstaltungs- und PA-Technik — Wurzel von PA-Streaming-Hub und Audio Normalizer.",
    tags: ["PA-Technik", "Events"],
    type: "selbststaendig",
    track: "haupt",
  },
  {
    period: "2021–2026",
    title: "Informatikstudium",
    org: "Universität Trier",
    desc: "Fundament in praktischer Informatik. Schwerpunkt im Verlauf zunehmend auf selbst gebaute Praxis verlagert.",
    tags: ["Informatik", "praktische Informatik"],
    type: "ausbildung",
    track: "haupt",
  },
  {
    period: "2021–2026",
    title: "Gastronomie & Werkstudent",
    org: "DerTeller Gastronomics",
    desc: "Minijob, zwischenzeitlich ein Jahr als Werkstudent — Kontext, aus dem der produktive Lieferschein-Processor entstand.",
    type: "job",
    track: "haupt",
  },
  {
    period: "2020–2021",
    title: "Teilzeit",
    org: "REWE Stadtkyll",
    type: "job",
    track: "haupt",
  },
  {
    period: "2018–2020",
    title: "Gastronomie (Minijob)",
    org: "DerTeller Gastronomics",
    desc: "Erste Station beim späteren Auftraggeber des Lieferschein-Processors.",
    type: "job",
    track: "haupt",
  },
  {
    period: "2012–2021",
    title: "Abitur",
    org: "Gymnasium Gerolstein",
    type: "ausbildung",
    track: "haupt",
  },

  // ── KI-Spur (Interview D, 2026-06-09; neuestes zuerst) ────────────
  {
    period: "heute",
    title: "Vollständiges Claude-Code-Setup",
    desc: "Ein produktives KI-Arbeitssystem über drei Maschinen, mit eigenem VPS als dauerhaftem Knoten.",
    type: "lernreise",
    track: "ki",
  },
  {
    period: "2026",
    title: "Tief in die Möglichkeiten",
    desc: "Eigenes MCP-Memory (RLM), Skills und Hook-System; Experimente mit OpenCode und Ollama Cloud; ein eigenes MCP für Modell-Routing.",
    tags: ["MCP", "RLM", "Ollama"],
    type: "lernreise",
    track: "ki",
  },
  {
    period: "Anfang 2026",
    title: "Umstieg auf Claude Code",
    desc: "Vom Chat zum agentischen Arbeiten direkt im Terminal.",
    tags: ["Claude Code"],
    type: "lernreise",
    track: "ki",
  },
  {
    period: "09/2025",
    title: "Vollständiger Einstieg — DerTeller-Projekt",
    desc: "Für den Lieferschein-Processor ganz ins KI-gestützte Entwickeln: JetBrains Junie, gestützt durch Claude Chat.",
    tags: ["JetBrains Junie", "Claude"],
    type: "lernreise",
    track: "ki",
  },
  {
    period: "2024",
    title: "KI im Alltag",
    desc: "Copilot wird fester Bestandteil der Arbeit.",
    type: "lernreise",
    track: "ki",
  },
  {
    period: "2023",
    title: "Erste KI-Code-Vorschläge",
    desc: "Copilot-Preview beim Programmieren, parallel Perplexity, Google AI Studio und ChatGPT (GPT-3.5) — der erste Kontakt.",
    tags: ["Copilot", "ChatGPT"],
    type: "lernreise",
    track: "ki",
  },
];
