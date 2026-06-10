import type { FlowSpec, Metric, SetupStat } from "./types";

/**
 * Making-of: wie dieses Portfolio entstand. Die Sektion ist selbst ein
 * Arbeitsbeispiel — Zahlen belegbar (Session-Logs, Test-Suite), nichts
 * geschönt. Der <5h-Wert meint reale Arbeitszeit des Menschen.
 */

export const makingOfIntro =
  "Diese Seite ist selbst ein Arbeitsbeispiel: gebaut mit meinem eigenen Claude-Code-Setup — in unter 5 Stunden realer Arbeitszeit. Möglich, weil mein KI-System mich und meine Projekte längst kannte.";

export const makingOfStats: (Metric | SetupStat)[] = [
  { value: "< 5 h", label: "reale Arbeitszeit" },
  { value: "730+", label: "Memory-Insights als Wissensbasis" },
  { value: "15", label: "Screenshots — von Agenten selbst erstellt" },
  { value: "17", label: "E2E-Tests grün vor jedem Deploy" },
];

export const makingOfSteps: { title: string; desc: string }[] = [
  {
    title: "Plan-Modus zuerst",
    desc: "Scope, Architektur, Auth-Gate und TLS-Strategie standen fest, bevor die erste Zeile Code entstand.",
  },
  {
    title: "KI-Interview",
    desc: "Werdegang, Entscheidungen und O-Töne hat mein System mich strukturiert gefragt — statt dass ich Texte von Hand schreibe.",
  },
  {
    title: "Gedächtnis statt Briefing",
    desc: "RLM-Memory und Knowledge-Graph kannten meine Projekte bereits — inklusive der Entscheidungen und Bugs dahinter. Fakten holte sich das System per Git- und MCP-Zugriff direkt aus den Repos.",
  },
  {
    title: "ultracode-Workflows",
    desc: "Recherche, Show-Pieces, Audits und sogar die Projekt-Screenshots liefen als parallele Agenten-Workflows — Agenten starteten meine Apps mit Dummy-Daten und fotografierten sie selbst.",
  },
  {
    title: "Verifiziert statt behauptet",
    desc: "Playwright-E2E, axe-Accessibility und Lighthouse mobil ≥ 90 — geprüft vor jedem Deploy auf den eigenen Server.",
  },
];

export const makingOfFlow: FlowSpec = {
  nodes: [
    { id: "plan", label: "Plan-Modus", sub: "Scope · Architektur", lane: 0 },
    { id: "interview", label: "KI-Interview", sub: "Werdegang · O-Töne", lane: 0 },
    { id: "mem", label: "RLM-Memory + Graph", sub: "730+ Insights über meine Arbeit", lane: 1, accent: "cyan" },
    { id: "git", label: "Git- & MCP-Zugriff", sub: "Fakten aus den Repos", lane: 1 },
    { id: "ultra", label: "ultracode-Workflows", sub: "parallele Agenten bauen & prüfen", lane: 2, accent: "violet" },
    { id: "verify", label: "Verifikation", sub: "Playwright · axe · Lighthouse", lane: 3 },
    { id: "deploy", label: "Live auf eigenem Server", sub: "VPS · Caddy · TLS", lane: 4, accent: "cyan" },
  ],
  edges: [
    { from: "plan", to: "ultra", animated: true },
    { from: "interview", to: "mem", animated: true },
    { from: "mem", to: "ultra", animated: true },
    { from: "git", to: "ultra", animated: true },
    { from: "ultra", to: "verify", animated: true },
    { from: "verify", to: "deploy", animated: true },
  ],
};
