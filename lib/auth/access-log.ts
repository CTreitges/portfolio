import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export type AccessEvent = "unlock_ok" | "unlock_fail" | "rl_block";

/**
 * Datenminimierung: IPv4 → letztes Oktett genullt, IPv6 → auf /64 gekürzt.
 * Reicht für "der IT-Fabrik-Code wurde am … benutzt", speichert aber keine
 * vollständige personenbezogene IP.
 */
export function truncateIp(ip: string): string {
  if (ip.includes(".")) {
    const octets = ip.split(".");
    if (octets.length === 4) {
      octets[3] = "0";
      return octets.join(".");
    }
  }
  if (ip.includes(":")) {
    return ip.split(":").slice(0, 4).join(":") + "::";
  }
  return "unknown";
}

/**
 * Hängt ein Ereignis als JSONL-Zeile an ACCESS_LOG_PATH an.
 * Fire-and-forget: Logging-Fehler dürfen den Unlock-Flow nie brechen.
 * Ohne gesetzten ACCESS_LOG_PATH (z.B. lokal) ist Logging aus.
 */
export async function logAccess(
  event: AccessEvent,
  opts: { code?: string; ip: string; ua?: string | null }
): Promise<void> {
  const path = process.env.ACCESS_LOG_PATH;
  if (!path) return;
  const line =
    JSON.stringify({
      ts: new Date().toISOString(),
      event,
      code: opts.code ?? null,
      ip: truncateIp(opts.ip),
      ua: opts.ua ? opts.ua.slice(0, 200) : null,
    }) + "\n";
  try {
    await mkdir(dirname(path), { recursive: true });
    await appendFile(path, line, "utf8");
  } catch (err) {
    console.error("[access-log] write failed:", err);
  }
}
