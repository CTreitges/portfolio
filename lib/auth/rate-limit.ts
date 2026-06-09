/**
 * In-Memory-Rate-Limiter für den Unlock-Endpoint.
 * Ausreichend, weil genau EIN Node-Prozess hinter Caddy läuft (systemd).
 * Reset bei Service-Restart ist akzeptiert.
 */

const WINDOW_MS = 15 * 60_000; // 15 Minuten
const MAX_ATTEMPTS = 5; // Versuche pro Fenster und IP
const MAX_ENTRIES = 10_000; // Memory-Cap gegen IP-Flooding
const SWEEP_INTERVAL_MS = 5 * 60_000;

interface Entry {
  count: number;
  windowStart: number;
}

interface Limiter {
  map: Map<string, Entry>;
  lastSweep: number;
}

// globalThis-Singleton: übersteht Next-HMR im Dev-Modus.
const g = globalThis as unknown as { __pfRateLimiter?: Limiter };

function limiter(): Limiter {
  g.__pfRateLimiter ??= { map: new Map(), lastSweep: Date.now() };
  return g.__pfRateLimiter;
}

/**
 * Bestimmt die Client-IP hinter Caddy.
 *
 * SICHERHEITSKRITISCH: Caddy HÄNGT die echte Peer-IP rechts an eine evtl.
 * mitgesendete (spoofbare) X-Forwarded-For-Liste AN. Deshalb wird hier IMMER
 * der RECHTESTE Eintrag genommen — niemals der linke (Angreifer-kontrolliert).
 * Next lauscht nur auf 127.0.0.1, alle externen Requests kommen durch Caddy.
 */
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  }
  return headers.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit(
  ip: string,
  now: number = Date.now()
): { allowed: boolean; retryAfterSec: number } {
  const l = limiter();

  if (now - l.lastSweep > SWEEP_INTERVAL_MS) {
    for (const [key, entry] of l.map) {
      if (now - entry.windowStart > WINDOW_MS) l.map.delete(key);
    }
    l.lastSweep = now;
  }

  let entry = l.map.get(ip);
  if (entry && now - entry.windowStart > WINDOW_MS) {
    l.map.delete(ip);
    entry = undefined;
  }
  if (!entry) {
    if (l.map.size >= MAX_ENTRIES) {
      // Eviction: ältesten Eintrag opfern statt unbegrenzt zu wachsen.
      const oldest = l.map.keys().next().value;
      if (oldest !== undefined) l.map.delete(oldest);
    }
    entry = { count: 0, windowStart: now };
    l.map.set(ip, entry);
  }

  entry.count++;
  if (entry.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSec: Math.max(
        1,
        Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000)
      ),
    };
  }
  return { allowed: true, retryAfterSec: 0 };
}

/** Nur für Tests. */
export function resetRateLimiter(): void {
  g.__pfRateLimiter = undefined;
}
