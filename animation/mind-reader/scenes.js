/* Szenen für "Patent Future – File 002: The Mind Reader". Jede Szene: fn(t) → SVG-String (1920x1080). */

const cam = (sc, fx, fy) => `translate(960 540) scale(${sc}) translate(${-fx} ${-fy})`;
const camLerp = (k, a, b) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const TY = 700, FLOOR = 990, SEATY = 780;
const LOCKGOLD = '#e3b34c';

// ======================= FIGUREN =======================
// Chip an der Schläfe (leuchtet)
const chipAt = (on = 1) => (x, hy, s) => `<g transform="translate(${x + 46 * s} ${hy - 16 * s})">
  <circle r="${18 * s}" fill="${MINT}" opacity="${.35 * on}" filter="url(#soft)"/>
  <rect x="${-8 * s}" y="${-8 * s}" width="${16 * s}" height="${16 * s}" rx="${4 * s}" fill="#1c2b3c" stroke="${MINT}" stroke-width="${2.6 * s}"/>
  <circle r="${2.8 * s}" fill="${MINT}" opacity="${.5 + .5 * on}"/></g>`;
const TOM = { hair: 'short', hairCol: '#5a3a24', skin: '#f2c6a0', shirt: '#8ab6e8', collar: true, pants: '#2d3a5a' };
// sitzend, Hände ruhig auf dem Tisch
const rest = (x, s) => ({ hL: [x - 58 * s, TY - 4], hR: [x + 58 * s, TY - 4] });
function sitter(x, o, t) {
  const s = o.s || 1;
  return person({ x, neck: SEATY - 230 * s, legs: 'sit', foot: FLOOR - 30 * (1 - s) / .2, t, blink: blinkAt(t, o.seed || 0), ...rest(x, s), ...o });
}
function tom(x, o, t) { return sitter(x, { ...TOM, hat: chipAt(o.chip ?? 1), seed: 2, ...o }, t); }

// ======================= BÜRO =======================
function officeRoom(t, o = {}) {
  let s = `<linearGradient id="owall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18242f"/><stop offset=".7" stop-color="#26394a"/><stop offset="1" stop-color="#2d4356"/></linearGradient>
  <rect x="-400" y="-400" width="${W + 800}" height="${FLOOR + 400}" fill="url(#owall)"/>`;
  for (let i = -4; i < 24; i++) s += `<rect x="${i * 160}" y="-400" width="4" height="${FLOOR + 400}" fill="#fff" opacity=".035"/>`;
  // Fenster mit Stadt
  s += `<linearGradient id="osky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fc4ef"/><stop offset="1" stop-color="#d8eefa"/></linearGradient>
    <rect x="70" y="110" width="330" height="380" rx="12" fill="#0f1922"/><rect x="84" y="124" width="302" height="352" rx="6" fill="url(#osky)"/>`;
  const R = rng(4);
  for (let i = 0; i < 7; i++) { const bx = 84 + i * 44, bh = 80 + R() * 180; s += `<rect x="${bx}" y="${476 - bh}" width="${40}" height="${bh}" fill="${['#6d8aa3', '#5b7690', '#7d98ae'][i % 3]}"/>`;
    for (let j = 0; j < bh / 30 - 1; j++) s += `<rect x="${bx + 8}" y="${476 - bh + 12 + j * 30}" width="8" height="12" fill="#dff3ff" opacity=".6"/><rect x="${bx + 24}" y="${476 - bh + 12 + j * 30}" width="8" height="12" fill="#dff3ff" opacity=".4"/>`; }
  s += `<rect x="232" y="124" width="8" height="352" fill="#0f1922"/><rect x="84" y="296" width="302" height="8" fill="#0f1922"/>`;
  // Deckenlampe (lang)
  s += `<rect x="560" y="-400" width="4" height="440" fill="#0e161e"/><rect x="1356" y="-400" width="4" height="440" fill="#0e161e"/>
    <rect x="520" y="40" width="880" height="22" rx="11" fill="#cfd8e0"/><polygon points="540,62 1380,62 1700,${TY} 220,${TY}" fill="#f4fbff" opacity=".05"/>`;
  // Wandbildschirm
  const sx = o.screenX ?? 1150, sw = 600, sh = 300, sy = 100;
  s += `<rect x="${sx - sw / 2 - 14}" y="${sy - 14}" width="${sw + 28}" height="${sh + 28}" rx="18" fill="#0b131a"/>
    <rect x="${sx - sw / 2}" y="${sy}" width="${sw}" height="${sh}" rx="8" fill="#0d1b2a"/>
    ${text('THOUGHT2TEXT', sx - sw / 2 + 24, sy + 34, { size: 22, font: 'JetBrains Mono', weight: 800, anchor: 'start', fill: MINT, ls: 2 })}
    <circle cx="${sx + sw / 2 - 90}" cy="${sy + 33}" r="8" fill="${CORAL}" opacity="${.5 + .5 * Math.sin(t * 5)}"/>${text('LIVE', sx + sw / 2 - 72, sy + 34, { size: 20, font: 'JetBrains Mono', weight: 800, anchor: 'start', fill: CORAL })}`;
  if (o.screen) s += o.screen(sx, sy + 60, sw, sh - 60);
  else s += [0, 1, 2].map(i => `<rect x="${sx - sw / 2 + 30}" y="${sy + 90 + i * 50}" width="${[420, 360, 250][i]}" height="16" rx="8" fill="#2c3e57"/>`).join('');
  return s;
}
// Text tippt sich auf den Bildschirm (mit Cursor)
function typed(str, k, x, y, o = {}) {
  const { size = 40, color = '#fff', maxCh = 24 } = o;
  const n = Math.floor(clamp(k) * str.length);
  const words = str.slice(0, n).split(' '), lines = []; let cur = '';
  words.forEach(w => { if ((cur + ' ' + w).trim().length > maxCh) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; });
  lines.push(cur.trim());
  const cursor = (k < 1 || Math.sin(k * 40) > 0) ? '▌' : '';
  return lines.map((l, i) => text(l + (i === lines.length - 1 ? cursor : ''), x, y + i * size * 1.3, { size, font: 'JetBrains Mono', weight: 800, anchor: 'start', fill: color })).join('');
}
function officeTable(x0 = 150, x1 = 1810) {
  return `<rect x="${x0 + 70}" y="${TY + 60}" width="30" height="${FLOOR - TY - 60}" fill="#5f6b78"/><rect x="${x1 - 100}" y="${TY + 60}" width="30" height="${FLOOR - TY - 60}" fill="#5f6b78"/>
    <rect x="${x0}" y="${TY}" width="${x1 - x0}" height="26" rx="8" fill="#e4e9ee"/>
    <rect x="${x0 + 14}" y="${TY + 22}" width="${x1 - x0 - 28}" height="54" fill="#a9b5c1"/>
    <rect x="${x0 + 14}" y="${TY + 22}" width="${x1 - x0 - 28}" height="10" fill="#000" opacity=".1"/>`;
}
function officeFloor(seats) {
  let s = `<rect x="-400" y="${FLOOR}" width="${W + 800}" height="600" fill="#2a333d"/><rect x="-400" y="${FLOOR - 12}" width="${W + 800}" height="14" fill="#1d242c"/>
    <ellipse cx="960" cy="${FLOOR + 6}" rx="900" ry="24" fill="#000" opacity=".25"/>`;
  seats.forEach(x => s += `<rect x="${x - 86}" y="${SEATY - 300}" width="172" height="290" rx="40" fill="#1f2a38"/><rect x="${x - 72}" y="${SEATY - 286}" width="144" height="262" rx="32" fill="#2b3a4d"/>
    <rect x="${x - 96}" y="${SEATY + 4}" width="192" height="26" rx="12" fill="#1f2a38"/>
    <rect x="${x - 9}" y="${SEATY + 28}" width="18" height="${FLOOR - SEATY - 60}" fill="#5f6b78"/>
    <path d="M${x - 80} ${FLOOR - 14} L${x} ${FLOOR - 40} L${x + 80} ${FLOOR - 14}" stroke="#5f6b78" stroke-width="12" fill="none" stroke-linecap="round"/>`);
  return s;
}
function mug(x, col) { return `<g transform="translate(${x} ${TY + 2})"><rect x="-22" y="-52" width="44" height="52" rx="8" fill="${col}"/><path d="M22 -40 C 42 -40, 42 -14, 22 -14" stroke="${col}" stroke-width="8" fill="none"/></g>`; }

const MEET = { boss: 430, ana: 800, tom: 1150, raj: 1500 };
function meetingPeople(t, st = {}) {
  let s = '';
  s += sitter(MEET.boss, { hair: 'bald', hairCol: '#7a6a5a', skin: '#e8b48c', shirt: '#3a4a6a', collar: true, tie: CORAL, age: .35, seed: 1,
    look: st.bossLook || [6, 0], mouth: st.bossMouth || 'smile', brows: st.bossBrows }, t);
  s += sitter(MEET.ana, { hair: 'pony', hairCol: '#2a1c16', skin: '#c98d64', shirt: '#3fae7a', s: .95, seed: 3,
    look: st.anaLook || [-6, 0], mouth: st.anaMouth || 'smile', brows: st.anaBrows }, t);
  s += tom(MEET.tom, { look: st.tomLook || [-6, 0], mouth: st.tomMouth || 'smile', brows: st.tomBrows, sweat: st.tomSweat, chip: st.chip ?? 1 }, t);
  s += sitter(MEET.raj, { hair: 'ben', hairCol: '#111', skin: '#8d5a3c', shirt: SUN, seed: 5,
    look: st.rajLook || [-8, 0], mouth: st.rajMouth || 'smile', brows: st.rajBrows }, t);
  return s;
}

