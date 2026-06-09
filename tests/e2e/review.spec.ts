import { test, type Page } from "@playwright/test";

const CODE = "dev-test-code";

async function unlock(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/unlock");
  await page.locator("#code").fill(CODE);
  await page.getByRole("button", { name: "Entsperren" }).click();
  await page.waitForURL("/");
  await page.waitForTimeout(400);
}

test("review sweep: viewports, routes, overflow, console", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("[console] " + m.text().slice(0, 200));
  });
  page.on("pageerror", (e) => errors.push("[pageerror] " + e.message.slice(0, 200)));

  await unlock(page);

  const viewports: [number, number][] = [
    [1440, 900],
    [820, 1180],
    [390, 844],
  ];
  const overflow: Record<string, { sw: number; cw: number; over: boolean }> = {};
  for (const [w, h] of viewports) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    await page.waitForTimeout(600);
    const o = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    overflow[`${w}`] = { ...o, over: o.sw > o.cw + 1 };
    await page.screenshot({
      path: `test-results/shots/rev-home-${w}.png`,
      fullPage: true,
    });
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  const routes: [string, string, boolean][] = [
    ["case-flagship", "/projekte/lieferschein-processor", true],
    ["case-pa", "/projekte/pa-streaming-hub", true],
    ["case-ordio", "/projekte/ordio-csv", true],
    ["research", "/research/cowork-guide", false],
    ["notfound", "/gibtsnicht", true],
    ["unlock", "/unlock", true],
  ];
  for (const [name, url, full] of routes) {
    await page.goto(url);
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `test-results/shots/rev-${name}.png`,
      fullPage: full,
    });
  }

  // Mobile Case-Study
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projekte/lieferschein-processor");
  await page.waitForTimeout(500);
  await page.screenshot({
    path: "test-results/shots/rev-case-390.png",
    fullPage: true,
  });

  console.log("OVERFLOW " + JSON.stringify(overflow));
  console.log(
    "CONSOLE_ERRORS count=" +
      errors.length +
      " " +
      JSON.stringify([...new Set(errors)].slice(0, 20))
  );
});
