import type { LabConcept } from "./types";

/**
 * Lab / Visionen — ehrliche Status-Badges.
 * Hermes läuft real als Gateway-Service auf dem VPS (verifiziert 2026-06-08),
 * Router→Ollama als Prototyp.
 */
export const labConcepts: LabConcept[] = [
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
