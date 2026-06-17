/**
 * Studienleistungen — Bachelor-Studiengang Informatik, Universität Trier (PO 2020).
 * Kuratierte Auswahl bestandener Kern-Module. Quelle: offizielle
 * Notenbescheinigung des Hochschulprüfungsamts (Stand 06/2026).
 * Bewusst ohne Abschlussnote / Durchschnitt (User-Entscheidung 2026-06-17).
 */

export interface StudiumModul {
  titel: string;
  lp: number;
  note: string;
}

export const studium = {
  hochschule: "Universität Trier",
  lpErreicht: 145,
  lpGesamt: 180,
  intro:
    "Ausgewählte bestandene Kern-Module aus meinem Informatikstudium — der praktische Schwerpunkt, auf dem meine Projekte aufbauen. Quelle: offizielle Notenbescheinigung der Universität Trier.",
  module: [
    { titel: "Web Entwicklung", lp: 5, note: "1,0" },
    { titel: "Systemsoftware", lp: 5, note: "1,7" },
    { titel: "Informatik-Projekt", lp: 10, note: "1,7" },
    { titel: "Programmierung I", lp: 10, note: "2,3" },
    { titel: "Algorithmen & Datenstrukturen", lp: 10, note: "2,7" },
    { titel: "Programmierung II", lp: 5, note: "2,7" },
    { titel: "Rechnerstrukturen", lp: 5, note: "2,7" },
    { titel: "Rechnernetze", lp: 5, note: "3,0" },
  ] as StudiumModul[],
};