// ---- s01–s02: erstes Meeting ----
function sceneMeeting(t) {
  const st = {};
  if (t > F('s01', .7) && t < S('s02')) st.bossMouth = 'talk';
  const k2 = prog(t, S('s02') + .1, E('s02'));
  const react = prog(t, E('s02') - .15, E('s02') + .25);
  if (react > 0) {
    Object.assign(st, { bossLook: [0, -12], bossMouth: 'o', bossBrows: 'angry', anaLook: [10, -10], anaMouth: 'o', anaBrows: 'up', rajLook: [-12, -10], rajMouth: 'o', rajBrows: 'up',
      tomLook: [0, -6], tomMouth: 'flat', tomBrows: 'worried', tomSweat: (t - E('s02')) % 1.2 });
  } else if (k2 > 0) { st.tomMouth = 'flat'; st.tomLook = [-10, -2]; st.bossMouth = 'smile'; }
  const screen = (sx, sy, sw) => k2 > 0 ? typed('This meeting could have been an email.', k2, sx - sw / 2 + 30, sy + 60, { size: 40, maxCh: 24 }) :
    `${text('Q3 SYNERGY UPDATE', sx, sy + 40, { size: 40, fill: '#cfe' })}${[0, 1].map(i => `<rect x="${sx - 200}" y="${sy + 90 + i * 46}" width="${[400, 300][i]}" height="14" rx="7" fill="#2c3e57"/>`).join('')}`;
  let world = officeRoom(t, { screen }) + officeFloor(Object.values(MEET)) + meetingPeople(t, st) + mug(MEET.boss + 120, CORAL) + mug(MEET.raj - 120, '#4c6ef5') + officeTable();
  // Demo: Gedanke → Text (Chip erklärt)
  const demo = inOut(t, F('s01', .3), F('s01', .38), F('s01', .62), F('s01', .68));
  if (demo > 0) {
    world += `<g transform="translate(${MEET.tom + 140} 360) scale(${back(demo) * .9})" opacity="${clamp(demo * 2)}">
      <circle cx="-70" cy="70" r="12" fill="#fff"/><circle cx="-40" cy="44" r="18" fill="#fff"/>
      <ellipse cx="40" cy="-20" rx="110" ry="70" fill="#fff"/>${text('…', 40, -30, { size: 70, fill: INK })}
      <path d="M160 -20 L230 -20 M210 -36 L230 -20 L210 -4" stroke="${MINT}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <rect x="250" y="-60" width="150" height="80" rx="10" fill="#0d1b2a" stroke="${MINT}" stroke-width="4"/>${text('Abc', 325, -18, { size: 40, font: 'JetBrains Mono', weight: 800, fill: MINT })}</g>`;
  }
  // Kamera
  let c = [1.75, MEET.tom, 470];
  c = camLerp(ease(prog(t, F('s01', .25), F('s01', .4))), c, [1.45, MEET.tom + 120, 430]);
  c = camLerp(ease(prog(t, F('s01', .68), F('s01', .85))), c, [1.0, 960, 540]);
  c = camLerp(ease(prog(t, S('s02'), S('s02') + .8)), c, [1.25, 1060, 420]);
  c = camLerp(ease(prog(t, E('s02'), E('s02') + .4)) * .6, c, [1.0, 960, 540]);
  c[0] *= 1 + .02 * Math.sin(t * .3);
  let s = `<g transform="${cam(...c)}">${world}</g>`;
  s += tag('NEW: THOUGHT-TO-TEXT CHIP', 60, 70, inOut(t, F('s01', .16), F('s01', .22), F('s01', .64), F('s01', .7)));
  return s;
}

// ---- s03: rausgeflogen ----
function sceneFired(t) {
  let s = `<linearGradient id="hall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2a36"/><stop offset="1" stop-color="#2f4252"/></linearGradient>
    <rect width="${W}" height="${H}" fill="url(#hall)"/><rect x="0" y="${FLOOR}" width="${W}" height="${H - FLOOR}" fill="#232b33"/>`;
  // Tür
  const slam = prog(t, S('s03') - .3, S('s03') + .05);
  s += `<rect x="1180" y="250" width="380" height="${FLOOR - 250}" fill="#0f1922"/><rect x="1194" y="264" width="352" height="${FLOOR - 264}" fill="#3a4a5c"/>
    <g transform="translate(1194 264) scale(${lerp(.3, 1, easeIn(slam))} 1)"><rect width="352" height="${FLOOR - 264}" fill="#56697d"/><circle cx="${40}" cy="${(FLOOR - 264) / 2}" r="14" fill="#cfd8e0"/>
    <rect x="96" y="80" width="160" height="56" rx="8" fill="#0d1b2a"/></g>`;
  s += `<g opacity="${slam}">${text('MEETING', 1370, 362, { size: 26, font: 'JetBrains Mono', weight: 800, fill: '#cfe' })}</g>`;
  // Tom mit Karton
  const box = (x, y) => `<g transform="translate(${x - 54} ${y - 30})"><rect x="-70" y="-20" width="250" height="150" rx="6" fill="#c9965a"/><rect x="-70" y="-20" width="250" height="26" fill="#b07d45"/>
    <rect x="-30" y="-110" width="16" height="100" fill="#2e8c62"/><ellipse cx="-22" cy="-120" rx="40" ry="24" fill="#3fae7a"/><rect x="70" y="-60" width="50" height="50" rx="8" fill="#4c6ef5"/>
    <rect x="130" y="-46" width="30" height="36" rx="4" fill="#f4efe6"/></g>`;
  s += person({ x: 800, neck: 470, s: 1.05, legs: 'stand', foot: 1000, ...TOM, hat: chipAt(.6), t, look: [8, 4], mouth: 'sad', brows: 'sad', blink: blinkAt(t, 2),
    hL: [736, 690], hR: [864, 690], item: (x, y) => box(x, y) });
  // Regenwolke über Tom
  const ck = back(prog(t, F('s03', .3), F('s03', .6)));
  if (ck > 0) {
    s += `<g transform="translate(800 170) scale(${ck})"><ellipse cx="0" cy="0" rx="120" ry="56" fill="#8a97a6"/><ellipse cx="-70" cy="16" rx="70" ry="44" fill="#7d8a99"/><ellipse cx="80" cy="14" rx="74" ry="44" fill="#7d8a99"/></g>`;
    for (let i = 0; i < 9; i++) { const ph = ((t * 1.6 + i * .37) % 1); s += `<line x1="${720 + i * 20}" y1="${210 + ph * 160}" x2="${716 + i * 20}" y2="${236 + ph * 160}" stroke="#9fd3ff" stroke-width="5" stroke-linecap="round" opacity="${ck * (1 - ph)}"/>`; }
  }
  return `<g transform="${cam(lerp(1.08, 1, ease(prog(t, S('s03'), E('s03')))), 960, 560)}">${s}</g>`;
}

// ---- s04: Versprechen + Schloss ----
function sceneHook(t) {
  let s = bgGrad('hk', '#06121c', '#10283a') + grid(.05);
  s += headline(['HOW CLOSE IS', 'THIS CHIP?'], 960, 330, t, S('s04') + .1, F('s04', .45), { size: 110 });
  const pk = prog(t, F('s04', .48), F('s04', .56));
  if (pk > 0) s += person({ x: 470, neck: 520, s: 1.0, legs: 'stand', foot: 1010, ...TOM, hat: chipAt(1), t, look: [12, -6], mouth: 'o', brows: 'worried', blink: blinkAt(t, 2), op: clamp(pk * 2) });
  return s;
}

// ======================= TITEL =======================
function sceneTitle(t) {
  const a = S('s05');
  let s = bgGrad('tbg', '#06121c', '#0e2a3a') + grid(.06);
  const scan = ((t - a) * 500) % (H + 200) - 100;
  s += `<rect x="0" y="${scan}" width="${W}" height="6" fill="${MINT}" opacity=".25" filter="url(#soft)"/>`;
  s += `<g opacity="${.22 * prog(t, a, a + 1)}">${brainShape(1580, 760, 1.5, '#5ef2c8', '#0d1b2a', 1)}</g>`;
  const k1 = back(prog(t, a + .1, a + .5));
  s += `<g transform="translate(960 300) scale(${k1})" opacity="${clamp(k1)}"><rect x="-340" y="-56" width="680" height="112" rx="18" fill="none" stroke="${MINT}" stroke-width="6"/>${text('PATENT FUTURE', 0, 4, { size: 70, fill: MINT, ls: 6, glow: MINT })}</g>`;
  const k2 = prog(t, F('s05', .36), F('s05', .46));
  if (k2 > 0) { const str = 'FILE 002'.slice(0, Math.ceil(k2 * 8)); s += text(str, 960, 450, { size: 56, font: 'JetBrains Mono', weight: 800, fill: '#d9f7ee', ls: 10 }); }
  const k3 = prog(t, F('s05', .62), F('s05', .7));
  if (k3 > 0) {
    const g = 1 - prog(t, F('s05', .7), F('s05', .9));
    const jx = noise(t, 80, 1) * 14 * g, jy = noise(t, 70, 2) * 6 * g, T = 'THE MIND READER', sz = 150;
    s += `<g transform="translate(960 640) scale(${lerp(1.3, 1, easeOut(k3))})" opacity="${k3}">
      ${text(T, jx, jy, { size: sz, fill: CORAL, op: .7 * g })}${text(T, -jx, -jy, { size: sz, fill: MINT, op: .7 * g })}
      ${text(T, 0, 0, { size: sz, fill: '#ffffff', glow: MINT })}</g>`;
  }
  return s;
}

