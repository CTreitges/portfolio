/**
 * Zurück-Ziel der Studienleistungen-Seite je nach Herkunfts-Button (?from=).
 * Reine, testbare Logik: mappt den from-Parameter auf den Sektions-Anker der
 * Startseite. Unbekannt/leer → Werdegang (Default — dort sitzt der zweite
 * "Studienleistungen ansehen"-Button).
 */
const STUDIUM_BACK_TARGETS: Record<string, string> = {
  about: "/#about",
  werdegang: "/#werdegang",
};

export function studiumBackHref(from: string | null | undefined): string {
  return STUDIUM_BACK_TARGETS[from ?? ""] ?? "/#werdegang";
}
