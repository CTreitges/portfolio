/**
 * Rendert og.png (1200x630, public/) und apple-icon.png (180x180, app/)
 * aus den HTML-Templates in diesem Ordner. Playwright nutzt das
 * Repo-Chromium; Webfonts kommen von Google Fonts (Netzwerk nötig).
 *
 *   node scripts/og/capture-og.mjs
 */
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");

const jobs = [
  {
    template: path.join(here, "og-template.html"),
    out: path.join(root, "public", "og.png"),
    width: 1200,
    height: 630,
  },
  {
    template: path.join(here, "apple-icon-template.html"),
    out: path.join(root, "app", "apple-icon.png"),
    width: 180,
    height: 180,
  },
];

const browser = await chromium.launch();
try {
  for (const job of jobs) {
    const page = await browser.newPage({
      viewport: { width: job.width, height: job.height },
      deviceScaleFactor: 1,
    });
    await page.goto("file://" + job.template, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: job.out });
    await page.close();
    console.log("geschrieben:", path.relative(root, job.out));
  }
} finally {
  await browser.close();
}