// ======================= SCHON REAL =======================
function wheelchair(x, s = 1) {
  return `<rect x="${x - 96 * s}" y="${SEATY - 270 * s}" width="${192 * s}" height="${270 * s}" rx="${30 * s}" fill="#2b3654"/>
    <rect x="${x - 104 * s}" y="${SEATY}" width="${208 * s}" height="${28 * s}" rx="${10 * s}" fill="#2b3654"/>
    <rect x="${x - 70 * s}" y="${FLOOR - 40}" width="${140 * s}" height="14" rx="7" fill="#5f6b78"/>`;
}
const wheels = (x, s = 1) => [-1, 1].map(d => `<ellipse cx="${x + d * 128 * s}" cy="${SEATY + 60}" rx="${26 * s}" ry="${170 * s}" fill="#1c2433"/><ellipse cx="${x + d * 128 * s}" cy="${SEATY + 60}" rx="${12 * s}" ry="${150 * s}" fill="none" stroke="#8a96a6" stroke-width="5"/>`).join('');
const pedestals = (x, hy, s) => `<rect x="${x - 34 * s}" y="${hy - 74 * s}" width="${22 * s}" height="${20 * s}" rx="${5 * s}" fill="#9aa6b2"/><rect x="${x + 10 * s}" y="${hy - 76 * s}" width="${22 * s}" height="${20 * s}" rx="${5 * s}" fill="#9aa6b2"/>`;
function monitor(x, y, w, h, inner) {
  return `<rect x="${x - 14}" y="${y + h / 2}" width="28" height="${FLOOR - y - h / 2 - 30}" fill="#3a4656"/><rect x="${x - 90}" y="${FLOOR - 40}" width="180" height="16" rx="8" fill="#3a4656"/>
    <rect x="${x - w / 2 - 14}" y="${y - h / 2 - 14}" width="${w + 28}" height="${h + 28}" rx="18" fill="#0b131a"/><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="8" fill="#0d1b2a"/>${inner || ''}`;
}
function sceneCasey(t) {
  let s = bgGrad('cs', '#14233a', '#22364f');
  s += `<rect x="-400" y="${FLOOR}" width="${W + 800}" height="400" fill="#1a2535"/>`;
  const CX = 600, n = SEATY - 230;
  const sensorsK = prog(t, F('s06', .68), F('s06', .74));
  const happy = t > S('s08');
  s += wheelchair(CX);
  s += person({ x: CX, neck: n, legs: 'sit', foot: FLOOR - 40, hair: 'short', hairCol: '#6b4a2e', beard: true, skin: '#f0c8a6', shirt: '#5a7fa6', pants: '#34405a', t,
    look: t > F('s07', .4) ? [12, -2] : [4, 0], mouth: happy ? 'smile' : 'flat', brows: t < F('s06', .5) ? 'sad' : 'neutral', blink: blinkAt(t, 4),
    hL: [CX - 64, n + 212], hR: [CX + 64, n + 212], hat: sensorsK > 0 ? pedestals : null });
  s += wheels(CX);
  // stumm: durchgestrichener Lautsprecher
  const muteK = inOut(t, F('s06', .32), F('s06', .38), F('s06', .55), F('s06', .6));
  if (muteK > 0) s += `<g transform="translate(${CX + 170} 380) scale(${back(muteK)})"><circle r="70" fill="#fff"/><path d="M-34 -16 L-14 -16 L8 -36 L8 36 L-14 16 L-34 16 Z" fill="${INK}"/><line x1="-46" y1="44" x2="46" y2="-44" stroke="${CORAL}" stroke-width="12" stroke-linecap="round"/></g>`;
  // Gehirn-Lupe mit 4 Sensoren
  const lens = inOut(t, F('s06', .6), F('s06', .66), S('s07') - .2, S('s07') + .15);
  if (lens > 0) {
    let sens = '';
    [[-40, -50], [-10, -64], [-48, -14], [-18, -28]].forEach(([dx, dy], i) => { const k = back(prog(t, F('s06', .72 + i * .05), F('s06', .76 + i * .05))); if (k > 0) sens += `<g transform="translate(${dx} ${dy}) scale(${k})"><rect x="-9" y="-9" width="18" height="18" rx="3" fill="#cfd8e0"/><circle r="22" fill="${MINT}" opacity=".35" filter="url(#soft)"/></g>`; });
    s += `<g transform="translate(1330 470) scale(${back(lens)})"><circle r="250" fill="#0d1b2a" stroke="${MINT}" stroke-width="8"/>
      <g transform="scale(1.9)">${brainShape(0, 0, .55, '#f2a6b8', '#c97a8e')}${sens}</g></g>
      <path d="M${CX + 40} ${n - 150} L1100 380" stroke="${MINT}" stroke-width="4" stroke-dasharray="10 10" opacity="${lens * .7}"/>`;
  }
  s += tag('CALIFORNIA · 2024', 60, 70, prog(t, F('s06', .54), F('s06', .6)));
  // s07: Elektroden, Signale → Wörter → Stimme
  const ck = inOut(t, S('s07') + .25, S('s07') + .65, F('s07', .38), F('s07', .44));
  const elec = Math.round(256 * easeOut(prog(t, S('s07') + .25, S('s07') + 1.5)));
  if (ck > 0) s += counter(String(elec), 1330, 420, 'ELECTRODES', ck, { size: 150 });
  const mk = back(prog(t, F('s07', .44), F('s07', .52)));
  const wordsK = prog(t, F('s07', .5), F('s07', .75));
  const gridK = prog(t, S('s08'), S('s08') + .4);
  if (mk > 0) {
    let inner = '';
    if (gridK <= 0) inner = [0, 1, 2, 3].map(i => { const w = [380, 300, 420, 220][i] * clamp(wordsK * 4 - i); return w > 0 ? `<rect x="${1330 - 230}" y="${330 + i * 56}" width="${w}" height="22" rx="11" fill="#fff" opacity=".85"/>` : ''; }).join('');
    else {
      // 10x10 Wörter: 97 richtig, 3 falsch
      const wrong = new Set([17, 58, 83]);
      for (let i = 0; i < 100; i++) {
        const k = prog(t, S('s08') + .2 + i * .012, S('s08') + .35 + i * .012); if (k <= 0) continue;
        const gx = 1330 - 225 + (i % 10) * 50, gy = 280 + Math.floor(i / 10) * 24;
        inner += `<rect x="${gx}" y="${gy}" width="40" height="16" rx="6" fill="${wrong.has(i) ? CORAL : MINT}" opacity="${k}"/>`;
      }
    }
    s += `<g transform="translate(1330 ${FLOOR}) scale(${mk}) translate(-1330 ${-FLOOR})">${monitor(1330, 400, 520, 300, inner)}</g>`;
    // Kabel + Signale
    s += `<path d="M${CX + 10} ${n - 150} C ${CX + 200} 120, 1000 160, 1070 300" stroke="#9aa6b2" stroke-width="7" fill="none" opacity="${mk}"/>`;
    for (let i = 0; i < 4; i++) { const ph = (t * .9 + i / 4) % 1; const bx = lerp(CX + 10, 1070, ph), by = lerp(n - 150, 300, ph) - Math.sin(ph * Math.PI) * 140; s += `<circle cx="${bx}" cy="${by}" r="10" fill="${MINT}" opacity="${mk * (gridK > 0 ? .3 : 1)}"/>`; }
  }
  // seine alte Stimme
  const vk = back(prog(t, F('s07', .76), F('s07', .84))) * (1 - prog(t, S('s08'), S('s08') + .3));
  if (vk > 0) {
    let waves = ''; for (let i = 0; i < 3; i++) { const r = 40 + i * 30 + ((t * 60) % 30); waves += `<path d="M${r * .7} ${-r * .7} A ${r} ${r} 0 0 1 ${r * .7} ${r * .7}" stroke="${MINT}" stroke-width="8" fill="none" opacity="${1 - i * .3}"/>`; }
    s += `<g transform="translate(1660 260) scale(${vk})"><circle r="80" fill="#0d1b2a" stroke="${MINT}" stroke-width="5"/><path d="M-40 -18 L-18 -18 L8 -40 L8 40 L-18 18 L-40 18 Z" fill="${MINT}"/><g transform="translate(14 0) scale(.6)">${waves}</g></g>
      ${text('HIS OLD VOICE', 1660, 380, { size: 30, font: 'JetBrains Mono', weight: 800, fill: MINT, op: clamp(vk) })}`;
  }
  const c8 = prog(t, F('s08', .15), F('s08', .3));
  if (c8 > 0) s += counter(Math.round(97 * easeOut(c8)) + ' / 100', 1330, 700, 'WORDS RIGHT', c8, { size: 100 });
  return s;
}

