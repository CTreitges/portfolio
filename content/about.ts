/**
 * About-Inhalte (aus Interview B/C, 2026-06-09). Bewusst kuratiert und
 * geerdet formuliert — keine Buzzword-Wolke. „Warum KI" als echte Anekdote.
 */

export const about = {
  // Kurzprofil (überarbeitet 2026-06-10 nach User-Vorgabe)
  profile:
    "Informatikstudent an der Universität Trier (Bachelor kurz vor dem Abschluss), in der Eifel verwurzelt — daneben zwei eigene Kleingewerbe: IT-Dienstleistungen sowie Musikveranstaltungen mit PA-Verleih. Seit Anfang 2026 liegt mein Fokus, auch in der Freizeit, fast vollständig auf KI und den Lösungen, die damit möglich werden.",

  profileDrive:
    "Werkzeuge zu bauen, die anderen das Leben leichter machen, war schon vor der KI-Zeit mein Antrieb — damals noch mit dem klassischen Ziel Softwareentwickler. Klassische Berufserfahrung bringe ich noch nicht mit, dafür ein eigenes Gewerbe, erste Kundenprojekte und Software, die produktiv läuft.",

  profilePersonal:
    "Wenn ein Thema mich packt, arbeite ich mich mit echtem Hyperfokus in kurzer Zeit tief hinein — das ist mein stärkstes Werkzeug, um Neues zu durchdringen. Und wenn ich etwas schaffen will, habe ich Biss.",

  howIWork:
    "Hands-on und autodidaktisch. Ich baue Dinge, bis sie produktiv laufen — nicht bis sie demobereit sind. Und ich recherchiere gern, bis ich die technisch beste Lösung gefunden habe.",

  // Warum KI — die persönliche Anekdote (Interview B, geschärft 2026-06-10)
  whyAI:
    "Der erste Aha-Moment kam im Studium: Copilot-Previews, die plötzlich brauchbaren Code vorschlugen. Richtig gepackt hat es mich beim Lieferschein-Projekt für DerTeller — als aus der Frage 'Geht das nicht mit KI?' eine Anwendung wurde, die seitdem jede Woche produktiv läuft. Inzwischen entwickle ich fast ausschließlich KI-gestützt, von JetBrains Junie bis Claude Code, und habe mir daraus ein eigenes Arbeitssystem mit Memory, Hooks und Agenten-Workflows gebaut. Geblieben bin ich, weil sich echte Probleme damit spürbar schneller lösen lassen — und weil sich kein anderes Feld so schnell bewegt.",

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

  // Abseits des Rechners (Interview C, überarbeitet 2026-06-10)
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
      label: "Hardware & Technik",
      desc: "PCs konfigurieren, Komponenten vergleichen, Technik bis ins Detail recherchieren — vom Gaming-Build bis zu Unified-Memory-Konzepten für lokale KI.",
    },
    {
      label: "Wissensdurst",
      desc: "Ich will wissen, wie Dinge funktionieren — ob Aktienmärkte oder Rennsport-Technik. Recherche ist für mich Freizeit, kein Aufwand.",
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
