import { describe, expect, it } from "vitest";
import { truncateIp } from "@/lib/auth/access-log";

/**
 * truncateIp ist die einzige DSGVO-Datenminimierungs-Funktion der Auth-Lib —
 * sie MUSS beweisbar nie eine vollständige IP zurückgeben.
 */
describe("truncateIp", () => {
  it("nullt das letzte IPv4-Oktett", () => {
    expect(truncateIp("203.0.113.77")).toBe("203.0.113.0");
    expect(truncateIp("192.168.188.137")).toBe("192.168.188.0");
    expect(truncateIp("1.2.3.4")).toBe("1.2.3.0");
  });

  it("kürzt IPv6 auf die ersten vier Gruppen (/64)", () => {
    expect(truncateIp("2001:db8:85a3:8d3:1319:8a2e:370:7348")).toBe(
      "2001:db8:85a3:8d3::"
    );
  });

  it("crasht nicht an Loopback/komprimiertem IPv6", () => {
    expect(truncateIp("::1")).toContain("::");
  });

  it("liefert 'unknown' für leere oder unklare Eingaben", () => {
    expect(truncateIp("")).toBe("unknown");
    expect(truncateIp("garbage")).toBe("unknown");
    expect(truncateIp("1.2.3")).toBe("unknown"); // unvollständige IPv4
  });

  it("gibt nie die vollständige IPv4 zurück (Datenminimierung)", () => {
    const out = truncateIp("203.0.113.77");
    expect(out).not.toBe("203.0.113.77");
    expect(out.endsWith(".0")).toBe(true);
  });
});