// ---- s09: Neuralink ----
function chessBoard(x, y, sz, t, mv) {
  let s = '';
  for (let i = 0; i < 64; i++) { const cx = i % 8, cy = Math.floor(i / 8); s += `<rect x="${x + cx * sz}" y="${y + cy * sz}" width="${sz}" height="${sz}" fill="${(cx + cy) % 2 ? '#3a5a6e' : '#cfe3ec'}"/>`; }
  const piece = (px, py, col) => `<g transform="translate(${px} ${py})"><circle cx="0" cy="${-sz * .12}" r="${sz * .2}" fill="${col}"/><path d="M${-sz * .25} ${sz * .32} L${sz * .25} ${sz * .32} L${sz * .14} ${-sz * .02} L${-sz * .14} ${-sz * .02} Z" fill="${col}"/></g>`;
  [[1, 0], [3, 0], [6, 1], [2, 1]].forEach(([a, b]) => s += piece(x + (a + .5) * sz, y + (b + .5) * sz, '#1a1420'));
  [[0, 6], [5, 6], [4, 7]].forEach(([a, b]) => s += piece(x + (a + .5) * sz, y + (b + .5) * sz, '#fff'));
  // Springer zieht (hüpft)
  const k = ease(mv), fx = lerp(6, 5, k), fy = lerp(7, 5, k);
  s += `<g transform="translate(0 ${-Math.sin(k * Math.PI) * sz * .8})">${piece(x + (fx + .5) * sz, y + (fy + .5) * sz, SUN)}</g>`;
  return s;
}
function sceneNeuralink(t) {
  let s = bgGrad('nl', '#14233a', '#22364f');
  s += `<rect x="-400" y="${FLOOR}" width="${W + 800}" height="400" fill="#1a2535"/>`;
  const out = ease(prog(t, F('s09', .76), F('s09', .82)));
  // Chip-Nahaufnahme
  const chipK = inOut(t, S('s09') + .1, S('s09') + .6, F('s09', .24), F('s09', .3));
  if (chipK > 0) {
    let threads = ''; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI - Math.PI; threads += `<path d="M${Math.cos(a) * 110} ${Math.sin(a) * 30 + 60} q ${Math.cos(a) * 60} 80 ${Math.cos(a) * 90} 200" stroke="${MINT}" stroke-width="3" fill="none" opacity=".7"/>`; }
    s += `<g transform="translate(960 470) scale(${back(chipK) * 1.3})">${threads}<ellipse cx="0" cy="10" rx="160" ry="56" fill="#9aa6b2"/><ellipse cx="0" cy="0" rx="160" ry="56" fill="#d9e0e8"/><ellipse cx="0" cy="-6" rx="120" ry="38" fill="#c3ccd6"/><circle r="200" fill="${MINT}" opacity=".12" filter="url(#glow)"/></g>
      ${text('THE SIZE OF A COIN', 960, 860, { size: 40, font: 'JetBrains Mono', weight: 800, fill: '#cfe', op: chipK })}`;
  }
  s += tag('ARIZONA · JANUARY 2024', 60, 70, prog(t, S('s09') + .2, S('s09') + .6) * (1 - out));
  // Noland + Schach
  const pk = prog(t, F('s09', .27), F('s09', .33)) * (1 - out);
  if (pk > 0) {
    const NX = 560, n = SEATY - 230;
    const mind = inOut(t, F('s09', .6), F('s09', .66), F('s09', .75), F('s09', .8));
    let g = wheelchair(NX) + person({ x: NX, neck: n, legs: 'sit', foot: FLOOR - 40, hair: 'short', hairCol: '#2a1c16', skin: '#f2c6a0', shirt: '#3d3d4f', pants: '#2a2a3a', t,
      look: [12, -2], mouth: t > F('s09', .5) ? 'smile' : 'flat', blink: blinkAt(t, 6), hL: [NX - 64, n + 212], hR: [NX + 64, n + 212],
      hat: (x, hy, sc) => `<circle cx="${x - 10 * sc}" cy="${hy - 52 * sc}" r="${30 * sc}" fill="${MINT}" opacity="${.25 + .35 * mind}" filter="url(#soft)"/>` }) + wheels(NX);
    const mv = prog(t, F('s09', .48), F('s09', .56));
    g += monitor(1330, 430, 520, 440, chessBoard(1330 - 200, 430 - 200, 50, t, mv));
    if (mind > 0) for (let i = 0; i < 5; i++) { const ph = (t * 1.2 + i / 5) % 1; g += `<path d="M${lerp(NX + 80, 1050, ph)} ${lerp(300, 380, ph) - 30} q 20 30 0 60" stroke="${MINT}" stroke-width="7" fill="none" opacity="${mind * Math.sin(ph * Math.PI)}"/>`; }
    s += `<g opacity="${clamp(pk * 2)}">${g}</g>`;
    s += headline(['WITH HIS MIND.'], 960, 150, t, F('s09', .64), F('s09', .76), { size: 90, hl: 0 });
  }
  // 21 Menschen
  if (out > 0) {
    s += tag('EARLY 2026', 60, 70, out);
    for (let i = 0; i < 21; i++) {
      const k = back(prog(t, F('s09', .82) + i * .05, F('s09', .82) + i * .05 + .3)); if (k <= 0) continue;
      const gx = 260 + (i % 7) * 120, gy = 400 + Math.floor(i / 7) * 150;
      s += `<g transform="translate(${gx} ${gy}) scale(${k})"><circle cy="-30" r="26" fill="${MINT}"/><path d="M-42 50 C -42 0, 42 0, 42 50 Z" fill="${MINT}" opacity=".8"/></g>`;
    }
    s += counter(String(Math.round(21 * easeOut(prog(t, F('s09', .82), E('s09'))))), 1500, 500, 'PEOPLE WITH THE CHIP', out, { size: 170 });
  }
  return s;
}

// ======================= DER HAKEN (Kopfprofil) =======================
const HEAD = 'M600 1000 L600 760 C 520 700, 490 580, 510 480 C 535 350, 650 280, 775 280 C 905 280, 995 370, 1000 475 C 1002 520, 1012 540, 1046 590 C 1058 610, 1046 622, 1018 624 C 1022 650, 1012 668, 1000 676 C 1012 696, 1002 714, 984 720 C 984 752, 958 772, 908 772 L880 772 L880 1000 Z';
function headProfile(t, o = {}) {
  let s = `<path d="${HEAD}" fill="#1a3a4e"/><path d="${HEAD}" fill="${MINT}" opacity=".05"/>`;
  s += brainShape(745, 470, .95, '#284f66', '#3f7189');
  if (o.motor > 0) s += `<path d="M720 320 C 700 400, 670 470, 640 560" stroke="${CORAL}" stroke-width="22" fill="none" stroke-linecap="round" opacity="${o.motor * (.6 + .4 * Math.sin(t * 6))}" filter="url(#glowS)"/>`;
  if (o.inner > 0) {
    const k = back(o.inner);
    s += `<g transform="translate(790 450) scale(${k})"><ellipse rx="150" ry="90" fill="${MINT}" opacity=".25" filter="url(#soft)"/><ellipse rx="120" ry="70" fill="#d9fff3"/>
      <path d="M-40 60 L-70 100 L-10 66 Z" fill="#d9fff3"/>${[0, 1, 2].map(i => `<rect x="-80" y="${-38 + i * 30}" width="${[160, 120, 140][i]}" height="14" rx="7" fill="#10283a" opacity="${.3 + .7 * clamp(o.inner * 3 - i)}"/>`).join('')}</g>`;
  }
  return s;
}
function sceneInner(t) {
  let s = bgGrad('in', '#06121c', '#10283a') + grid(.035);
  // s10
  const motor = prog(t, F('s10', .5), F('s10', .58)) * (1 - prog(t, S('s11'), S('s11') + .4));
  const inner = prog(t, F('s11', .45), F('s11', .6));
  s += `<g transform="translate(-90 0)">${headProfile(t, { motor, inner })}`;
  const mouthK = back(prog(t, F('s10', .62), F('s10', .68))) * (1 - prog(t, S('s11'), S('s11') + .4));
  const handK = back(prog(t, F('s10', .82), F('s10', .88))) * (1 - prog(t, S('s11'), S('s11') + .4));
  if (mouthK > 0) s += `<path d="M650 540 C 800 640, 960 700, 1120 690" stroke="${CORAL}" stroke-width="6" stroke-dasharray="14 10" fill="none" opacity="${clamp(mouthK)}"/>
    <g transform="translate(1190 690) scale(${mouthK})"><circle r="70" fill="#fff"/><path d="M-40 -6 Q 0 -30 40 -6 Q 0 36 -40 -6 Z" fill="#d9472b"/><path d="M-36 -4 Q 0 6 36 -4" stroke="#7a2e2e" stroke-width="5" fill="none"/></g>`;
  if (handK > 0) s += `<path d="M690 360 C 860 260, 1040 240, 1140 330" stroke="${CORAL}" stroke-width="6" stroke-dasharray="14 10" fill="none" opacity="${clamp(handK)}"/>
    <g transform="translate(1210 350) scale(${handK})"><circle r="70" fill="#fff"/><rect x="-26" y="-10" width="52" height="46" rx="14" fill="#f2c6a0"/>${[-20, -7, 6, 19].map(x => `<rect x="${x - 6}" y="-44" width="12" height="40" rx="6" fill="#f2c6a0"/>`).join('')}<rect x="-40" y="-2" width="20" height="12" rx="6" fill="#f2c6a0" transform="rotate(-30 -30 4)"/></g>`;
  s += '</g>';
  // Gedanken: nicht gelesen
  const tk = inOut(t, F('s10', .2), F('s10', .26), F('s10', .46), F('s10', .5));
  if (tk > 0) s += `<g transform="translate(1400 330) scale(${back(tk)})"><circle cx="-180" cy="150" r="16" fill="#fff"/><circle cx="-140" cy="110" r="24" fill="#fff"/>
    <ellipse rx="230" ry="130" fill="#fff"/><ellipse cx="-120" cy="-60" rx="120" ry="90" fill="#fff"/><ellipse cx="120" cy="-50" rx="130" ry="90" fill="#fff"/>${text('THOUGHTS', 0, 10, { size: 64, fill: INK })}</g>
    ${stamp('NOT READ', 1400, 360, prog(t, F('s10', .32), F('s10', .38)), CORAL, -10, 64)}`;
  // s11
  s += headline(['YOUR INNER VOICE'], 1370, 200, t, F('s11', .05), E('s11') + .2, { size: 70, hl: 0 });
  // s12: Stanford entschlüsselt innere Sprache
  s += tag('STANFORD · 2025', 60, 70, prog(t, S('s12') + .1, S('s12') + .5));
  const mk = back(prog(t, F('s12', .4), F('s12', .48)));
  const lockK = prog(t, F('s13', .58), F('s13', .64));
  if (mk > 0) {
    const words = ['I', 'would', 'like', 'some', 'water'];
    let inner = words.map((w, i) => { const k = prog(t, F('s12', .48) + i * .35, F('s12', .48) + i * .35 + .2); return k > 0 ? text(w, 1215 + [0, 40, 170, 270, 410][i], 470, { size: 46, font: 'JetBrains Mono', weight: 800, anchor: 'start', fill: '#fff', op: k }) : ''; }).join('');
    // ungefragte Gedanken (Zahlen)
    const leak = prog(t, F('s13', .12), F('s13', .2));
    if (leak > 0) inner += ['3', '4', '5'].map((d, i) => text(d, 1240 + i * 70, 560, { size: 60, font: 'JetBrains Mono', weight: 800, fill: CORAL, op: prog(t, F('s13', .15) + i * .3, F('s13', .2) + i * .3) })).join('');
    if (lockK > 0) inner += `<rect x="1180" y="390" width="480" height="230" fill="#0d1b2a" opacity="${lockK * .85}"/><g transform="translate(1420 520) scale(${back(lockK) * .8})">${lockIcon(0, t)}</g>`;
    s += `<g transform="translate(1420 520) scale(${mk}) translate(-1420 -520)"><rect x="1166" y="376" width="508" height="258" rx="18" fill="#0b131a"/><rect x="1180" y="390" width="480" height="230" rx="8" fill="#0d1b2a"/>${inner}</g>`;
    for (let i = 0; i < 4; i++) { const ph = (t * 1 + i / 4) % 1; s += `<circle cx="${lerp(860, 1170, ph)}" cy="${lerp(450, 480, ph) - Math.sin(ph * Math.PI) * 40}" r="9" fill="${MINT}" opacity="${mk * (1 - lockK)}"/>`; }
  }
  const c74 = inOut(t, F('s12', .74), F('s12', .8), E('s12') + .3, S('s13') + .3);
  if (c74 > 0) s += counter(Math.round(74 * easeOut(prog(t, F('s12', .74), E('s12')))) + '%', 1420, 800, 'UP TO · WORDS RIGHT', c74, { size: 120 });
  const wk = inOut(t, F('s13', .18), F('s13', .24), F('s13', .55), F('s13', .6));
  if (wk > 0) s += `<g transform="translate(1420 780) scale(${back(wk)})"><rect x="-260" y="-50" width="520" height="100" rx="20" fill="#2a1418" stroke="${CORAL}" stroke-width="4"/>${text('THOUGHTS NOBODY ASKED FOR', 0, 3, { size: 32, fill: CORAL })}</g>`;
  return s;
}

