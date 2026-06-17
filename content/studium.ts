/**
 * Studienleistungen — Bachelor-Studiengang Informatik, Universität Trier (PO 2020).
 * Alle bestandenen Module. Quelle: offizielle Notenbescheinigung des
 * Hochschulprüfungsamts (Stand 06/2026). Bewusst ohne Abschlussnote /
 * Durchschnitt (User-Entscheidung 2026-06-17).
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
    "Alle bestandenen Module aus meinem Informatikstudium — der praktische Schwerpunkt, auf dem meine Projekte aufbauen. Quelle: offizielle Notenbescheinigung der Universität Trier (zum Download oben).",
  module: [
    { titel: "Web Entwicklung", lp: 5, note: "1,0" },
    { titel: "Systemsoftware", lp: 5, note: "1,7" },
    { titel: "Informatik-Projekt", lp: 10, note: "1,7" },
    { titel: "Programmierung I", lp: 10, note: "2,3" },
    { titel: "Grundzüge der VWL II: Makroökonomik", lp: 5, note: "2,3" },
    { titel: "Algorithmen & Datenstrukturen", lp: 10, note: "2,7" },
    { titel: "Programmierung II", lp: 5, note: "2,7" },
    { titel: "Rechnerstrukturen", lp: 5, note: "2,7" },
    { titel: "Werkzeuge der Informatik", lp: 5, note: "2,7" },
    { titel: "Rechnernetze", lp: 5, note: "3,0" },
    { titel: "Diskrete Strukturen & Logik", lp: 10, note: "3,3" },
    { titel: "Einführung in die Mathematik", lp: 10, note: "3,3" },
    { titel: "Human-Computer Interaction", lp: 5, note: "3,3" },
    { titel: "Informatik-Seminar", lp: 5, note: "3,3" },
    { titel: "Management von Softwareprojekten", lp: 5, note: "3,3" },
    { titel: "Grundzüge der VWL I: Mikroökonomik", lp: 5, note: "3,3" },
    { titel: "Softwaretechnik", lp: 5, note: "3,7" },
    { titel: "Informatik-Proseminar", lp: 5, note: "3,7" },
    { titel: "Lineare Algebra", lp: 10, note: "4,0" },
    { titel: "Datenbanksysteme", lp: 5, note: "4,0" },
    { titel: "Nichtrelationale Informationssysteme", lp: 5, note: "4,0" },
    { titel: "Grundzüge der BWL I: Führungsprozesse", lp: 5, note: "4,0" },
    { titel: "Digitale Geschäftsprozesse & Entscheidungen", lp: 5, note: "4,0" },
  ] as StudiumModul[],
};
