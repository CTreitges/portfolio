/**
 * Geteilte Content-Typen. Alles Inhaltliche lebt typisiert in content/*.ts —
 * Compile-Fehler bei kaputten Slug-Querverweisen (Konstellation → Projekt).
 * PLATZHALTER-Felder sind als solche markiert und werden nach dem Interview ersetzt.
 */

export type RelevanceTag =
  | "Automatisierung"
  | "Lokale KI"
  | "Multi-Agent"
  | "Infrastruktur"
  | "Tooling";

export type ProjectStatus = "produktiv" | "aktiv" | "prototyp" | "archiviert";

/** Wiederverwendbares Diagramm-Modell (Setup, Lab, Case-Study-Architektur). */
export interface FlowNode {
  id: string;
  label: string;
  sub?: string;
  /** Spalte/Ebene (0 = oben/links). Für Auto-Layout im FlowDiagram. */
  lane: number;
  accent?: "cyan" | "violet" | "muted";
}
export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  /** animiertes Datenpaket entlang der Kante */
  animated?: boolean;
}
export interface FlowSpec {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface Metric {
  value: string; // z.B. "16.000+" — als String, damit Einheiten/Formate frei sind
  label: string;
}

/**
 * Projekt-Screenshot. Liegt als vorab optimierte WebP unter public/projects/
 * (hinter dem Auth-Gate; bewusst KEIN next/image — der Optimizer-Pfad ist
 * im proxy-Matcher öffentlich). Feste Maße → CLS 0.
 */
export interface ProjectScreenshot {
  src: string; // "/projects/<slug>/<name>.webp" (max 1600w)
  thumb?: string; // "/projects/<slug>/<name>-thumb.webp" (800w, 16:10)
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

/** Kompakter Repo-Verweis für den „Außerdem auf GitHub"-Strip. */
export interface MiniTool {
  name: string;
  desc: string;
  repo: string;
  stack: string[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string; // 1-Zeiler-Outcome
  featured: boolean;
  /** Aushängeschild — bekommt zusätzliche Hervorhebung. */
  flagship?: boolean;
  status: ProjectStatus;
  relevance: RelevanceTag;
  /** Repo/Link, optional (private Repos: weglassen) */
  repo?: string;
  /** Karte im Grid ausblenden; Case-Study-Seite bleibt erreichbar. */
  hidden?: boolean;
  /** UI-Screenshots (Dummy-Daten); erstes Element = Karten-Thumb. */
  screenshots?: ProjectScreenshot[];
  stack: string[];
  /** Kurzbeschreibung für die Karte (2-3 Sätze) */
  summary: string;
  /** „So kam ich dazu" — Entstehungsgeschichte, 1-2 Sätze. */
  origin?: string;
  /** „Stand heute" — aktueller Entwicklungsstand, eine Zeile. */
  currentStatus?: string;
  /** Akzent-Metrik auf der Karte */
  headlineMetric?: Metric;
  caseStudy: {
    problem: string[];
    approach: string[];
    architecture?: FlowSpec;
    results: string[];
    metrics: Metric[];
    /** explizites IT-Fabrik-Mapping */
    itFabrik: string;
    learnings: string[];
    /** true = KI/LLM im Kern */
    aiCore: boolean;
    /** optionale Projekt-Timeline (z.B. Junie → Claude Code) */
    timeline?: { period: string; text: string }[];
    /** Hinweis zu Screenshots/Datenschutz */
    screenshotNote?: string;
  };
}

export type TimelineType =
  | "ausbildung"
  | "job"
  | "selbststaendig"
  | "lernreise";

export interface TimelineEntry {
  period: string;
  title: string;
  org?: string;
  desc?: string;
  tags?: string[];
  type: TimelineType;
  /** lernreise = zweite Spur (KI-Weg) */
  track: "haupt" | "ki";
  placeholder?: boolean;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  clusterId: string;
  /** Position im SVG-Viewport (0-100, wird skaliert) */
  x: number;
  y: number;
  /** Cluster-Stern (groß) vs. Satellit */
  level: "cluster" | "satellite";
  desc: string;
  proof?: { text: string; href?: string };
}
export interface KnowledgeCluster {
  id: string;
  label: string;
  x: number;
  y: number;
  /** Einzeiler fürs Detail-Panel im Kategorie-Explorer. */
  blurb?: string;
}
export interface KnowledgeEdge {
  from: string;
  to: string;
}

export interface SetupStat {
  value: string;
  label: string;
  source?: string; // belegbare Quelle (intern, nicht angezeigt)
}

export type LabStatus = "prototyp" | "laeuft" | "in-arbeit" | "konzept";
export interface LabConcept {
  id: string;
  title: string;
  status: LabStatus;
  statusNote: string;
  pitch: string;
  kmuAngle: string;
  flow: FlowSpec;
}

export interface ResearchDoc {
  slug: string;
  title: string;
  file: string; // Dateiname in content/research-docs/
  lines?: number;
  sections?: number;
  sizeKB?: number;
  desc: string;
  desktopOnly?: boolean;
  placeholder?: boolean; // noch nicht redigiert/kopiert
}
