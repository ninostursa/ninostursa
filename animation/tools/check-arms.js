// Prüft, ob irgendwo im Video eine Hand weiter weg liegt, als der Arm reicht (Arme würden gestreckt/zu lang wirken).
//   node tools/check-arms.js [folgen-ordner]   (Standard: the-copy) → Liste Zeitpunkt + Figur + Überlänge
// lib.js zieht solche Hände automatisch heran; diese Liste zeigt, wo dadurch eine Hand ihr Ziel (Tisch, Tastatur …) verfehlt.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), { pathToFileURL } = require('url');
const dir = path.resolve(__dirname, '..', process.argv[2] || 'the-copy');
(async () => {
  const tl = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 480, height: 270 } });
  await p.addInitScript(t => { window.TIMELINE = t; }, tl);
  await p.goto(pathToFileURL(path.join(dir, 'scene.html')).href);
  const res = await p.evaluate(dur => { const out = {};
    for (let t = 0; t < dur; t += .25) { window.ARMWARN = []; render(t); if (window.ARMWARN.length) out[t.toFixed(2)] = [...new Set(window.ARMWARN.map(w => w.split(' ').slice(0, -1).join(' ')))].join(', ') + ' (max ' + Math.max(...window.ARMWARN.map(w => parseInt(w.split(' ').pop()))) + '%)'; }
    return out; }, tl.duration);
  await b.close();
  // zu Bereichen zusammenfassen
  let last = null, start = null; const rows = [];
  const ks = Object.keys(res).map(Number);
  ks.forEach((t, i) => { if (start === null) start = t; if (ks[i + 1] === undefined || ks[i + 1] - t > .26 || res[ks[i + 1].toFixed(2)].split(' (')[0] !== res[t.toFixed(2)].split(' (')[0]) { rows.push(`${start.toFixed(2)}–${t.toFixed(2)} s: ${res[t.toFixed(2)]}`); start = null; } });
  console.log(rows.length ? rows.join('\n') : 'Alle Hände liegen in Armreichweite.');
  process.exitCode = rows.length ? 1 : 0;
})();