// ======================= OHNE OP =======================
function sceneScanner(t) {
  let s = bgGrad('sc', '#0e1d2c', '#1c3246') + grid(.03);
  s += `<rect x="-400" y="${FLOOR}" width="${W + 800}" height="400" fill="#16222e"/>`;
  const slide = ease(prog(t, F('s14', .25), F('s14', .5)));
  // Scanner-Ring (hinten), Kopf liegt später im Ring
  s += `<circle cx="1440" cy="560" r="330" fill="#e6ebf0"/><circle cx="1440" cy="560" r="300" fill="#cfd8e0"/><circle cx="1440" cy="560" r="190" fill="#0d1b2a"/>
    <circle cx="1440" cy="560" r="190" fill="${MINT}" opacity="${.15 + .1 * Math.sin(t * 6)}"/><rect x="1270" y="840" width="340" height="${FLOOR - 840}" fill="#cfd8e0"/>
    <rect x="1600" y="380" width="60" height="16" rx="8" fill="${MINT}" opacity="${.5 + .5 * Math.sin(t * 4)}"/>`;
  // Liege + Mensch (liegt auf dem Rücken, Kopf Richtung Ring)
  const hx = lerp(1000, 1420, slide);
  const hp = (x, hy, sc) => `<path d="M${x - 58 * sc} ${hy} C ${x - 58 * sc} ${hy - 90 * sc}, ${x + 58 * sc} ${hy - 90 * sc}, ${x + 58 * sc} ${hy}" stroke="#222" stroke-width="${10 * sc}" fill="none"/><rect x="${x - 70 * sc}" y="${hy - 16 * sc}" width="${26 * sc}" height="${46 * sc}" rx="${8 * sc}" fill="#333"/><rect x="${x + 44 * sc}" y="${hy - 16 * sc}" width="${26 * sc}" height="${46 * sc}" rx="${8 * sc}" fill="#333"/>`;
  s += `<rect x="${hx - 760}" y="650" width="880" height="34" rx="14" fill="#cfd8e0"/><rect x="${hx - 420}" y="684" width="60" height="${FLOOR - 684}" fill="#8a96a6"/>`;
  s += `<g transform="translate(${hx - 60} 600) rotate(90)">${person({ x: 0, neck: 0, s: .8, legs: 'stand', foot: 640, hair: 'long', hairCol: '#3b2a24', skin: '#f2cfae', shirt: '#7b6cff', pants: '#2b2b4a', t, mouth: 'smile', blink: .1, hat: hp })}</g>`;
  // Geschichten (Noten aus dem Kopfhörer)
  for (let i = 0; i < 5; i++) { const ph = (t * .5 + i / 5) % 1; s += text(['♪', '♫'][i % 2], 1440 + Math.sin(ph * 6 + i) * 60, 330 - ph * 220, { size: 60, fill: SUN, op: slide * Math.sin(ph * Math.PI) }); }
  s += tag('TEXAS · 2023', 60, 70, prog(t, F('s14', .27), F('s14', .33)));
  // 16 Stunden
  const ck = prog(t, F('s14', .6), F('s14', .7));
  if (ck > 0) {
    const spin = prog(t, F('s14', .6), E('s14') + .5);
    s += `<g transform="translate(420 300) scale(${back(ck)})"><circle r="110" fill="#f2f0e6"/><circle r="98" fill="#fff"/>
      <line x1="0" y1="0" x2="0" y2="-55" stroke="${INK}" stroke-width="10" stroke-linecap="round" transform="rotate(${spin * 360 * 16 / 12})"/>
      <line x1="0" y1="0" x2="0" y2="-80" stroke="${CORAL}" stroke-width="6" stroke-linecap="round" transform="rotate(${spin * 360 * 16})"/><circle r="9" fill="${INK}"/></g>`;
    s += counter(Math.round(16 * easeOut(spin)) + ' HOURS', 420, 520, 'IN THE SCANNER', ck, { size: 80 });
  }
  return s;
}
function textCard(x, y, w, k, label, str, col) {
  return card(x, y, w, 210, k, `${text(label, -w / 2 + 40, -62, { size: 26, font: 'JetBrains Mono', weight: 800, anchor: 'start', fill: col, ls: 3 })}
    ${text(str, -w / 2 + 40, 10, { size: 40, anchor: 'start', fill: '#fff', weight: 800 })}`, { stroke: col });
}
function animalIcon(i) {
  if (i === 0) return `<circle r="40" fill="#f2b84b"/><path d="M-36 -20 L-30 -56 L-8 -36 Z M36 -20 L30 -56 L8 -36 Z" fill="#f2b84b"/><circle cx="-14" cy="-6" r="6" fill="${INK}"/><circle cx="14" cy="-6" r="6" fill="${INK}"/><path d="M-6 10 L6 10 L0 16 Z" fill="${CORAL}"/>`;
  if (i === 1) return `<ellipse rx="46" ry="28" fill="#4cc9f0"/><path d="M40 0 L74 -26 L74 26 Z" fill="#4cc9f0"/><circle cx="-22" cy="-6" r="6" fill="${INK}"/>`;
  return `<ellipse rx="44" ry="34" fill="#fff"/><circle cx="-36" cy="-22" r="24" fill="#fff"/><circle cx="-42" cy="-26" r="5" fill="${INK}"/><path d="M-60 -20 L-78 -14 L-60 -10 Z" fill="${SUN}"/><path d="M-10 -10 Q 20 -50 40 -20" stroke="#e6ebf0" stroke-width="10" fill="none"/>`;
}
function sceneGist(t) {
  let s = bgGrad('gs', '#06121c', '#10283a') + grid(.035);
  // s15: gehört vs. entschlüsselt
  const fade15 = 1 - prog(t, S('s16'), S('s16') + .4);
  s += `<g opacity="${fade15}">`;
  s += textCard(960, 300, 1400, prog(t, S('s15') + .1, S('s15') + .5), 'HEARD', '“I don’t have my driver’s license yet.”', '#9fd3ff');
  s += textCard(960, 600, 1400, prog(t, F('s15', .3), F('s15', .36)), 'DECODED', '“She has not even started to learn to drive yet.”', MINT);
  const imag = inOut(t, F('s15', .4), F('s15', .46), F('s15', .6), F('s15', .64));
  if (imag > 0) s += `<g transform="translate(1600 130) scale(${back(imag)})"><rect x="-120" y="-60" width="240" height="120" rx="14" fill="#1c2b3c" stroke="${SUN}" stroke-width="4"/>${text('+ IMAGINED', 0, 3, { size: 30, font: 'JetBrains Mono', weight: 800, fill: SUN })}</g>`;
  const nw = prog(t, F('s15', .64), F('s15', .7));
  if (nw > 0) s += text('NOT WORD FOR WORD', 960, 820, { size: 46, fill: CORAL, op: nw });
  s += stamp('THE GIST', 1500, 840, prog(t, F('s15', .82), F('s15', .88)), MINT, -8, 70);
  s += '</g>';
  // s16: trainiert vs. fremd, Tiere
  const k16 = prog(t, S('s16'), S('s16') + .5);
  if (k16 > 0) {
    const think = prog(t, F('s16', .55), F('s16', .62));
    const p1 = person({ x: 560, neck: 560, s: .95, legs: 'stand', foot: 1020, hair: 'long', hairCol: '#3b2a24', skin: '#f2cfae', shirt: '#7b6cff', pants: '#2b2b4a', t,
      look: [4, -8], mouth: think > 0 ? 'grin' : 'smile', blink: blinkAt(t, 1) });
    const p2 = person({ x: 1380, neck: 560, s: .95, legs: 'stand', foot: 1020, hair: 'ben', hairCol: '#2a1c16', skin: '#8d5a3c', shirt: SUN, t,
      look: [-4, -8], mouth: 'o', brows: 'up', blink: blinkAt(t, 5) });
    s += `<g opacity="${k16}">${p1}${p2}</g>`;
    s += card(560, 210, 520, 150, prog(t, F('s16', .17), F('s16', .23)), think > 0 ?
      text(Math.sin(t * 30) > 0 ? 'ERR0R #!?' : 'ERROR ??%', 0, 4, { size: 54, font: 'JetBrains Mono', weight: 800, fill: CORAL }) :
      `${text('TRAINED IT', 0, -30, { size: 26, font: 'JetBrains Mono', weight: 800, fill: MINT })}${text('WORKS ✓', 0, 22, { size: 50, fill: '#fff' })}`, { stroke: think > 0 ? CORAL : MINT });
    s += card(1380, 210, 520, 150, prog(t, F('s16', .3), F('s16', .36)),
      `${text('STRANGER', 0, -30, { size: 26, font: 'JetBrains Mono', weight: 800, fill: CORAL })}${text('??? ?? ????', 0, 22, { size: 50, font: 'JetBrains Mono', weight: 800, fill: '#fff' })}`, { stroke: CORAL });
    // Tiere in Gedanken
    if (think > 0) [0, 1, 2].forEach(i => { const k = back(prog(t, F('s16', .78) + i * .12, F('s16', .84) + i * .12)); if (k > 0) s += `<g transform="translate(${360 + i * 200} ${430 - (i % 2) * 40}) scale(${k})"><circle r="70" fill="#fff" opacity=".95"/>${animalIcon(i)}</g>`; });
  }
  return s;
}

