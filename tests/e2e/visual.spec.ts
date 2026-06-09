import { test, type Page } from "@playwright/test";

const CODE = "dev-test-code";

// emulateMedia setzt prefers-reduced-motion verlässlich (anders als test.use hier):
// → Lenis aus (natives Scrollen) + Reveal sofort sichtbar → vollständiger Full-Page-Shot.
async function unlock(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/unlock");
  await page.locator("#code").fill(CODE);
  await page.getByRole("button", { name: "Entsperren" }).click();
  await page.waitForURL("/");
  await page.waitForTimeout(500);
}

test("desktop screenshots", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await unlock(page);
  await page.screenshot({
    path: "test-results/shots/home-1440.png",
    fullPage: true,
  });
  await page.goto("/projekte/lieferschein-processor");
  await page.waitForTimeout(500);
  await page.screenshot({
    path: "test-results/shots/case-1440.png",
    fullPage: true,
  });
});

test("mobile screenshot", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await unlock(page);
  await page.screenshot({
    path: "test-results/shots/home-390.png",
    fullPage: true,
  });
});

test("unlock screenshot", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/unlock");
  await page.waitForTimeout(400);
  await page.screenshot({ path: "test-results/shots/unlock-1440.png" });
});

test("ki-wissen explorer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/unlock");
  await page.locator("#code").fill(CODE);
  await page.getByRole("button", { name: "Entsperren" }).click();
  await page.waitForURL("/");

  const section = page.locator("#ki-wissen");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Interessen/ }).click();
  await page.waitForTimeout(400);
  await section.screenshot({ path: "test-results/shots/ki-wissen.png" });
});
