import type {
  KnowledgeCluster,
  KnowledgeEdge,
  KnowledgeNode,
} from "./types";

/**
 * Knowledge Constellation — 7 Cluster-Sterne + Satelliten, feste Positionen
 * (kein Force-Graph: deterministisch, designbar, mobil beherrschbar).
 * Koordinaten in einem 0–100-Viewport, werden im SVG skaliert.
 * Jeder Satellit trägt einen `proof` — die Konstellation ist eine Landkarte
 * der TATSÄCHLICHEN Praxis, nicht eine Behauptungswolke.
 */

export const clusters: KnowledgeCluster[] = [
  { id: "orchestration", label: "LLM-Orchestrierung", x: 27, y: 20, blurb: "Mehrere Modelle und Agenten gezielt zusammenspielen lassen." },
  { id: "local", label: "Lokale LLMs", x: 73, y: 17, blurb: "Modelle auf eigener Hardware betreiben — datenschutzkonform." },
  { id: "multiagent", label: "Multi-Agent-Systeme", x: 50, y: 39, blurb: "Aufgaben auf spezialisierte, sich gegenseitig prüfende Agenten verteilen." },
  { id: "mcp", label: "MCP-Protokoll", x: 17, y: 54, blurb: "Werkzeuge und Daten über das Model-Context-Protocol anbinden." },
  { id: "memory", label: "RAG & Memory", x: 82, y: 53, blurb: "Wissen abrufbar machen — persistentes Gedächtnis und Retrieval." },
  { id: "prompting", label: "Prompt Engineering", x: 34, y: 80, blurb: "Modelle gezielt steuern und ihre Ausgaben verlässlich formen." },
  { id: "automation", label: "Automatisierung", x: 70, y: 82, blurb: "Wiederkehrende Abläufe per KI auf Knopfdruck erledigen." },
  { id: "interests", label: "Interessen & Forschung", x: 52, y: 60, blurb: "Woran ich gerade tüftle und forsche." },
];