// ======================= TAG 2: VORSTELLUNGSGESPRÄCH =======================
function sceneInterview(t) {
  const IX = 720, TX = 1200;
  const q = F('s17', .58);
  const k18 = prog(t, S('s18') + .05, E('s18'));
  const react = t > E('s18') - .1;
  const screen = (sx, sy, sw) => k18 > 0 ? typed('In your chair.', k18, sx - sw / 2 + 30, sy + 90, { size: 56, maxCh: 20 }) : `${text('INTERVIEW · 10:00', sx, sy + 40, { size: 34, fill: '#cfe' })}`;
  let world = officeRoom(t, { screen, screenX: 960 });
  // Poster
  world += `<rect x="1560" y="150" width="200" height="260" rx="6" fill="#f4efe6"/><rect x="1580" y="170" width="160" height="140" fill="#3fae7a"/><circle cx="1660" cy="210" r="26" fill="${SUN}"/><path d="M1580 310 L1640 240 L1700 300 L1740 260 L1740 310 Z" fill="#2e8c62"/>${text('TEAMWORK', 1660, 360, { size: 28, fill: INK })}`;
  // Stuhl-Leuchten (der Stuhl, den Tom will)
  const glowK = prog(t, F('s18', .5), E('s18') + .4) * (1 - prog(t, F('s19', .7), E('s19')));
  world += officeFloor([IX, TX]);
  if (glowK > 0) world += `<rect x="${IX - 100}" y="${SEATY - 310}" width="200" height="320" rx="44" fill="${SUN}" opacity="${glowK * .35}" filter="url(#glow)"/>`;
  world += sitter(IX, { hair: 'long', hairCol: '#1a1420', skin: '#e8c0a0', shirt: '#4a3a6a', glasses: true, seed: 7, s: .97,
    look: react ? [6, -14] : [12, 0], mouth: react ? 'o' : (t > F('s17', .42) && t < E('s17') ? 'talk' : 'smile'), brows: react ? 'angry' : 'neutral' }, t);
  world += tom(TX, { look: react ? [-10, 2] : [-12, 0], mouth: t > S('s19') ? 'grin' : (k18 > 0 ? 'flat' : 'smile'), brows: react ? 'worried' : 'neutral',
    sweat: t > S('s19') ? (t - S('s19')) % 1.2 : 0 }, t);
  world += `<g transform="translate(${IX + 140} ${TY + 2})"><rect x="-60" y="-14" width="120" height="14" rx="4" fill="#f4efe6"/><rect x="-50" y="-20" width="100" height="8" fill="#e6dccb"/></g>` + mug(TX + 140, '#4c6ef5');
  world += officeTable(300, 1620);
  const qk = inOut(t, q, q + .3, E('s17') + .6, E('s17') + .9);
  world += bubble(IX + 60, 300, 'Where do you see yourself in five years?', qk, { tail: -60, size: 36, maxW: 520 });
  let c = [1.0, 960, 540];
  c = camLerp(ease(prog(t, S('s18'), S('s18') + .6)), c, [1.2, 960, 420]);
  c = camLerp(ease(prog(t, S('s19'), E('s19'))), c, [1.45, TX, 500]);
  let s = `<g transform="${cam(...c)}">${world}</g>`;
  s += tag('DAY 2', 60, 70, prog(t, S('s17') + .1, S('s17') + .5), SUN);
  return s;
}

// ======================= GESETZE =======================
function sceneLaw(t) {
  let s = bgGrad('lw', '#06121c', '#10283a') + grid(.035);
  s += headline(['WHO OWNS', 'YOUR BRAIN DATA?'], 960, 160, t, S('s20') + .05, F('s20', .2), { size: 90 });
  // Gehirn mit Datenstrom
  const bk = back(prog(t, S('s20') + .1, S('s20') + .6));
  s += `<g transform="translate(560 ${lerp(600, 560, prog(t, F('s20', .2), F('s20', .3)))}) scale(${bk})">${brainShape(0, 0, 1.0, '#f2a6b8', '#c97a8e')}</g>`;
  for (let i = 0; i < 10; i++) { const ph = (t * .7 + i / 10) % 1; s += text(i % 2 ? '1' : '0', 760 + ph * 300, 560 + Math.sin(ph * 8 + i) * 60, { size: 34, font: 'JetBrains Mono', weight: 800, fill: MINT, op: bk * Math.sin(ph * Math.PI) * (1 - prog(t, F('s20', .2), F('s20', .3))) }); }
  // Schutzschild
  const sh = prog(t, F('s20', .22), F('s20', .32));
  if (sh > 0) s += `<g transform="translate(560 560) scale(${back(sh)})"><path d="M0 -260 L220 -180 C 220 40, 140 180, 0 260 C -140 180, -220 40, -220 -180 Z" fill="${MINT}" opacity=".12"/>
    <path d="M0 -260 L220 -180 C 220 40, 140 180, 0 260 C -140 180, -220 40, -220 -180 Z" fill="none" stroke="${MINT}" stroke-width="10" stroke-linejoin="round"/></g>`;
  s += tag('COLORADO · 2024', 60, 70, prog(t, F('s20', .22), F('s20', .28)));
  const row = (y, k, place, what, col) => card(1360, y, 760, 170, k, `${text(place, -340, -30, { size: 30, font: 'JetBrains Mono', weight: 800, anchor: 'start', fill: col, ls: 3 })}${text(what, -340, 26, { size: 44, anchor: 'start', fill: '#fff' })}`, { stroke: col });
  s += row(330, prog(t, F('s20', .3), F('s20', .36)), 'COLORADO · 2024', 'First US state law', MINT);
  s += row(560, prog(t, F('s20', .57), F('s20', .63)), 'CALIFORNIA', 'Followed', MINT);
  s += row(790, prog(t, F('s20', .72), F('s20', .78)), 'CHILE', 'Neurorights in the constitution', SUN);
  s += stamp('LAW', 1640, 300, prog(t, F('s20', .4), F('s20', .46)), MINT, 10, 44);
  return s;
}

// ======================= URTEIL =======================
function sceneVerdict(t) {
  let s = bgGrad('vd', '#06121c', '#10283a') + grid(.035);
  s += stamp('VERDICT', 960, 120, prog(t, S('s21'), S('s21') + .4), MINT, 0, 70);
  const rows = [
    [.06, .24, 'Give people their voice back', 'ALREADY HERE', MINT],
    [.36, .55, 'Read your inner voice, for everyone', 'MAYBE IN 20 YEARS', SUN],
    [.66, .78, 'Read thoughts you want to keep', 'WE HOPE NEVER', CORAL],
  ];
  rows.forEach(([a, b, what, verdict, col], i) => {
    const y = 330 + i * 230, k = prog(t, F('s21', a), F('s21', a) + .4);
    if (k <= 0) return;
    s += `<g opacity="${clamp(k * 2)}" transform="translate(${(1 - easeOut(k)) * -60} 0)"><rect x="140" y="${y - 80}" width="1640" height="160" rx="26" fill="#10283a" stroke="${col}" stroke-opacity=".5" stroke-width="4"/>
      <circle cx="230" cy="${y}" r="44" fill="${col}" opacity=".9"/>${text(String(i + 1), 230, y + 2, { size: 50, fill: '#06121c' })}
      ${text(what, 310, y + 2, { size: 50, anchor: 'start', fill: '#fff' })}</g>`;
    s += stamp(verdict, 1500, y, prog(t, F('s21', b), F('s21', b) + .3), col, -6, 40);
  });
  s += tag('OUR OWN ESTIMATE', 60, 1010, prog(t, F('s21', .88), F('s21', .93)), SUN);
  return s;
}

