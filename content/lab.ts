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
    statusNote: "Konzept",
    pitch:
      "Ein Assistent, der seine eigene Wissensbasis pflegt: Er liest alle verfügbaren Dateien — Dokumente, Notizen, Projektstände, Mails — und baut daraus automatisch eine durchsuchbare Datenbank über dich und deine Arbeit. Darauf aufbauend nimmt er Routineaufgaben ab: eingehende E-Mails lesen, Antwortentwürfe im eigenen Schreibstil vorbereiten und sie in einem eigenen UI zur Freigabe vorlegen. Den Stil lernt er aus deinen bisherigen Texten. Und er bleibt nicht stehen: In kurzen Interviews fragt er gezielt nach, was ihm an Wissen fehlt — und verbessert sich damit selbst.",
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
    id: "usecase-benchmarks",
    title: "Benchmark-System für meine Use-Cases",
    status: "konzept",
    statusNote: "Konzept",
    pitch:
      "Ein eigenes Benchmark-System, das keine generischen Leaderboards nachbetet, sondern meine echten Use-Cases testet: Parsing-Regeln vorschlagen, deutsche Belege extrahieren, Automations-Skripte schreiben. Gemessen wird pro Modell und pro Effort-Stufe — vom schnellen Solo-Lauf bis zum Multi-Agent-Workflow — nach Qualität, Kosten und Latenz. Weil sich die Modell-Landschaft wöchentlich ändert, läuft das System regelmäßig neu und gibt aktiv Feedback: 'Für Aufgabe X lohnt sich jetzt Modell Y.'",
    kmuAngle:
      "Modellwahl wird vom Bauchgefühl zum Messwert: Ein KMU sieht schwarz auf weiß, welches Modell für den eigenen Dokumenten-Workflow reicht — und ab wann das günstige lokale Modell den teuren Cloud-Aufruf ersetzt.",
    flow: {
      nodes: [
        { id: "cases", label: "Meine Use-Cases", sub: "Parsing · Extraktion · Skripte", lane: 0 },
        { id: "harness", label: "Test-Harness", sub: "feste Aufgaben + Soll-Ergebnisse", lane: 1, accent: "cyan" },
        { id: "models", label: "Modelle × Effort", sub: "lokal · Cloud · Solo bis Workflow", lane: 2 },
        { id: "score", label: "Bewertung", sub: "Qualität · Kosten · Latenz", lane: 3, accent: "violet" },
        { id: "report", label: "Laufendes Feedback", sub: "Empfehlung je Aufgabe", lane: 4 },
      ],
      edges: [
        { from: "cases", to: "harness", animated: true },
        { from: "harness", to: "models", animated: true },
        { from: "models", to: "score", animated: true },
        { from: "score", to: "report", animated: true },
        { from: "report", to: "harness", label: "neue Modelle" },
      ],
    },
  },
  {
    id: "model-specialization",
    title: "Modell-Spezialisierung statt Modell-Gigantismus",
    status: "konzept",
    statusNote: "Konzept",
    pitch:
      "Open-Weight-Modelle (lokal via Ollama oder über Ollama Cloud) gezielt auf einen Use-Case nachtrainieren, statt für alles das größte Modell zu mieten: ein kleines Modell, das nur deutsche Geschäftsbelege oder das eigene Produktvokabular versteht — dafür schneller, günstiger und komplett on-prem. Die Trainingsdaten entstehen bei mir nebenbei: die 364 kuratierten Regeln des Lieferschein-Processors und die bestätigten Extraktionen aus DocuFlow sind genau die Feedback-Datensätze, die man dafür braucht.",
    kmuAngle:
      "Für KMU der realistische Weg zu eigener KI: kein Riesenmodell, sondern ein kleiner Spezialist fürs eigene Vokabular — bezahlbar trainiert, lokal betrieben, mit jedem bestätigten Beleg besser.",
    flow: {
      nodes: [
        { id: "base", label: "Open-Weight-Basis", sub: "Ollama · Ollama Cloud", lane: 0 },
        { id: "data", label: "Eigene Daten", sub: "364 Regeln · bestätigte Extraktionen", lane: 0 },
        { id: "tune", label: "Nachtraining", sub: "LoRA / Finetune", lane: 1, accent: "cyan" },
        { id: "spec", label: "Spezialmodell", sub: "klein · schnell · on-prem", lane: 2, accent: "violet" },
        { id: "loop", label: "Feedback-Loop", sub: "Accept/Reject als neue Daten", lane: 3 },
      ],
      edges: [
        { from: "base", to: "tune", animated: true },
        { from: "data", to: "tune", animated: true },
        { from: "tune", to: "spec", animated: true },
        { from: "spec", to: "loop", animated: true },
        { from: "loop", to: "tune", label: "besser werden", animated: true },
      ],
    },
  },
  {
    id: "meta-prompting",
    title: "Meta-Prompting — ein Agent promptet den Agenten",
    status: "konzept",
    statusNote: "Konzept",
    pitch:
      "Hermes führt das Vorgespräch mit mir: Er fragt nach, bis klar ist, was ich wirklich will — und formuliert daraus den präzisen Arbeitsauftrag für eine Claude-Code-Session, deutlich besser als ein schneller Prompt zwischen Tür und Angel. Dazu verwaltet er die Kontingente: Aufträge landen in einer Warteschlange und starten automatisch, sobald das Session-Limit wieder frei ist — auch nachts um drei.",
    kmuAngle:
      "Mitarbeitende beschreiben Aufgaben in ihren eigenen Worten; der Meta-Agent übersetzt sie in saubere KI-Arbeitsaufträge und taktet teure Kontingente optimal aus. Niemand braucht eine Prompt-Schulung.",
    flow: {
      nodes: [
        { id: "me", label: "Mensch", sub: "grobe Idee", lane: 0 },
        { id: "hermes", label: "Hermes", sub: "Interview · Prompt-Optimierung", lane: 1, accent: "cyan" },
        { id: "queue", label: "Warteschlange", sub: "wartet auf freies Kontingent", lane: 2 },
        { id: "cc", label: "Claude-Code-Session", sub: "führt aus", lane: 3, accent: "violet" },
        { id: "out", label: "Ergebnis", lane: 4 },
      ],
      edges: [
        { from: "me", to: "hermes", animated: true },
        { from: "hermes", to: "me", label: "fragt nach" },
        { from: "hermes", to: "queue", animated: true },
        { from: "queue", to: "cc", label: "Limit frei", animated: true },
        { from: "cc", to: "out", animated: true },
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
    statusNote: "läuft auf meinem Server",
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
