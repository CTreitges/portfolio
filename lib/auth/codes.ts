import { verify } from "@node-rs/argon2";

export interface NamedCode {
  name: string;
  hash: string;
}

/**
 * Parst die ACCESS_CODES-Umgebungsvariable.
 * Format: `name1:$argon2id$...;name2:$argon2id$...`
 * Argon2-Hashes enthalten weder `:` noch `;`, daher ist das Splitting eindeutig.
 */
export function parseAccessCodes(raw: string | undefined): NamedCode[] {
  if (!raw) return [];
  return raw
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const i = entry.indexOf(":");
      if (i <= 0) return null;
      const name = entry.slice(0, i).trim();
      const hash = entry.slice(i + 1).trim();
      if (!name || !hash.startsWith("$argon2")) return null;
      return { name, hash };
    })
    .filter((x): x is NamedCode => x !== null);
}

/**
 * Prüft einen eingegebenen Code gegen alle benannten Hashes.
 * Läuft bewusst über ALLE Einträge (kein Early-Return), damit die Antwortzeit
 * nicht verrät, welcher Eintrag getroffen wurde.
 * Gibt den Namen des passenden Codes zurück, sonst null.
 */
export async function verifyCode(
  code: string,
  codes?: NamedCode[]
): Promise<string | null> {
  const list = codes ?? parseAccessCodes(process.env.ACCESS_CODES);
  let matched: string | null = null;
  for (const { name, hash } of list) {
    try {
      if (await verify(hash, code)) {
        matched ??= name;
      }
    } catch {
      // Ungültiger Hash-Eintrag — überspringen, kein Crash.
    }
  }
  return matched;
}
