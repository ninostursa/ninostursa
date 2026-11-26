// Rendert scene.html zu einem MP4 (1080x1920, 30 fps) mit synthetisiertem Ton.
//   node render.js                 → copy-of-you_en.mp4
//   node render.js --lang de       → copy-of-you_de.mp4
//   node render.js --stills 2,9,14 → still_<t>.png (Testbilder)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30, WORKERS = 3;
const dir = __dirname;
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : d; };
const lang = arg('--lang', 'en');
const url = 'file://' + path.join(dir, 'scene.html') + '?lang=' + lang;

async function newPage(browser) {
  const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

(async () => {
  const browser = await chromium.launch();
  const stills = arg('--stills');
  if (stills) {
    const page = await newPage(browser);
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(dir, `still_${t}.png`) });
    }
    await browser.close();
    return;
  }

  const framesDir = path.join(dir, `frames_${lang}`);
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir);
  const probe = await newPage(browser);
  const duration = await probe.evaluate(() => window.DURATION);
  await probe.close();
  const total = Math.round(duration * FPS);

  let done = 0;
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const page = await newPage(browser);
    for (let i = w; i < total; i += WORKERS) {
      await page.evaluate(t => window.render(t), i / FPS);
      await page.screenshot({ path: path.join(framesDir, `f${String(i).padStart(4, '0')}.png`) });
      if (++done % 150 === 0) console.log(`[${lang}] Bild ${done}/${total}`);
    }
  }));
  await browser.close();

  // ---------- Ton ----------
  const D = duration;
  const env = (a, b) => `between(t,${a},${b})`;
  const filter = [
    // Klangteppich: Am im Labor, F-Dur beim Essen, Am zum Schluss
    `aevalsrc='0.045*(if(lt(t,17)+gt(t,37), sin(2*PI*110*t)+0.8*sin(2*PI*130.81*t)+0.6*sin(2*PI*164.81*t), sin(2*PI*87.31*t)+0.8*sin(2*PI*110*t)+0.6*sin(2*PI*130.81*t)+0.4*sin(2*PI*174.61*t)))*(0.75+0.25*sin(2*PI*0.25*t))':d=${D}:s=44100,afade=t=in:d=1.5,afade=t=out:st=${D - 1.5}:d=1.5[pad]`,
    // Upload-Piepen, Tonhöhe steigt
    `aevalsrc='${env(5.4, 10.9)}*0.10*sin(2*PI*(520+110*(t-5.4))*t)*lt(mod(t,0.22),0.05)':d=${D}:s=44100[beep]`,
    // Einschalt-Gong + Anstoß-Klirren + Schluss-Glitzern + Zwinker-Blip
    `aevalsrc='gte(t,11)*0.22*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-2.5*(t-11)) + gte(t,26.75)*0.22*(sin(2*PI*2637*t)+0.7*sin(2*PI*3951*t))*exp(-8*(t-26.75)) + gte(t,39.6)*0.12*(sin(2*PI*1046.5*t)+0.5*sin(2*PI*1568*t))*exp(-1.8*(t-39.6)) + ${env(41.6, 41.9)}*0.15*sin(2*PI*(1400+3000*(t-41.6))*t)':d=${D}:s=44100[ding]`,
    // Gluckern beim Einschenken (19.2–20.3) und Schlucken (21.6–22.4)
    `anoisesrc=color=brown:d=${D}:a=0.9:r=44100,lowpass=f=500,volume='(${env(19.2, 20.3)}*(0.5+0.5*sin(2*PI*9*t)) + ${env(21.6, 22.4)}*(0.5+0.5*sin(2*PI*4*t)))*2.2':eval=frame[glug]`,
    // Dampf-Zischen (22.2) + Zeitraffer-Rauschen (29.3–36.8)
    `anoisesrc=color=pink:d=${D}:a=0.5:r=44100,highpass=f=1500,volume='gte(t,22.2)*lt(t,23.4)*0.5*exp(-3*(t-22.2)) + ${env(29.3, 37.2)}*0.32*pow(min(1,(t-29.3)/6),2)*min(1,(37.2-t)*3)':eval=frame[hiss]`,
    `[pad][beep][ding][glug][hiss]amix=5:normalize=0,alimiter=limit=0.9[aout]`,
  ].join(';');

  const out = path.join(dir, `copy-of-you_${lang}.mp4`);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-filter_complex', filter, '-map', '0:v', '-map', '[aout]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium',
    '-c:a', 'aac', '-b:a', '160k', '-t', String(D), out], { stdio: 'inherit' });
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log('Fertig:', out);
})();
