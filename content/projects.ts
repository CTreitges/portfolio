import type { MiniTool, Project } from "./types";

/**
 * Kuratierte Projekte. Lieferschein-Processor ist das Aushängeschild (flagship).
 * Jedes Projekt trägt eine Entstehungsgeschichte (origin) und einen aktuellen
 * Stand (currentStatus). Zahlen sind belegbar; Sensibles bleibt draußen.
 */
export const projects: Project[] = [
  {
    slug: "lieferschein-processor",
    title: "Lieferschein-Processor",
    tagline:
      "Wöchentlich im Echtbetrieb: Event-Bedarfs-PDFs → Produktions-Excel für die Küche + Beschriftungskarten mit Allergenen.",
    featured: true,
    flagship: true,
    status: "produktiv",
    relevance: "Automatisierung",
    stack: [
      "Python",
      "Streamlit",
      "pdfplumber",
      "openpyxl",
      "Claude API",
      "python-docx",
      "Git-Sync",
    ],
    summary:
      "Mein Aushängeschild: eine produktiv genutzte Anwendung für einen Gastronomiebetrieb (DerTeller Gastronomics). Sie liest die PDF-Bedarfsübersichten der Events ein — also welche Lebensmittel und Gerichte fürs jeweilige Event gebraucht werden — und überträgt sie über ein 364-Regeln-Regelwerk in eine Excel-Produktionsübersicht für die Küche. Parallel entstehen Beschriftungskarten mit den passenden Allergenen. Eine Fehlererkennung fängt unbekannte Positionen ab, und die Regelwerk-Pflege ist KI-gestützt: für jede unbekannte Position schlägt Claude eine neue Regel vor — mit Begründung und Accept/Reject.",
    origin:
      "Entstanden aus einer Frage in meinem Werkstudenten-Job, ob sich so etwas mit KI lösen ließe — ich habe mich reingefuchst und es bis zum Produktivbetrieb gebracht.",
    currentStatus:
      "Seit September 2025 in wöchentlichem Produktiveinsatz, laufend weiterentwickelt.",
    headlineMetric: { value: "482", label: "automatisierte Tests" },
    // Alle Aufnahmen mit einer rein synthetischen Dummy-Bedarfsübersicht
    // (Event "Musterfirma") — keine echten Event-/Kunden-/Gästedaten.
    screenshots: [
      {
        src: "/projects/lieferschein-processor/01-parser-verlauf.webp",
        thumb: "/projects/lieferschein-processor/01-parser-verlauf-thumb.webp",
        alt: "Streamlit-Oberfläche des Lieferschein-Processors mit Verlauf-Tab: Tabelle der verarbeiteten PDF-Datei, Zähler erfolgreicher Updates und Download-Schaltflächen.",
        caption:
          "Verlauf nach der Verarbeitung einer Bedarfsübersicht: erkannte Metadaten (Event, Wochentag, PAX), erfolgreiche Excel-Updates und Downloads für Excel und Beschriftungen.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/lieferschein-processor/02-fehlererkennung.webp",
        thumb: "/projects/lieferschein-processor/02-fehlererkennung-thumb.webp",
        alt: "Ergebnisbereich der App mit roten Fehlermeldungen zu nicht zugeordneten Einträgen einer verarbeiteten Test-PDF.",
        caption:
          "Automatische Fehlererkennung: nicht zugeordnete PDF-Positionen und ein Trigger-Treffer ohne passendes Excel-Produkt, einzeln quittierbar.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/lieferschein-processor/03-debug-matching.webp",
        thumb: "/projects/lieferschein-processor/03-debug-matching-thumb.webp",
        alt: "Debug-Tabelle mit Zeilenstatus matched/unmatched, Mengen, Größenblöcken und Trigger-Schlüsseln pro PDF-Zeile.",
        caption:
          "Debug-Ansicht des Parsers: jede PDF-Zeile mit Menge, Größenblock und Trigger-Zuordnung — 13 von 15 Zeilen gematcht, 2 bewusst unbekannte Positionen.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/lieferschein-processor/04-excel-tabelle.webp",
        thumb: "/projects/lieferschein-processor/04-excel-tabelle-thumb.webp",
        alt: "Tabellen-Tab mit Excel-Vorschau: Produktzeilen mit Einheiten und eingetragenen Mengen aus der verarbeiteten Test-PDF.",
        caption:
          "Vorschau der aktualisierten Produktionsübersicht direkt in der App: die erkannten Mengen sind in die Excel-Spalte des Events gebucht.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/lieferschein-processor/05-ki-vorschlaege.webp",
        thumb: "/projects/lieferschein-processor/05-ki-vorschlaege-thumb.webp",
        alt: "Bereich KI-gestützte Fehlerbehebung mit zwei Regel-Vorschlägen, Zielprodukt-Auswahl und Schaltflächen zum Annehmen oder Erstellen.",
        caption:
          "KI-Vorschlags-UI im Regelwerk: Vorschläge für neue Regeln zu unbekannten Positionen, filterbar und per Annehmen/Verwerfen anwendbar.",
        width: 1600,
        height: 1000,
      },
    ],
    caseStudy: {
      aiCore: true,
      problem: [
        "Bei DerTeller müssen Woche für Woche die Bedarfsübersichten der Events — welche Lebensmittel und Gerichte die Küche produzieren muss — in einen sauberen Produktionsplan überführt werden. Von Hand ist das mühsam und fehleranfällig.",
        "Die Event-PDFs sind uneinheitlich, und es tauchen ständig neue Gerichte und Schreibweisen auf; ein starres Parsing-Schema scheitert daran.",
      ],
      approach: [
        "Spaltenbasiertes PDF-Parsing (pdfplumber) liest pro Event Menge, Produkttext, Datum und Personenzahl (PAX) aus; Abschnitte wie 'Am Eventtag' oder 'Equipment' werden automatisch ausgeblendet.",
        "Ein gepflegtes Regelwerk (364 Regeln) bildet jede erkannte Position auf die kanonischen Excel-Produkte samt Größe ab; die Mengen werden direkt aus der Übersicht übernommen und nach Wochentag in die Produktions-Excel gebucht.",
        "Fehlererkennung für alle Fälle (nicht zugeordnete Positionen, fehlende Produkte, Validierung, Blacklist) — übersichtlich pro Event im Verlauf.",
        "KI-gestützte Regelwerk-Pflege: für jede unbekannte Position schlägt Claude eine neue Regel, einen ähnlichen Treffer oder einen Blacklist-Eintrag vor — mit Begründung und Accept/Reject. Dazu Beschriftungskarten (DOCX/PDF) mit den event-relevanten Allergenen; Regelwerk versioniert via Git-Sync, Auslieferung als selbst-aktualisierendes Windows-Programm.",
      ],
      architecture: {
        nodes: [
          { id: "pdf", label: "Event-Bedarfs-PDF", sub: "Menge · Datum · PAX", lane: 0 },
          { id: "parse", label: "Parser", sub: "pdfplumber, Spalten", lane: 1 },
          { id: "rules", label: "Regelwerk", sub: "364 Regeln · Trigger→Produkt", lane: 2 },
          { id: "ai", label: "KI-Regelpflege", sub: "Claude-Vorschläge", lane: 2, accent: "cyan" },
          { id: "xlsx", label: "Produktions-Excel", sub: "Küche, je Wochentag", lane: 3, accent: "violet" },
          { id: "labels", label: "Beschriftungskarten", sub: "Allergene", lane: 3 },
        ],
        edges: [
          { from: "pdf", to: "parse", animated: true },
          { from: "parse", to: "rules", animated: true },
          { from: "rules", to: "ai", label: "unbekannt", animated: true },
          { from: "ai", to: "rules", label: "gepflegt" },
          { from: "rules", to: "xlsx", animated: true },
          { from: "rules", to: "labels", animated: true },
        ],
      },
      results: [
        "Im realen wöchentlichen Einsatz bei DerTeller Gastronomics — von der Event-Bedarfsübersicht zum fertigen Küchen-Produktionsplan plus Beschriftungskarten.",
        "364 Regeln (rund 200 mit Allergen-, ~150 mit Beschriftungs-Angaben); 83 KI-Vorschläge bearbeitet (67 angenommen, 16 abgelehnt).",
        "Abgesichert durch eine 482-Tests-Suite (Parser-Korpus + Playwright-E2E gegen die laufende App), zuletzt vollständig grün.",
        "~16.000 Zeilen Code im Kern; ausgeliefert als selbst-aktualisierendes Windows-Programm.",
      ],
      metrics: [
        { value: "482", label: "Tests grün" },
        { value: "364", label: "Regeln" },
        { value: "wöchentlich", label: "Echtbetrieb" },
      ],
      itFabrik:
        "Das Paradebeispiel für 'interne Abläufe automatisieren': ein wiederkehrender, manueller Büroprozess, der durch Regel-Engine plus KI-Unterstützung auf Knopfdruck läuft — produktiv, getestet, gewartet. Genau die Art Lösung, die ein KMU-Systemhaus für seine Kunden baut.",
      learnings: [
        "Regelwerk + KI-Vorschläge schlägt reines LLM-Parsing: nachvollziehbar, korrigierbar, kein Halluzinieren von Mengen.",
        "Ein Accept/Reject-Loop macht die KI zum Assistenten statt zur Blackbox — der Mensch behält die Kontrolle.",
        "Das Projekt ist mit meinem Werkzeug gewachsen: von JetBrains Junie zu Claude Code — die KI-Tools haben den Sprung in Tempo und Tiefe gebracht.",
      ],
      timeline: [
        { period: "09/2025", text: "Projektstart, erste Version mit JetBrains Junie." },
        { period: "bis Ende 2025", text: "Parser, Regelwerk und erster Echtbetrieb mit Junie ausgebaut." },
        { period: "Ende 2025 / Anf. 2026", text: "Umstieg auf Claude Code." },
        { period: "2026", text: "KI-Vorschlagssystem, 482-Test-Suite, Regel-Builder, Allergen-Logik, selbst-aktualisierende EXE." },
        { period: "heute", text: "Wöchentlich produktiv bei DerTeller, laufend gepflegt." },
      ],
      screenshotNote:
        "Arbeitgeber DerTeller mit Einverständnis genannt; Screenshots mit anonymisierten Dummy-Daten — keine echten Event-, Kunden- oder Gästedaten.",
    },
  },
  {
    slug: "docuflow",
    title: "DocuFlow",
    tagline: "Rechnungen & Belege → strukturierte Daten, vollständig lokal.",
    featured: true,
    status: "aktiv",
    relevance: "Lokale KI",
    repo: "https://github.com/CTreitges/DocuFlow",
    stack: ["Python", "FastAPI", "Svelte 5", "Ollama", "german-ocr", "SQLite"],
    summary:
      "Ein Dokumenten-Tool, das eingehende PDFs und Bilder per lokalem OCR-Modell (german-ocr über Ollama) ausliest — ein Cloud-Modell (Qwen über Ollama Cloud) springt nur als Fallback ein —, bekannte Absender über Templates erkennt und nach selbst definierten Regeln einsortiert. Im Normalfall verlässt kein Dokument das Haus. Aus bestätigten Extraktionen generiert es automatisch neue Templates und wird mit jedem Beleg schneller.",
    origin:
      "Entstanden aus der Anfrage eines Kumpels, der einen Elektriker-Betrieb führt und seine Belege nicht in die Cloud geben wollte.",
    currentStatus:
      "In aktiver Entwicklung; Frontend auf Svelte 5 + FastAPI migriert, OCR-Pipeline steht.",
    headlineMetric: { value: "3-stufig", label: "OCR-Pipeline" },
    // Demo-Lauf mit fiktiven Rechnungen (Elektro Mustermann GmbH u.a.),
    // ungültigen IBANs (DE00…) und neutralen Pfaden.
    screenshots: [
      {
        src: "/projects/docuflow/01-eingang-pruefansicht.webp",
        thumb: "/projects/docuflow/01-eingang-pruefansicht-thumb.webp",
        alt: "Dunkle DocuFlow-Oberfläche: Tabelle eingegangener Rechnungs-PDFs mit Status- und Konfidenz-Spalten, darunter Prüf-Panel mit extrahierten Feldern einer fiktiven Beispielrechnung.",
        caption:
          "Dokumenten-Eingang mit Prüf-Ansicht: per Template extrahierte Rechnungsfelder (Absender, Betrag, IBAN, Zahlungsziel) mit Konfidenz-Badges, direkt editierbar.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/docuflow/02-regel-editor.webp",
        thumb: "/projects/docuflow/02-regel-editor-thumb.webp",
        alt: "Regel-Editor in DocuFlow: aufgeklappte Regel 'Handwerker-Rechnungen' mit Bedingungszeilen, Zielordner-Platzhaltern wie {jahr} und Dateinamens-Bausteinen samt Pfadvorschau.",
        caption:
          "Sortier-Regeln im Schema WANN → WOHIN → WIE BENENNEN: Bedingungen, Zielordner mit Platzhaltern und Dateinamens-Bausteine mit Live-Pfadvorschau.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/docuflow/03-dashboard.webp",
        thumb: "/projects/docuflow/03-dashboard-thumb.webp",
        alt: "DocuFlow-Dashboard: vier Kennzahl-Karten, Tabelle sortierter Dokumente mit Zielpfaden und ein Aktivitäts-Log mit Einträgen zu Template-Erkennung und Sortierung.",
        caption:
          "Dashboard mit Status-Kennzahlen, einsortierten Dokumenten samt Zielpfad und Aktivitäts-Log mit Template-Match-Scores.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/docuflow/04-ocr-debug.webp",
        thumb: "/projects/docuflow/04-ocr-debug-thumb.webp",
        alt: "OCR-Debug-Ansicht in DocuFlow: dreistufige Pipeline-Anzeige mit Häkchen für Text-Extraktion und Template-Match sowie Raster der extrahierten Rechnungsfelder.",
        caption:
          "Pipeline-Diagnose an einem Beleg: Text-Extraktion → Template-Match (100 %) → OCR-Fallback übersprungen, darunter alle extrahierten Felder mit Konfidenz.",
        width: 1600,
        height: 1000,
      },
    ],
    caseStudy: {
      aiCore: true,
      problem: [
        "Eingehende Rechnungen und Belege manuell zu sichten, umzubenennen und abzulegen kostet Zeit und ist fehleranfällig.",
        "Cloud-OCR-Dienste scheiden für sensible Geschäftsdokumente aus Datenschutzgründen aus.",
      ],
      approach: [
        "Dreistufige Pipeline: zuerst nativer PDF-Text, dann Template-Match für bekannte Absender, erst zuletzt das OCR-Modell — primär lokal (german-ocr über Ollama), ein Cloud-Modell (Qwen über Ollama Cloud) nur als Fallback.",
        "Aus bestätigten KI-Extraktionen generiert das System automatisch neue Templates — es wird mit jedem Beleg schneller und sicherer.",
        "Sortier-Regeln (WANN → WOHIN → WIE-BENANNT) als visueller Editor; Inbox-Workflow mit menschlicher Bestätigung vor jeder Ablage.",
      ],
      architecture: {
        nodes: [
          { id: "in", label: "PDF / Bild", lane: 0 },
          { id: "text", label: "Text-Extraktion", sub: "PyMuPDF", lane: 1 },
          { id: "tpl", label: "Template-Match", sub: "bekannte Absender", lane: 1, accent: "violet" },
          { id: "ocr", label: "OCR-Modell", sub: "german-ocr lokal · Qwen Fallback", lane: 2, accent: "cyan" },
          { id: "rules", label: "Regel-Engine", lane: 3 },
          { id: "out", label: "Sortiert + benannt", lane: 4 },
        ],
        edges: [
          { from: "in", to: "text", animated: true },
          { from: "text", to: "tpl" },
          { from: "tpl", to: "ocr", animated: true },
          { from: "ocr", to: "rules", animated: true },
          { from: "tpl", to: "rules" },
          { from: "rules", to: "out", animated: true },
        ],
      },
      results: [
        "Voll funktionsfähiges Desktop-Tool: FastAPI-Backend, Svelte-5-Frontend, lokale Inferenz.",
        "Selbstlernendes Template-System reduziert die LLM-Aufrufe über die Zeit.",
      ],
      metrics: [
        { value: "lokal", label: "german-ocr (Cloud nur Fallback)" },
        { value: "3", label: "Pipeline-Stufen" },
        { value: "on-prem", label: "Default ohne Cloud" },
      ],
      itFabrik:
        "Genau das Muster, das ein KMU-Systemhaus für seine Kunden braucht: KI-gestützte Dokumentenverarbeitung, die aus Datenschutzgründen komplett on-premise läuft.",
      learnings: [
        "Ein lokales Vision-LLM ist für deutsche Geschäftsdokumente praxistauglich — wenn man es als Fallback hinter günstigere Stufen setzt.",
        "Menschliche Bestätigung vor der Ablage ist kein Rückschritt, sondern schafft Vertrauen in die Automatisierung.",
      ],
      screenshotNote: "Demo mit Dummy-Belegen.",
    },
  },
  {
    slug: "ordio-csv",
    title: "Ordio-Perso-CSV",
    tagline:
      "Handschriftliche Personalbögen → HR-Import-Datei, mit datenschutzkonformem OCR.",
    featured: false,
    status: "prototyp",
    relevance: "Lokale KI",
    stack: [
      "Python",
      "Mistral Vision API",
      "Ollama",
      "pypdf",
      "reportlab",
      "openpyxl",
      "Tkinter",
    ],
    summary:
      "Ein Werkzeug, das ausgefüllte Personalfragebögen (digital oder handschriftlich) ausliest und daraus die Import-Datei für die Personalsoftware Ordio erzeugt — samt Kontroll-PDF zur Sichtprüfung. Der spannende Teil: ein Zweig, der handschriftliche Bögen per Vision-OCR transkribiert — wahlweise über die EU-gehostete Mistral-API (mit vollständig durchdachter DSGVO-Auftragsverarbeitung) oder komplett lokal via Ollama. Weil es um hochsensible Daten geht, war Datenschutz von Anfang an ein First-Class-Feature.",
    origin:
      "Entstanden aus dem realen Onboarding-Aufwand im Gastronomiebetrieb: Papier-Personalbögen mussten Stück für Stück in die Personalsoftware Ordio — ein perfekter Anlass, OCR und Datenschutz ernsthaft zu durchdenken.",
    currentStatus:
      "Produktiv-Zweig (digitale Formulare) stabil; OCR-Zweig (Mistral/Ollama) als dokumentierter Prototyp.",
    headlineMetric: { value: "2 Wege", label: "EU-Cloud / lokal" },
    caseStudy: {
      aiCore: true,
      problem: [
        "Stammdaten neuer Mitarbeiter landen auf Papier-Personalbögen; die Übertragung in die Personalsoftware Ordio ist mühsam und fehleranfällig.",
        "Die Daten sind hochsensibel (Sozialversicherung, Bankverbindung, teils Art.-9-DSGVO-Daten) — Datenschutz ist kein Nachgedanke, sondern Voraussetzung.",
      ],
      approach: [
        "Digitale Formulare werden direkt aus den PDF-Feldern (AcroForm) gelesen; handschriftliche Bögen per Vision-OCR transkribiert.",
        "Zwei bewusst gewählte OCR-Wege: die EU-gehostete Mistral-API mit vollständiger Auftragsverarbeitung (DPA, Training-Opt-out, Zero-Data-Retention, VVT-Eintrag) — oder komplett lokal via Ollama, dann ganz ohne Auftragsverarbeiter.",
        "Strenge Format-Validierung (IBAN, Sozialversicherungs- und Steuernummer per Regex) plus eine klare Prompt-Regel: im Zweifel leer lassen statt raten.",
        "Ausgabe als Ordio-Import-Datei plus lesbares Kontroll-PDF zur manuellen Sichtprüfung vor dem Import.",
      ],
      architecture: {
        nodes: [
          { id: "form", label: "Personalbogen", sub: "digital / Scan", lane: 0 },
          { id: "acro", label: "AcroForm-Lesen", sub: "digitale Felder", lane: 1 },
          { id: "ocr", label: "Vision-OCR", sub: "Mistral EU / Ollama", lane: 1, accent: "cyan" },
          { id: "valid", label: "Validierung", sub: "IBAN · SV-Nr · Steuer-ID", lane: 2, accent: "violet" },
          { id: "out", label: "Ordio-Datei + Kontroll-PDF", lane: 3 },
        ],
        edges: [
          { from: "form", to: "acro", label: "digital", animated: true },
          { from: "form", to: "ocr", label: "handschriftlich", animated: true },
          { from: "acro", to: "valid", animated: true },
          { from: "ocr", to: "valid", animated: true },
          { from: "valid", to: "out", animated: true },
        ],
      },
      results: [
        "Funktionierender Produktiv-Zweig für digitale Formulare; dokumentierter OCR-Prototyp mit zwei Datenschutz-Wegen.",
        "Vollständige DSGVO-Dokumentation (Auftragsverarbeitung nach Art. 28, VVT-Eintrag, Opt-out-Nachweis) als Teil des Repos.",
      ],
      metrics: [
        { value: "2", label: "OCR-Wege (EU / lokal)" },
        { value: "Art. 28", label: "DSGVO durchdacht" },
        { value: "0", label: "Raten — leer statt falsch" },
      ],
      itFabrik:
        "Zeigt Datenschutz als Design-Disziplin: die bewusste Wahl zwischen EU-Cloud-OCR mit sauberer Auftragsverarbeitung und vollständig lokaler Verarbeitung — exakt die Abwägung, die ein Systemhaus mit sensiblen Kundendaten treffen muss.",
      learnings: [
        "Datenschutz gehört in die Architektur, nicht in den Anhang: Wer zuerst über DPA, Retention und Opt-out nachdenkt, baut die richtige Lösung.",
        "Ein lokaler OCR-Fallback (Ollama) nimmt die ganze Auftragsverarbeiter-Last raus — manchmal ist 'kein Dienstleister' die beste Compliance.",
        "Strikte Validierung schlägt blindes Vertrauen ins Modell: lieber ein leeres Feld zur Nachprüfung als eine falsche Bankverbindung.",
      ],
      screenshotNote:
        "Wegen der hochsensiblen Daten ohne Screenshots — die Verarbeitung zeige ich gern im Gespräch, mit fiktiven Mustern.",
    },
  },
  {
    slug: "cascade-bot",
    title: "Cascade-Bot-MCP",
    tagline:
      "Ein Telegram-Bot, der KI-Agenten im Plan→Implement→Review-Takt orchestriert — meine Brücke zum agentischen Arbeiten.",
    featured: false,
    status: "archiviert",
    relevance: "Multi-Agent",
    repo: "https://github.com/CTreitges/Cascade-Bot-MCP",
    stack: ["Python", "MCP", "Telegram", "Opus", "Sonnet", "Ollama/GLM"],
    summary:
      "Ein MCP-Server plus Telegram-Bot, der eine Agenten-Kette steuert: Opus plant, ein günstigeres Cloud- oder lokales Modell implementiert, Sonnet reviewt — mit Live-Status direkt im Telegram-Chat. Es war meine Brücke vom reinen Chat zum agentischen Arbeiten. Ehrlich gesagt: durch die rasante Entwicklung von Claude Code (eigene Subagenten, Workflows) ist es heute weniger zentral — aber das Konzept (Modelle nach Kosten und Datenschutz mischen, Agenten unterwegs per Chat steuern) bleibt wertvoll.",
    origin:
      "Entstanden aus dem Wunsch, KI-Agenten auch unterwegs per Telegram zu steuern — mein Einstieg ins agentische Arbeiten, noch vor den heutigen Claude-Code-Bordmitteln.",
    currentStatus:
      "Übergangsprojekt, heute durch Claude-Code-Eigenentwicklungen abgelöst; Konzept und Telegram-Live-Steuerung leben weiter.",
    headlineMetric: { value: "3 Rollen", label: "Plan · Implement · Review" },
    caseStudy: {
      aiCore: true,
      problem: [
        "Komplexe Code-Aufgaben profitieren von Arbeitsteilung zwischen Modellen — aber das von Hand zu koordinieren ist mühsam.",
        "Man möchte einen laufenden Agenten-Job unterwegs verfolgen und steuern können, nicht nur am Rechner.",
      ],
      approach: [
        "Rollenbasierte Kette: Planner (Opus) → Implementer (Cloud-LLM oder lokales Ollama/GLM/DeepSeek) → Reviewer (Sonnet).",
        "Als MCP-Server gebaut, damit die Orchestrierung sauberer Bestandteil des Claude-Code-Ökosystems wird.",
        "Telegram als Steuer- und Statuskanal: Fortschritt, Rückfragen und Ergebnisse landen live im Chat.",
      ],
      architecture: {
        nodes: [
          { id: "tg", label: "Telegram", sub: "Auftrag + Live-Status", lane: 0 },
          { id: "mcp", label: "MCP-Server", sub: "Orchestrator", lane: 1, accent: "cyan" },
          { id: "plan", label: "Planner", sub: "Opus", lane: 2 },
          { id: "impl", label: "Implementer", sub: "Cloud / Ollama", lane: 2, accent: "violet" },
          { id: "rev", label: "Reviewer", sub: "Sonnet", lane: 2 },
          { id: "out", label: "Ergebnis + Review", lane: 3 },
        ],
        edges: [
          { from: "tg", to: "mcp", animated: true },
          { from: "mcp", to: "plan", animated: true },
          { from: "plan", to: "impl", animated: true },
          { from: "impl", to: "rev", animated: true },
          { from: "rev", to: "out", animated: true },
          { from: "out", to: "tg", label: "Live", animated: true },
        ],
      },
      results: [
        "Öffentliches Repo mit MCP-Server + Telegram-Integration.",
        "Modell-agnostischer Implementer: Cloud-LLM oder lokales Modell je nach Kosten/Datenschutz wählbar.",
      ],
      metrics: [
        { value: "3", label: "Agenten-Rollen" },
        { value: "Telegram", label: "Live-Steuerung" },
        { value: "Multi-Modell", label: "Opus · Sonnet · lokal" },
      ],
      itFabrik:
        "Zeigt praktisches Verständnis von Multi-Agent-Orchestrierung und Kostensteuerung — und die ehrliche Fähigkeit, ein Werkzeug einzuordnen: ein bewusster Zwischenschritt, dessen Ideen ich heute direkt in Claude Code nutze.",
      learnings: [
        "Arbeitsteilung zwischen Modellen lohnt sich, wenn die Rollen klar geschnitten sind.",
        "Ein Chat-Kanal als Mensch-im-Loop-Schnittstelle senkt die Hürde, Agenten produktiv einzusetzen.",
        "Werkzeuge altern — die Bereitschaft, ein eigenes Projekt durch das bessere abzulösen, gehört dazu.",
      ],
    },
  },
  {
    slug: "claude-code-setup",
    title: "Claude-Code-Setup",
    tagline:
      "Mein selbst gebauter KI-Arbeitsplatz: Memory, Hooks, Plan-Modus und Effort-Stufen über drei Maschinen.",
    featured: false,
    // Karte im Grid ausgeblendet: das Setup hat seine eigene Sektion
    // („Mein Maschinenraum"), die hierher verlinkt — keine Doppelung.
    hidden: true,
    status: "produktiv",
    relevance: "Tooling",
    stack: ["Claude Code", "MCP", "PowerShell", "Python", "systemd", "RLM"],
    summary:
      "Ein über Monate gewachsenes, selbst gebautes Setup rund um Claude Code: persistentes geteiltes Memory (RLM), eine Hook-Pipeline, eigene Skills und Commands, 13 MCP-Server, ein Plan-Modus mit wählbaren Effort-Stufen (bis hin zur Multi-Agent-Orchestrierung) und ein VPS mit dauerhafter, reboot-fester Session — alles synchronisiert über drei Maschinen.",
    origin:
      "Aus täglicher Arbeit gewachsen: je ernsthafter ich mit Claude Code arbeitete, desto mehr Gedächtnis, Werkzeuge und Leitplanken brauchte es — bis daraus ein eigenes System wurde.",
    currentStatus:
      "Täglich produktiv; zuletzt: VPS als dauerhafter Node, Effort-gesteuerte Workflows. Dokumentiert in einer eigenen 17-Sektionen-Architektur-Doku.",
    headlineMetric: { value: "730+", label: "persistierte Memories" },
    caseStudy: {
      aiCore: true,
      problem: [
        "Ein KI-Assistent ohne Gedächtnis vergisst jede Session — Entscheidungen, Fehler und Kontext gehen verloren.",
        "Wer KI ernsthaft als tägliches Werkzeug nutzt, braucht Leitplanken, Reproduzierbarkeit und Wiederverwendbarkeit.",
      ],
      approach: [
        "Eigenes, über alle Maschinen geteiltes Memory-System (RLM) mit semantischer und BM25-Suche: Funde, Entscheidungen und Bugs werden sofort als Insights und Session-Chunks persistiert — der VPS hält die kanonische Datenbank.",
        "Hook-Pipeline (16 Skripte über 6 Events) erzwingt Disziplin: Scope-Guards, Test-Erinnerungen, automatische Memory-Speicherung, Skill-Nudges.",
        "Plan-Modus zuerst, dann bewusste Wahl der Effort-Stufe — von schnellem Solo bis zur Multi-Agent-Orchestrierung für große Aufgaben; verteilt über zwei PCs, WSL und einen VPS per newer-wins-Sync.",
      ],
      architecture: {
        nodes: [
          { id: "machines", label: "3 Maschinen", sub: "PC · WSL · Oracle-VPS", lane: 0 },
          { id: "sync", label: "Sync", sub: "newer-wins · VPS kanonisch", lane: 1 },
          { id: "core", label: "Claude-Code-Kern", sub: "Hooks · Skills · Plan/Effort", lane: 2, accent: "cyan" },
          { id: "mcp", label: "13 MCP-Server", lane: 3, accent: "violet" },
          { id: "rlm", label: "RLM-Memory", sub: "Insights + Chunks", lane: 4, accent: "cyan" },
          { id: "out", label: "Linear · Git", lane: 5 },
        ],
        edges: [
          { from: "machines", to: "sync", animated: true },
          { from: "sync", to: "core", animated: true },
          { from: "core", to: "mcp", animated: true },
          { from: "mcp", to: "rlm", animated: true },
          { from: "rlm", to: "core", label: "Recall", animated: true },
          { from: "core", to: "out", animated: true },
        ],
      },
      results: [
        "730+ persistierte Insights, über drei Maschinen synchron gehalten (VPS als kanonische Quelle).",
        "16 Hook-Skripte über 6 Events, 6 Skills, 5 Commands, 13 MCP-Server, 1 Plugin.",
        "Plan-Modus + Effort-Stufen steuern, wie gründlich eine Aufgabe angegangen wird; ein VPS dient als vollwertiger, reboot-fester KI-Node mit persistenter Session.",
      ],
      metrics: [
        { value: "13", label: "MCP-Server" },
        { value: "16 / 6", label: "Hooks / Events" },
        { value: "3", label: "synchrone Maschinen" },
      ],
      itFabrik:
        "Beweist Hands-on-KI-Begeisterung in Reinform: kein Tutorial-Wissen, sondern ein selbst gebautes, produktiv genutztes KI-Arbeitssystem mit Memory, Guardrails und gestufter Workflow-Orchestrierung.",
      learnings: [
        "Persistentes, geteiltes Memory verändert, wie man mit einem KI-Assistenten arbeitet — Kontext wird zum Asset.",
        "Erst planen, dann die passende Effort-Stufe wählen: nicht jede Aufgabe braucht ein Agenten-Orchester, aber die großen profitieren enorm.",
      ],
    },
  },
  {
    slug: "audio-normalizer",
    title: "Audio Normalizer",
    tagline:
      "Lautheits-Normalisierung mit 100 % Dynamik-Erhalt — GUI und CLI, Rekordbox-kompatibel.",
    featured: false,
    status: "produktiv",
    relevance: "Tooling",
    repo: "https://github.com/CTreitges/AudioNormalizer",
    stack: ["Python", "PyQt6", "FFmpeg", "EBU R128", "pytest"],
    summary:
      "Eine Desktop-App für DJs, die Audiodateien auf einheitliche Lautheit bringt, ohne die Dynamik zu zerstören. Drei Modi (Peak, Loudness, Hybrid), Clipping-Schutz, Rekordbox-kompatibles Überschreiben mit Backup (erhält Cuepoints und Beatgrids) — GUI plus skriptbares CLI, sauber getrennt und durch über 50 Tests abgesichert.",
    origin:
      "Entstanden aus Ärger über die Abo-Gebühren vergleichbarer DJ-Software zur Set-Vorbereitung — also habe ich es selbst gebaut.",
    currentStatus: "Stabil (Version 5); modularisiert, Rekordbox-kompatibel.",
    headlineMetric: { value: "50+", label: "automatisierte Tests" },
    // GUI offscreen gerendert; ausschließlich fiktive Demo-Tracks
    // (per ffmpeg generierte Sinus-WAVs).
    screenshots: [
      {
        src: "/projects/audio-normalizer/01-hauptfenster-hybrid.webp",
        thumb: "/projects/audio-normalizer/01-hauptfenster-hybrid-thumb.webp",
        alt: "Audio Normalizer Hauptfenster: Modus-Auswahl auf Hybrid-Normalizing mit vier Parameterfeldern, Drag-and-drop-Zone und Liste mit drei geladenen WAV-Demo-Tracks.",
        caption:
          "Hauptfenster im Hybrid-Modus: Ziel-Peak, Max True Peak, maximale Abweichung und Referenz-LUFS als Batch-Parameter für drei Demo-Tracks.",
        width: 1560,
        height: 1760,
      },
      {
        src: "/projects/audio-normalizer/02-loudness-modus.webp",
        thumb: "/projects/audio-normalizer/02-loudness-modus-thumb.webp",
        alt: "Audio Normalizer im Loudness-Normalizing-Modus: Eingabefelder für Ziel-Loudness in LUFS und Max True Peak sowie Checkbox zum Überschreiben mit Backup.",
        caption:
          "Loudness-Normalisierung nach EBU R128 mit Ziel-LUFS und True-Peak-Limit — inklusive Rekordbox-kompatiblem Überschreiben.",
        width: 1560,
        height: 1760,
      },
    ],
    caseStudy: {
      aiCore: false,
      problem: [
        "DJ-Sets brauchen einheitliche Lautheit — gängige Normalizer zerstören dabei aber die Dynamik oder die Rekordbox-Cuepoints.",
        "Manuelles Anpassen pro Track ist bei großen Bibliotheken unzumutbar — und fertige Tools kosten laufend Abo-Gebühren.",
      ],
      approach: [
        "Drei Normalisierungs-Modi inkl. Hybrid, der pro Track zwischen Peak und Loudness (EBU R128) entscheidet — lineare Verstärkung, keine Kompression.",
        "Rekordbox-Kompatibilität: WAV/FLAC-Grenzen, Metadaten-Strip, Überschreiben-mit-Backup, das Cuepoints und Beatgrids erhält.",
        "Saubere Architektur: Qt-freie Engine, separates CLI, atomares Schreiben — abgesichert durch über 50 Tests ohne FFmpeg-Abhängigkeit.",
      ],
      results: [
        "Stabile App mit GUI und CLI, 25 Module, 8 Test-Suites.",
        "Erhält DJ-kritische Metadaten (Cuepoints/Beatgrids) beim Überschreiben.",
      ],
      metrics: [
        { value: "3", label: "Normalisierungs-Modi" },
        { value: "7", label: "Audio-Formate" },
        { value: "50+", label: "Tests (pytest)" },
      ],
      itFabrik:
        "Zeigt sauberes Software-Engineering: klare Trennung von Engine/CLI/GUI, hohe Testabdeckung, durchdachter Umgang mit Edge-Cases — Handwerk, das auf jedes Projekt übertragbar ist.",
      learnings: [
        "Testbarkeit beginnt bei der Architektur: eine Qt-freie Engine lässt sich vollständig ohne GUI prüfen.",
        "Domänenwissen (Rekordbox-Eigenheiten) entscheidet über die Praxistauglichkeit mehr als der Algorithmus.",
      ],
      screenshotNote: "Screenshots mit fiktiven Demo-Tracks.",
    },
  },
  {
    slug: "pc-mover",
    title: "PC Mover",
    tagline:
      "Ein PC-Umzug auf Knopfdruck: installierte Programme samt Einstellungen sichern und auf einem neuen Rechner wiederherstellen.",
    featured: false,
    status: "aktiv",
    relevance: "Infrastruktur",
    repo: "https://github.com/CTreitges/PCMover",
    stack: ["PowerShell 7", "Windows Forms", "robocopy", "Registry"],
    summary:
      "Ein PowerShell-Werkzeug mit Windows-Forms-Oberfläche, das installierte Programme über die Registry erkennt und ihre Bestandteile — Programmverzeichnis, AppData, Registry-Einträge, Dokumente — als strukturierte Backups sichert. Auf einem neuen Rechner lassen sie sich selektiv wiederherstellen; robocopy und bis zu vier parallele Jobs machen es schnell und robust.",
    origin:
      "Entstanden aus den Abo-Gebühren vergleichbarer Umzugs-Tools — und weil die nötigen Microsoft-Bordmittel ohnehin verfügbar waren, lag es nahe, es selbst zu bauen.",
    currentStatus: "Funktionsfähig auf Windows 10/11; gelegentlich erweitert.",
    headlineMetric: { value: "4×", label: "parallele Jobs" },
    caseStudy: {
      aiCore: false,
      problem: [
        "Ein neuer PC bedeutet sonst stundenlanges Neuinstallieren und Nachkonfigurieren jeder einzelnen Anwendung.",
        "Programmdaten verteilen sich über Programmverzeichnis, AppData, Registry und Dokumente — leicht etwas zu vergessen.",
      ],
      approach: [
        "Registry-Scan (HKLM 64/32-bit, HKCU) erzeugt eine Liste installierter Software mit Pfaden und Metadaten.",
        "Pro Programm werden Programmverzeichnis (robocopy), AppData, Registry-Dumps und Dokumente als Backup mit Manifest gesichert.",
        "Wiederherstellung selektiv pro Komponente mit Fortschrittsanzeige; bis zu vier Programme werden parallel verarbeitet.",
      ],
      results: [
        "Funktionierendes Migrations-Tool für Windows 10/11 mit Tab-Oberfläche (Export/Import).",
        "Manifest-Tracking und Export-Log pro Programm; robocopy-Retry-Policy gegen Netzwerk-Aussetzer.",
      ],
      metrics: [
        { value: "4×", label: "parallele Jobs" },
        { value: "4", label: "Komponenten je Programm" },
        { value: "Win 10/11", label: "kompatibel" },
      ],
      itFabrik:
        "Belegt Windows- und PowerShell-Kompetenz fürs Tagesgeschäft eines Systemhauses: genau die Art Werkzeug, das man für PC-Rollouts und Hardware-Wechsel beim Kunden selbst baut.",
      learnings: [
        "robocopy nimmt einem die robusten Kopier-Details ab — Retry/Wait-Policy schlägt selbstgebaute Schleifen.",
        "Ein Manifest pro Programm macht die Wiederherstellung nachvollziehbar und selektiv.",
      ],
      screenshotNote:
        "Ohne Screenshots — das Tool zeige ich gern live, ohne echte Registry-Daten.",
    },
  },
  {
    slug: "pa-streaming-hub",
    title: "PA-Streaming-Hub",
    tagline:
      "Eine deklarative NixOS-Appliance, die direkt in eine Streaming-Kiosk-Oberfläche bootet — für den PA-Verleih.",
    featured: false,
    status: "prototyp",
    relevance: "Infrastruktur",
    stack: ["NixOS", "FastAPI", "PipeWire", "go-librespot", "cage", "systemd"],
    summary:
      "Ein Verleih-System für PA-Anlagen: ein Mini-PC bootet ohne Desktop direkt in eine Streaming-Oberfläche. Mieter wählen per Weboberfläche Spotify Connect, Bluetooth oder USB; eine PipeWire-DSP-Kette bietet drei Sound-Profile (Hintergrund, Party, Sprache). Das ganze System ist deklarativ in NixOS beschrieben — reproduzierbar, versioniert, bei jedem Boot in sauberem Zustand (Mieter-Daten überleben keinen Neustart). Ein PIN-geschützter Admin-Bereich gehört dem Vermieter.",
    origin:
      "Entstanden aus meinem Kleingewerbe für Musikveranstaltungen: verliehene PA-Technik sollte sich ohne IT-Kenntnisse bedienen lassen — und nach jedem Verleih sauber zurückfallen.",
    currentStatus:
      "Grundstein gelegt: Architektur und Backend stehen, aber die Streaming-Dienst-Links und die Oberfläche sind noch nicht vollständig funktional. Wird bei Gelegenheit weiterentwickelt.",
    headlineMetric: { value: "deklarativ", label: "System als Code" },
    // Dev-Lauf mit Stub-Adaptern und rein fiktiven Demo-Daten
    // (Geräte, SSIDs, Tracks) — Kiosk-Viewport.
    screenshots: [
      {
        src: "/projects/pa-streaming-hub/01-mieter-hub.webp",
        thumb: "/projects/pa-streaming-hub/01-mieter-hub-thumb.webp",
        alt: "Dunkle Kiosk-Oberfläche mit Kacheln zur Musikquellen-Auswahl, Now-Playing-Anzeige eines laufenden Spotify-Titels, Lautstärkeregler und drei DSP-Profil-Buttons.",
        caption:
          "Kiosk-Startseite für Mieter: Streaming-Quellen, Now-Playing-Banner, Lautstärke und DSP-Schnellwahl — bedienbar ohne IT-Kenntnisse.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/pa-streaming-hub/02-dsp-profile.webp",
        thumb: "/projects/pa-streaming-hub/02-dsp-profile-thumb.webp",
        alt: "Admin-Seite mit Signalketten-Anzeige (Highpass, EQ, DSP-Sink) und drei Profilkarten; das Profil Party ist als aktiv markiert.",
        caption:
          "DSP-Verwaltung mit visualisierter PipeWire-Signalkette und drei Klangprofilen (Hintergrund, Party, Sprache) inkl. LUFS-/SPL-Zielwerten.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/pa-streaming-hub/03-admin-dashboard.webp",
        thumb: "/projects/pa-streaming-hub/03-admin-dashboard-thumb.webp",
        alt: "Admin-Dashboard mit sechs grünen Status-Karten, Navigation zu DSP, WLAN, Bluetooth, USB und System-Reset sowie einem Audit-Log mit Zeitstempeln.",
        caption:
          "PIN-geschütztes Vermieter-Dashboard: Live-Status aller Subsysteme, Navigation und Audit-Log der letzten Admin-Aktionen.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/pa-streaming-hub/04-spotify-connect.webp",
        thumb: "/projects/pa-streaming-hub/04-spotify-connect-thumb.webp",
        alt: "Spotify-Connect-Seite mit Gerätenamen-Banner, großem QR-Code, nummerierter Drei-Schritte-Anleitung und laufendem Titel unten.",
        caption:
          "Spotify Connect ohne Geräte-Login: QR-Code, Gerätename für die Spotify-App und 3-Schritte-Anleitung für Mieter.",
        width: 1600,
        height: 1000,
      },
    ],
    caseStudy: {
      aiCore: false,
      problem: [
        "Geliehene PA-Technik soll bedienbar sein, ohne dass der Mieter ein Betriebssystem sieht oder etwas kaputt konfigurieren kann.",
        "Bei jedem Verleih soll das Gerät in einen sauberen, identischen Zustand zurückfallen — ohne dass Daten des letzten Mieters zurückbleiben.",
      ],
      approach: [
        "Ganzes System deklarativ in NixOS (flake.nix): reproduzierbar, versioniert, identisch wiederherstellbar — inklusive eigener Pakete für Kiosk und DSP.",
        "Direct-Boot-Kiosk (cage + Chromium) ohne Desktop; Laufzeit-State auf tmpfs, der bei jedem Boot verschwindet (Datenschutz für Mieter), Konfiguration via Impermanence persistent.",
        "FastAPI-Backend mit Weboberfläche (Jinja + htmx); PipeWire-DSP-Kette mit drei Sound-Profilen; Spotify Connect über go-librespot; Admin-Bereich PIN-geschützt; systemd-Härtung.",
      ],
      architecture: {
        nodes: [
          { id: "boot", label: "Direct-Boot", sub: "NixOS · cage", lane: 0 },
          { id: "kiosk", label: "Kiosk-UI", sub: "FastAPI + htmx", lane: 1, accent: "cyan" },
          { id: "src", label: "Quellen", sub: "Spotify · BT · USB", lane: 2 },
          { id: "dsp", label: "PipeWire-DSP", sub: "3 Profile", lane: 3, accent: "violet" },
          { id: "out", label: "Audio-Ausgang", lane: 4 },
        ],
        edges: [
          { from: "boot", to: "kiosk", animated: true },
          { from: "kiosk", to: "src", animated: true },
          { from: "src", to: "dsp", animated: true },
          { from: "dsp", to: "out", animated: true },
        ],
      },
      results: [
        "Vollständige, deklarative NixOS-Appliance inkl. DSP-Filterkette und Spotify-Connect-Integration; Backend läuft, Dev-VM verifiziert.",
        "Stateless-by-design: Mieter-Daten überleben keinen Neustart.",
        "Ehrlicher Stand: der Grundstein steht, aber die Streaming-Dienst-Links und die Oberfläche sind noch nicht komplett funktional.",
      ],
      metrics: [
        { value: "3", label: "DSP-Sound-Profile" },
        { value: "0", label: "Desktop / Login nötig" },
        { value: "100 %", label: "als Code beschrieben" },
      ],
      itFabrik:
        "Belegt Infrastruktur- und Linux-Tiefe: deklarative, reproduzierbare Systeme, systemd-Härtung, Netzwerk und Audio-Routing — das Fundament, auf dem KI-Lösungen sauber betrieben werden.",
      learnings: [
        "Deklarative Systeme nehmen dem Betrieb den Schrecken: ein kaputtes Gerät ist ein 'nixos-rebuild' vom Soll-Zustand entfernt.",
        "Weniger ist mehr: kein Desktop, kein Login, keine Angriffsfläche.",
        "Ehrlich bleiben über den Reifegrad — ein semi-funktionaler Prototyp ist kein fertiges Produkt.",
      ],
      screenshotNote:
        "Screenshots aus einem Dev-Lauf der Weboberfläche mit fiktiven Demo-Daten — auf dem Mini-PC bootet das System direkt in diese Ansicht.",
    },
  },
];

export const projectsBySlug = new Map(projects.map((p) => [p.slug, p]));
export const featuredProjects = projects.filter((p) => p.featured);

/**
 * Kleinere öffentliche Repos ohne eigene Case-Study — kompakter
 * „Außerdem auf GitHub"-Strip unter dem Projekt-Grid.
 * Beschreibungen folgen den echten READMEs (nichts erfunden).
 */
export const miniTools: MiniTool[] = [
  {
    name: "GazeFactory — Uni-Projekt, vor meiner KI-Zeit",
    desc: "Blickführung (Gaze Guiding) in einer VR-Atomkraftwerk-Simulation: Das System leitet Probanden Schritt für Schritt durchs Hochfahren des Reaktors und reagiert auf Fehler. Entstanden im 4er-Team im Rahmen eines Informatikprojekts an der Universität Trier — komplett ohne KI-Unterstützung gebaut.",
    repo: "https://github.com/CTreitges/GazeFactory",
    stack: ["Unity", "C#", "VR"],
  },
];
