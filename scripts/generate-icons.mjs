/**
 * Run once after dropping brand files into public/:
 *   node scripts/generate-icons.mjs
 *
 * Reads:  public/symbol.png  (source — any large square PNG)
 * Writes: app/icon.png        (512×512  — Next.js App Router favicon)
 *         app/apple-icon.png  (180×180  — Apple touch icon)
 *         app/favicon.ico     (32×32 embedded in .ico)
 */

import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const src = resolve(root, "public/symbol.png");

console.log("Reading", src);

const img = sharp(src);

await img.clone().resize(512, 512).png().toFile(resolve(root, "app/icon.png"));
console.log("✓ app/icon.png (512×512)");

await img.clone().resize(180, 180).png().toFile(resolve(root, "app/apple-icon.png"));
console.log("✓ app/apple-icon.png (180×180)");

// .ico = 32×32 PNG wrapped — browsers accept PNG inside .ico
const ico32 = await img.clone().resize(32, 32).png().toBuffer();
writeFileSync(resolve(root, "app/favicon.ico"), ico32);
console.log("✓ app/favicon.ico (32×32)");

console.log("\nDone. Restart the dev server to pick up the new icons.");
