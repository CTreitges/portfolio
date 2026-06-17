/**
 * Zentrale basePath-Konstante.
 *
 * Next.js wendet `basePath` automatisch NUR auf `next/link` und `useRouter`
 * an. Überall sonst — plain `<a href>`, `fetch()`, `window.location`,
 * Cookie-`path`, der Magic-Link-Generator — muss der Präfix von Hand davor.
 * Diese Datei ist die eine Quelle dafür.
 *
 * Muss zur BUILD-Zeit feststehen: `NEXT_PUBLIC_*` wird in `next.config.ts` und
 * in die Client-Bundles inlined. Leer (Default, z. B. Dev) → App läuft auf "/".
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Pure Kern-Logik (mit beliebigem basePath testbar): einen site-relativen Pfad
 * mit dem Präfix versehen, ohne ihn zu verdoppeln.
 */
export function applyBasePath(basePath: string, path: string): string {
  if (!basePath) return path;
  if (path === "/") return basePath;
  if (path === basePath || path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}

/** Site-relativen Pfad mit dem konfigurierten basePath versehen. */
export function withBasePath(path: string): string {
  return applyBasePath(BASE_PATH, path);
}
