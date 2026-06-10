import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const CODE = "dev-test-code";

// Eigene XFF-IP pro Spec-Datei (Unlock-Rate-Limit zählt auch Erfolge).
test.use({ extraHTTPHeaders: { "x-forwarded-for": "203.0.113.51" } });

async function scan(page: import("@playwright/test").Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical"
  );
  console.log(
    `AXE ${label}: ${results.violations.length} violations (${serious.length} serious/critical)`
  );
  for (const v of serious) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
  }
  return serious;
}

test("a11y: unlock + home", async ({ page }) => {
  await page.goto("/unlock");
  await page.waitForTimeout(300);
  const unlockSerious = await scan(page, "/unlock");

  await page.locator("#code").fill(CODE);
  await page.getByRole("button", { name: "Entsperren" }).click();
  await page.waitForURL("/");
  await page.waitForTimeout(600);
  const homeSerious = await scan(page, "/");

  // Keine schwerwiegenden/kritischen A11y-Verstöße zulassen.
  expect(unlockSerious, "unlock serious violations").toEqual([]);
  expect(homeSerious, "home serious violations").toEqual([]);
});