export const nodes: KnowledgeNode[] = [
  // ── LLM-Orchestrierung ──
  {
    id: "o-claudecode",
    label: "Claude Code",
    clusterId: "orchestration",
    x: 14,
    y: 11,
    level: "satellite",
    desc: "Täglicher Treiber meines gesamten Workflows — gesteuert über Hooks, Skills und Commands.",
    proof: { text: "Mein Setup im Detail", href: "#setup" },
  },
  {
    id: "o-routing",
    label: "Modell-Routing",
    clusterId: "orchestration",
    x: 35,
    y: 9,
    level: "satellite",
    desc: "Anfragen je nach Komplexität und Datensensibilität an Cloud- oder lokale Modelle leiten.",
    proof: { text: "Konzept im Lab", href: "#lab" },
  },
  {
    id: "o-cascade",
    label: "Agenten-Kette",
    clusterId: "orchestration",
    x: 30,
    y: 30,
    level: "satellite",
    desc: "Plan → Implement → Review als koordinierte Kette spezialisierter Modelle.",
    proof: { text: "Cascade-Bot", href: "/projekte/cascade-bot" },
  },

  // ── Lokale LLMs ──
  {
    id: "l-ollama",
    label: "Ollama",
    clusterId: "local",
    x: 86,
    y: 9,
    level: "satellite",
    desc: "Lokale Inferenz auf eigenem Server — läuft 24/7 auf meinem VPS.",
    proof: { text: "DocuFlow nutzt es produktiv", href: "/projekte/docuflow" },
  },
  {
    id: "l-vision",
    label: "Vision-OCR",
    clusterId: "local",
    x: 62,
    y: 11,
    level: "satellite",
    desc: "Qwen3-VL liest deutsche Geschäftsdokumente lokal aus — kein Cloud-Upload.",
    proof: { text: "DocuFlow", href: "/projekte/docuflow" },
  },
  {
    id: "l-privacy",
    label: "On-Premise-Datenschutz",
    clusterId: "local",
    x: 88,
    y: 27,
    level: "satellite",
    desc: "Sensible Daten verlassen nie das Haus — der entscheidende Hebel für KMU.",
    proof: { text: "Hintergrund im Lab", href: "#lab" },
  },

  // ── Multi-Agent-Systeme ──
  {
    id: "m-pir",
    label: "Plan·Implement·Review",
    clusterId: "multiagent",
    x: 50,
    y: 28,
    level: "satellite",
    desc: "Rollenbasierte Kette: jedes Modell macht, was es am besten kann.",
    proof: { text: "Cascade-Bot", href: "/projekte/cascade-bot" },
  },
  {
    id: "m-verify",
    label: "Adversariale Verifikation",
    clusterId: "multiagent",
    x: 64,
    y: 36,
    level: "satellite",
    desc: "Mehrere unabhängige Prüf-Agenten pro Befund — perspektiven-divers statt redundant.",
  },
  {
    id: "m-roles",
    label: "Rollen-Spezialisierung",
    clusterId: "multiagent",
    x: 40,
    y: 48,
    level: "satellite",
    desc: "Planner, Implementer und Reviewer mit klar geschnittenen Zuständigkeiten.",
    proof: { text: "Cascade-Bot", href: "/projekte/cascade-bot" },
  },

  // ── MCP-Protokoll ──
  {
    id: "mcp-rlm",
    label: "Eigener RLM-Server",
    clusterId: "mcp",
    x: 8,
    y: 44,
    level: "satellite",
    desc: "Selbst gebauter MCP-Server in Python — bringt persistentes Memory in jede Session.",
    proof: { text: "Im Setup", href: "#setup" },
  },
  {
    id: "mcp-fleet",
    label: "13 MCP-Server",
    clusterId: "mcp",
    x: 30,
    y: 60,
    level: "satellite",
    desc: "Von Git über Filesystem bis Linear — Werkzeuge, die der Assistent direkt bedient.",
    proof: { text: "Im Setup", href: "#setup" },
  },
  {
    id: "mcp-cascade",
    label: "Cascade als MCP",
    clusterId: "mcp",
    x: 10,
    y: 66,
    level: "satellite",
    desc: "Agenten-Orchestrierung sauber als MCP-Server gekapselt.",
    proof: { text: "Cascade-Bot", href: "/projekte/cascade-bot" },
  },

  // ── RAG & Memory ──
  {
    id: "mem-rlm",
    label: "RLM-System",
    clusterId: "memory",
    x: 92,
    y: 45,
    level: "satellite",
    desc: "Selbst gebautes Memory: 730+ Insights, sessionübergreifend abrufbar.",
    proof: { text: "Im Setup", href: "#setup" },
  },
  {
    id: "mem-search",
    label: "BM25 + semantisch",
    clusterId: "memory",
    x: 70,
    y: 50,
    level: "satellite",
    desc: "Hybride Suche über das Memory — präzise Begriffe und semantische Nähe kombiniert.",
    proof: { text: "Im Setup", href: "#setup" },
  },
  {
    id: "mem-chunks",
    label: "Session-Chunks",
    clusterId: "memory",
    x: 90,
    y: 67,
    level: "satellite",
    desc: "Ganze Arbeitssitzungen werden verdichtet gespeichert und später wieder eingespielt.",
    proof: { text: "Im Setup", href: "#setup" },
  },

  // ── Prompt Engineering ──
  {
    id: "p-suggest",
    label: "KI-Vorschlags-System",
    clusterId: "prompting",
    x: 28,
    y: 88,
    level: "satellite",
    desc: "Strukturierte Prompts erzeugen Regel-Vorschläge mit Begründung und Feedback-Loop.",
    proof: {
      text: "Lieferschein-Processor",
      href: "/projekte/lieferschein-processor",
    },
  },
  {
    id: "p-structured",
    label: "Strukturierte Outputs",
    clusterId: "prompting",
    x: 48,
    y: 86,
    level: "satellite",
    desc: "JSON-Schemata erzwingen verlässliche, weiterverarbeitbare Modell-Antworten.",
    proof: { text: "DocuFlow-Extraktion", href: "/projekte/docuflow" },
  },
  {
    id: "p-system",
    label: "System-Prompts & Guardrails",
    clusterId: "prompting",
    x: 24,
    y: 70,
    level: "satellite",
    desc: "Verhalten gezielt formen — und über Hooks technisch absichern.",
    proof: { text: "Hook-Pipeline", href: "#setup" },
  },

  // ── Automatisierung ──
  {
    id: "a-pipeline",
    label: "Dokumenten-Pipelines",
    clusterId: "automation",
    x: 68,
    y: 92,
    level: "satellite",
    desc: "Wiederkehrende Büroprozesse laufen auf Knopfdruck statt von Hand.",
    proof: {
      text: "Lieferschein-Processor",
      href: "/projekte/lieferschein-processor",
    },
  },
  {
    id: "a-hooks",
    label: "Hook-Pipeline",
    clusterId: "automation",
    x: 84,
    y: 88,
    level: "satellite",
    desc: "16 Skripte über 6 Events — Disziplin und Wiederholbarkeit erzwungen statt erhofft.",
    proof: { text: "Im Setup", href: "#setup" },
  },
  {
    id: "a-sort",
    label: "Selbstlernende Sortierung",
    clusterId: "automation",
    x: 60,
    y: 74,
    level: "satellite",
    desc: "Aus bestätigten Extraktionen entstehen automatisch neue Templates.",
    proof: { text: "DocuFlow", href: "/projekte/docuflow" },
  },

  // ── Interessen & Forschung ──
  {
    id: "in-hardware",
    label: "Lokale KI-Hardware",
    clusterId: "interests",
    x: 43,
    y: 54,
    level: "satellite",
    desc: "GPUs, ARM-Server und Edge-Geräte — was lokale Inferenz praktisch und bezahlbar macht. Mein VPS und eine 1080-Ti-Workstation sind die Spielwiese.",
    proof: { text: "Mein Setup", href: "#setup" },
  },
  {
    id: "in-mobile",
    label: "KI auf mobilen Geräten",
    clusterId: "interests",
    x: 61,
    y: 53,
    level: "satellite",
    desc: "Modelle und Agenten, die auf dem Handy laufen oder von unterwegs gesteuert werden — KI, die nicht am Schreibtisch klebt.",
  },
  {
    id: "in-benchmarks",
    label: "Open-Weight-Modellvergleich",
    clusterId: "interests",
    x: 52,
    y: 70,
    level: "satellite",
    desc: "Offene Modelle (Kimi, DeepSeek, GLM …) mit eigenen Benchmarks vergleichen, statt Marketing-Zahlen zu glauben — Tool-Format-Treue, Reasoning, Kosten.",
    proof: { text: "Konzept im Lab", href: "#lab" },
  },
];

/** Verbindungslinien zwischen verwandten Clustern (die „Sternbilder"). */
export const edges: KnowledgeEdge[] = [
  { from: "orchestration", to: "multiagent" },
  { from: "orchestration", to: "local" },
  { from: "orchestration", to: "prompting" },
  { from: "multiagent", to: "mcp" },
  { from: "multiagent", to: "memory" },
  { from: "mcp", to: "memory" },
  { from: "local", to: "memory" },
  { from: "prompting", to: "automation" },
  { from: "automation", to: "memory" },
  { from: "mcp", to: "prompting" },
  { from: "interests", to: "local" },
  { from: "interests", to: "multiagent" },
  { from: "interests", to: "memory" },
];

export const clustersById = new Map(clusters.map((c) => [c.id, c]));
