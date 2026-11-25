// node scripts/stills.mjs <slug-film> 2 14.5 31 ...  -> <slug>/out/stills/s_<detik>.jpg (skala 0.5), satu bundle, satu browser.
// Cek tampilan adegan sebelum render penuh (jauh lebih cepat daripada render video). Jalankan dari folder kerja.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [slug, ...rest] = process.argv.slice(2);
const times = rest.map(Number);
if (!slug || !times.length) { console.log("pakai: node scripts/stills.mjs <slug-film> <detik> <detik> ..."); process.exit(1); }
const outDir = path.join(slug, "out", "stills");
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({
  entryPoint: path.resolve(slug, "src/index.ts"),
  publicDir: path.resolve(slug, "public"),
  webpackOverride: (c) => c,
});
const browser = await openBrowser("chrome", { chromiumOptions: { gl: "angle" } });
const comp = await selectComposition({ serveUrl, id: "Film", puppeteerInstance: browser });
for (const t of times) {
  const out = path.join(outDir, `s_${t}.jpg`);
  await renderStill({ composition: comp, serveUrl, output: out, frame: Math.min(comp.durationInFrames - 1, Math.round(t * comp.fps)), scale: 0.5, imageFormat: "jpeg", puppeteerInstance: browser, chromiumOptions: { gl: "angle" } });
  console.log("ok", out);
}
await browser.close({ silent: true });