// ======================= AUSBLICK =======================
function sceneFuture(t) {
  const meet = prog(t, F('s22', .55), F('s22', .62));
  let s = '';
  // Symbole: Nachricht denken, stilles Telefonat
  const ik = (f) => back(prog(t, F('s22', f), F('s22', f) + .4)) * (1 - meet);
  const bg = bgGrad('fu', '#06121c', '#10283a') + grid(.035);
  if (meet < 1) {
    s += `<g opacity="${1 - meet}">${bg}`;
    s += headline(['AND IF IT WORKS?'], 960, 540, t, S('s22') + .05, F('s22', .14), { size: 100, hl: 0 });
    const k1 = ik(.15);
    if (k1 > 0) s += `<g transform="translate(560 540) scale(${k1})"><circle r="250" fill="#10283a" stroke="${MINT}" stroke-width="6"/>
      <ellipse cx="-70" cy="-40" rx="90" ry="60" fill="#fff"/><circle cx="-130" cy="40" r="14" fill="#fff"/>${text('Hi!', -70, -38, { size: 50, fill: INK })}
      <path d="M30 -40 L90 -40 M70 -56 L90 -40 L70 -24" stroke="${MINT}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <rect x="100" y="-120" width="110" height="190" rx="20" fill="#1c2b3c" stroke="#cfd8e0" stroke-width="6"/><rect x="116" y="-70" width="80" height="34" rx="12" fill="${MINT}"/>
      ${text('MESSAGES YOU JUST THINK', 0, 180, { size: 30, fill: '#fff' })}</g>`;
    const k2 = ik(.38);
    if (k2 > 0) {
      let waves = ''; for (let i = 0; i < 4; i++) { const ph = (t * .8 + i / 4) % 1; waves += `<circle cx="${lerp(-110, 110, ph)}" cy="${-20 - Math.sin(ph * Math.PI) * 50}" r="10" fill="${MINT}" opacity="${Math.sin(ph * Math.PI)}"/>`; }
      s += `<g transform="translate(1360 540) scale(${k2})"><circle r="250" fill="#10283a" stroke="${MINT}" stroke-width="6"/>
        <circle cx="-140" cy="-10" r="50" fill="#f2c6a0"/><circle cx="140" cy="-10" r="50" fill="#c98d64"/>${waves}
        <path d="M-40 60 L-10 60 L10 40 L10 100 L-10 80 L-40 80 Z" fill="#cfd8e0"/><line x1="-44" y1="110" x2="20" y2="30" stroke="${CORAL}" stroke-width="8" stroke-linecap="round"/>
        ${text('SILENT PHONE CALLS', 0, 180, { size: 30, fill: '#fff' })}</g>`;
    }
    s += '</g>';
  }
  if (meet > 0) {
    const happy = t > F('s22', .85);
    const st = { bossMouth: 'smile', anaMouth: 'smile', rajMouth: 'smile', tomMouth: happy ? 'grin' : 'smile', bossLook: [8, -2], anaLook: [10, 0], rajLook: [-10, 0], tomLook: [-8, 0] };
    const screen = (sx, sy) => `${text('0 WORDS SPOKEN', sx, sy + 70, { size: 48, font: 'JetBrains Mono', weight: 800, fill: MINT })}`;
    let world = officeRoom(t, { screen }) + officeFloor(Object.values(MEET)) + meetingPeople(t, st) + officeTable();
    // Gedankenverbindungen zwischen den Köpfen
    const xs = Object.values(MEET), hy = [SEATY - 230 - 66, SEATY - 230 * .95 - 66 * .95, SEATY - 230 - 66, SEATY - 230 - 66];
    for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) {
      const mx = (xs[i] + xs[j]) / 2, my = Math.min(hy[i], hy[j]) - 60 - (j - i) * 40;
      world += `<path d="M${xs[i]} ${hy[i] - 60} Q ${mx} ${my} ${xs[j]} ${hy[j] - 60}" stroke="${MINT}" stroke-width="4" fill="none" stroke-dasharray="12 10" stroke-dashoffset="${-t * 60}" opacity="${meet * .7}"/>`;
    }
    const zoom = ease(prog(t, F('s22', .85), E('s22') + .4));
    const c = camLerp(zoom, [1, 960, 540], [1.6, MEET.tom, 470]);
    s += `<g opacity="${meet}"><g transform="${cam(...c)}">${world}</g></g>`;
    s += text('MEETINGS WITHOUT A WORD', 960, 1010, { size: 40, fill: '#fff', op: meet * (1 - zoom) });
  }
  return s;
}

// ======================= AUFLÖSUNG =======================
function lockIcon(open, t, label) {
  const lift = easeOut(clamp(open)) * 60;
  return `<g><rect x="-130" y="-100" width="260" height="260" rx="40" fill="${SUN}" opacity="${.2 + .2 * open}" filter="url(#glow)"/>
    <g transform="translate(${open * 34} ${-lift}) rotate(${-open * 18} 50 -40)"><path d="M-50 -30 L-50 -80 C -50 -150, 50 -150, 50 -80 L50 -30" stroke="#c9ced6" stroke-width="26" fill="none" stroke-linecap="round"/></g>
    <rect x="-90" y="-40" width="180" height="150" rx="24" fill="${LOCKGOLD}"/><rect x="30" y="-40" width="60" height="150" rx="24" fill="#c9952f" opacity=".6"/>
    <circle cx="0" cy="20" r="18" fill="#3a2a10"/><rect x="-7" y="22" width="14" height="40" rx="6" fill="#3a2a10"/>
    ${label ? text(label, 0, 150, { size: 26, font: 'JetBrains Mono', weight: 800, fill: '#fff' }) : ''}</g>`;
}
function scenePayoff(t) {
  let s = bgGrad('po', '#06121c', '#10283a') + grid(.04);
  // Passwortfeld
  const fk = back(prog(t, F('s24', .5), F('s24', .58)));
  let field = '', fieldCol = MINT;
  if (t < S('s25')) {
    const ty = prog(t, F('s24', .8), E('s24'));
    field = ty > 0 ? typed('chitty chitty bang bang', ty, -330, 6, { size: 44, maxCh: 40 }) : text('• • • • • •', 0, 8, { size: 50, fill: '#cfe' });
  } else if (t < S('s26')) field = text('• • • • • • • •', 0, 8, { size: 50, fill: '#cfe' });
  else { field = typed('I love Mondays.', prog(t, S('s26') + .05, E('s26')), -330, 6, { size: 50, maxCh: 40 }); fieldCol = SUN; }
  if (fk > 0) s += `<g transform="translate(960 760) scale(${fk})"><rect x="-380" y="-60" width="760" height="120" rx="24" fill="#0d1b2a" stroke="${fieldCol}" stroke-width="5"/>${field}
    ${text(t < S('s25') ? 'MENTAL PASSWORD' : 'TOM’S PASSWORD', -360, -94, { size: 28, font: 'JetBrains Mono', weight: 800, anchor: 'start', fill: fieldCol, ls: 3 })}</g>`;
  s += tag('STANFORD · 2025', 60, 70, inOut(t, S('s24') + .1, S('s24') + .5, E('s24') + .2, S('s25') + .3));
  // Tom
  const tk = prog(t, S('s25'), S('s25') + .5);
  if (tk > 0) {
    const think = t > S('s26');
    s += `<g opacity="${tk}">${person({ x: 330, neck: 520, s: 1.0, legs: 'stand', foot: 1020, ...TOM, hat: chipAt(1), t,
      look: [12, -6], mouth: think ? (t > E('s26') ? 'grin' : 'flat') : 'smile', brows: think ? 'worried' : 'neutral', blink: blinkAt(t, 2),
      sweat: think && t < E('s26') + 1 ? (t - S('s26')) % 1 : 0 })}</g>`;
  }
  // Kalender "MONDAY"
  const mk = back(prog(t, E('s26') + .1, E('s26') + .5));
  if (mk > 0) s += `<g transform="translate(1600 520) rotate(6) scale(${mk})"><rect x="-120" y="-130" width="240" height="260" rx="20" fill="#f4efe6"/><rect x="-120" y="-130" width="240" height="70" rx="20" fill="${CORAL}"/><rect x="-120" y="-80" width="240" height="20" fill="${CORAL}"/>
    ${text('MON', 0, -94, { size: 40, fill: '#fff' })}${text('😬', 0, 40, { size: 110 })}</g>`;
  return s;
}

// ======================= SCHLUSS =======================
function sceneOutro(t) {
  let s = bgGrad('ot', '#06121c', '#10283a') + grid(.035);
  const toNext = ease(prog(t, S('s28') - .3, S('s28') + .4));
  const pk = back(prog(t, S('s27'), S('s27') + .5)) * (1 - toNext);
  if (pk > 0) {
    s += `<g transform="translate(700 560) rotate(-3) scale(${pk})"><rect x="-330" y="-430" width="660" height="860" rx="10" fill="#f4efe6"/>
      ${text('PATENT FUTURE', 0, -370, { size: 46, fill: INK, ls: 4 })}${text('FILE 002 · THE MIND READER', 0, -320, { size: 28, font: 'JetBrains Mono', weight: 800, fill: '#555' })}
      <line x1="-280" y1="-290" x2="280" y2="-290" stroke="#999" stroke-width="3"/>
      <g opacity=".85" transform="translate(0 -10)">${brainShape(0, 0, .8, '#f2a6b8', '#c97a8e')}<g transform="translate(110 -60)"><rect x="-26" y="-26" width="52" height="52" rx="10" fill="#1c2b3c" stroke="${MINT}" stroke-width="5"/><circle r="8" fill="${MINT}"/></g></g>
      ${Array.from({ length: 4 }, (_, i) => `<rect x="-280" y="${280 + i * 34}" width="${560 - (i % 2) * 140}" height="12" rx="6" fill="#c9c2b6"/>`).join('')}</g>`;
    s += `<g opacity="${1 - toNext}">${stamp('PENDING', 760, 640, prog(t, F('s27', .2), F('s27', .28)), CORAL, -14, 96)}</g>`;
  }
  s += `<g opacity="${1 - toNext}">${headline(['WOULD YOU', 'GET THE CHIP?'], 1420, 420, t, F('s27', .45), E('s27') + 5, { size: 80 })}</g>`;
  const ck = back(prog(t, F('s27', .74), F('s27', .82))) * (1 - toNext);
  if (ck > 0) s += `<g transform="translate(1420 700) scale(${ck})"><rect x="-260" y="-60" width="520" height="120" rx="60" fill="#fff"/><path d="M-190 50 L-210 100 L-150 56 Z" fill="#fff"/>${text('Tell us in the comments', 0, 2, { size: 38, fill: INK })}</g>`;
  if (toNext > 0) {
    const k2 = back(prog(t, S('s28'), S('s28') + .6));
    const glow = .6 + .4 * Math.sin(t * 4);
    // Teströhrchen + Kalenderblatt mit "?"
    s += `<g transform="translate(600 540) scale(${k2})"><circle r="300" fill="${CORAL}" opacity="${glow * .1}" filter="url(#glow)"/>
      <g transform="translate(120 20) rotate(8)"><rect x="-150" y="-180" width="300" height="340" rx="24" fill="#f4efe6"/><rect x="-150" y="-180" width="300" height="80" rx="24" fill="${CORAL}"/><rect x="-150" y="-120" width="300" height="20" fill="${CORAL}"/>
        ${text('??.??.????', 0, 40, { size: 52, font: 'JetBrains Mono', weight: 800, fill: INK })}</g>
      <g transform="translate(-150 0) rotate(-16)"><rect x="-40" y="-200" width="80" height="360" rx="40" fill="#e6f2f8" opacity=".9"/><rect x="-40" y="10" width="80" height="150" rx="40" fill="#d9472b"/><rect x="-52" y="-212" width="104" height="30" rx="10" fill="#cfd8e0"/></g></g>`;
    s += headline(['NEXT TIME:', 'A TEST THAT TELLS YOU', 'THE DAY YOU WILL DIE'], 1360, 300, t, S('s28') + .1, E('s28') + 5, { size: 60, hl: 2 });
    const sb = back(prog(t, F('s28', .62), F('s28', .72)));
    const click = pulse(t, F('s28', .85), .4);
    if (sb > 0) s += `<g transform="translate(1360 720) scale(${sb * (1 - click * .08)})"><rect x="-250" y="-60" width="500" height="120" rx="60" fill="${click > 0 || t > F('s28', .9) ? '#555' : CORAL}"/>${text(t > F('s28', .9) ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 3, { size: 48, fill: '#fff' })}</g>
      <g transform="translate(${lerp(1700, 1420, ease(prog(t, F('s28', .7), F('s28', .84))))} ${lerp(950, 760, ease(prog(t, F('s28', .7), F('s28', .84))))})"><path d="M0 0 L0 60 L16 46 L28 72 L40 66 L28 42 L48 42 Z" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`;
  }
  return s;
}

