// Kanal-Grafiken rendern: node branding/render.js <avatar|banner|watermark> <ziel.png>
// watermark wird transparent mit 150x150 ausgegeben (YouTube-Vorgabe), die anderen in voller Größe.
const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');

(async () => {
  const [mode, out] = process.argv.slice(2);
  const [w, h] = mode === 'banner' ? [2560, 1440] : [800, 800];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('Seitenfehler:', e.message); process.exitCode = 1; });
  await page.goto(pathToFileURL(path.join(__dirname, 'branding.html')).href + '?mode=' + mode);
  await page.evaluate(() => Promise.all([800, 900].map(w => document.fonts.load(`${w} 20px Inter`))
    .concat([800].map(w => document.fonts.load(`${w} 20px "JetBrains Mono"`)))));
  const big = mode === 'watermark' ? path.resolve(out).replace(/\.png$/, '_800.png') : path.resolve(out);
  await page.screenshot({ path: big, omitBackground: mode === 'watermark' });
  await browser.close();
  if (mode === 'watermark') require('child_process').execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', big,
    '-vf', 'scale=150:150:flags=lanczos,format=rgba', path.resolve(out)]);
  console.log('Fertig:', out);
})();
