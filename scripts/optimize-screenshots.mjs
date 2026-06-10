/**
 * Roh-Screenshots (PNG) → optimierte WebPs unter public/projects/<slug>/:
 *   <name>.webp        — max. 1600px breit (Galerie)
 *   <name>-thumb.webp  — 800x500, 16:10-Crop oben (Karten-Thumb)
 *
 *   node scripts/optimize-screenshots.mjs <slug> <raw-dir>
 *
 * Gibt fertige `screenshots`-Einträge (JSON) für content/projects.ts aus —
 * width/height stammen aus der tatsächlichen Ausgabedatei (CLS-Garantie).
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [slug, rawDir] = process.argv.slice(2);
if (!slug || !rawDir) {
  console.error("Aufruf: node scripts/optimize-screenshots.mjs <slug> <raw-dir>");
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "projects", slug);
fs.mkdirSync(outDir, { recursive: true });

const files = fs
  .readdirSync(rawDir)
  .filter((f) => f.toLowerCase().endsWith(".png"))
  .sort();

const entries = [];
for (const file of files) {
  const name = path.basename(file, path.extname(file));
  const src = path.join(rawDir, file);

  const main = await sharp(src)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(outDir, `${name}.webp`));

  await sharp(src)
    .resize(800, 500, { fit: "cover", position: "top" })
    .webp({ quality: 80 })
    .toFile(path.join(outDir, `${name}-thumb.webp`));

  entries.push({
    src: `/projects/${slug}/${name}.webp`,
    thumb: `/projects/${slug}/${name}-thumb.webp`,
    alt: "TODO",
    caption: "TODO",
    width: main.width,
    height: main.height,
  });
}

console.log(JSON.stringify(entries, null, 2));
