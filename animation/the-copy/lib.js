/* Zeichen-Bibliothek: Helfer, Figuren, Roboter, Requisiten, Text.
 * Bildfläche 1920x1080. Alle Funktionen liefern SVG-Strings. */
const W = 1920, H = 1080;
const MINT = '#5ef2c8', CORAL = '#ff7a59', SUN = '#ffd166', NAVY = '#0b1a26', INK = '#1d2438';

// ---------- Mathe / Zeit ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeIn = k => k * k * k;
const back = k => { if (k <= 0) return 0; if (k >= 1) return 1; const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const inOut = (t, a, b, c, d) => ease(prog(t, a, b)) * (1 - ease(prog(t, c, d)));
const pulse = (t, a, len = .4) => { const k = (t - a) / len; return k < 0 || k > 1 ? 0 : Math.sin(k * Math.PI); };
function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
const mix = (c1, c2, k) => { const a = hex2rgb(c1), b = hex2rgb(c2); return '#' + a.map((v, i) => Math.round(lerp(v, b[i], clamp(k))).toString(16).padStart(2, '0')).join(''); };
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const noise = (t, f, s) => Math.sin(t * f + s) * .6 + Math.sin(t * f * 2.3 + s * 1.7) * .4;
const blinkAt = (t, seed) => ((t + seed * 1.37) % 4.1) < .13 ? .1 : 1;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- Timeline ----------
let TL = null, CLIP = {};
function setTimeline(tl) { TL = tl; CLIP = {}; tl.clips.forEach(c => CLIP[c.id] = c); }
const S = id => CLIP[id].start, E = id => CLIP[id].end;
const F = (id, f) => lerp(CLIP[id].start, CLIP[id].end, f);     // Zeitpunkt bei Anteil f des Clips

// ---------- Text ----------
function text(str, x, y, o = {}) {
  const { size = 60, weight = 900, fill = '#fff', font = 'Inter', anchor = 'middle', op = 1, ls = 0, glow = null, stroke = null } = o;
  const base = `x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle" font-family="${font}" font-weight="${weight}" font-size="${size}" letter-spacing="${ls}"`;
  let s = '';
  if (glow) s += `<text ${base} fill="${glow}" opacity="${.5 * op}" filter="url(#glow)">${esc(str)}</text>`;
  if (stroke) s += `<text ${base} fill="${stroke}" stroke="${stroke}" stroke-width="${size * .14}" stroke-linejoin="round" opacity="${.6 * op}">${esc(str)}</text>`;
  return s + `<text ${base} fill="${fill}" opacity="${op}">${esc(str)}</text>`;
}
// Schlagzeile, ploppt rein (Zeilen nacheinander), zweite Zeile mint
function headline(lines, x, y, t, tIn, tOut, o = {}) {
  const { size = 92, hl = 1, gap = 1.12, color = '#fff' } = o;
  let s = '';
  lines.forEach((ln, i) => {
    const k = back(prog(t, tIn + i * .25, tIn + i * .25 + .4)) * (1 - ease(prog(t, tOut, tOut + .3)));
    if (k <= 0) return;
    s += `<g transform="translate(${x} ${y + i * size * gap}) scale(${k})">${text(ln, 0, 0, { size, fill: i === hl ? MINT : color, glow: i === hl ? MINT : null, stroke: '#08121b', op: clamp(k) })}</g>`;
  });
  return s;
}
// kleines Etikett (Ort/Jahr)
function tag(str, x, y, k, color = MINT) {
  if (k <= 0) return '';
  const w = str.length * 17 + 46;
  return `<g transform="translate(${x} ${y})" opacity="${clamp(k)}"><g transform="translate(${(1 - easeOut(k)) * -40} 0)">
    <rect x="0" y="-26" width="${w}" height="52" rx="10" fill="#08121b" opacity=".82"/>
    <rect x="0" y="-26" width="8" height="52" rx="4" fill="${color}"/>
    ${text(str, 26, 1, { size: 28, weight: 800, font: 'JetBrains Mono', anchor: 'start', fill: color })}</g></g>`;
}
function counter(val, x, y, label, k, o = {}) {
  if (k <= 0) return '';
  const { size = 96, color = MINT } = o;
  return `<g transform="translate(${x} ${y}) scale(${back(clamp(k * 1.4))})" opacity="${clamp(k * 2)}">
    ${text(val, 0, 0, { size, font: 'Inter', fill: color, glow: color })}
    ${text(label, 0, size * .78, { size: size * .32, weight: 800, font: 'JetBrains Mono', fill: '#d9f7ee', ls: 3 })}</g>`;
}
const fmt = n => Math.round(n).toLocaleString('en-US');

function bubble(x, y, str, k, o = {}) {
  if (k <= 0) return '';
  const { robot = false, tail = 0, size = 40, maxW = 640 } = o;
  const fill = robot ? '#0d1b2a' : '#fff', fg = robot ? MINT : INK;
  // einfacher Zeilenumbruch
  const words = str.split(' '); const lines = []; let cur = '';
  const cw = size * (robot ? .62 : .56);
  words.forEach(w => { if ((cur + ' ' + w).trim().length * cw > maxW) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; });
  lines.push(cur.trim());
  const w = Math.max(...lines.map(l => l.length)) * cw + 70, h = lines.length * size * 1.25 + 44;
  const st = robot ? `stroke="${MINT}" stroke-width="4"` : '';
  return `<g transform="translate(${x} ${y}) scale(${back(k)})" opacity="${clamp(k * 2)}">
    <path d="M${tail - 18} ${h / 2 - 6} L${tail + 4} ${h / 2 + 40} L${tail + 24} ${h / 2 - 6} Z" fill="${fill}" ${st}/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${Math.min(40, h / 2)}" fill="${fill}" ${st}/>
    <rect x="${tail - 15}" y="${h / 2 - 12}" width="36" height="12" fill="${fill}"/>
    ${lines.map((l, i) => text(l, 0, -h / 2 + 22 + size * .62 + i * size * 1.25, { size, weight: 800, font: robot ? 'JetBrains Mono' : 'Inter', fill: fg })).join('')}</g>`;
}

// ---------- Figuren (gezeichnete Menschen, Vorderansicht) ----------
// Ellbogen: von zwei möglichen Lagen immer die natürliche (nach außen und unten) wählen.
// side = 1 → linker Arm (außen = links), side = -1 → rechter Arm (außen = rechts)
function elbow(sx, sy, hx, hy, L, side) {
  const dx = hx - sx, dy = hy - sy, dd = Math.hypot(dx, dy) || 1, d = Math.min(dd, L * 2 - .01);
  const mx = (sx + hx) / 2, my = (sy + hy) / 2, h = Math.sqrt(Math.max(0, L * L - d * d / 4));
  const nx = -dy / dd, ny = dx / dd;
  const out = side > 0 ? -1 : 1;
  const a = [mx + nx * h, my + ny * h], b = [mx - nx * h, my - ny * h];
  const score = e => .5 * out * (e[0] - sx) + (e[1] - sy);
  return score(a) >= score(b) ? a : b;
}
function armPath(sx, sy, hx, hy, L, side) {
  const [ex, ey] = elbow(sx, sy, hx, hy, L, side);
  return `M${sx} ${sy} L${ex} ${ey} L${hx} ${hy}`;
}
// Hand mit Daumen, ausgerichtet am Unterarm
function hand(hx, hy, ex, ey, r, skin, side) {
  const ang = Math.atan2(hy - ey, hx - ex) * 180 / Math.PI;
  const shade = mix(skin, '#7a4a3a', .25);
  return `<g transform="translate(${hx} ${hy}) rotate(${ang})">
    <ellipse cx="${r * .35}" cy="${side * -r * .55}" rx="${r * .42}" ry="${r * .32}" fill="${shade}"/>
    <ellipse cx="${r * .2}" cy="0" rx="${r * 1.05}" ry="${r * .82}" fill="${skin}"/>
    <path d="M${r * .55} ${-r * .45} L${r * 1.05} ${-r * .45} M${r * .6} 0 L${r * 1.15} 0 M${r * .55} ${r * .45} L${r * 1.05} ${r * .45}" stroke="${shade}" stroke-width="${r * .12}" stroke-linecap="round" opacity=".6"/></g>`;
}

const HAIR = {
  // jeweils [hinten, vorne] als Funktion (x, hy Kopfmitte, s, Farbe)
  dad: [
    (x, y, s, c) => '',
    (x, y, s, c) => `<path d="M${x - 50 * s} ${y - 6 * s} C ${x - 54 * s} ${y - 62 * s}, ${x + 50 * s} ${y - 76 * s}, ${x + 52 * s} ${y - 10 * s} C ${x + 40 * s} ${y - 34 * s}, ${x + 10 * s} ${y - 40 * s}, ${x - 8 * s} ${y - 36 * s} C ${x - 26 * s} ${y - 34 * s}, ${x - 40 * s} ${y - 24 * s}, ${x - 50 * s} ${y - 6 * s} Z" fill="${c}"/>
      <path d="M${x + 4 * s} ${y - 56 * s} C ${x - 4 * s} ${y - 92 * s}, ${x + 36 * s} ${y - 96 * s}, ${x + 30 * s} ${y - 72 * s} C ${x + 26 * s} ${y - 62 * s}, ${x + 14 * s} ${y - 70 * s}, ${x + 18 * s} ${y - 78 * s}" stroke="${c}" stroke-width="${9 * s}" fill="none" stroke-linecap="round"/>`],
  beard: [(x, y, s, c) => '', (x, y, s, c) => `<path d="M${x - 46 * s} ${y + 6 * s} C ${x - 44 * s} ${y + 60 * s}, ${x + 44 * s} ${y + 60 * s}, ${x + 46 * s} ${y + 6 * s} C ${x + 36 * s} ${y + 36 * s}, ${x - 36 * s} ${y + 36 * s}, ${x - 46 * s} ${y + 6 * s} Z" fill="${c}" opacity=".9"/>`],
  mom: [
    (x, y, s, c) => `<path d="M${x - 62 * s} ${y + 46 * s} C ${x - 78 * s} ${y - 40 * s}, ${x - 40 * s} ${y - 80 * s}, ${x} ${y - 78 * s} C ${x + 40 * s} ${y - 80 * s}, ${x + 78 * s} ${y - 40 * s}, ${x + 62 * s} ${y + 46 * s} Z" fill="${c}"/>`,
    (x, y, s, c) => `<path d="M${x - 54 * s} ${y + 4 * s} C ${x - 58 * s} ${y - 60 * s}, ${x + 20 * s} ${y - 82 * s}, ${x + 54 * s} ${y - 20 * s} C ${x + 30 * s} ${y - 40 * s}, ${x - 10 * s} ${y - 30 * s}, ${x - 30 * s} ${y - 40 * s} C ${x - 40 * s} ${y - 20 * s}, ${x - 46 * s} ${y - 8 * s}, ${x - 54 * s} ${y + 4 * s} Z" fill="${c}"/>`],
  lily: [
    (x, y, s, c) => `<circle cx="${x - 62 * s}" cy="${y - 10 * s}" r="${22 * s}" fill="${c}"/><circle cx="${x + 62 * s}" cy="${y - 10 * s}" r="${22 * s}" fill="${c}"/>
      <rect x="${x - 70 * s}" y="${y - 32 * s}" width="${14 * s}" height="${8 * s}" rx="3" fill="${CORAL}"/><rect x="${x + 56 * s}" y="${y - 32 * s}" width="${14 * s}" height="${8 * s}" rx="3" fill="${CORAL}"/>`,
    (x, y, s, c) => `<path d="M${x - 50 * s} ${y - 2 * s} C ${x - 56 * s} ${y - 70 * s}, ${x + 56 * s} ${y - 70 * s}, ${x + 50 * s} ${y - 2 * s} C ${x + 44 * s} ${y - 30 * s}, ${x + 20 * s} ${y - 26 * s}, ${x + 10 * s} ${y - 36 * s} C ${x - 4 * s} ${y - 24 * s}, ${x - 30 * s} ${y - 30 * s}, ${x - 50 * s} ${y - 2 * s} Z" fill="${c}"/>`],
  ben: [
    (x, y, s, c) => '',
    (x, y, s, c) => `<path d="M${x - 52 * s} ${y - 4 * s} L${x - 58 * s} ${y - 48 * s} L${x - 34 * s} ${y - 58 * s} L${x - 26 * s} ${y - 84 * s} L${x} ${y - 66 * s} L${x + 18 * s} ${y - 86 * s} L${x + 30 * s} ${y - 60 * s} L${x + 56 * s} ${y - 62 * s} L${x + 52 * s} ${y - 6 * s} C ${x + 30 * s} ${y - 36 * s}, ${x - 30 * s} ${y - 36 * s}, ${x - 52 * s} ${y - 4 * s} Z" fill="${c}"/>`],
  long: [
    (x, y, s, c) => `<path d="M${x - 60 * s} ${y + 110 * s} C ${x - 80 * s} ${y - 40 * s}, ${x - 40 * s} ${y - 82 * s}, ${x} ${y - 80 * s} C ${x + 40 * s} ${y - 82 * s}, ${x + 80 * s} ${y - 40 * s}, ${x + 60 * s} ${y + 110 * s} Z" fill="${c}"/>`,
    (x, y, s, c) => `<path d="M${x - 52 * s} ${y + 10 * s} C ${x - 60 * s} ${y - 76 * s}, ${x + 60 * s} ${y - 76 * s}, ${x + 52 * s} ${y + 10 * s} C ${x + 40 * s} ${y - 30 * s}, ${x + 4 * s} ${y - 44 * s}, ${x} ${y - 44 * s} C ${x - 4 * s} ${y - 44 * s}, ${x - 40 * s} ${y - 30 * s}, ${x - 52 * s} ${y + 10 * s} Z" fill="${c}"/>`],
  old: [
    (x, y, s, c) => `<circle cx="${x}" cy="${y - 64 * s}" r="${24 * s}" fill="${c}"/>`,
    (x, y, s, c) => `<path d="M${x - 52 * s} ${y + 2 * s} C ${x - 60 * s} ${y - 66 * s}, ${x + 60 * s} ${y - 66 * s}, ${x + 52 * s} ${y + 2 * s} C ${x + 40 * s} ${y - 28 * s}, ${x - 40 * s} ${y - 28 * s}, ${x - 52 * s} ${y + 2 * s} Z" fill="${c}"/>`],
  short: [
    (x, y, s, c) => '',
    (x, y, s, c) => `<path d="M${x - 51 * s} ${y - 2 * s} C ${x - 56 * s} ${y - 70 * s}, ${x + 56 * s} ${y - 72 * s}, ${x + 51 * s} ${y - 4 * s} C ${x + 36 * s} ${y - 30 * s}, ${x - 36 * s} ${y - 34 * s}, ${x - 51 * s} ${y - 2 * s} Z" fill="${c}"/>`],
  pony: [
    (x, y, s, c) => `<path d="M${x + 40 * s} ${y - 40 * s} C ${x + 110 * s} ${y - 40 * s}, ${x + 100 * s} ${y + 40 * s}, ${x + 70 * s} ${y + 70 * s}" stroke="${c}" stroke-width="${26 * s}" fill="none" stroke-linecap="round"/>`,
    (x, y, s, c) => `<path d="M${x - 51 * s} ${y} C ${x - 56 * s} ${y - 72 * s}, ${x + 56 * s} ${y - 72 * s}, ${x + 51 * s} ${y} C ${x + 30 * s} ${y - 40 * s}, ${x - 30 * s} ${y - 40 * s}, ${x - 51 * s} ${y} Z" fill="${c}"/><circle cx="${x + 46 * s}" cy="${y - 40 * s}" r="${8 * s}" fill="${SUN}"/>`],
  bald: [(x, y, s, c) => '', (x, y, s, c) => `<path d="M${x - 52 * s} ${y + 4 * s} C ${x - 56 * s} ${y - 20 * s}, ${x - 50 * s} ${y - 30 * s}, ${x - 46 * s} ${y - 30 * s} L${x - 44 * s} ${y + 4 * s} Z M${x + 52 * s} ${y + 4 * s} C ${x + 56 * s} ${y - 20 * s}, ${x + 50 * s} ${y - 30 * s}, ${x + 46 * s} ${y - 30 * s} L${x + 44 * s} ${y + 4 * s} Z" fill="${c}"/>`],
};

/* person(o)
 * x, neck (Halsansatz y), s Skalierung, skin, hair (Stil), hairCol, shirt, look [dx,dy], mouth, brows,
 * blink, hL/hR Handpositionen, legs: 'stand' + foot, pants, glasses, beard, op, tilt, blush, item(hx,hy), age (0..1 Falten)
 */
function person(o) {
  const s = o.s || 1, x = o.x, n = o.neck;
  const skin = o.skin || '#f2c6a0', shade = mix(skin, '#7a4a3a', .25);
  const shirt = o.shirt || CORAL, shirtD = mix(shirt, '#000000', .22);
  const hc = o.hairCol || '#3b2a24';
  const hy = n - 66 * s;                       // Kopfmitte
  const hairs = HAIR[o.hair || 'short'];
  let g = '';
  // Beine
  if (o.legs === 'stand') {
    const pants = o.pants || '#2d3a5a';
    g += `<path d="M${x - 46 * s} ${n + 210 * s} L${x - 40 * s} ${o.foot - 10} L${x - 6 * s} ${o.foot - 10} L${x} ${n + 240 * s} L${x + 6 * s} ${o.foot - 10} L${x + 40 * s} ${o.foot - 10} L${x + 46 * s} ${n + 210 * s} Z" fill="${pants}"/>
      <ellipse cx="${x - 26 * s}" cy="${o.foot - 4}" rx="${26 * s}" ry="${11 * s}" fill="#222"/><ellipse cx="${x + 26 * s}" cy="${o.foot - 4}" rx="${26 * s}" ry="${11 * s}" fill="#222"/>`;
  }
  if (o.legs === 'sit') {
    const pants = o.pants || '#2d3a5a';
    g += `<path d="M${x - 50 * s} ${n + 200 * s} L${x - 56 * s} ${n + 250 * s} L${x - 50 * s} ${o.foot - 10} L${x - 14 * s} ${o.foot - 10} L${x - 10 * s} ${n + 252 * s} L${x + 10 * s} ${n + 252 * s} L${x + 14 * s} ${o.foot - 10} L${x + 50 * s} ${o.foot - 10} L${x + 56 * s} ${n + 250 * s} L${x + 50 * s} ${n + 200 * s} Z" fill="${pants}"/>
      <rect x="${x - 60 * s}" y="${n + 236 * s}" width="${120 * s}" height="${30 * s}" rx="${14 * s}" fill="${mix(pants, '#fff', .08)}"/>
      <ellipse cx="${x - 34 * s}" cy="${o.foot - 4}" rx="${26 * s}" ry="${11 * s}" fill="#222"/><ellipse cx="${x + 34 * s}" cy="${o.foot - 4}" rx="${26 * s}" ry="${11 * s}" fill="#222"/>`;
  }
  // Hinter-Haar
  g += `<g transform="rotate(${o.tilt || 0} ${x} ${n})">${hairs[0](x, hy, s, hc)}</g>`;
  // Oberkörper
  g += `<path d="M${x - 64 * s} ${n + 40 * s} C ${x - 64 * s} ${n + 10 * s}, ${x - 40 * s} ${n}, ${x - 18 * s} ${n} L${x + 18 * s} ${n} C ${x + 40 * s} ${n}, ${x + 64 * s} ${n + 10 * s}, ${x + 64 * s} ${n + 40 * s} L${x + 56 * s} ${n + 230 * s} L${x - 56 * s} ${n + 230 * s} Z" fill="${shirt}"/>
    <path d="M${x + 20 * s} ${n} C ${x + 42 * s} ${n}, ${x + 64 * s} ${n + 10 * s}, ${x + 64 * s} ${n + 40 * s} L${x + 56 * s} ${n + 230 * s} L${x + 26 * s} ${n + 230 * s} Z" fill="${shirtD}" opacity=".45"/>
    <path d="M${x - 18 * s} ${n - 2} Q ${x} ${n + 26 * s} ${x + 18 * s} ${n - 2} Z" fill="${shade}"/>`;
  if (o.collar) g += `<path d="M${x - 22 * s} ${n} L${x - 4 * s} ${n + 28 * s} L${x - 30 * s} ${n + 22 * s} Z M${x + 22 * s} ${n} L${x + 4 * s} ${n + 28 * s} L${x + 30 * s} ${n + 22 * s} Z" fill="#fff"/>`;
  if (o.tie) g += `<path d="M${x} ${n + 14 * s} L${x - 8 * s} ${n + 30 * s} L${x} ${n + 90 * s} L${x + 8 * s} ${n + 30 * s} Z" fill="${o.tie}"/>`;
  // Hals
  g += `<rect x="${x - 15 * s}" y="${n - 26 * s}" width="${30 * s}" height="${30 * s}" fill="${shade}"/>`;
  // Arme (Ärmel + Hand)
  const L = 70 * s, shY = n + 32 * s;
  const hL = o.hL || [x - 54 * s, n + 200 * s], hR = o.hR || [x + 54 * s, n + 200 * s];
  const drawArm = (sx, h, side) => { const [ex, ey] = elbow(sx, shY, h[0], h[1], L, side);
    return `<path d="M${sx} ${shY} L${ex} ${ey} L${h[0]} ${h[1]}" stroke="${shirtD}" stroke-width="${35 * s}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>
      <path d="M${sx} ${shY} L${ex} ${ey} L${h[0]} ${h[1]}" stroke="${shirt}" stroke-width="${29 * s}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${lerp(ex, h[0], .55)} ${lerp(ey, h[1], .55)} L${h[0]} ${h[1]}" stroke="${shade}" stroke-width="${20 * s}" stroke-linecap="round" opacity="${o.sleeves === false ? 1 : 0}"/>
      ${hand(h[0], h[1], ex, ey, 15 * s, skin, side)}`; };
  g += drawArm(x - 50 * s, hL, 1) + drawArm(x + 50 * s, hR, -1);
  if (o.item) g += o.item(hR[0], hR[1]);
  if (o.itemL) g += o.itemL(hL[0], hL[1]);
  // Kopf
  const [ldx, ldy] = o.look || [0, 0];
  const ex = x + ldx * s, ey = hy - 2 * s + ldy * s, bl = o.blink ?? 1;
  let face = '';
  face += `<ellipse cx="${x - 50 * s}" cy="${hy + 4 * s}" rx="${9 * s}" ry="${13 * s}" fill="${shade}"/><ellipse cx="${x + 50 * s}" cy="${hy + 4 * s}" rx="${9 * s}" ry="${13 * s}" fill="${shade}"/>
    <ellipse cx="${x}" cy="${hy}" rx="${50 * s}" ry="${58 * s}" fill="${skin}"/>
    <path d="M${x + 22 * s} ${hy - 50 * s} C ${x + 52 * s} ${hy - 30 * s}, ${x + 54 * s} ${hy + 30 * s}, ${x + 20 * s} ${hy + 56 * s} C ${x + 44 * s} ${hy + 20 * s}, ${x + 44 * s} ${hy - 20 * s}, ${x + 22 * s} ${hy - 50 * s} Z" fill="${shade}" opacity=".35"/>`;
  if (o.blush !== false) face += `<ellipse cx="${ex - 28 * s}" cy="${ey + 22 * s}" rx="${10 * s}" ry="${6 * s}" fill="#ff8a8a" opacity=".35"/><ellipse cx="${ex + 28 * s}" cy="${ey + 22 * s}" rx="${10 * s}" ry="${6 * s}" fill="#ff8a8a" opacity=".35"/>`;
  // Augen
  face += `<g transform="translate(${ex} ${ey}) scale(1 ${bl})">
     <ellipse cx="${-18 * s}" cy="0" rx="${7 * s}" ry="${9.5 * s}" fill="#1a1420"/><ellipse cx="${18 * s}" cy="0" rx="${7 * s}" ry="${9.5 * s}" fill="#1a1420"/>
     <circle cx="${-16 * s}" cy="${-3 * s}" r="${2.4 * s}" fill="#fff"/><circle cx="${20 * s}" cy="${-3 * s}" r="${2.4 * s}" fill="#fff"/></g>`;
  // Brauen
  const bw = o.brows || 'neutral';
  const by = ey - 20 * s, bc = mix(hc, '#000', .2);
  const brow = { neutral: [0, 0], up: [-8, -8], worried: [6, -6], angry: [-6, 6], sad: [6, -4] }[bw] || [0, 0];
  face += `<path d="M${ex - 28 * s} ${by + brow[0] * s * .3} L${ex - 9 * s} ${by + brow[1] * s * .5 - 2 * s}" stroke="${bc}" stroke-width="${5 * s}" stroke-linecap="round"/>
    <path d="M${ex + 9 * s} ${by + brow[1] * s * .5 - 2 * s} L${ex + 28 * s} ${by + brow[0] * s * .3}" stroke="${bc}" stroke-width="${5 * s}" stroke-linecap="round"/>`;
  // Nase
  face += `<path d="M${ex + 2 * s} ${ey + 8 * s} Q ${ex + 8 * s} ${ey + 20 * s} ${ex} ${ey + 22 * s}" stroke="${shade}" stroke-width="${4 * s}" fill="none" stroke-linecap="round"/>`;
  // Mund
  const mx = ex, my = ey + 36 * s;
  const mouths = {
    smile: `<path d="M${mx - 14 * s} ${my - 3 * s} Q ${mx} ${my + 10 * s} ${mx + 14 * s} ${my - 3 * s}" stroke="#7a2e2e" stroke-width="${4.5 * s}" fill="none" stroke-linecap="round"/>`,
    grin: `<path d="M${mx - 17 * s} ${my - 5 * s} Q ${mx} ${my + 18 * s} ${mx + 17 * s} ${my - 5 * s} Z" fill="#7a2e2e"/><path d="M${mx - 13 * s} ${my - 3 * s} L${mx + 13 * s} ${my - 3 * s} L${mx + 10 * s} ${my + 2 * s} L${mx - 10 * s} ${my + 2 * s} Z" fill="#fff"/>`,
    o: `<ellipse cx="${mx}" cy="${my + 2 * s}" rx="${7 * s}" ry="${10 * s}" fill="#7a2e2e"/>`,
    open: `<ellipse cx="${mx}" cy="${my + 2 * s}" rx="${12 * s}" ry="${8 * s}" fill="#7a2e2e"/>`,
    flat: `<line x1="${mx - 11 * s}" y1="${my + 2 * s}" x2="${mx + 11 * s}" y2="${my + 2 * s}" stroke="#7a2e2e" stroke-width="${4.5 * s}" stroke-linecap="round"/>`,
    sad: `<path d="M${mx - 13 * s} ${my + 6 * s} Q ${mx} ${my - 6 * s} ${mx + 13 * s} ${my + 6 * s}" stroke="#7a2e2e" stroke-width="${4.5 * s}" fill="none" stroke-linecap="round"/>`,
    talk: `<ellipse cx="${mx}" cy="${my + 2 * s}" rx="${11 * s}" ry="${(3 + 6 * Math.abs(Math.sin((o.t || 0) * 14))) * s}" fill="#7a2e2e"/>`,
  };
  face += mouths[o.mouth || 'smile'];
  if (o.age) face += `<path d="M${ex - 34 * s} ${ey + 4 * s} l -8 4 M${ex + 34 * s} ${ey + 4 * s} l 8 4 M${mx - 22 * s} ${my - 6 * s} q -4 8 2 14 M${mx + 22 * s} ${my - 6 * s} q 4 8 -2 14" stroke="${shade}" stroke-width="${3 * s}" fill="none" opacity="${o.age}" stroke-linecap="round"/>`;
  if (o.beard) face += HAIR.beard[1](x, hy, s, hc);
  face += hairs[1](x, hy, s, hc);
  if (o.glasses) face += `<g stroke="#1a1420" stroke-width="${3.5 * s}" fill="#fff" fill-opacity=".12"><circle cx="${ex - 18 * s}" cy="${ey}" r="${15 * s}"/><circle cx="${ex + 18 * s}" cy="${ey}" r="${15 * s}"/><line x1="${ex - 3 * s}" y1="${ey}" x2="${ex + 3 * s}" y2="${ey}"/></g>`;
  if (o.hat) face += o.hat(x, hy, s);
  if (o.sweat > 0) face += `<path d="M${x + 44 * s} ${hy - 30 * s + o.sweat * 40 * s} q ${10 * s} ${16 * s} 0 ${24 * s} q ${-10 * s} ${-8 * s} 0 ${-24 * s}" fill="#8fd8ff" opacity="${clamp(2 - o.sweat * 2)}"/>`;
  g += `<g transform="rotate(${o.tilt || 0} ${x} ${n})">${face}</g>`;
  if (o.front) g += o.front(x, n, s);
  return `<g opacity="${o.op ?? 1}">${g}</g>`;
}

// ---------- Roboter-Papa ----------
/* robot(o): x, neck, s, t, eyes: on|off|happy|wink|think|ad|dollar, look, blink, hL/hR, legs:'stand'+foot, steam, power, tilt, patch, mouth: smile|o|talk */
function robot(o) {
  const s = o.s || 1, x = o.x, n = o.neck, t = o.t || 0;
  const body = '#eef2f6', shade = '#b8c4d1', dark = '#2b3654', joint = '#4b5878';
  const hw = 150 * s, hh = 124 * s, hy = n - hh / 2 - 10 * s;
  const pw = o.power ?? 1;
  let g = '';
  if (o.legs === 'stand') {
    const lim = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${shade}" stroke-width="${30 * s}" stroke-linecap="round"/><line x1="${x1 - 4}" y1="${y1}" x2="${x2 - 4}" y2="${y2}" stroke="${body}" stroke-width="${20 * s}" stroke-linecap="round"/>`;
    g += lim(x - 30 * s, n + 200 * s, x - 34 * s, o.foot - 16) + lim(x + 30 * s, n + 200 * s, x + 34 * s, o.foot - 16) +
      `<rect x="${x - 76 * s}" y="${o.foot - 26 * s}" width="${58 * s}" height="${26 * s}" rx="${10 * s}" fill="${dark}"/><rect x="${x + 18 * s}" y="${o.foot - 26 * s}" width="${58 * s}" height="${26 * s}" rx="${10 * s}" fill="${dark}"/>`;
  }
  if (o.legs === 'sit') {
    const seg = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${shade}" stroke-width="${30 * s}" stroke-linecap="round"/><line x1="${x1 - 4}" y1="${y1}" x2="${x2 - 4}" y2="${y2}" stroke="${body}" stroke-width="${20 * s}" stroke-linecap="round"/>`;
    [-1, 1].forEach(sd => {
      g += seg(x + sd * 30 * s, n + 196 * s, x + sd * 44 * s, n + 236 * s) + seg(x + sd * 44 * s, n + 236 * s, x + sd * 44 * s, o.foot - 18);
      g += `<circle cx="${x + sd * 44 * s}" cy="${n + 236 * s}" r="${14 * s}" fill="${joint}"/><rect x="${x + sd * 44 * s - 30 * s}" y="${o.foot - 26 * s}" width="${60 * s}" height="${26 * s}" rx="${10 * s}" fill="${dark}"/>`;
    });
  }
  g += `<rect x="${x - 66 * s}" y="${n + 8 * s}" width="${132 * s}" height="${210 * s}" rx="${42 * s}" fill="${shade}"/>
    <rect x="${x - 66 * s}" y="${n + 8 * s}" width="${118 * s}" height="${204 * s}" rx="${42 * s}" fill="${body}"/>
    <rect x="${x - 40 * s}" y="${n + 150 * s}" width="${64 * s}" height="${12 * s}" rx="${6 * s}" fill="${shade}"/>
    <circle cx="${x - 6 * s}" cy="${n + 84 * s}" r="${20 * s}" fill="${dark}"/>
    <circle cx="${x - 6 * s}" cy="${n + 84 * s}" r="${12 * s}" fill="${MINT}" opacity="${pw * (.6 + .4 * Math.sin(t * 3))}"/>
    <circle cx="${x - 6 * s}" cy="${n + 84 * s}" r="${36 * s}" fill="${MINT}" opacity="${pw * .16}" filter="url(#soft)"/>`;
  const L = 78 * s, shY = n + 40 * s;
  const hL = o.hL || [x - 62 * s, n + 196 * s], hR = o.hR || [x + 62 * s, n + 196 * s];
  const arm = (side, h) => {
    const sx = x + side * 58 * s, p = armPath(sx, shY, h[0], h[1], L, side > 0 ? -1 : 1);
    return `<path d="${p}" stroke="${shade}" stroke-width="${28 * s}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${p}" transform="translate(-3 0)" stroke="${body}" stroke-width="${19 * s}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${sx}" cy="${shY}" r="${14 * s}" fill="${joint}"/><circle cx="${h[0]}" cy="${h[1]}" r="${17 * s}" fill="${joint}"/>`;
  };
  g += arm(-1, hL) + arm(1, hR);
  if (o.item) g += o.item(hR[0], hR[1]);
  if (o.itemL) g += o.itemL(hL[0], hL[1]);
  // Gesicht
  const [ldx, ldy] = o.look || [0, 0];
  const ex = x + ldx * 1.6 * s, ey = hy - 4 * s + ldy * s, bl = o.blink ?? 1;
  const arc = cx => `<path d="M${cx - 14 * s} ${ey + 6 * s} Q ${cx} ${ey - 16 * s} ${cx + 14 * s} ${ey + 6 * s}" stroke="${MINT}" stroke-width="${8 * s}" fill="none" stroke-linecap="round"/>`;
  const oval = (cx, k = 1) => `<ellipse cx="${cx}" cy="0" rx="${12 * s}" ry="${17 * s * k}" fill="${MINT}"/>`;
  let eyes = '', mouth = '';
  const ey2 = o.eyes || 'on';
  if (ey2 === 'happy') eyes = arc(ex - 28 * s) + arc(ex + 28 * s);
  else if (ey2 === 'wink') eyes = `<g transform="translate(0 ${ey}) scale(1 ${bl})">${oval(ex - 28 * s)}</g>` + arc(ex + 28 * s);
  else if (ey2 === 'think') eyes = `<g transform="translate(0 ${ey - 8 * s})">${oval(ex - 28 * s, .6)}${oval(ex + 28 * s, .6)}</g>` +
    `<g transform="translate(${x + 54 * s} ${hy - 34 * s}) rotate(${t * 300})"><circle r="${9 * s}" fill="none" stroke="${MINT}" stroke-width="${3 * s}" stroke-dasharray="${10 * s} ${6 * s}"/></g>`;
  else if (ey2 === 'dollar') eyes = text('$', ex - 28 * s, ey + 2 * s, { size: 46 * s, fill: SUN }) + text('$', ex + 28 * s, ey + 2 * s, { size: 46 * s, fill: SUN });
  else if (ey2 === 'ad') eyes = '';
  else eyes = `<g transform="translate(0 ${ey}) scale(1 ${bl})" opacity="${pw}">${oval(ex - 28 * s)}${oval(ex + 28 * s)}</g>`;
  const my = hy + 32 * s;
  if (ey2 !== 'ad') {
    if (o.mouth === 'o') mouth = `<ellipse cx="${ex}" cy="${my}" rx="${9 * s}" ry="${9 * s}" fill="none" stroke="${MINT}" stroke-width="${5 * s}" opacity="${pw}"/>`;
    else if (o.mouth === 'talk') { const a = Math.abs(Math.sin(t * 13)) * 10 * s + 2 * s; mouth = `<rect x="${ex - 18 * s}" y="${my - a / 2}" width="${36 * s}" height="${a}" rx="${a / 2}" fill="${MINT}"/>`; }
    else if (o.mouth === 'flat') mouth = `<line x1="${ex - 16 * s}" y1="${my}" x2="${ex + 16 * s}" y2="${my}" stroke="${MINT}" stroke-width="${5 * s}" stroke-linecap="round"/>`;
    else mouth = `<path d="M${ex - 18 * s} ${my - 3 * s} Q ${ex} ${my + 11 * s} ${ex + 18 * s} ${my - 3 * s}" stroke="${MINT}" stroke-width="${5 * s}" fill="none" stroke-linecap="round" opacity="${pw}"/>`;
  }
  const screen = o.screen ? o.screen(x - hw / 2 + 16 * s, hy - hh / 2 + 16 * s, hw - 38 * s, hh - 34 * s) : '';
  g += `<g transform="rotate(${o.tilt || 0} ${x} ${n})">
    <rect x="${x - 16 * s}" y="${n - 18 * s}" width="${32 * s}" height="${30 * s}" fill="${joint}"/>
    <path d="M${x - 4 * s} ${hy - hh / 2 + 2} C ${x - 12 * s} ${hy - hh / 2 - 46 * s}, ${x + 36 * s} ${hy - hh / 2 - 52 * s}, ${x + 26 * s} ${hy - hh / 2 - 22 * s} C ${x + 20 * s} ${hy - hh / 2 - 8 * s}, ${x + 4 * s} ${hy - hh / 2 - 20 * s}, ${x + 12 * s} ${hy - hh / 2 - 30 * s}" stroke="${shade}" stroke-width="${9 * s}" fill="none" stroke-linecap="round"/>
    <circle cx="${x + 12 * s}" cy="${hy - hh / 2 - 30 * s}" r="${8 * s}" fill="${MINT}" opacity="${pw}"/>
    <circle cx="${x - hw / 2 - 3}" cy="${hy}" r="${15 * s}" fill="${joint}"/><circle cx="${x + hw / 2 + 3}" cy="${hy}" r="${15 * s}" fill="${joint}"/>
    <rect x="${x - hw / 2}" y="${hy - hh / 2}" width="${hw}" height="${hh}" rx="${40 * s}" fill="${shade}"/>
    <rect x="${x - hw / 2}" y="${hy - hh / 2}" width="${hw - 10 * s}" height="${hh - 6 * s}" rx="${40 * s}" fill="${body}"/>
    <rect x="${x - hw / 2 + 16 * s}" y="${hy - hh / 2 + 16 * s}" width="${hw - 38 * s}" height="${hh - 34 * s}" rx="${26 * s}" fill="#0d1b2a"/>
    ${screen}
    <g filter="url(#glowS)">${eyes}${mouth}</g>
    ${o.patch ? `<g transform="translate(${x + 44 * s} ${hy - 48 * s}) rotate(25)" opacity="${o.patch}"><rect x="${-30 * s}" y="${-11 * s}" width="${60 * s}" height="${22 * s}" rx="${8 * s}" fill="#f4c59a"/></g>` : ''}
  </g>`;
  if (o.steam > 0) for (let i = 0; i < 3; i++) {
    const k = clamp(o.steam * 1.4 - i * .2); if (k <= 0 || k >= 1) continue;
    g += `<circle cx="${x + 12 * s + (i - 1) * 30 * s}" cy="${hy - hh / 2 - 44 * s - k * 120 * s - i * 18}" r="${(16 + k * 22) * s}" fill="#fff" opacity="${(1 - k) * .85}"/>`;
  }
  return `<g opacity="${o.op ?? 1}">${g}</g>`;
}

// ---------- Requisiten ----------
const oilCan = (x, y, tilt = 0, s = 1) => `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})">
  <path d="M-40 -96 L40 -96 L46 0 L-46 0 Z" fill="#3e7d5a"/><path d="M14 -96 L40 -96 L46 0 L22 0 Z" fill="#2c5c42"/>
  <rect x="-46" y="-102" width="92" height="16" rx="5" fill="#2c5c42"/>
  <path d="M34 -90 L100 -150 L110 -140 L44 -76 Z" fill="#9aa6b2"/>
  <rect x="-32" y="-72" width="64" height="40" rx="5" fill="${SUN}"/>
  <text x="0" y="-51" text-anchor="middle" dominant-baseline="middle" font-family="Inter" font-weight="900" font-size="28" fill="#2c3a2a">OIL</text></g>`;

function glass(x, y, level, color, tilt = 0, s = 1) {
  const h = 92, w = 60, id = 'g' + Math.round(x * 7 + y * 3);
  const lv = clamp(level) * (h - 10);
  return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})">
    <clipPath id="${id}"><path d="M${-w / 2} ${-h} L${w / 2} ${-h} L${w / 2 - 7} 0 L${-w / 2 + 7} 0 Z"/></clipPath>
    <rect x="${-w}" y="${-lv - 4}" width="${w * 2}" height="${lv + 10}" fill="${color}" clip-path="url(#${id})"/>
    <path d="M${-w / 2} ${-h} L${w / 2} ${-h} L${w / 2 - 7} 0 L${-w / 2 + 7} 0 Z" fill="#fff" opacity=".16" stroke="#fff" stroke-opacity=".75" stroke-width="3.5"/>
    <rect x="${-w / 2 + 9}" y="${-h + 10}" width="7" height="${h - 26}" rx="3" fill="#fff" opacity=".5"/></g>`;
}
function fork(hx, hy, k) {
  return `<g transform="translate(${hx} ${hy}) rotate(${lerp(25, -35, k)})"><rect x="-4" y="-60" width="8" height="60" rx="4" fill="#cfd5dd"/><path d="M-12 -60 L-12 -82 M0 -60 L0 -84 M12 -60 L12 -82" stroke="#cfd5dd" stroke-width="5" stroke-linecap="round"/><rect x="-14" y="-64" width="28" height="8" rx="4" fill="#cfd5dd"/></g>`;
}
function plate(x, y, food, t, op = 1) {
  let st = '';
  if (food) for (let i = 0; i < 3; i++) {
    const ph = ((t * 40 + i * 25) % 70);
    st += `<path d="M${x - 22 + i * 22} ${y - 30 - ph} q 10 -12 0 -24 q -10 -12 0 -24" stroke="#fff" stroke-width="5" fill="none" opacity="${.3 * (1 - ph / 70)}" stroke-linecap="round"/>`;
  }
  return `<g opacity="${op}">${st}<g transform="translate(${x + 118} ${y + 6}) rotate(-80)"><rect x="-4" y="-60" width="8" height="60" rx="4" fill="#cfd5dd"/><path d="M-10 -60 L-10 -78 M0 -60 L0 -80 M10 -60 L10 -78" stroke="#cfd5dd" stroke-width="4" stroke-linecap="round"/></g><ellipse cx="${x}" cy="${y + 2}" rx="96" ry="20" fill="#f7f3ec"/><ellipse cx="${x}" cy="${y - 1}" rx="74" ry="13" fill="#e4ddd2"/>
    ${food ? `<path d="M${x - 48} ${y - 2} q 14 -34 30 -10 q 14 -32 30 -8 q 14 -26 28 6 Z" fill="#f2b84b"/><circle cx="${x - 8}" cy="${y - 18}" r="12" fill="#d9472b"/><circle cx="${x + 18}" cy="${y - 13}" r="9" fill="#d9472b"/>` : ''}</g>`;
}
function stamp(str, x, y, k, color = MINT, rot = -10, size = 70) {
  if (k <= 0) return '';
  const sc = lerp(2.2, 1, easeOut(clamp(k * 1.6)));
  const w = str.length * size * .66 + 60;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" opacity="${clamp(k * 3)}">
    <rect x="${-w / 2}" y="${-size * .8}" width="${w}" height="${size * 1.6}" rx="16" fill="none" stroke="${color}" stroke-width="10"/>
    ${text(str, 0, 4, { size, fill: color, ls: 4 })}</g>`;
}
function brainShape(x, y, s, fill, line, op = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}">
    <path d="M-150 20 C -175 -40, -130 -110, -60 -115 C -30 -150, 40 -150, 70 -115 C 140 -115, 180 -50, 160 10 C 185 60, 140 120, 80 110 C 50 140, -10 140, -40 115 C -110 130, -170 90, -150 20 Z" fill="${fill}"/>
    <g stroke="${line}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8">
      <path d="M0 -130 C -10 -60, 20 0, 0 120"/><path d="M-120 -40 C -80 -60, -60 -20, -90 10 C -110 40, -60 60, -40 40"/>
      <path d="M-60 -100 C -40 -70, -80 -60, -60 -30"/><path d="M60 -100 C 40 -60, 90 -50, 70 -10 C 50 30, 110 40, 120 0"/>
      <path d="M40 60 C 70 80, 110 70, 120 50"/><path d="M-100 70 C -70 90, -40 80, -30 60"/></g></g>`;
}
function motes(t, col, n = 40, seed = 3) {
  const R = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = R() * W, y0 = R() * H, r = 2 + R() * 4, sp = 10 + R() * 25, ph = R() * 6.28;
    const y = ((y0 - t * sp) % H + H) % H;
    s += `<circle cx="${x + Math.sin(t * .7 + ph) * 16}" cy="${y}" r="${r}" fill="${col}" opacity="${(.12 + .28 * Math.sin(t * 1.3 + ph) ** 2).toFixed(3)}" filter="url(#soft)"/>`;
  }
  return s;
}
function bgGrad(id, top, bot) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#${id})"/>`;
}
function grid(op = .05, step = 80, col = MINT) {
  let s = '';
  for (let x = 0; x <= W; x += step) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${col}" stroke-opacity="${op}" stroke-width="2"/>`;
  for (let y = 0; y <= H; y += step) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${col}" stroke-opacity="${op}" stroke-width="2"/>`;
  return s;
}
function card(x, y, w, h, k, inner, o = {}) {
  if (k <= 0) return '';
  const { fill = '#10283a', stroke = MINT, rot = 0 } = o;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${back(k)})" opacity="${clamp(k * 2)}">
    <rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="26" fill="#000" opacity=".3"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26" fill="${fill}" stroke="${stroke}" stroke-opacity=".6" stroke-width="4"/>
    ${inner}</g>`;
}
