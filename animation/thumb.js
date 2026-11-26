// Thumbnail rendern: node thumb.js <seite.html> <ziel.png>  → 1920x1080 PNG (YouTube: 16:9, max. 2 MB)
const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const [src, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  page.on('pageerror', e => { console.error('Seitenfehler:', e.message); process.exitCode = 1; });
  await page.goto(pathToFileURL(path.resolve(src)).href);
  await page.evaluate(() => Promise.all(
    [400, 500, 600, 700, 800, 900].map(w => document.fonts.load(`${w} 20px Inter`))
      .concat([400, 500, 600, 700, 800].map(w => document.fonts.load(`${w} 20px "JetBrains Mono"`)))));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.resolve(out) });
  await browser.close();
  console.log('Fertig:', out);
})();
