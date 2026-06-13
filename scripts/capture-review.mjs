import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const CODE = "dev-test-code";
const OUT = "/tmp/portfolio-shots";
mkdirSync(OUT, { recursive: true });

const SECTIONS = ["about", "projekte", "ki-wissen", "setup", "research", "lab", "werdegang", "making-of", "kontakt"];

async function unlock(page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://localhost:3000/unlock");
  await page.locator("#code").fill(CODE);
  await page.getByRole("button", { name: "Entsperren" }).click();
  await page.waitForURL("http://localhost:3000/");
  await page.waitForTimeout(700);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  extraHTTPHeaders: { "x-forwarded-for": "203.0.113.77" },
});
const page = await ctx.newPage();

// ── Unlock-Seite (Desktop) ───────────────────────────────────────
await page.setViewportSize({ width: 1440, height: 900 });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://localhost:3000/unlock");
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/00-unlock-1440.png` });

// ── Desktop: Full-Page + Sektionen ───────────────────────────────
await unlock(page);
await page.screenshot({ path: `${OUT}/01-home-full-1440.png`, fullPage: true });

// Hero (oben)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/02-hero-1440.png` });

for (const id of SECTIONS) {
  const sec = page.locator(`#${id}`);
  if ((await sec.count()) === 0) { console.log(`MISSING section #${id}`); continue; }
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await sec.screenshot({ path: `${OUT}/sec-${id}-1440.png` }).catch((e) => console.log(`shot fail ${id}: ${e.message}`));
}

// KI-Wissen Constellation: aktiv interagieren (Desktop-only)
try {
  const sec = page.locator("#ki-wissen");
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Interessen|Explorer|Wissen/ }).first().click({ timeout: 2000 }).catch(() => {});
  await page.waitForTimeout(400);
  await sec.screenshot({ path: `${OUT}/sec-ki-wissen-active-1440.png` });
} catch {}

// ── Case-Study-Seite (Flagship) ──────────────────────────────────
await page.goto("http://localhost:3000/projekte/lieferschein-processor");
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/03-case-lieferschein-1440.png`, fullPage: true });

// ── Mobile 390: Full-Page + Schlüssel-Sektionen ──────────────────
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://localhost:3000/");
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/10-home-full-390.png`, fullPage: true });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/11-hero-390.png` });
for (const id of ["about", "projekte", "kontakt"]) {
  const sec = page.locator(`#${id}`);
  if ((await sec.count()) === 0) continue;
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await sec.screenshot({ path: `${OUT}/sec-${id}-390.png` }).catch(() => {});
}

// Konsolen-Fehler einsammeln
await browser.close();
console.log("DONE");
