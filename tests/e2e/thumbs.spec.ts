import { test } from "@playwright/test";
import { researchDocs } from "../../content/research";

// Erzeugt Vorschau-Thumbnails der Recherche-Dokumente (hinter Auth) für die
// Research-Karten. Kein echter Test — ein Generator-Lauf.
const CODE = "dev-test-code";

test("generate research thumbnails", async ({ page }) => {
  await page.goto("/unlock");
  await page.locator("#code").fill(CODE);
  await page.getByRole("button", { name: "Entsperren" }).click();
  await page.waitForURL("/");

  await page.setViewportSize({ width: 1280, height: 800 });
  for (const d of researchDocs) {
    await page.goto(`/research-docs/${d.file}`, { waitUntil: "load" });
    await page.waitForTimeout(900);
    await page.screenshot({
      path: `public/research-thumbs/${d.slug}.jpg`,
      type: "jpeg",
      quality: 72,
      clip: { x: 0, y: 0, width: 1280, height: 800 },
    });
  }
});
