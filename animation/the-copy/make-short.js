// Short (9:16, ~23 s) aus dem fertigen Video bauen: node make-short.js  → short.mp4
// Teil A: Kalt-Einstieg 0–14,1 s · Teil B: "one question … We will get to it" (17,5–22,3 s) · Teil C: Titelkarte + Aufruf
// Der Hochformat-Ausschnitt folgt dem Geschehen (Schwenk-Stützpunkte PAN), Untertitel für stumm schauende Zuschauer.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const dir = __dirname, parts = path.join(dir, 'short_parts');
const SRC = path.join(dir, 'the-copy.mp4'), OUT = path.join(dir, 'short.mp4');
const A = [0, 14.1], B = [17.5, 22.3], AUDIO_B_END = 26.7;
const PANEL_END = (A[1] - A[0]) + (B[1] - B[0]);          // 18,9 s
const TOTAL = PANEL_END + (AUDIO_B_END - B[1]);            // 23,3 s
const SCALE = 1.125, PANEL_Y = 330, CAP_Y = 1250;

// Schwenk: [Zeit im Short, Bildmitte im Original (x, 0..1920)]
const PAN = [[0, 1330], [2.6, 1330], [3.9, 960], [5.6, 960], [6.3, 1110], [7.6, 1110], [8.6, 1320], [11.9, 1320],
  [12.5, 1170], [14.1, 1170], [14.101, 820], [PANEL_END, 820]];
// Untertitel: [von, bis, Text mit | als Zeilenumbruch]
const CAPS = [
  [1.2, 2.9, 'Sunday dinner|at the Millers.'], [3.0, 4.05, 'Spaghetti, as always.'], [4.15, 5.75, 'And this is Dad.'],
  [5.9, 7.65, 'Dad died|three years ago.'], [7.7, 9.4, 'But he still|comes to dinner.'], [9.45, 10.6, 'Every Sunday.'],
  [10.7, 12.1, 'Same terrible jokes.'], [12.15, 14.1, 'He just drinks|motor oil now.'],
  [14.15, 15.35, 'And there is|one question'], [15.35, 16.95, 'this family never|dared to ask him.'], [17.15, 18.85, 'We will get to it.'],
];

const px = cx => Math.max(0, Math.min(2160 - 1080, cx * SCALE - 540));
function panExpr() {
  let e = String(px(PAN[PAN.length - 1][1]));
  for (let i = PAN.length - 2; i >= 0; i--) {
    const [t0, c0] = PAN[i], [t1, c1] = PAN[i + 1], x0 = px(c0), x1 = px(c1);
    const k = `((t-${t0})/${(t1 - t0).toFixed(4)})`;
    e = `if(lt(t,${t1}),${x0}+(${x1 - x0})*${k}*${k}*(3-2*${k}),${e})`;
  }
  return e;
}

(async () => {
  fs.rmSync(parts, { recursive: true, force: true }); fs.mkdirSync(parts);
  const browser = await chromium.launch();
  const shot = async (query, file, h) => {
    const page = await browser.newPage({ viewport: { width: 1080, height: h }, deviceScaleFactor: 1 });
    page.on('pageerror', e => { console.error('Seitenfehler:', e.message); process.exitCode = 1; });
    await page.goto(pathToFileURL(path.join(dir, 'short.html')).href + '?' + query);
    await page.evaluate(() => Promise.all([800, 900].map(w => document.fonts.load(`${w} 20px Inter`)).concat([document.fonts.load('800 20px "JetBrains Mono"')])));
    await page.screenshot({ path: path.join(parts, file), omitBackground: true });
    await page.close();
  };
  await shot('mode=bg', 'bg.png', 1920);
  await shot('mode=hook', 'hook.png', 1920);
  await shot('mode=end', 'end.png', 1920);
  for (let i = 0; i < CAPS.length; i++) await shot('mode=cap&text=' + encodeURIComponent(CAPS[i][2]), `cap${i}.png`, 300);
  await browser.close();

  const args = ['-loglevel', 'error', '-y', '-i', SRC,
    '-loop', '1', '-t', String(TOTAL), '-i', path.join(parts, 'bg.png'),
    '-loop', '1', '-t', String(TOTAL), '-i', path.join(parts, 'hook.png'),
    '-loop', '1', '-t', String(TOTAL), '-i', path.join(parts, 'end.png')];
  CAPS.forEach((_, i) => args.push('-loop', '1', '-t', String(TOTAL), '-i', path.join(parts, `cap${i}.png`)));
  let f = `[0:v]trim=${A[0]}:${A[1]},setpts=PTS-STARTPTS[va];[0:v]trim=${B[0]}:${B[1]},setpts=PTS-STARTPTS[vb];` +
    `[va][vb]concat=n=2:v=1:a=0,scale=2160:1215,crop=1080:1215:x='${panExpr()}':y=0[pan];` +
    `[1:v][pan]overlay=0:${PANEL_Y}:eof_action=pass[s0];[s0][2:v]overlay=0:0:enable='lt(t,${PANEL_END})'[s1];`;
  CAPS.forEach(([a, b], i) => { f += `[s${i + 1}][${4 + i}:v]overlay=0:${CAP_Y}:enable='between(t,${a},${b})'[s${i + 2}];`; });
  const last = `s${CAPS.length + 1}`;
  f += `[3:v]format=rgba,fade=t=in:st=${PANEL_END}:d=0.35:alpha=1[end];[${last}][end]overlay=0:0:enable='gte(t,${PANEL_END})',fps=30,format=yuv420p[v];`;
  f += `[0:a]atrim=${A[0]}:${A[1]},asetpts=PTS-STARTPTS,afade=t=out:st=${A[1] - A[0] - .08}:d=0.08[a1];` +
    `[0:a]atrim=${B[0]}:${AUDIO_B_END},asetpts=PTS-STARTPTS,afade=t=in:d=0.08,afade=t=out:st=${AUDIO_B_END - B[0] - .7}:d=0.7[a2];` +
    `[a1][a2]concat=n=2:v=0:a=1[a]`;
  args.push('-filter_complex', f, '-map', '[v]', '-map', '[a]', '-t', String(TOTAL),
    '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', OUT);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  console.log('Fertig:', OUT, `(${TOTAL.toFixed(1)} s)`);
})();
