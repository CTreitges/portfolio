# Design-Brief — Portfolio Christof Treitges

> **Verwendung:** Dieses Dokument ist der Design-Prompt. Es wird an Claude (frontend-design)
> übergeben und ist zugleich die verbindliche Design-Grundlage für die Implementierung
> (Phase 3/4). Erwartete Deliverables stehen in §12.

---

## 1. Kontext & Mission

- **Was:** Persönliche Portfolio-Website als zentrales Bewerbungs-Asset. Bewerbung als
  **„KI-Entwickler & Innovation Specialist"** bei der IT-Fabrik Bitburg (IT-Systemhaus,
  Microsoft Gold Partner, 600+ KMU-Kunden in der Eifel-Region).
- **Wer schaut:** Geschäftsführung, HR und Tech-Leads eines bodenständigen KMU-Systemhauses.
  Lesezeit 3–5 Minuten. Keine Design-Agentur-Jury — beeindrucken ja, abschrecken nein.
- **Harte Anforderung — 30-Sekunden-Fast-Path:** Der erste Viewport muss OHNE Scroll in
  ~1,5 s lesbar sein: Name, Rolle, 1-Satz-Value-Prop, 3 Beweis-Zahlen, CTA. Animationen
  inszenieren das, dürfen es nie verzögern. Tiefe ist Opt-in (Scroll/Klick).
- **Sprache:** Deutsch. Microcopy direkt, kein Marketing-Sprech.
- **Besonderheit:** Die Site liegt hinter einem Zugangscode-Gate auf `https://<SERVER_IP>`
  (nackte IP, bewusst privat). **Die `/unlock`-Seite ist der allererste Eindruck und MUSS
  vollwertig designt sein** — sie ist die Visitenkarte vor der Visitenkarte.
- **Meta-Botschaft:** Die Site selbst ist Arbeitsprobe — selbst gebaut (Next.js 16), selbst
  gehostet (eigener ARM-Server), selbst absichert (eigenes Auth-Gate). Der Footer sagt das explizit.

## 2. Brand-Persönlichkeit

**5 Adjektive:** präzise · technisch-warm · neugierig · hands-on · souverän.

Tonalität: Ein Entwickler, der Dinge wirklich baut und betreibt — nicht nur ausprobiert.
Selbstbewusst ohne Buzzwords. Ehrlichkeit ist Designprinzip: Status-Badges sagen „läuft als
Prototyp" oder „in Arbeit", nie mehr als die Wahrheit. Zahlen sind live gezählt, nicht geschätzt.

## 3. Farbwelt

- **Dark-Base, durchgehend** (kein Light-Mode, kein Toggle): fast-schwarz mit Blau-/Violettstich —
  **kein reines #000**. Richtung: `#0a0a12` bis `#0d0d16`.
- **Primär-Akzent:** Electric Cyan (Richtung `#22d3ee` / `#67e8f9`) — Links, CTAs, aktive Zustände,
  Terminal-Prompt.
- **Sekundär-Glow:** Aurora-Violett (Richtung `#8b5cf6` / `#a78bfa`) — nur für Hintergrund-Glows,
  Diagramm-Sekundärlinien, niemals für Text.
- **Semantik-Tokens** (als Tailwind-v4-`@theme` definieren):
  `--color-bg`, `--color-surface` (Karten), `--color-surface-2` (Panels), `--color-border`,
  `--color-border-glow`, `--color-text`, `--color-text-muted`, `--color-text-faint`,
  `--color-accent`, `--color-accent-soft`, `--color-glow`, `--color-success`, `--color-warn`,
  `--color-danger`.
- **Status-Farben** für Ehrlichkeits-Badges: läuft (grün), Prototyp (cyan), in Arbeit (amber), Konzept (violett).
- **WCAG AA Pflicht:** Fließtext ≥ 4.5:1 auf Surface, Muted-Text ≥ 4.5:1 auf bg. Cyan auf Dunkel
  nur für große Headlines/UI-Elemente (≥ 3:1), nie für lange Texte.

## 4. Typografie

- **Display** (H1/H2, Zahlen): Richtung **Space Grotesk** — technisch, markant, leicht warm.
- **Text:** **Inter** — neutral, exzellent lesbar.
- **Mono — prominent:** **JetBrains Mono**. Mono ist Identitätsträger (Terminal-Showcase,
  Stack-Chips, Eyebrows, Stats, Code-Referenzen). Eyebrow-Stil: Mono, uppercase, letter-spacing,
  cyan, z. B. `// KI-ENTWICKLER & INNOVATION SPECIALIST`.
- **Skala:** fluid via `clamp()`. H1 ~ clamp(2.5rem, 6vw, 4.5rem). Fließtext 16–18px,
  Zeilenlänge max ~70ch. Alle Fonts self-hosted via `next/font` (keine externen Requests).

