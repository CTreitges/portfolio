import { test, expect } from "@playwright/test";

const CODE = "dev-test-code";

// Eigene XFF-IP pro Spec-Datei (Unlock-Rate-Limit zählt auch Erfolge).
test.use({ extraHTTPHeaders: { "x-forwarded-for": "203.0.113.54" } });

/**
 * Regression (Bug 2026-06-11): Lenis blockiert Anker-Links, solange
 * `anchors: true` fehlt — Hero-CTA "Projekte ansehen" und Header-Nav
 * waren tot. Dieser Test läuft BEWUSST OHNE reducedMotion, damit Lenis
 * aktiv ist wie beim echten Nutzer.
 */
test("anker-links scrollen mit aktivem Lenis", async ({ page }) => {
  await page.goto("/unlock");
  await page.locator("#code").fill(CODE);
  await page.getByRole("button", { name: "Entsperren" }).click();
  await page.waitForURL("/");
  await page.waitForTimeout(1000);

  await page.getByRole("link", { name: "Projekte ansehen" }).click();
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 })
    .toBeGreaterThan(500);
  const top = await page.evaluate(
    () => document.getElementById("projekte")!.getBoundingClientRect().top
  );
  expect(top).toBeGreaterThan(-250);
  expect(top).toBeLessThan(500);

  // Header-Nav (plain <a href="#...">) muss ebenfalls funktionieren.
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Kontakt" })
    .click();
  await expect
    .poll(
      () =>
        page.evaluate(
          () => document.getElementById("kontakt")!.getBoundingClientRect().top
        ),
      { timeout: 5000 }
    )
    .toBeLessThan(500);
});
