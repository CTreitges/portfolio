import { expect, request, test } from "@playwright/test";

/**
 * Exit-Gate Phase 1 — komplette Auth-Strecke gegen den laufenden Dev-Server.
 * Jeder Test nutzt eine EIGENE X-Forwarded-For-"IP", damit der In-Memory-
 * Rate-Limiter nicht zwischen Tests überlappt (getClientIp nimmt rightmost —
 * ohne Caddy davor ist der Header hier direkt steuerbar, in Prod nicht).
 */

const DEV_CODE = "dev-test-code"; // entspricht dem Hash in .env.local (nur lokal)

test.describe("Auth-Gate", () => {
  test("ohne Session: / leitet auf /unlock um", async ({ browser }) => {
    const ctx = await browser.newContext({
      extraHTTPHeaders: { "x-forwarded-for": "203.0.113.10" },
    });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/unlock$/);
    await expect(page.getByTestId("unlock-form")).toBeVisible();
    await ctx.close();
  });

  test("ohne Session: tiefer Pfad landet mit ?from= auf /unlock", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      extraHTTPHeaders: { "x-forwarded-for": "203.0.113.11" },
    });
    const page = await ctx.newPage();
    await page.goto("/projekte/docuflow");
    await expect(page).toHaveURL(/\/unlock\?from=%2Fprojekte%2Fdocuflow$/);
    await ctx.close();
  });

  test("API ohne Session: 401 statt Redirect", async () => {
    const api = await request.newContext({
      baseURL: "http://localhost:3000",
      extraHTTPHeaders: { "x-forwarded-for": "203.0.113.12" },
    });
    const res = await api.post("/api/logout");
    expect(res.status()).toBe(401);
    await api.dispose();
  });

  test("robots.txt: öffentlich + Disallow all; X-Robots-Tag gesetzt", async () => {
    const api = await request.newContext({
      baseURL: "http://localhost:3000",
      extraHTTPHeaders: { "x-forwarded-for": "203.0.113.13" },
    });
    const robots = await api.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toMatch(/Disallow:\s*\//);

    const unlock = await api.get("/unlock");
    expect(unlock.headers()["x-robots-tag"]).toContain("noindex");
    await api.dispose();
  });

  test("falscher Code: generische Fehlermeldung, kein Zugang", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      extraHTTPHeaders: { "x-forwarded-for": "203.0.113.14" },
    });
    const page = await ctx.newPage();
    await page.goto("/unlock");
    await page.locator("#code").fill("voellig-falsch");
    await page.getByRole("button", { name: "Entsperren" }).click();
    await expect(page.getByTestId("unlock-message")).toHaveText(
      /nicht gültig/i
    );
    await expect(page).toHaveURL(/\/unlock$/);
    expect(
      (await ctx.cookies()).find((c) => c.name === "pf_session")
    ).toBeUndefined();
    await ctx.close();
  });

  test("Rate-Limit: 6. Versuch derselben IP → 429 + Retry-After", async () => {
    const api = await request.newContext({
      baseURL: "http://localhost:3000",
      extraHTTPHeaders: { "x-forwarded-for": "203.0.113.15" },
    });
    for (let i = 1; i <= 5; i++) {
      const res = await api.post("/api/unlock", {
        data: { code: `falsch-${i}` },
      });
      expect(res.status(), `Versuch ${i}`).toBe(401);
    }
    const sixth = await api.post("/api/unlock", {
      data: { code: "falsch-6" },
    });
    expect(sixth.status()).toBe(429);
    expect(Number(sixth.headers()["retry-after"])).toBeGreaterThan(0);
    await api.dispose();
  });

  test("korrekter Code: HttpOnly-Session-Cookie + Zugang zur Site", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      extraHTTPHeaders: { "x-forwarded-for": "203.0.113.16" },
    });
    const page = await ctx.newPage();
    await page.goto("/unlock");
    await page.locator("#code").fill(DEV_CODE);
    await page.getByRole("button", { name: "Entsperren" }).click();
    await page.waitForURL("/");

    const cookie = (await ctx.cookies()).find((c) => c.name === "pf_session");
    expect(cookie).toBeDefined();
    expect(cookie!.httpOnly).toBe(true);
    expect(cookie!.sameSite).toBe("Strict");

    // Mit Session: kein Redirect mehr.
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await ctx.close();
  });

  test("Magic-Link /unlock#code=… submitted automatisch", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      extraHTTPHeaders: { "x-forwarded-for": "203.0.113.17" },
    });
    const page = await ctx.newPage();
    await page.goto(`/unlock#code=${encodeURIComponent(DEV_CODE)}`);
    await page.waitForURL("/");
    expect(
      (await ctx.cookies()).find((c) => c.name === "pf_session")
    ).toBeDefined();
    await ctx.close();
  });

  test("?from= führt nach Unlock zum Ursprungs-Pfad", async ({ browser }) => {
    const ctx = await browser.newContext({
      extraHTTPHeaders: { "x-forwarded-for": "203.0.113.18" },
    });
    const page = await ctx.newPage();
    await page.goto("/unlock?from=%2Fprojekte%2Fdocuflow");
    await page.locator("#code").fill(DEV_CODE);
    await page.getByRole("button", { name: "Entsperren" }).click();
    await page.waitForURL("/projekte/docuflow"); // 404-Seite ok — Pfad zählt.
    await ctx.close();
  });

  test("Open-Redirect-Schutz: from=//evil.com wird ignoriert", async () => {
    const api = await request.newContext({
      baseURL: "http://localhost:3000",
      extraHTTPHeaders: { "x-forwarded-for": "203.0.113.19" },
    });
    const res = await api.post("/api/unlock", {
      data: { code: DEV_CODE, from: "//evil.com/phish" },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).redirect).toBe("/");
    await api.dispose();
  });
});