## 5. Textur & Tiefe

- **Noise/Grain:** feines SVG-Noise-Overlay über der ganzen Site, Opazität 2–4 % — bricht flache
  Flächen, analoger Charakter.
- **Aurora-Glows:** weiche radiale Cyan/Violett-Gradients (stark geblurrt) hinter Hero und Kontakt
  (Klammer-Effekt Anfang/Ende), dezent hinter `/unlock`-Karte.
- **Glassmorphism-Budget:** NUR Sticky-Header (nach Scroll) und Detail-Panels (Konstellation,
  Lightbox). Nirgendwo sonst.
- **Spotlight-Border-Rezept:** Karten mit 1px-Border; auf Hover folgt ein radialer Gradient-Glow
  der Maus entlang der Border (CSS Custom Properties `--mx`/`--my`). Fläche bleibt ruhig.
- **Schatten:** keine klassischen Drop-Shadows; Tiefe über Border-Helligkeit + Glow + Layering.

## 6. Motion-Vokabular

- **Easing-Familie:** `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuint-artig) für Reveals;
  Spring (Motion-Defaults, leicht gedämpft) für Hover/Magnetic.
- **Dauer-Skala:** micro 150 ms · reveal 600 ms · scene 1000 ms. Stagger 60–80 ms.
- **Scroll-Verhalten:** Lenis smooth scroll (dezent, lerp ~0.1). **Budget: GENAU 1 gepinnte
  Sektion** (Knowledge-Konstellation, ~1,5 Viewports Scrub). Alles andere: einfache
  `whileInView`-Reveals (einmalig, kein Re-Trigger beim Hochscrollen).
- **Hover-Physik:** Magnetic Buttons max 8px Versatz; Card-Tilt max 4°; alles spring-released.
- **Nur `transform` + `opacity` animieren.** Keine width/height/top/left-Animationen.
- **`prefers-reduced-motion`:** jede Animation hat einen definierten statischen Ersatzzustand
  (Inhalte sichtbar, keine Bewegung, Konstellation statisch gerendert).
- **Anti-Animation-Soup:** max. 1 Haupteffekt pro Viewport. Eine Animation muss etwas erklären,
  führen oder belohnen — sonst raus.

## 7. Sektion-Specs (Reihenfolge = Dramaturgie)

### 7.0 `/unlock` — Code-Gate (erste Visitenkarte)
- Voller Viewport. Aurora + Noise, zentrierte Spotlight-Karte (max-w ~28rem).
- Monogramm „CT" (Mono, cyan-Border-Box), Titel „Privates Portfolio", Subzeile „Zugang per Code
  aus dem Anschreiben", 1 Passwort-Feld (Mono), Button „Entsperren", Mail-Fallback-Fußzeile.
- States: idle (ruhig) · loading (Button-Puls) · **error (Karten-Shake + roter Border-Glow,
  generische Meldung)** · blocked (amber) · **success (Karte löst sich auf → weicher Übergang
  zur Site — der Magic-Link-Besucher erlebt NUR diese 2-Sekunden-Animation)**.

### 7.1 Hero
- Eyebrow (Mono, cyan) „KI-Entwickler & Innovation Specialist" · H1 „Christof Treitges" ·
  Subline-Value-Prop (PLATZHALTER bis Interview: „Ich baue KI-Lösungen, die Abläufe wirklich
  automatisieren — lokal, datenschutzkonform, produktiv im Einsatz.") · 3 Proof-Chips
  („6 produktive Projekte" · „22 MCP-Server orchestriert" · „715+ persistierte KI-Memories") ·
  CTA „Projekte ansehen" (magnetic, gefüllt) + „Kontakt" (ghost).
- Hintergrund: subtiles Partikelfeld (R3F, cyan/violett Punkte, langsame Drift, Maus-Parallax;
  Mobile/reduced-motion: statische Aurora). H1-Reveal: SplitText Char-Stagger < 0,9 s.
- Unten: dezenter Scroll-Hint.

### 7.2 About — Bento-Grid
- 5–6 Kacheln ungleicher Größe: Portrait/Avatar (PLATZHALTER) · Kurzprofil (3 Sätze) ·
  „Wie ich arbeite" · „Warum KI" (Anekdote, PLATZHALTER) · Tech-Marquee (laufender Ticker,
  pausiert on hover) · Standort/Verfügbarkeit (PLATZHALTER).
- Spotlight-Hover auf Kacheln, Reveal mit Stagger.

### 7.3 Projekte — Beweis-Grid
- 2 Featured-Karten groß (DocuFlow, Lieferschein-Processor) + 4 normale (Cascade-Bot,
  Claude-Code-Setup, PA-Streaming-Hub, Audio Normalizer).
- Karte: Cover-Visual (stilisiert, kein roher Screenshot), Titel, 1-Zeiler-Outcome, Stack-Chips
  (Mono), Impact-Zahl, Relevanz-Tag (Automatisierung/Lokale KI/Multi-Agent/Infrastruktur).
- Hover: Spotlight-Border + Tilt max 4°. Klick → Case-Study-Seite.
- **Case-Study-Template:** Kopf (Titel, Zeitraum, Rolle, Stack) → Problem → Ansatz mit
  **FlowDiagram** (animierte Datenpakete) → Ergebnis + Metriken (CountUp) → Screenshots
  (Lightbox) → Box **„Warum relevant für ein KMU-Systemhaus"** (visuell abgesetzt, IT-Fabrik-
  Mapping) → Learnings → Prev/Next.

### 7.4 KI-Wissen — „Knowledge Constellation" (visuelles Herzstück)
- Dunkler Nachthimmel (Canvas-Sternfeld, sehr dezent), darüber SVG-Konstellation:
  **7 Cluster-Sterne** (LLM-Orchestrierung · Lokale LLMs · Multi-Agent-Systeme · MCP-Protokoll ·
  RAG & Memory · Prompt Engineering · Automatisierung) mit je 3–5 Satelliten-Nodes,
  Verbindungslinien zwischen verwandten Konzepten.
- **Inszenierung:** Sektion pinnt ~1,5 Viewports: Cluster zünden nacheinander (Glow-Puls,
  Linien zeichnen sich via stroke-dashoffset), dann entpinnt → frei interaktiv.
- **Interaktion = Beweis:** Hover/Klick auf Node → Glas-Panel: 2–3 Sätze + „Wo ich das einsetze"
  mit Link zu Projekt/Setup. Verbundene Linien leuchten auf.
- **Mobile:** Accordion aus 7 Cluster-Karten (Mini-SVG + Node-Liste mit denselben Panels). Kein Pin.

### 7.5 Claude-Code-Setup — „Mein Maschinenraum"
- (a) **Architektur-Diagramm** (SVG, Ebenen vertikal): Maschinen (2 PCs + WSL + VPS) → Sync →
  Claude-Code-Kern (13 Hooks/17 Events, 6 Skills, 10 Commands) → MCP-Ebene (22 Server) →
  Memory (RLM: 715+ Insights) → Output (Telegram, Linear, Git). Animierte Datenpakete laufen
  auf den Pfaden (CSS offset-path). Hover auf Ebene → hervorheben + Kurztext.
- (b) **Terminal-Showcase:** stilisiertes Terminal-Fenster (Mono, Tabs), tippt echte Abläufe
  nach (Hook-Feuer → rlm_remember → Telegram; /cascade-Run; VPS-Session-attach). Cursor blinkt,
  Tippgeschwindigkeit realistisch, Replay-Button.
- (c) **Stats-Leiste:** 4–6 CountUp-Zahlen (Mono, groß) mit Label.

### 7.6 Research-Showcase — „Recherche als Produkt"
- Intro-Zeile zum eigenen Design-System „research-pitch", dann 3 Dokument-Karten:
  Browser-Frame-Thumbnail (scrollt langsam on hover), Titel, Meta-Chips (Zeilen · Sektionen · KB),
  2 Sätze Kontext, „Ansehen →".
- Viewer-Seite: Vollbild-iframe, schmale Top-Bar (← Zurück · Titel · „In neuem Tab"). Mobile:
  „Für Desktop optimiert"-Hinweis + Click-to-Load.

### 7.7 Lab / Visionen — „Woran ich denke"
- 2 Konzept-Karten mit **Status-Badge**: ① „Claude orchestriert lokale KI" (*Prototyp läuft*) —
  Mini-FlowDiagram Router→Entscheid→Ollama/Cloud, Pointe „Kosten- & Datenschutz-Hebel für KMU".
  ② „Hermes — lokaler Agent-Hub" (*läuft als Gateway auf meinem Server*) — Mini-Flow
  Eingang→Hub→Agenten. Gleiches Diagramm-Vokabular wie 7.5.

### 7.8 Werdegang — Timeline (zwei Spuren)
- Vertikale Zentral-Linie wächst beim Scrollen (scrub). **Spur A:** Stationen (Schule Hillesheim →
  Gymnasium Gerolstein → Informatikstudium Uni Trier → DerTeller Gastronomics (Minijob/Werkstudent)
  → Rewe → Kleingewerbe IT (2025) + Kleingewerbe Musikveranstaltungen (2023)). **Spur B (parallel,
  cyan):** KI-Lernreise (PLATZHALTER: erste Ollama-Installation, erster MCP, RLM-Idee, VPS-Node).
- Stationen alternierend links/rechts (Desktop), Jahr-Marker als Glow-Dots. Mobile einspaltig.
- Ton: Brüche werden erzählt, nicht versteckt — Detail-Texte PLATZHALTER bis Interview.

### 7.9 Kontakt
- Headline mit Text-Gradient: „Lassen Sie uns über KI bei der IT-Fabrik sprechen."
- E-Mail (Copy-Button mit Check-Animation), GitHub `CTreitges`, optional Telefon/Standort (PLATZHALTER).
- Aurora-Echo vom Hero. Footer: „Diese Seite: Next.js 16 · selbst gehostet auf eigenem
  ARM-Server · geschützt durch ein selbst gebautes Auth-Gate" + dezenter Tech-Stack in Mono.

## 8. Komponenten-Inventar mit States

| Komponente | States |
|---|---|
| Button (filled/ghost/magnetic) | idle · hover (magnetic pull, Glow) · active · disabled · loading |
| Chip (Stack/Relevanz/Status) | statisch · hover (Tooltip optional) |
| SpotlightCard | idle · hover (Border-Glow folgt Maus) · focus-visible |
| Unlock-Feld | idle · focus · loading · error (Shake + rot) · blocked (amber) · success |
| Terminal | typing · idle (Cursor blinkt) · Tab-Wechsel · Replay |
| FlowDiagram-Node | idle · highlight (Hover-Ebene) · aktiv (Paket durchläuft) |
| Konstellations-Node | idle · hover (wächst, Linien leuchten) · selected (Panel offen) |
| Timeline-Station | offscreen · revealed · highlight (Marker-Glow) |
| Nav-Link | idle · hover · active (Scroll-Spy, cyan Marker) |
| Copy-Button | idle · copied (Check, 2s) |

## 9. Referenzen & Anti-Referenzen

- **Referenzen (Stimmung, nicht Kopie):** linear.app (Präzision, dunkle Tiefe) ·
  cassie.codes (Scroll-Erzählung mit Persönlichkeit) · Aceternity-UI-Komponenten (Spotlight,
  Aurora, Bento — als Pattern-Inspiration, Eigenbau) · Magic UI (Marquee, Particles, Text-Reveal) ·
  vercel.com (Mono-Akzente, Terminal-Ästhetik).
- **Anti-Referenzen:** Animation-Soup (alles wackelt) · Glassmorphism-Overuse · generische
  Template-Portfolios · Scroll-Hijacking (Scroll-Geschwindigkeit kapern) · Cyberpunk-Gaming-Look
  (Neon-Überdosis — wir sind technisch-warm, nicht Las Vegas) · Stock-Fotos.

## 10. Responsive-Regeln

- Breakpoints: Mobile < 768 · Tablet < 1024 · Desktop ≥ 1024. Design ist Desktop-first gedacht
  (Recruiter), Mobile vollwertig.
- **Definierte Mobile-Ersatzzustände:** Hero R3F → statische Aurora · Konstellation → Accordion ·
  Timeline → einspaltig · Research-Viewer → Click-to-Load · Bento → 1–2 Spalten · Terminal →
  volle Breite, kleinere Schrift.
- Touch: keine Hover-abhängigen Informationen — alles auch per Tap erreichbar.

## 11. A11y- & Performance-Constraints

- Kontrast WCAG AA überall; `focus-visible`-Ringe (cyan) auf allen Interaktiven; vollständige
  Tastatur-Pfade (Konstellation: Nodes tabbar, Panel per Enter).
- Semantik: ein `<h1>`, Sektionen mit `<section aria-labelledby>`, Landmark-Rollen.
- LCP < 2,5 s · CLS = 0 (Fonts via next/font, Bilder mit fester Ratio) · keine Long-Tasks > 200 ms
  beim Scrollen · 60 fps Desktop-Ziel · R3F: DPR-Cap 1.5, pausiert bei `document.hidden`.

## 12. Erwartete Deliverables des Design-Passes

1. **Finales `@theme`-Token-Set** (Farben, Typo-Skala, Radii, Glow-Schatten, Motion-Dauern)
   als Tailwind-v4-CSS.
2. **Gestaltete Screens** (Code oder hochwertige Beschreibung pro Komponente):
   `/unlock` · Hero · Konstellation (Desktop + Mobile-Accordion) · Projekt-Karte +
   Case-Study-Kopf · Terminal-Showcase.
3. **Komponenten-Stilregeln** für §8 (konkrete Klassen/Werte).

---
*Stand: 2026-06-08 · Platzhalter werden nach dem Werdegang-Interview ersetzt (Hero-Subline,
About-Anekdote, Timeline-Spur B, Foto, Kontaktdetails).*
