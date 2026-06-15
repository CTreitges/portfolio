/** Globale Site-Daten: Identität, Navigation, Kontakt, Hero-Texte. */

// Ladungsfähige Anschrift fürs Impressum (§ 5 DDG) — kommt aus der
// Server-Umgebung, NICHT aus dem (öffentlichen) Repo, damit die Privatadresse
// nicht in der git-History liegt. Format: '|'-getrennte Zeilen, z. B.
// LEGAL_ADDRESS_LINES="Musterstr. 1|12345 Musterstadt". Auf dem VPS in
// /etc/portfolio/portfolio.env (wird beim Build gesourct). Fehlt sie, bleibt es
// beim Platzhalter → addressPlaceholder ist automatisch true.
const legalAddressLines = (process.env.LEGAL_ADDRESS_LINES ?? "")
  .split("|")
  .map((line) => line.trim())
  .filter(Boolean);

export const site = {
  name: "Christof Treitges",
  role: "KI-Entwickler & Innovation Specialist",
  eyebrow: "// KI-ENTWICKLER & INNOVATION SPECIALIST",

  // Value-Prop (Mittelstand/IT-Fabrik-Zielgruppe). Christof kann das durch
  // seinen eigenen Satz ersetzen.
  heroSubline:
    "Ich baue lokale, datenschutzkonforme KI-Lösungen, die im Mittelstand echte Abläufe automatisieren — produktiv im Einsatz, nicht nur als Demo.",

  // Recruiter-lesbare Beweis-Chips: Flagship-Fakt, Breite, roter Faden.
  proofChips: [
    { value: "wöchentlich", label: "produktiv beim Kunden" },
    { value: "on-prem", label: "DSGVO-konforme KI" },
    { value: "13", label: "MCP-Server im Setup" },
  ],

  contact: {
    email: "Christof.Treitges@outlook.de",
    github: "https://github.com/CTreitges",
    githubHandle: "CTreitges",
    // Telefon/Standort bewusst NICHT öffentlich (Interview-Entscheidung:
    // im Gespräch klären).
  },

  // Reihenfolge = Dramaturgie = Scroll-Spy-Reihenfolge.
  nav: [
    { id: "about", label: "Über mich" },
    { id: "projekte", label: "Projekte" },
    { id: "ki-wissen", label: "KI-Wissen" },
    { id: "setup", label: "Setup" },
    { id: "research", label: "Recherchen" },
    { id: "lab", label: "Lab" },
    { id: "werdegang", label: "Werdegang" },
    { id: "making-of", label: "Making-of" },
    { id: "kontakt", label: "Kontakt" },
  ],

  // Für IT-Fabrik: roter Faden lokale, datenschutzkonforme KI für KMU.
  target: {
    company: "IT-Fabrik Bitburg",
    positioning:
      "Lokale, datenschutzkonforme KI und spürbare Prozess-Automatisierung für den Mittelstand.",
  },

  footerTech:
    "Next.js 16 · React 19 · selbst gehostet auf eigenem ARM-Server · geschützt durch ein selbst gebautes Auth-Gate",

  // Faktischer Datenschutz-Hinweis (keine Rechtsberatung, nur Transparenz).
  footerPrivacy:
    "Keine Tracker, keine Analytics, kein Cookie außer dem technisch nötigen Session-Cookie — gehostet auf eigenem Server.",

  // Rechtstexte (Impressum/Datenschutz, öffentlich erreichbar vor dem Gate).
  // Die Anschrift kommt aus LEGAL_ADDRESS_LINES (siehe oben) — solange sie
  // fehlt, ist addressPlaceholder automatisch true: der Footer blendet die
  // Rechts-Links aus und die Seiten zeigen einen "wird ergänzt"-Hinweis statt
  // unfertiger Platzhalter (kein halb veröffentlichtes Impressum).
  legal: {
    holder: "Christof Treitges",
    addressLines:
      legalAddressLines.length > 0
        ? legalAddressLines
        : ["Straße und Hausnummer", "PLZ und Ort"],
    addressPlaceholder: legalAddressLines.length === 0,
    hostingProvider: "Oracle Cloud Infrastructure",
    hostingLocation: "Frankfurt am Main, Deutschland (Region eu-frankfurt-1)",
  },
} as const;

export type Site = typeof site;
