// Rendert scene.html Bild für Bild und baut daraus ein MP4 (1080x1920, 30 fps) mit Ton.
// Aufruf:  node render.js            → szene01.mp4
//          node render.js --still 5  → still.png (Einzelbild bei t=5s, zum Testen)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30;
const dir = __dirname;
const framesDir = path.join(dir, 'frames');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(dir, 'scene.html'));
  await page.evaluate(() => document.fonts.ready);

  const stillIdx = process.argv.indexOf('--still');
  if (stillIdx > -1) {
    const t = parseFloat(process.argv[stillIdx + 1] || '2');
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: path.join(dir, 'still.png') });
    await browser.close();
    return;
  }

  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir);
  const duration = await page.evaluate(() => window.DURATION);
  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    await page.screenshot({ path: path.join(framesDir, `f${String(i).padStart(4, '0')}.png`) });
    if (i % 60 === 0) console.log(`Bild ${i}/${total}`);
  }
  await browser.close();

  // Ton: ruhiger Klangteppich + tiefes Raketengrollen + "Whoosh" beim Zeitsprung
  const audio = [
    // Pad (A2 + E3 + A3), sanft ein- und ausgeblendet
    `sine=f=110:d=${duration}[a1];sine=f=164.8:d=${duration}[a2];sine=f=220:d=${duration}[a3];` +
    `[a1][a2][a3]amix=3,volume=0.5,tremolo=f=0.3:d=0.4,afade=t=in:d=1.5,afade=t=out:st=${duration - 1.2}:d=1.2[pad];` +
    // Grollen: braunes Rauschen, tiefpassgefiltert, Hüllkurve 3.2s → 9.5s
    `anoisesrc=color=brown:d=${duration}:a=0.9,lowpass=f=160,lowpass=f=160,` +
    `volume='if(lt(t,3.2),0,if(lt(t,4.4),(t-3.2)/1.2,if(lt(t,7),1,max(0,1-(t-7)/2.5))))*1.6':eval=frame[rumble];` +
    // Whoosh: Rosa Rauschen mit Bandpass, ab 7.8s ansteigend
    `anoisesrc=color=pink:d=${duration}:a=0.5,bandpass=f=1200:w=900,` +
    `volume='if(lt(t,7.8),0,if(lt(t,11.2),pow((t-7.8)/3.4,2),max(0,1-(t-11.2)/0.5)))*0.35':eval=frame[whoosh];` +
    `[pad][rumble][whoosh]amix=3:normalize=0,alimiter=limit=0.9[aout]`,
  ].join('');

  execFileSync('ffmpeg', [
    '-y', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-filter_complex', audio, '-map', '0:v', '-map', '[aout]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium',
    '-c:a', 'aac', '-b:a', '160k', '-shortest', path.join(dir, 'szene01.mp4'),
  ], { stdio: 'inherit' });
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log('Fertig: szene01.mp4');
})();
