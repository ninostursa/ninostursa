// Prüft alle Frisuren aus lib.js: Bei Figuren mit Haaren darf oben am Kopf keine Haut durchscheinen ("Glatze").
//   node tools/check-hair.js [pfad/zur/lib.js]   → Liste OK/FEHLER + tools/hair-check.png (Übersicht zum Ansehen)
// Ablauf: Jede Frisur wird mit Testfarben gezeichnet (Haut Magenta, Haare Grün). Im Bereich über der Stirn
// (Kopfoberkante bis 10 Einheiten darunter, mittlere 60 % der Kopfbreite) zählt das Skript Haut-Pixel.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const lib = path.resolve(process.argv[2] || path.join(__dirname, '../the-copy/lib.js'));
const NO_HAIR = ['bald', 'beard', 'stubble', 'moustache', 'full'];   // Glatze gewollt bzw. Bärte

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.setContent(`<html><body style="margin:0;background:#fff"><svg id="s" width="1600" height="900" viewBox="0 0 1600 900"></svg></body></html>`);
  await page.addScriptTag({ content: fs.readFileSync(lib, 'utf8') });
  const styles = await page.evaluate(no => Object.keys(HAIR).filter(k => Array.isArray(HAIR[k]) && !no.includes(k)), NO_HAIR);
  let bad = 0;
  for (const st of styles) {
    await page.evaluate(st => { document.getElementById('s').innerHTML =
      person({ x: 800, neck: 560, s: 4, hair: st, hairCol: '#00ff00', skin: '#ff00ff', shirt: '#cccccc', blush: false }); }, st);
    // Kopfmitte hy = neck - 66*s = 296, Kopf rx 50*s, ry 58*s → Oberkante y = 64
    const buf = await page.screenshot({ clip: { x: 800 - 120, y: 64, width: 240, height: 40 } });
    const skin = await page.evaluate(async b64 => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data;
      let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] < 80 && d[i + 2] > 200) n++; return n;
    }, buf.toString('base64'));
    const ok = skin < 20;
    if (!ok) bad++;
    console.log(`${ok ? 'OK    ' : 'FEHLER'} ${st.padEnd(8)} Haut-Pixel über der Stirn: ${skin}`);
  }
  // Übersicht aller Frisuren in normalen Farben
  await page.evaluate(styles => { document.getElementById('s').innerHTML = styles.map((st, i) =>
    person({ x: 110 + (i % 8) * 190, neck: 230 + Math.floor(i / 8) * 360, s: 1.2, hair: st, hairCol: '#5a3a2a', skin: '#f2c6a0', shirt: '#4c6ef5' }) +
    `<text x="${110 + (i % 8) * 190}" y="${380 + Math.floor(i / 8) * 360}" text-anchor="middle" font-size="22" font-family="sans-serif">${st}</text>`).join(''); }, styles);
  await page.screenshot({ path: path.join(__dirname, 'hair-check.png') });
  await browser.close();
  console.log(bad ? `\n${bad} Frisur(en) zeigen eine Glatze – Vorderhaar höher ziehen (Scheitelpunkt mind. 6 Einheiten über der Kopfoberkante y-58).` : '\nAlle Frisuren decken den Kopf ab.');
  process.exitCode = bad ? 1 : 0;
})();
