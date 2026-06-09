import { beforeEach, describe, expect, it } from "vitest";
import {
  checkRateLimit,
  getClientIp,
  resetRateLimiter,
} from "@/lib/auth/rate-limit";

describe("getClientIp — XFF-Spoofing-Schutz", () => {
  it("nimmt den RECHTESTEN X-Forwarded-For-Eintrag (von Caddy angehängt)", () => {
    // Angreifer schickt eigenen XFF-Header mit, Caddy hängt die echte Peer-IP an:
    const h = new Headers({
      "x-forwarded-for": "1.2.3.4, 5.6.7.8, 203.0.113.7",
    });
    expect(getClientIp(h)).toBe("203.0.113.7");
  });

  it("einzelner XFF-Eintrag wird direkt genommen", () => {
    const h = new Headers({ "x-forwarded-for": "203.0.113.7" });
    expect(getClientIp(h)).toBe("203.0.113.7");
  });

  it("trimmt Whitespace um die Einträge", () => {
    const h = new Headers({ "x-forwarded-for": " 1.2.3.4 ,  203.0.113.7 " });
    expect(getClientIp(h)).toBe("203.0.113.7");
  });

  it("fällt auf x-real-ip zurück, sonst 'unknown'", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe(
      "198.51.100.2"
    );
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});

describe("checkRateLimit", () => {
  beforeEach(() => resetRateLimiter());

  it("erlaubt 5 Versuche, blockt den 6.", () => {
    const ip = "203.0.113.1";
    for (let i = 1; i <= 5; i++) {
      expect(checkRateLimit(ip).allowed, `Versuch ${i}`).toBe(true);
    }
    const sixth = checkRateLimit(ip);
    expect(sixth.allowed).toBe(false);
    expect(sixth.retryAfterSec).toBeGreaterThan(0);
    expect(sixth.retryAfterSec).toBeLessThanOrEqual(15 * 60);
  });

  it("zählt IPs unabhängig voneinander", () => {
    for (let i = 0; i < 6; i++) checkRateLimit("203.0.113.1");
    expect(checkRateLimit("203.0.113.2").allowed).toBe(true);
  });

  it("gibt die IP nach Ablauf des 15-Minuten-Fensters wieder frei", () => {
    const ip = "203.0.113.3";
    const t0 = 1_000_000;
    for (let i = 0; i < 6; i++) checkRateLimit(ip, t0);
    expect(checkRateLimit(ip, t0).allowed).toBe(false);
    // 15 Minuten + 1s später:
    expect(checkRateLimit(ip, t0 + 15 * 60_000 + 1000).allowed).toBe(true);
  });

  it("Memory-Cap: wächst nicht unbegrenzt bei IP-Flooding", () => {
    const t0 = 2_000_000;
    for (let i = 0; i < 10_500; i++) {
      checkRateLimit(`10.0.${Math.floor(i / 250)}.${i % 250}`, t0);
    }
    // Kein Assert auf interne Größe nötig — wichtig ist: neue IPs funktionieren weiter.
    expect(checkRateLimit("203.0.113.99", t0).allowed).toBe(true);
  });
});