// ======================= ABLAUF =======================
const SCENES = [
  ['s01', 's02', sceneMeeting], ['s03', 's03', sceneFired], ['s04', 's04', sceneHook], ['s05', 's05', sceneTitle],
  ['s06', 's08', sceneCasey], ['s09', 's09', sceneNeuralink], ['s10', 's13', sceneInner], ['s14', 's14', sceneScanner],
  ['s15', 's16', sceneGist], ['s17', 's19', sceneInterview], ['s20', 's20', sceneLaw], ['s21', 's21', sceneVerdict],
  ['s22', 's22', sceneFuture], ['s23', 's26', scenePayoff], ['s27', 's28', sceneOutro],
];
let CUTS = [];
function buildCuts() {
  CUTS = SCENES.map(([a, b, fn], i) => {
    const start = i === 0 ? 0 : (E(SCENES[i - 1][1]) + S(a)) / 2;
    const end = i === SCENES.length - 1 ? TL.duration : (E(b) + S(SCENES[i + 1][0])) / 2;
    return { start, end, fn };
  });
}

// Schloss (roter Faden) – Bildschirmkoordinaten
function lockCard(t) {
  const born = F('s04', .5), park = F('s04', .97), back0 = S('s23'), gone = E('s26') + 1.4;
  if (t < born || t > gone) return '';
  let x, y, sc;
  if (t < park) { const k = ease(prog(t, born + .9, park)); x = lerp(1240, 1800, k); y = lerp(560, 110, k); sc = lerp(1.6, .45, k) * back(prog(t, born, born + .4)); }
  else if (t < back0) { const pul = pulse(t, F('s13', .6), .8) + pulse(t, F('s13', .9), .6); x = 1800; y = 110; sc = .45 * (1 + .25 * pul + .05 * pulse((t - park) % 9, 0, .6)); }
  else { const k = ease(prog(t, back0, back0 + 1)); x = lerp(1800, 960, k); y = lerp(110, 400, k); sc = lerp(.45, 1.5, k); }
  const open = Math.max(inOut(t, E('s24') - .2, E('s24') + .1, S('s25') + .1, S('s25') + .3), prog(t, E('s26') - .2, E('s26') + .1));
  const fade = 1 - prog(t, gone - .5, gone);
  const spark = open > 0 ? Array.from({ length: 8 }, (_, i) => { const a = i / 8 * 6.28, r = 150 + open * 60; return `<circle cx="${Math.cos(a) * r}" cy="${Math.sin(a) * r - 20}" r="${8 * open}" fill="${SUN}" opacity="${open * (1 - prog(t, E('s26') + .3, E('s26') + 1)) }"/>`; }).join('') : '';
  return `<g transform="translate(${x} ${y}) scale(${sc})" opacity="${fade}">${lockIcon(open, t)}${spark}</g>`;
}
function chapterBanner(t) {
  let s = '';
  const ids = Object.keys(TL.chapters);
  ids.forEach((id, i) => {
    if (id === 's01') return;
    const a = S(id) + .2, k = inOut(t, a, a + .4, a + 2.6, a + 3);
    if (k <= 0) return;
    s += `<g transform="translate(${-560 * (1 - k)} 0)" opacity="${k}"><rect x="0" y="930" width="${TL.chapters[id].length * 30 + 120}" height="96" fill="#08121b" opacity=".85"/>
      <rect x="0" y="930" width="10" height="96" fill="${MINT}"/>
      ${text('CHAPTER ' + i, 40, 955, { size: 22, font: 'JetBrains Mono', weight: 800, anchor: 'start', fill: MINT, ls: 3 })}
      ${text(TL.chapters[id].toUpperCase(), 40, 995, { size: 40, anchor: 'start', fill: '#fff' })}</g>`;
  });
  return s;
}

// Soundeffekte (werden von render.js ausgelesen)
function sfxList() {
  const L = [];
  CUTS.forEach((c, i) => { if (i > 0) L.push([c.start - .15, 'whoosh']); });
  Object.keys(TL.chapters).forEach(id => { if (id !== 's01') L.push([S(id) + .2, 'swish']); });
  L.push([F('s01', .16), 'pop'], [F('s01', .3), 'blip']);
  L.push([S('s02') + .1, 'typing'], [E('s02') + .05, 'scratch']);
  L.push([S('s03') - .2, 'door']);
  L.push([F('s04', .5), 'lock'], [F('s04', .95), 'swish']);
  L.push([S('s05') + .1, 'boom'], [F('s05', .64), 'glitch']);
  L.push([F('s06', .34), 'warn'], [F('s06', .72), 'pop'], [F('s06', .77), 'pop'], [F('s06', .82), 'pop'], [F('s06', .87), 'pop']);
  L.push([S('s07') + .1, 'count'], [F('s07', .5), 'typing'], [F('s07', .78), 'chime_low']);
  L.push([S('s08') + .2, 'count'], [F('s08', .3), 'tick2']);
  L.push([S('s09') + .1, 'power'], [F('s09', .5), 'chess'], [F('s09', .555), 'chess'], [F('s09', .82), 'count']);
  L.push([F('s10', .32), 'stamp'], [F('s10', .62), 'pop'], [F('s10', .82), 'pop']);
  L.push([F('s11', .45), 'blip']);
  L.push([F('s12', .48), 'typing'], [F('s12', .76), 'count']);
  L.push([F('s13', .18), 'warn'], [F('s13', .58), 'lock']);
  L.push([F('s14', .27), 'scan'], [F('s14', .62), 'tick']);
  L.push([S('s15') + .1, 'pop'], [F('s15', .3), 'pop'], [F('s15', .82), 'stamp']);
  L.push([F('s16', .3), 'glitch'], [F('s16', .78), 'pop'], [F('s16', .9), 'pop'], [F('s16', .58), 'glitch']);
  L.push([F('s17', .58), 'pop'], [S('s18') + .05, 'typing'], [E('s18') + .05, 'scratch']);
  L.push([F('s20', .22), 'chime_low'], [F('s20', .3), 'pop'], [F('s20', .4), 'stamp'], [F('s20', .57), 'pop'], [F('s20', .72), 'pop']);
  L.push([S('s21'), 'stamp'], [F('s21', .24), 'stamp'], [F('s21', .55), 'stamp'], [F('s21', .78), 'stamp']);
  L.push([F('s22', .15), 'pop'], [F('s22', .38), 'pop'], [F('s22', .57), 'chime_low'], [F('s22', .88), 'blip']);
  L.push([S('s23') + .1, 'swish'], [F('s23', .75), 'chime_low']);
  L.push([F('s24', .52), 'pop'], [F('s24', .8), 'typing'], [E('s24') - .2, 'unlock'], [S('s25') + .15, 'lock']);
  L.push([S('s26') + .05, 'typing'], [E('s26') - .2, 'unlock'], [E('s26') + .15, 'pop']);
  L.push([F('s27', .2), 'stamp'], [F('s28', .85), 'click']);
  return L;
}

function render(t) {
  const cut = CUTS.find(c => t >= c.start && t < c.end) || CUTS[CUTS.length - 1];
  let dip = 0;
  CUTS.forEach((c, i) => { if (i > 0) dip = Math.max(dip, 1 - Math.abs(t - c.start) / .16); });
  const fadeIn = 1 - prog(t, 0, .8), fadeOut = prog(t, TL.duration - 1, TL.duration);
  document.getElementById('stage').innerHTML = `
  <defs>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="glow" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="glowS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
  </defs>
  ${cut.fn(t)}
  ${motes(t, '#e6f6ff', 24)}
  ${chapterBanner(t)}
  ${lockCard(t)}
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect width="${W}" height="${H}" fill="#000" opacity="${Math.max(dip * .85, fadeIn, fadeOut)}"/>`;
}

function init(tl) { setTimeline(tl); buildCuts(); window.SFX = sfxList(); window.DURATION = TL.duration; }
