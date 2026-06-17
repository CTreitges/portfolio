import { describe, expect, it } from "vitest";
import { applyBasePath, withBasePath } from "@/lib/base-path";

describe("applyBasePath", () => {
  it("lässt Pfade unverändert, wenn kein basePath gesetzt ist", () => {
    expect(applyBasePath("", "/unlock")).toBe("/unlock");
    expect(applyBasePath("", "/")).toBe("/");
    expect(applyBasePath("", "/api/unlock")).toBe("/api/unlock");
  });

  it("präfixt site-relative Pfade", () => {
    expect(applyBasePath("/portfolio", "/unlock")).toBe("/portfolio/unlock");
    expect(applyBasePath("/portfolio", "/api/unlock")).toBe(
      "/portfolio/api/unlock"
    );
    expect(applyBasePath("/portfolio", "/research-docs/x.html")).toBe(
      "/portfolio/research-docs/x.html"
    );
  });

  it("bildet Root auf den basePath selbst ab (kein '/portfolio/')", () => {
    expect(applyBasePath("/portfolio", "/")).toBe("/portfolio");
  });

  it("verdoppelt einen vorhandenen Präfix nicht (idempotent)", () => {
    expect(applyBasePath("/portfolio", "/portfolio")).toBe("/portfolio");
    expect(applyBasePath("/portfolio", "/portfolio/unlock")).toBe(
      "/portfolio/unlock"
    );
  });

  it("verwechselt ähnliche Präfixe nicht (Segment-Grenze)", () => {
    // '/portfolios' beginnt mit '/portfolio', ist aber ein anderer Pfad.
    expect(applyBasePath("/portfolio", "/portfolios")).toBe(
      "/portfolio/portfolios"
    );
  });
});

describe("withBasePath", () => {
  it("nutzt den konfigurierten basePath (in Tests leer → unverändert)", () => {
    expect(withBasePath("/unlock")).toBe("/unlock");
    expect(withBasePath("/")).toBe("/");
  });
});
