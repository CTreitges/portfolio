import type { FlowSpec, SetupStat } from "./types";

/**
 * „Mein Maschinenraum" — Zahlen nach der eigenen Architektur-Doku
 * (claude-setup-dokumentation.html, 17 Sektionen). Dev-Kern: 13 MCP,
 * 16 Hook-Skripte über 6 Events, 6 Skills, 5 Commands. Kein Telegram im
 * täglichen Claude-Code-Flow — Output ist Linear + Git. Plan-Modus + Effort.
 */

export const setupStats: SetupStat[] = [
  { value: "3", label: "Maschinen", source: "PC · WSL · Oracle-VPS" },
  { value: "13", label: "MCP-Server", source: "12 stdio + 1 SSE" },
  { value: "16", label: "Hook-Skripte", source: "über 6 Events" },
  { value: "6", label: "Skills" },
  { value: "5", label: "Commands" },
  { value: "730+", label: "RLM-Insights", source: "rlm_status live" },
  { value: "1", label: "Plugin", source: "frontend-design" },
  { value: "24/7", label: "VPS-Session", source: "systemd, reboot-fest" },
];

/** Architektur-Ebenen für das animierte Diagramm (oben → unten). */
export const setupArchitecture: FlowSpec = {
  nodes: [
    { id: "machines", label: "Maschinen", sub: "PC · WSL · Oracle-VPS", lane: 0 },
    { id: "sync", label: "Sync", sub: "newer-wins · VPS kanonisch", lane: 1, accent: "muted" },
    { id: "core", label: "Claude-Code-Kern", sub: "Hooks · Skills · Plan/Effort", lane: 2, accent: "cyan" },
    { id: "mcp", label: "MCP-Ebene", sub: "13 Server", lane: 3, accent: "violet" },
    { id: "rlm", label: "RLM-Memory", sub: "Insights + Chunks", lane: 4, accent: "cyan" },
    { id: "out", label: "Output", sub: "Linear · Git", lane: 5 },
  ],
  edges: [
    { from: "machines", to: "sync", animated: true },
    { from: "sync", to: "core", animated: true },
    { from: "core", to: "mcp", animated: true },
    { from: "mcp", to: "rlm", animated: true },
    { from: "rlm", to: "core", label: "Recall", animated: true },
    { from: "core", to: "out", animated: true },
  ],
};

/** „Was ich damit mache" — kurz erklärte Bausteine des Setups. */
export const setupCapabilities: { title: string; desc: string }[] = [
  {
    title: "VPS + Ein-Befehl-Update",
    desc: "Ein eigener Oracle-Server als dauerhafter, reboot-fester KI-Knoten. Ein einziger Befehl (claude-update) hält alle drei Maschinen synchron.",
  },
  {
    title: "Plan-Modus & Effort-Stufen",
    desc: "Erst planen, dann die Gründlichkeit wählen — von schnellem Solo bis zur mehrstufigen Multi-Agent-Orchestrierung für große Aufgaben.",
  },
  {
    title: "Skills & Auto-Skills",
    desc: "Wiederkehrende Abläufe als abrufbare Fähigkeiten — teils automatisch vorgeschlagen, wenn die Situation passt.",
  },
  {
    title: "MCP-Werkzeuge",
    desc: "13 angebundene Server geben dem Assistenten echte Werkzeuge an die Hand: Git, Dateisystem, Recherche, Issue-Tracker und mehr.",
  },
  {
    title: "Hooks für Konsistenz",
    desc: "16 Skripte über 6 Events als erzwungene Leitplanken: Scope-Schutz, Test-Pflicht, automatisches Speichern von Funden.",
  },
  {
    title: "Geteiltes Memory (RLM)",
    desc: "Ein eigenes Gedächtnis über alle Maschinen: Entscheidungen, Funde und ganze Sessions bleiben erhalten — der VPS hält die kanonische Datenbank.",
  },
];

/** Terminal-Showcase: Tabs mit nachgespielten echten Abläufen. */
export interface TerminalLine {
  kind: "prompt" | "out" | "ok" | "comment";
  text: string;
}
export interface TerminalTab {
  id: string;
  label: string;
  lines: TerminalLine[];
}

export const terminalTabs: TerminalTab[] = [
  {
    id: "hooks",
    label: "Hook-Pipeline",
    lines: [
      { kind: "comment", text: "# Ein Prompt löst die Hook-Kette aus" },
      { kind: "prompt", text: "claude: \"fix den Parser-Bug in KW21\"" },
      { kind: "out", text: "→ scope_guard.ps1   prüft verbotene Muster … ok" },
      { kind: "out", text: "→ rlm_recall_hook   lädt relevanten Kontext" },
      { kind: "out", text: "→ Fix + Regressionstest geschrieben" },
      { kind: "ok", text: "✓ rlm_remember     Fund + Root-Cause persistiert" },
      { kind: "ok", text: "✓ stop_rlm_hook    blockt Stop ohne Memory-Save" },
    ],
  },
  {
    id: "plan",
    label: "Plan + Effort",
    lines: [
      { kind: "comment", text: "# Erst planen, dann Gründlichkeit wählen" },
      { kind: "prompt", text: "claude --plan \"Excel-Export refactoren\"" },
      { kind: "out", text: "PLAN      analysiert + skizziert die Schritte" },
      { kind: "out", text: "→ Plan geprüft und freigegeben" },
      { kind: "prompt", text: "/effort ultracode" },
      { kind: "out", text: "WORKFLOW  mehrere Agenten: planen · bauen · prüfen" },
      { kind: "ok", text: "✓ adversariale Verifikation pro Fund" },
    ],
  },
  {
    id: "vps",
    label: "VPS-Session",
    lines: [
      { kind: "comment", text: "# Dauerhafte KI-Session auf dem eigenen Server" },
      { kind: "prompt", text: "ssh oracle-vps" },
      { kind: "out", text: "tmux attach -t claude" },
      { kind: "out", text: "claude-session.service  active (reboot-fest)" },
      { kind: "ok", text: "✓ RLM live   geteiltes Memory, VPS kanonisch" },
    ],
  },
];
