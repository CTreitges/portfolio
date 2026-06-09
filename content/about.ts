/**
 * About-Inhalte (aus Interview B/C, 2026-06-09). Bewusst kuratiert und
 * geerdet formuliert — keine Buzzword-Wolke. „Warum KI" als echte Anekdote.
 */

export const about = {
  // Kurzprofil
  profile:
    "Informatik-Hintergrund, in der Eifel verwurzelt, mit einem Hang dazu, Werkzeuge selbst zu bauen statt sie nur zu benutzen. Ich entwickle KI-Lösungen, die im Alltag echte Arbeit abnehmen — am liebsten lokal und datenschutzkonform.",

  howIWork:
    "Hands-on und autodidaktisch. Ich baue Dinge, bis sie produktiv laufen — nicht bis sie demobereit sind. Und ich recherchiere gern, bis ich die technisch beste Lösung gefunden habe.",

  // Warum KI — die persönliche Anekdote (Interview B)
  whyAI:
    "Angefangen hat es mit KI-Vorschlägen beim Programmieren im Studium — erst Copilot-Previews, dann zunehmend im Alltag. Für das Lieferschein-Projekt bei DerTeller bin ich schließlich ganz ins KI-gestützte Entwickeln eingestiegen: von JetBrains Junie über Claude Chat bis Claude Code. Dort bin ich geblieben, weil sich damit echte Probleme spürbar schneller lösen lassen.",

  // Was ich mit KI baue (Interview C) — konkrete Fähigkeiten
  buildCapabilities: [
    {
      title: "Büro-Automatisierung",
      desc: "Tools, die wiederkehrende Büroaufgaben abnehmen — vom Beleg-Parsing bis zur fertigen Excel-Übersicht.",
    },
    {
      title: "PowerShell-Werkzeuge",
      desc: "Kleine UI- und Automations-Tools für Windows-Umgebungen.",
    },
    {
      title: "Python-Anwendungen",
      desc: "Von Desktop-Apps bis zu Verarbeitungs-Pipelines mit lokaler KI.",
    },
    {
      title: "Lokale KI & Agenten",
      desc: "MCP-Server, Memory-Systeme und Agenten-Orchestrierung auf eigener Infrastruktur.",
    },
  ],

  // Stärken — geerdet, nicht als Schlagwortliste
  strengths: [
    "Verständnis für den tatsächlichen Bedarf hinter einer Anfrage",
    "Schnelle Auffassungsgabe, hohe Lernbereitschaft",
    "Ausdauer bei kniffligen Problemen",
    "Gründliche Recherche der besten technischen Lösung",
    "Teamarbeit",
  ],

  // Abseits des Rechners (Interview C) — menschlich, geerdet
  beyondCode: [
    {
      label: "Pfadfinder",
      desc: "Mein Leben lang dabei, seit fünf Jahren als Leiter — Verantwortung, Gruppe, Verlässlichkeit.",
    },
    {
      label: "Ton- & Veranstaltungstechnik",
      desc: "PA-Anlagen bauen und einmessen, Events organisieren — die nerdige Seite zum Anfassen.",
    },
    {
      label: "Technik-Tüftelei",
      desc: "Spiele-Server konfigurieren, früher eigene Mods geschrieben — Neugier, die nie ganz aufgehört hat.",
    },
  ],

  techStack: [
    "Python",
    "TypeScript",
    "PowerShell",
    "Linux",
    "Ollama",
    "FastAPI",
    "Svelte",
    "Next.js",
    "MCP",
    "Claude Code",
    "NixOS",
    "openpyxl",
  ],
} as const;
