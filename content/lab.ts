import type { LabConcept } from "./types";

/**
 * Lab / Visionen — ehrliche Status-Badges.
 * Hermes läuft real als Gateway-Service auf dem VPS (verifiziert 2026-06-08),
 * Router→Ollama als Prototyp.
 */
export const labConcepts: LabConcept[] = [
  {
    id: "personal-support-bot",
    title: "Persönlicher Support-Bot",
    status: "konzept",
    statusNote: "Konzept — die Bausteine laufen einzeln schon in meinem Setup",
    pitch:
      "Ein Assistent, der seine eigene Wissensbasis pflegt: Er liest alle verfügbaren Dateien — Dokumente, Notizen, Projektstände, Mails — und baut daraus automatisch eine durchsuchbare Datenbank über dich und deine Arbeit. Darauf aufbauend nimmt er echte Aufgaben ab: eingehende E-Mails lesen, Antwortentwürfe im eigenen Schreibstil vorbereiten und sie in einem eigenen UI zur Freigabe vorlegen. Den Stil lernt er aus deinen bisherigen Texten. Und er bleibt nicht stehen: In kurzen Interviews fragt er gezielt nach, was ihm an Wissen fehlt — und verbessert sich damit selbst.",
    kmuAngle:
      "Der Schritt von 'KI als Werkzeug' zu 'KI als eingearbeitete Assistenz': eine Instanz, die das Wissen einer Person oder Abteilung selbstständig aktuell hält und Routinekommunikation vorbereitet — freigegeben wird von Menschen. Mein RLM-Memory und die Hook-Pipeline sind im Kleinen genau das.",
    flow: {
      nodes: [
        { id: "files", label: "Dateien & Mails", sub: "Dokumente · Notizen · Postfach", lane: 0 },
        { id: "ingest", label: "Auto-Ingestion", sub: "KI pflegt die Wissensbasis", lane: 1, accent: "cyan" },
        { id: "kb", label: "Wissensbasis", sub: "Person · Projekte · Schreibstil", lane: 2, accent: "violet" },
        { id: "interview", label: "Interview-Modus", sub: "fragt nach, schließt Lücken", lane: 1 },
        { id: "draft", label: "Entwürfe", sub: "Mails im eigenen Stil", lane: 3 },
        { id: "ui", label: "Review-UI", sub: "Mensch gibt frei", lane: 4 },
      ],
      edges: [
        { from: "files", to: "ingest", animated: true },
        { from: "ingest", to: "kb", animated: true },
        { from: "interview", to: "kb", label: "Lücken", animated: true },
        { from: "kb", to: "draft", animated: true },
        { from: "draft", to: "ui", animated: true },
        { from: "ui", to: "kb", label: "Feedback" },
      ],
    },
  },
  {
    id: "local-orchestration",
    title: "Claude orchestriert lokale KI",
    status: "prototyp",
    statusNote: "läuft als Prototyp",
    pitch:
      "Ein Router entscheidet pro Anfrage anhand von Komplexität und Datensensibilität, ob ein lokales Modell auf meinem Server oder ein Cloud-Modell antwortet — Cloud-Stärke, wo nötig, lokale Kontrolle, wo möglich.",
    kmuAngle:
      "Für ein KMU der doppelte Hebel: Kosten senken und sensible Daten im Haus halten — ohne auf leistungsfähige KI zu verzichten.",
    flow: {
      nodes: [
        { id: "req", label: "Anfrage", lane: 0 },
        { id: "router", label: "Router", sub: "Komplexität · Datenschutz", lane: 1, accent: "cyan" },
        { id: "local", label: "Lokales Modell", sub: "Ollama · on-prem", lane: 2, accent: "violet" },
        { id: "cloud", label: "Cloud-Modell", sub: "bei Bedarf", lane: 2 },
        { id: "ans", label: "Antwort", lane: 3 },
      ],
      edges: [
        { from: "req", to: "router", animated: true },
        { from: "router", to: "local", label: "sensibel / einfach", animated: true },
        { from: "router", to: "cloud", label: "komplex", animated: true },
        { from: "local", to: "ans", animated: true },
        { from: "cloud", to: "ans", animated: true },
      ],
    },
  },
  {
    id: "hermes-hub",
    title: "Hermes — lokaler Agent-Hub",
    status: "laeuft",
    statusNote: "läuft als Gateway auf meinem Server",
    pitch:
      "Ein zentraler Hub im eigenen Netz, der Anfragen aus verschiedenen Kanälen entgegennimmt und je nach Anwendungsfall den passenden KI-Agenten ansteuert — Recherche, Dokumente, Automatisierung. Das Gateway läuft bereits dauerhaft auf meinem VPS.",
    kmuAngle:
      "Die Vision eines firmeneigenen KI-Schaltpults: eine Anlaufstelle, hinter der spezialisierte Agenten für die jeweilige Abteilung arbeiten.",
    flow: {
      nodes: [
        { id: "in", label: "Eingang", sub: "Telegram · API · Voice", lane: 0 },
        { id: "hub", label: "Hermes-Hub", sub: "Routing nach Use-Case", lane: 1, accent: "cyan" },
        { id: "research", label: "Recherche-Agent", lane: 2 },
        { id: "docs", label: "Dokumenten-Agent", lane: 2, accent: "violet" },
        { id: "auto", label: "Automations-Agent", lane: 2 },
        { id: "res", label: "Ergebnis", lane: 3 },
      ],
      edges: [
        { from: "in", to: "hub", animated: true },
        { from: "hub", to: "research", animated: true },
        { from: "hub", to: "docs", animated: true },
        { from: "hub", to: "auto", animated: true },
        { from: "research", to: "res" },
        { from: "docs", to: "res", animated: true },
        { from: "auto", to: "res" },
      ],
    },
  },
];
