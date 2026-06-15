/**
 * About-Inhalte (aus Interview B/C, 2026-06-09). Bewusst kuratiert und
 * geerdet formuliert — keine Buzzword-Wolke. „Warum KI" als echte Anekdote.
 */

export const about = {
  // Kurzprofil (überarbeitet 2026-06-10 nach User-Vorgabe)
  profile:
    "Informatikstudent an der Universität Trier (Bachelor kurz vor dem Abschluss), in der Eifel verwurzelt — daneben zwei eigene Kleingewerbe: IT-Dienstleistungen sowie Musikveranstaltungen mit PA-Verleih. Seit Anfang 2026 liegt mein Fokus, auch in der Freizeit, fast vollständig auf KI und den Lösungen, die damit möglich werden.",

  profileDrive:
    "Werkzeuge zu bauen, die anderen das Leben leichter machen, war schon vor der KI-Zeit mein Antrieb — damals noch mit dem klassischen Ziel Softwareentwickler. Klassische Berufserfahrung bringe ich noch nicht mit, dafür ein eigenes Gewerbe, erste Kundenprojekte und Software, die produktiv läuft. Den nächsten Schritt will ich bewusst in einem Team gehen — ein gutes Umfeld, in dem ich mein Können gezielt ausbaue und an Kundenprojekten arbeite, auf die ich richtig Lust habe.",

  profilePersonal:
    "Wenn ein Thema mich packt, arbeite ich mich mit Hyperfokus in kurzer Zeit tief hinein — das ist mein stärkstes Werkzeug, um Neues zu durchdringen. Und wenn ich etwas schaffen will, habe ich Biss.",

  howIWork:
    "Hands-on und autodidaktisch. Ich baue Dinge, bis sie produktiv laufen — nicht bis sie demobereit sind. Und ich recherchiere gern, bis ich die technisch beste Lösung gefunden habe. Das geht auch ganz ohne KI: Mein VR-Projekt GazeFactory (Uni, 4er-Team, 2023) habe ich von Grund auf selbst gebaut — Zustandsmodell und Blickführungs-Logik in Eigenregie, vor der KI-Code-Ära.",

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
      desc: "MCP-Server, Memory-Systeme und Agenten-Orchestrierung auf eigener Infrastruktur — modell-agnostisch von lokalen Open-Weights (Ollama) bis EU-Cloud, je nach Kosten und Datenschutz.",
    },
  ],

  // Stärken — geerdet, nicht als Schlagwortliste
  strengths: [
    "Verständnis für den tatsächlichen Bedarf hinter einer Anfrage",
    "Schnelle Auffassungsgabe, hohe Lernbereitschaft",
    "Ausdauer bei kniffligen Problemen",
    "Gründliche Recherche der besten technischen Lösung",
    "Verantwortung im Team — als langjähriger Pfadfinder-Leiter und im Uni-Projektteam",
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
