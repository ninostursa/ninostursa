// Rendert das Erklärvideo: Bilder (Playwright) + Ton (mix.py) → MP4 1920x1080, 30 fps.
//   node render.js                      → mind-reader.mp4
//   node render.js --stills 5,12,30     → stills/still_<t>.png
//   node render.js --sheet              → stills/sheet.png (Übersicht: alle 4 s ein Bild)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30, WORKERS = 3;
const dir = __dirname;
const arg = n => { const i = process.argv.indexOf(n); return i > -1 ? (process.argv[i + 1] || true) : null; };
const timeline = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));

async function newPage(browser, scale = 2) {
  const page = await browser.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: scale });
  await page.addInitScript(tl => { window.TIMELINE = tl; }, timeline);
  page.on('pageerror', e => { console.error('Seitenfehler:', e.message); process.exitCode = 1; });
  await page.goto(require('url').pathToFileURL(path.join(dir, 'scene.html')).href);
  // Alle Schnitte vorab laden (sonst fehlen sie im ersten Bild, das sie braucht)
  await page.evaluate(() => Promise.all(
    [400, 500, 600, 700, 800, 900].map(w => document.fonts.load(`${w} 20px Inter`))
      .concat([400, 500, 600, 700, 800].map(w => document.fonts.load(`${w} 20px "JetBrains Mono"`)))));
  await page.evaluate(() => document.fonts.ready);
  return page;
}

(async () => {
  const browser = await chromium.launch();
  const stillsDir = path.join(dir, 'stills');
  if (arg('--stills') || arg('--sheet')) {
    fs.mkdirSync(stillsDir, { recursive: true });
    const page = await newPage(browser, 1);
    let times = arg('--stills') ? String(arg('--stills')).split(',').map(Number) : [];
    if (arg('--sheet')) for (let t = 2; t < timeline.duration; t += 4) times.push(+t.toFixed(1));
    for (const t of times) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(stillsDir, `still_${String(t).padStart(6, '0')}.png`) });
    }
    await browser.close();
    if (arg('--sheet')) {
      // Liste statt Glob (funktioniert auch unter Windows)
      const list = path.join(stillsDir, 'list.txt');
      fs.writeFileSync(list, times.map(t => `file '${path.join(stillsDir, `still_${String(t).padStart(6, '0')}.png`).replace(/\\/g, '/')}'`).join('\n'));
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list,
        '-vf', 'scale=480:270,tile=6x9', '-frames:v', '1', path.join(stillsDir, 'sheet.png')]);
    }
    return;
  }

  // Ton
  const probe = await newPage(browser, 1);
  const sfx = await probe.evaluate(() => window.SFX);
  await probe.close();
  fs.writeFileSync(path.join(dir, 'sfx.json'), JSON.stringify(sfx));
  execFileSync(process.platform === 'win32' ? 'python' : 'python3',[path.join(dir, 'mix.py')], { stdio: 'inherit' });

  // Bilder
  const framesDir = path.join(dir, 'frames');
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir);
  const total = Math.round(timeline.duration * FPS);
  let done = 0;
  const t0 = Date.now();
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const page = await newPage(browser, 2);
    for (let i = w; i < total; i += WORKERS) {
      await page.evaluate(t => window.render(t), i / FPS);
      await page.screenshot({ path: path.join(framesDir, `f${String(i).padStart(5, '0')}.png`) });
      if (++done % 300 === 0) console.log(`Bild ${done}/${total} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
  }));
  await browser.close();

  const out = path.join(dir, 'mind-reader.mp4');
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%05d.png'),
    '-i', path.join(dir, 'mix.wav'), '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], { stdio: 'inherit' });
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log('Fertig:', out);
})();
