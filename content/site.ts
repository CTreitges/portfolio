/** Globale Site-Daten: Identität, Navigation, Kontakt, Hero-Texte. */

export const site = {
  name: "Christof Treitges",
  role: "KI-Entwickler & Innovation Specialist",
  eyebrow: "// KI-ENTWICKLER & INNOVATION SPECIALIST",

  // Value-Prop (Mittelstand/IT-Fabrik-Zielgruppe). Christof kann das durch
  // seinen eigenen Satz ersetzen.
  heroSubline:
    "Ich baue lokale, datenschutzkonforme KI-Lösungen, die im Mittelstand echte Abläufe automatisieren — produktiv im Einsatz, nicht nur als Demo.",
  heroSublinePlaceholder: false,

  // Recruiter-lesbare Beweis-Chips: Flagship-Fakt, Breite, roter Faden.
  proofChips: [
    { value: "wöchentlich", label: "produktiv beim Kunden" },
    { value: "8+", label: "Projekte & Tools" },
    { value: "100 %", label: "lokal möglich" },
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
      "Lokale, datenschutzkonforme KI und echte Prozess-Automatisierung für den Mittelstand.",
  },

  footerTech:
    "Next.js 16 · React 19 · selbst gehostet auf eigenem ARM-Server · geschützt durch ein selbst gebautes Auth-Gate",

  // Faktischer Datenschutz-Hinweis (keine Rechtsberatung, nur Transparenz).
  footerPrivacy:
    "Keine Tracker, keine Analytics, kein Cookie außer dem technisch nötigen Session-Cookie — gehostet auf eigenem Server.",
} as const;

export type Site = typeof site;
