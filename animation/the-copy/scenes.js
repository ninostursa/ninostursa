/* Szenen für "Patent Future – File 001: The Copy". Jede Szene: fn(t) → SVG-String (Weltkoordinaten 1920x1080). */

const cam = (sc, fx, fy) => `translate(960 540) scale(${sc}) translate(${-fx} ${-fy})`;
const camLerp = (k, a, b) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

// ======================= ESSZIMMER =======================
const TY = 700, FLOOR = 990, SEATY = 780;   // Tischkante, Boden, Sitzhöhe                      // Tischkante
const SEAT = { mom: 430, lily: 800, ben: 1150, bot: 1500 };
const eat = (t, ph) => { const c = ((t + ph) % 2.6) / 2.6; return c < .5 ? ease(c * 2) : ease((1 - c) * 2); };

function room(t, dayK = 0) {
  let s = `<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c1f33"/><stop offset=".65" stop-color="#5a3446"/><stop offset="1" stop-color="#6e3d4a"/></linearGradient>
  <rect x="-400" y="-400" width="${W + 800}" height="${FLOOR + 400}" fill="url(#wall)"/>`;
  for (let i = -4; i < 24; i++) s += `<rect x="${i * 100}" y="-400" width="34" height="${FLOOR + 400}" fill="#fff" opacity=".022"/>`;
  const top = mix('#101a3d', '#6fc3ff', dayK), bot = mix('#2a2d5e', '#ffd6a0', dayK);
  s += `<linearGradient id="win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>
  <rect x="80" y="120" width="300" height="360" rx="16" fill="#1c1420"/><rect x="96" y="136" width="268" height="328" rx="8" fill="url(#win)"/>`;
  const R = rng(11);
  for (let i = 0; i < 26; i++) { const sx = 100 + R() * 260, sy = 140 + R() * 300, ph = R() * 6; s += `<circle cx="${sx}" cy="${sy}" r="${1 + R() * 2}" fill="#fff" opacity="${(1 - dayK) * (.4 + .5 * Math.sin(t * 2 + ph) ** 2)}"/>`; }
  s += `<circle cx="300" cy="200" r="30" fill="${dayK > .5 ? '#fff4c2' : '#f2f0e6'}"/>
  <rect x="225" y="136" width="10" height="328" fill="#1c1420"/><rect x="96" y="295" width="268" height="10" fill="#1c1420"/>`;
  return s;
}
function lamp(t) {
  return `<line x1="960" y1="-400" x2="960" y2="215" stroke="#1a1018" stroke-width="6"/>
    <polygon points="260,${TY + 6} 1660,${TY + 6} 1040,300 880,300" fill="#ffe2b0" opacity=".16"/>
    <ellipse cx="960" cy="${TY - 200}" rx="900" ry="440" fill="url(#lampGlow)" opacity=".7"/>
    <path d="M880 215 L1040 215 L1100 305 L820 305 Z" fill="${CORAL}"/><path d="M990 215 L1040 215 L1100 305 L1030 305 Z" fill="#e0603f"/>
    <ellipse cx="960" cy="308" rx="52" ry="14" fill="#fff6d8"/>`;
}
// Bilderrahmen; Nr. 0 = Papa (Gold), weitere erscheinen im Zeitraffer
const FRAMES = [[1700, 190, 'dad'], [1830, 260, 'a'], [1610, 300, 'b'], [1280, 170, 'mom'], [1420, 210, 'c'], [1880, 110, 'd']];
function frames(n, hl = 0) {
  let s = '';
  FRAMES.forEach(([fx, fy, who], i) => {
    const k = clamp(n - i); if (k <= 0) return;
    const gold = who === 'dad' || who === 'mom';
    s += `<g transform="translate(${fx} ${fy}) scale(${back(k)})">
      ${i === 0 && hl > 0 ? `<rect x="-90" y="-104" width="180" height="208" rx="20" fill="${SUN}" opacity="${hl * .5}" filter="url(#glow)"/>` : ''}
      <rect x="-66" y="-80" width="132" height="160" rx="8" fill="${gold ? '#d9a84e' : '#3a2433'}"/>
      <rect x="-54" y="-68" width="108" height="136" rx="4" fill="${gold ? '#f6e6c4' : '#e8cdb4'}"/>
      <clipPath id="fc${i}"><rect x="-54" y="-68" width="108" height="136" rx="4"/></clipPath>
      <g clip-path="url(#fc${i})"><g transform="translate(0 -10) scale(.5)">${miniFace(who)}</g></g>
      ${gold ? `<path d="M30 -80 L66 -80 L66 -44 Z" fill="#1a1018"/>` : ''}</g>`;
  });
  return s;
}
function miniFace(who) {
  const cfg = { dad: ['dad', '#3b2a24', '#f2c6a0', CORAL], mom: ['mom', '#8a5a3c', '#f6d1b0', '#3fae7a'], a: ['short', '#222', '#c98d64', '#4cc9f0'], b: ['long', '#e0b050', '#f6d1b0', '#b07cff'], c: ['ben', '#5a3a2a', '#e8b48c', SUN], d: ['pony', '#222', '#8d5a3c', CORAL] }[who] || ['short', '#333', '#f2c6a0', '#888'];
  return person({ x: 0, neck: 76, hair: cfg[0], hairCol: cfg[1], skin: cfg[2], shirt: cfg[3], beard: who === 'dad', mouth: 'smile' });
}
function plant(k) {
  const sc = lerp(.9, 2.0, k); let l = '';
  for (let i = 0; i < 7; i++) l += `<g transform="rotate(${-90 + (i - 3) * 24})"><ellipse cx="${55 + (i % 3) * 18}" cy="0" rx="${55 + (i % 3) * 18}" ry="20" fill="${i % 2 ? '#3fae7a' : '#2e8c62'}"/></g>`;
  return `<g transform="translate(1860 ${FLOOR - 86}) scale(${sc})">${l}<path d="M-42 0 L42 0 L32 86 L-32 86 Z" fill="#c8643f"/></g>`;
}
function table() {
  return `<rect x="220" y="${TY + 60}" width="34" height="${FLOOR - TY - 60}" fill="#5a3a2e"/><rect x="1706" y="${TY + 60}" width="34" height="${FLOOR - TY - 60}" fill="#5a3a2e"/>
    <rect x="150" y="${TY}" width="1660" height="28" rx="10" fill="#f9f3ea"/>
    <rect x="164" y="${TY + 24}" width="1632" height="40" fill="#efe5d6"/>
    <rect x="164" y="${TY + 24}" width="1632" height="10" fill="#000" opacity=".08"/>
    <rect x="164" y="${TY + 56}" width="1632" height="18" fill="${CORAL}"/>
    ${Array.from({ length: 41 }, (_, i) => `<circle cx="${184 + i * 40}" cy="${TY + 74}" r="10" fill="${CORAL}"/>`).join('')}`;
}
function floorAndChairs(seats) {
  let s = `<rect x="-400" y="${FLOOR}" width="${W + 800}" height="600" fill="#3a2630"/><rect x="-400" y="${FLOOR - 14}" width="${W + 800}" height="16" fill="#2a1a22"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="-400" y="${FLOOR + 22 + i * 30}" width="${W + 800}" height="3" fill="#000" opacity=".15"/>`;
  s += `<ellipse cx="960" cy="${FLOOR + 6}" rx="900" ry="26" fill="#000" opacity=".25"/>`;
  seats.forEach(x => s += `<rect x="${x - 92}" y="${SEATY - 290}" width="184" height="300" rx="34" fill="#5a3a2e"/><rect x="${x - 76}" y="${SEATY - 274}" width="152" height="268" rx="26" fill="#6b4636"/>
    <rect x="${x - 100}" y="${SEATY + 4}" width="200" height="26" rx="10" fill="#5a3a2e"/>
    <rect x="${x - 92}" y="${SEATY + 28}" width="18" height="${FLOOR - SEATY - 30}" fill="#4a2e24"/><rect x="${x + 74}" y="${SEATY + 28}" width="18" height="${FLOOR - SEATY - 30}" fill="#4a2e24"/>`);
  return s;
}

// Familie: sitzt ruhig am Tisch, Hände liegen auf dem Tisch (keine Arm- oder Essbewegungen)
function family(t, st) {
  let s = '';
  const N = SEATY - 230;
  const rest = (x, sc) => ({ hL: [x - 58 * sc, TY - 4], hR: [x + 58 * sc, TY - 4] });
  if (st.momOp > 0) {
    s += person({ x: SEAT.mom, neck: N, hair: 'mom', hairCol: mix('#8a5a3c', '#d8d8de', st.momGrey || 0), skin: '#f6d1b0', shirt: '#3fae7a', t,
      look: st.momLook || [6, 0], mouth: st.momMouth || 'smile', brows: st.momBrows, blink: blinkAt(t, 1), op: st.momOp, age: st.momGrey,
      legs: 'sit', foot: FLOOR, pants: '#3a3550', ...rest(SEAT.mom, 1) });
  }
  if (st.lilyOp > 0) {
    const ls = st.lilyS || .8, ln = SEATY - 230 * ls;
    s += person({ x: SEAT.lily, neck: ln, s: ls, hair: st.lilyHair || 'lily', hairCol: mix('#c0642e', '#d8d8de', st.lilyGrey || 0), skin: '#f8d8bc', shirt: SUN, t,
      look: st.lilyLook || [0, 0], mouth: st.lilyMouth || 'smile', brows: st.lilyBrows, blink: blinkAt(t, 3), op: st.lilyOp, age: st.lilyGrey,
      legs: 'sit', foot: FLOOR - 30 * (1 - ls) / .2, pants: '#4a5a8a', ...rest(SEAT.lily, ls) });
  }
  if (st.benOp > 0) {
    const bn = SEATY - 230 * .95;
    s += person({ x: SEAT.ben, neck: bn, s: .95, hair: 'ben', hairCol: mix('#2a1c16', '#d8d8de', st.benGrey || 0), skin: '#e8b48c', shirt: '#4c6ef5', t,
      look: st.benLook || [-4, 0], mouth: st.benMouth || 'smile', brows: st.benBrows, blink: blinkAt(t, 5), op: st.benOp, age: st.benGrey,
      legs: 'sit', foot: FLOOR, pants: '#2d3a5a', ...rest(SEAT.ben, .95) });
  }
  (st.extra || []).forEach(e => s += e);
  return s;
}

// Roboter am Tisch inkl. Öl-Handlung. st.pour/st.drink 0..1
function botAtTable(t, st) {
  const bx = SEAT.bot, n = SEATY - 205, CAN = [1700, TY + 4], GL = [1620, TY + 2];
  let hR = [bx + 84, TY + 44], hL = [bx - 84, TY + 44], can = CAN, canTilt = 0, gp = GL, gTilt = 0, level = st.level ?? .7;
  if (st.reach > 0) {
    can = [lerp(CAN[0], 1660, st.lift || 0), lerp(CAN[1], TY - 150, st.lift || 0)];
    canTilt = -55 * (st.pour || 0);
    hR = [lerp(hR[0], can[0], st.reach), lerp(hR[1], can[1] - 40, st.reach)];
  }
  if (st.drink > 0) {
    gp = [lerp(GL[0], bx + 40, st.drink), lerp(GL[1], n - 60, st.drink)]; gTilt = -60 * st.drink;
    hR = [gp[0] + 12, gp[1] - 40];
  }
  if (st.wave > 0) hL = [lerp(hL[0], bx - 120 + Math.sin(t * 11) * 22, st.wave), lerp(hL[1], n - 70, st.wave)];
  if (st.hRover) hR = st.hRover;
  let s = robot({ x: bx, neck: n, s: .92, t, legs: 'sit', foot: FLOOR, eyes: st.eyes || 'on', look: st.look || [-4, 0], blink: blinkAt(t, 6), hR, hL, steam: st.steam || 0,
    mouth: st.mouth, patch: st.patch, item: st.item, screen: st.screen });
  if ((st.pour || 0) > .3) {
    const a = (canTilt - 42) * Math.PI / 180, sx = can[0] + Math.cos(a) * 150, sy = can[1] + Math.sin(a) * 150;
    s += `<path d="M${sx} ${sy} Q ${GL[0] + 6} ${sy} ${GL[0]} ${GL[1] - 30}" stroke="#b8860b" stroke-width="${9 * st.pour}" fill="none" stroke-linecap="round"/>`;
  }
  s += oilCan(can[0], can[1], canTilt) + glass(gp[0], gp[1], level, '#b8860b', gTilt);
  return s;
}

function dinnerBase(t, o) {
  let s = room(t, o.dayK || 0) + frames(o.frames ?? 3, o.dadHl || 0) + lamp(t) + floorAndChairs([SEAT.mom, SEAT.lily, SEAT.ben, SEAT.bot]) + plant(o.plant || 0);
  s += family(t, o.fam);
  s += botAtTable(t, o.bot);
  s += plate(SEAT.mom, TY + 4, true, t, o.fam.momOp > 0 || o.platesAll ? 1 : 0);
  s += plate(SEAT.lily, TY + 4, true, t, o.fam.lilyOp > 0 ? 1 : 0);
  s += plate(SEAT.ben, TY + 4, true, t, o.fam.benOp > 0 || o.platesAll ? 1 : 0);
  s += table();
  return s;
}

// ---- Kalt-Einstieg s01–s03 ----
function sceneDinnerOpen(t) {
  const fam = { momOp: 1, lilyOp: 1, benOp: 1, eat: true };
  const bot = {};
  // "And this is Dad" → Zoom + Winken
  const hiK = inOut(t, F('s01', .45), F('s01', .52), F('s01', .7), F('s01', .76));
  if (hiK > 0) { bot.wave = hiK; bot.eyes = 'happy'; }
  // "Dad died three years ago" → Bild an der Wand
  const photoK = inOut(t, F('s01', .74), F('s01', .82), E('s01') + .2, E('s01') + .7);
  // Witz
  const joke = inOut(t, F('s02', .3), F('s02', .36), F('s02', .6), F('s02', .66));
  if (joke > 0) { bot.mouth = 'talk'; bot.look = [-8, 0]; fam.benPalm = ease(prog(t, F('s02', .45), F('s02', .52))); fam.momLook = [4, -10]; fam.momMouth = 'flat'; fam.lilyMouth = 'grin'; fam.eat = false; }
  // Öl
  const r0 = F('s02', .6);
  bot.reach = ease(prog(t, r0, r0 + .5)) * (1 - ease(prog(t, r0 + 2.1, r0 + 2.5)));
  bot.lift = ease(prog(t, r0 + .4, r0 + .8)) * (1 - ease(prog(t, r0 + 1.8, r0 + 2.2)));
  bot.pour = inOut(t, r0 + .7, r0 + 1.0, r0 + 1.5, r0 + 1.8);
  bot.level = t < r0 + .8 ? .1 : (t < r0 + 1.7 ? lerp(.1, .95, prog(t, r0 + .8, r0 + 1.7)) : .95);
  const d0 = r0 + 2.4;
  bot.drink = inOut(t, d0, d0 + .5, d0 + 1.6, d0 + 2.0);
  if (t > d0 + .5) bot.level = lerp(.95, .2, prog(t, d0 + .5, d0 + 1.6));
  if (t > d0 + .4 && t < d0 + 2.6) bot.eyes = 'happy';
  bot.steam = prog(t, d0 + 1.4, d0 + 2.8);
  if (bot.reach > 0 || bot.drink > 0) { bot.look = [8, 4]; fam.lilyLook = [12, 0]; fam.lilyMouth = 'o'; }
  // s03: Lily will fragen
  const ask = inOut(t, F('s03', .5), F('s03', .58), F('s03', .78), F('s03', .88));
  if (t > S('s03')) fam.eat = false;
  if (ask > 0) { fam.lilyHand = ask * .7; fam.lilyMouth = t < F('s03', .7) ? 'open' : 'flat'; fam.lilyLook = [10, -2]; }
  if (t > F('s03', .76)) { fam.lilyLook = [0, 8]; fam.lilyMouth = 'flat'; fam.lilyBrows = 'sad'; fam.momLook = [10, 0]; fam.momBrows = 'worried'; }
  // Kamera
  let c = [1.0, 960, 540];
  const zBot = inOut(t, F('s01', .45), F('s01', .55), F('s01', .72), F('s01', .8));
  const zPh = inOut(t, F('s01', .74), F('s01', .84), E('s01') + .3, S('s02') + .3);
  c = camLerp(ease(zBot), c, [1.45, 1500, 560]);
  c = camLerp(ease(zPh), c, [1.9, 1700, 260]);
  const zOil = inOut(t, r0 - .2, r0 + .4, d0 + 2.4, d0 + 3.2);
  c = camLerp(zOil * .6, c, [1.35, 1560, 600]);
  const zLily = ease(prog(t, F('s03', .45), E('s03')));
  c = camLerp(zLily * .7, c, [1.5, 800, 600]);
  c[0] *= 1 + .03 * Math.sin(t * .3);
  let s = `<g transform="${cam(...c)}">${dinnerBase(t, { fam, bot, dadHl: photoK })}
    ${bubble(1360, 360, "…and then the toaster said: I'm toast!", joke, { robot: true, tail: 80, size: 34, maxW: 520 })}
    ${photoK > 0 ? tag('IN LOVING MEMORY · 2077', 1585, 330, photoK, SUN) : ''}</g>`;
  s += headline(['WOULD YOU SIT', 'AT THIS TABLE?'], 960, 150, t, F('s03', .02), F('s03', .42), { size: 96 });
  return s;
}

// ---- Werbung s19r ----
function sceneDinnerAd(t) {
  const a = S('s19r'), e = E('s19r');
  const fam = { momOp: 1, lilyOp: 1, benOp: 1, eat: false, momBrows: 'angry', momMouth: 'flat', momLook: [10, 0], lilyMouth: 'o', lilyLook: [12, -2], benMouth: 'flat', benLook: [10, 0], benBrows: 'up' };
  const box = ease(prog(t, a + .1, a + .6));
  const bot = {
    eyes: 'happy', mouth: 'talk', look: [0, 0], level: .5,
    hRover: [lerp(SEAT.bot + 70, SEAT.bot + 150, box), lerp(TY - 8, 480, box)],
    item: (x, y) => box > 0 ? cereal(x + 30, y - 10, box) : '',
  };
  const c = camLerp(ease(prog(t, a, a + 1.2)), [1.0, 960, 540], [1.45, 1440, 560]);
  let s = `<g transform="${cam(...c)}">${dinnerBase(t, { fam, bot })}
    ${sparkles(1640, 390, t, box)}</g>`;
  s += tag('SPONSORED MESSAGE', 60, 60, prog(t, a + .4, a + .8), SUN);
  s += stamp('AD', 1720, 900, prog(t, F('s19r', .7), F('s19r', .8)), CORAL, 12, 90);
  return s;
}
function cereal(x, y, k) {
  return `<g transform="translate(${x} ${y}) scale(${back(k)}) rotate(-8)">
    <rect x="-70" y="-120" width="140" height="190" rx="10" fill="${CORAL}"/><rect x="-70" y="-120" width="140" height="44" rx="10" fill="${SUN}"/>
    ${text('CRUNCHY', 0, -98, { size: 24, fill: '#7a2e2e' })}${text('BITS', 0, -40, { size: 44, fill: '#fff' })}
    <circle cx="-20" cy="14" r="18" fill="${SUN}"/><circle cx="16" cy="24" r="16" fill="#f2b84b"/><circle cx="0" cy="44" r="14" fill="${SUN}"/>
    ${text('NEW!', 44, -150, { size: 30, fill: SUN })}</g>`;
}
function sparkles(x, y, t, k) {
  if (k <= 0) return '';
  let s = '';
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * 6.28 + t, r = 130 + Math.sin(t * 3 + i) * 20, sc = .5 + .5 * Math.sin(t * 6 + i * 2) ** 2;
    s += `<g transform="translate(${x + Math.cos(a) * r} ${y + Math.sin(a) * r}) scale(${sc * k})"><path d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z" fill="${SUN}"/></g>`;
  }
  return s;
}

// ---- Zeitraffer s22 ----
function sceneDinnerLapse(t) {
  const k = prog(t, F('s22', .12), F('s22', .82));
  const dayK = k > 0 && k < 1 ? Math.sin(t * 7) * .5 + .5 : 0;
  const fam = {
    eat: true,
    momOp: 1 - prog(k, .42, .5), momGrey: prog(k, .05, .38),
    lilyOp: 1, lilyS: lerp(.8, 1, ease(prog(k, .05, .4))), lilyHair: k > .3 ? 'pony' : 'lily', lilyGrey: prog(k, .72, 1) * .8,
    benOp: 1 - prog(k, .58, .66), benGrey: prog(k, .3, .55),
  };
  const kidIn = back(prog(k, .68, .78)), kid2 = back(prog(k, .74, .84));
  fam.extra = [];
  if (kidIn > 0) fam.extra.push(`<g transform="translate(${SEAT.mom} ${FLOOR}) scale(${kidIn}) translate(${-SEAT.mom} ${-FLOOR})">` +
    person({ x: SEAT.mom, neck: SEATY - 230 * .78, s: .78, legs: 'sit', foot: FLOOR - 40, pants: '#2d3a5a', hair: 'short', hairCol: '#222', skin: '#c98d64', shirt: '#4cc9f0', look: [8, 0], blink: blinkAt(t, 8), mouth: 'grin', hL: [SEAT.mom - 46, TY - 4], hR: [SEAT.mom + 46, TY - 4] }) + '</g>');
  if (kid2 > 0) fam.extra.push(`<g transform="translate(${SEAT.ben} ${FLOOR}) scale(${kid2}) translate(${-SEAT.ben} ${-FLOOR})">` +
    person({ x: SEAT.ben, neck: SEATY - 230 * .76, s: .76, legs: 'sit', foot: FLOOR - 40, pants: '#3a3550', hair: 'long', hairCol: '#e0b050', skin: '#f6d1b0', shirt: '#b07cff', look: [10, -2], blink: blinkAt(t, 9), mouth: 'smile', hL: [SEAT.ben - 46, TY - 4], hR: [SEAT.ben + 46, TY - 4] }) + '</g>');
  // Roboter trinkt immer wieder
  const c = (t * 1.5) % 1, dk = k > 0 && k < 1 ? (c < .5 ? ease(c * 2) : ease((1 - c) * 2)) : 0;
  const fin = F('s22', .86);
  const bot = { drink: Math.max(dk, inOut(t, fin, fin + .4, fin + 1.2, fin + 1.6)), level: .6, eyes: (dk > .5 || (t > fin + .3 && t < fin + 1.8)) ? 'happy' : 'on', patch: clamp((k - .55) * 6), steam: prog(t, fin + 1.0, fin + 2.2) };
  const frameN = 3 + ease(prog(k, .45, .95)) * 3;
  let s = `<g transform="${cam(1.0 + .03 * k, 960, 540)}">${dinnerBase(t, { fam, bot, dayK, frames: frameN, plant: ease(k), platesAll: kidIn > 0 })}</g>`;
  // Jahreszähler
  const yk = inOut(t, S('s22') + .2, S('s22') + .7, E('s22') + .1, E('s22') + .5);
  if (yk > 0) {
    const year = Math.round(lerp(2080, 2150, ease(k)));
    s += `<g transform="translate(960 130) scale(${back(yk)})">${text(String(year), 0, 0, { size: 150, fill: MINT, glow: MINT, stroke: '#08121b' })}</g>`;
  }
  return s;
}

// ---- Auflösung s23–s25 ----
function sceneDinnerPayoff(t) {
  const fam = { momOp: 1, lilyOp: 1, benOp: 1, eat: false };
  const bot = { look: [-4, 0] };
  if (t > S('s24') - .3) { fam.lilyLook = [12, -2]; fam.momLook = [10, 0]; fam.benLook = [10, 0]; fam.lilyBrows = 'worried'; }
  if (t > S('s24') && t < E('s24')) fam.lilyMouth = 'talk';
  if (t > S('s24')) { bot.look = [-10, 2]; fam.momBrows = 'worried'; fam.benMouth = 'flat'; }
  if (t > S('s25')) {
    bot.eyes = t < F('s25', .3) ? 'think' : 'on';
    bot.mouth = (t > F('s25', 0) && t < F('s25', .18)) || (t > F('s25', .42) && t < F('s25', .85)) ? 'talk' : 'smile';
    bot.look = [-6, 0];
    if (t > F('s25', .86)) { bot.eyes = 'wink'; bot.look = [0, 0]; }
    fam.lilyMouth = t > F('s25', .85) ? 'smile' : 'flat';
  }
  fam.t = t;
  let c = [1.0, 960, 540];
  c = camLerp(ease(prog(t, S('s24') - .4, S('s24') + .6)), c, [1.55, 800, 600]);
  c = camLerp(ease(prog(t, S('s25') - .2, S('s25') + .8)), c, [1.7, 1480, 560]);
  c = camLerp(ease(prog(t, F('s25', .84), E('s25'))), c, [2.0, 1500, 520]);
  let s = `<g transform="${cam(...c)}">${dinnerBase(t, { fam, bot })}</g>`;
  s += bubble(760, 170, 'Dad? Are you still you?', inOut(t, S('s24') + .1, S('s24') + .4, E('s24') + 1.2, E('s24') + 1.5), { tail: 40, size: 44 });
  s += bubble(1240, 150, 'I think so.', inOut(t, S('s25') + .1, S('s25') + .4, F('s25', .4), F('s25', .45)), { robot: true, tail: 120, size: 40 });
  s += bubble(1240, 150, "But I would say that, wouldn't I?", inOut(t, F('s25', .44), F('s25', .5), E('s25') + .6, E('s25') + .9), { robot: true, tail: 120, size: 38, maxW: 560 });
  return s;
}

// ======================= TITEL =======================
function sceneTitle(t) {
  const a = S('s04');
  let s = bgGrad('tbg', '#06121c', '#0e2a3a') + grid(.06);
  const scan = ((t - a) * 500) % (H + 200) - 100;
  s += `<rect x="0" y="${scan}" width="${W}" height="6" fill="${MINT}" opacity=".25" filter="url(#soft)"/>`;
  s += `<g opacity="${.25 * prog(t, a, a + 1)}">${robot({ x: 1560, neck: 560, s: 1.6, t, eyes: 'on', legs: 'stand', foot: 1300 })}</g>`;
  const k1 = back(prog(t, a + .1, a + .5));
  s += `<g transform="translate(960 300) scale(${k1})" opacity="${clamp(k1)}"><rect x="-340" y="-56" width="680" height="112" rx="18" fill="none" stroke="${MINT}" stroke-width="6"/>${text('PATENT FUTURE', 0, 4, { size: 70, fill: MINT, ls: 6, glow: MINT })}</g>`;
  const k2 = prog(t, F('s04', .36), F('s04', .46));
  if (k2 > 0) { const str = 'FILE 001'.slice(0, Math.ceil(k2 * 8)); s += text(str, 960, 450, { size: 56, font: 'JetBrains Mono', weight: 800, fill: '#d9f7ee', ls: 10 }); }
  const k3 = prog(t, F('s04', .64), F('s04', .72));
  if (k3 > 0) {
    const g = 1 - prog(t, F('s04', .72), F('s04', .9));
    const jx = noise(t, 80, 1) * 14 * g, jy = noise(t, 70, 2) * 6 * g;
    s += `<g transform="translate(960 640) scale(${lerp(1.3, 1, easeOut(k3))})" opacity="${k3}">
      ${text('THE COPY', jx, jy, { size: 210, fill: CORAL, op: .7 * g })}${text('THE COPY', -jx, -jy, { size: 210, fill: MINT, op: .7 * g })}
      ${text('THE COPY', 0, 0, { size: 210, fill: '#ffffff', glow: MINT })}</g>`;
  }
  return s;
}

// ======================= ECHOS =======================
function sceneChat(t) {
  const a = S('s05');
  let s = bgGrad('cbg', '#141233', '#2a2450');
  s += `<rect x="140" y="110" width="320" height="300" rx="14" fill="#0d0b22"/><rect x="154" y="124" width="292" height="272" rx="8" fill="#1b2a5e"/><circle cx="380" cy="190" r="34" fill="#f2f0e6"/>`;
  // Uhr
  const spin = prog(t, F('s05', .84), E('s05') + .3);
  const hA = 90 + spin * 360 * 3, mA = spin * 360 * 36;
  s += `<g transform="translate(760 230)"><circle r="78" fill="#f2f0e6"/><circle r="70" fill="#fff"/>
    <line x1="0" y1="0" x2="0" y2="-40" stroke="${INK}" stroke-width="8" stroke-linecap="round" transform="rotate(${hA})"/>
    <line x1="0" y1="0" x2="0" y2="-58" stroke="${CORAL}" stroke-width="5" stroke-linecap="round" transform="rotate(${mA})"/><circle r="7" fill="${INK}"/></g>`;
  // Joshua am Schreibtisch, vom Bildschirm angeleuchtet
  s += `<ellipse cx="560" cy="560" rx="420" ry="300" fill="${MINT}" opacity=".10" filter="url(#glow)"/>`;
  const typing = (t * 3) % 1 < .5;
  s += person({ x: 560, neck: 560, s: 1.15, hair: 'short', hairCol: '#2a1c16', skin: '#f0c4a0', shirt: '#3a4256', beard: true, t,
    look: [10, 6], mouth: t > F('s05', .78) ? 'smile' : 'flat', brows: t < F('s05', .5) ? 'worried' : 'neutral', blink: blinkAt(t, 2),
    hL: [470, 850 + (typing ? -6 : 0)], hR: [650, 850 + (typing ? 0 : -6)] });
  s += `<rect x="120" y="850" width="900" height="40" rx="10" fill="#4a3a5a"/><rect x="140" y="890" width="860" height="200" fill="#2a2040"/>
    <path d="M400 850 L720 850 L760 800 L440 800 Z" fill="#c9ced6"/>`;
  // Chat-Fenster
  const pk = back(prog(t, a + .3, a + .9));
  let chat = `<rect x="-280" y="-400" width="560" height="800" rx="44" fill="#0e1424"/><rect x="-262" y="-382" width="524" height="764" rx="30" fill="#162033"/>
    <circle cx="-200" cy="-330" r="30" fill="${CORAL}"/>${text('J', -200, -328, { size: 30, fill: '#fff' })}
    ${text('Jessica · simulation', -150, -330, { size: 28, weight: 800, anchor: 'start', fill: '#fff' })}
    <line x1="-262" y1="-284" x2="262" y2="-284" stroke="#fff" stroke-opacity=".1" stroke-width="2"/>`;
  const msgs = [[.3, 0, 2], [.4, 1, 1], [.52, 0, 3], [.62, 1, 2], [.72, 0, 2], [.8, 1, 1], [.88, 0, 3], [.95, 1, 2]];
  let y = -250, msgSvg = '';
  const shown = msgs.filter(m => t > F('s05', m[0]));
  const scroll = Math.max(0, shown.reduce((acc, m) => acc + m[2] * 34 + 46, 0) - 560);
  msgs.forEach(([f, me, lines]) => {
    const k = prog(t, F('s05', f), F('s05', f) + .25);
    const h = lines * 34 + 26;
    if (k > 0) {
      const w = 300 + (lines === 1 ? -80 : 40), bx = me ? 240 - w : -240;
      msgSvg += `<g transform="translate(0 ${-scroll}) translate(${bx + w / 2} ${y + h / 2}) scale(${back(k)}) translate(${-(bx + w / 2)} ${-(y + h / 2)})" opacity="${clamp(k * 2)}">
        <rect x="${bx}" y="${y}" width="${w}" height="${h}" rx="22" fill="${me ? CORAL : '#2c3e57'}"/>
        ${Array.from({ length: lines }, (_, i) => `<rect x="${bx + 22}" y="${y + 20 + i * 34}" width="${(w - 44) * (i === lines - 1 ? .6 : 1)}" height="14" rx="7" fill="#fff" opacity=".55"/>`).join('')}</g>`;
    }
    y += h + 20;
  });
  s += `<g transform="translate(1400 560) scale(${pk})">${chat}<clipPath id="chatclip"><rect x="-262" y="-280" width="524" height="660"/></clipPath><g clip-path="url(#chatclip)">${msgSvg}</g></g>`;
  s += tag('CANADA', 60, 1000, prog(t, F('s05', .2), F('s05', .26)));
  s += tag('8 YEARS AFTER SHE DIED', 250, 1000, prog(t, F('s05', .6), F('s05', .66)), SUN);
  return s;
}

function sceneFuneral(t) {
  let s = bgGrad('fbg', '#2a2238', '#4a3a4e');
  for (let i = 0; i < 5; i++) s += `<rect x="${200 + i * 360}" y="80" width="140" height="520" rx="70" fill="#fff" opacity=".04"/>`;
  // Blumen + Kerzen
  const flower = (x, y, sc) => { let f = `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M0 0 L-30 120 L30 120 Z" fill="#3a5a40"/>`; for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28; f += `<ellipse cx="${Math.cos(a) * 46}" cy="${Math.sin(a) * 30 - 20}" rx="30" ry="18" fill="${i % 2 ? '#f4f1ea' : '#e9dcf0'}"/>`; } return f + `<circle cx="0" cy="-20" r="14" fill="${SUN}"/></g>`; };
  s += flower(440, 640, 1.3) + flower(1480, 640, 1.3);
  [600, 1320].forEach((x, i) => s += `<rect x="${x - 14}" y="560" width="28" height="120" rx="6" fill="#f4efe6"/><ellipse cx="${x}" cy="${545 + Math.sin(t * 9 + i) * 3}" rx="10" ry="18" fill="${SUN}"/><circle cx="${x}" cy="545" r="50" fill="${SUN}" opacity=".18" filter="url(#soft)"/>`);
  // Bildschirm mit Marina
  s += `<rect x="930" y="660" width="60" height="200" fill="#1a1622"/><rect x="820" y="850" width="280" height="24" rx="10" fill="#1a1622"/>
    <rect x="640" y="150" width="640" height="420" rx="24" fill="#111"/><rect x="660" y="170" width="600" height="380" rx="12" fill="#e9dccf"/>
    <clipPath id="tv"><rect x="660" y="170" width="600" height="380" rx="12"/></clipPath>`;
  const talk = t > F('s06', .08) && t < F('s06', .95);
  s += `<g clip-path="url(#tv)">${person({ x: 960, neck: 430, s: 1.25, hair: 'old', hairCol: '#e8e8ee', skin: '#f2cdb0', shirt: '#9c7cc2', glasses: true, age: .9, t, mouth: talk ? 'talk' : 'smile', blink: blinkAt(t, 4) })}</g>
    <rect x="660" y="170" width="600" height="380" rx="12" fill="url(#tvShine)" opacity=".3"/>`;
  // Trauergäste (von hinten)
  const R = rng(5);
  for (let row = 0; row < 2; row++) for (let i = 0; i < 9; i++) {
    const x = 120 + i * 215 + row * 100 + R() * 30, y = 930 + row * 110, sc = 1 + row * .15;
    const hand = row === 0 && i === 6 ? inOut(t, F('s06', .2), F('s06', .3), F('s06', .55), F('s06', .65)) : 0;
    s += `<g transform="translate(${x} ${y}) scale(${sc})">
      ${hand > 0 ? `<path d="M46 -10 L${46 + 20 * hand} ${-10 - 150 * hand}" stroke="#241c2c" stroke-width="26" stroke-linecap="round"/><circle cx="${46 + 20 * hand}" cy="${-10 - 150 * hand}" r="16" fill="#e8b48c"/>` : ''}
      <path d="M-80 120 C -80 20, 80 20, 80 120 Z" fill="${row ? '#1a1420' : '#241c2c'}"/><ellipse cx="0" cy="-30" rx="46" ry="54" fill="${['#2a1c16', '#5a3a2a', '#3a3038', '#111'][i % 4]}"/></g>`;
  }
  s += tag('ENGLAND · 2022', 60, 70, prog(t, F('s06', .05), F('s06', .12)));
  s += tag('MARINA SMITH · 87', 60, 140, prog(t, F('s06', .15), F('s06', .22)), SUN);
  return s;
}

function sceneVR(t) {
  let s = bgGrad('vbg', '#0b0a1e', '#1e1446');
  for (let i = 0; i < 18; i++) { const x = (i - 9) * 160; s += `<line x1="${960 + x * .3}" y1="640" x2="${960 + x * 2.2}" y2="${H + 50}" stroke="${MINT}" stroke-opacity=".15" stroke-width="2"/>`; }
  for (let j = 0; j < 7; j++) { const y = 640 + Math.pow(j / 6, 1.8) * 460; s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${MINT}" stroke-opacity="${.05 + j * .02}" stroke-width="2"/>`; }
  const reach = ease(prog(t, F('s07', .25), F('s07', .85)));
  const headset = (x, hy, sc) => `<rect x="${x - 64 * sc}" y="${hy - 26 * sc}" width="${128 * sc}" height="${52 * sc}" rx="${18 * sc}" fill="#1c1f2e"/><rect x="${x - 56 * sc}" y="${hy - 8 * sc}" width="${112 * sc}" height="8" rx="4" fill="${MINT}" opacity="${.6 + .4 * Math.sin(t * 5)}"/><rect x="${x - 70 * sc}" y="${hy - 8 * sc}" width="${140 * sc}" height="${12 * sc}" fill="#1c1f2e"/>`;
  s += person({ x: 640, neck: 380, s: 1.25, legs: 'stand', foot: 1000, hair: 'long', hairCol: '#141018', skin: '#f2cfae', shirt: '#7b6cff', pants: '#2b2b4a', t,
    mouth: t > F('s07', .6) ? 'smile' : 'o', hL: [560, 640], hR: [lerp(740, 900, reach), lerp(640, 560, reach)], hat: (x, hy, sc) => headset(x, hy - 2 * sc, sc) });
  // Mädchen aus Licht
  const gk = prog(t, F('s07', .12), F('s07', .35));
  s += `<g opacity="${gk * (.7 + .15 * Math.sin(t * 4))}" filter="url(#glowS)">${person({ x: 1260, neck: 600, s: .8, legs: 'stand', foot: 1000, hair: 'lily', hairCol: '#9ff7e0', skin: '#c9fff0', shirt: '#5ef2c8', pants: '#3fd6b0', blush: false, t,
    look: [-10, -4], mouth: 'smile', blink: blinkAt(t, 7), hL: [lerp(1200, 1080, reach), lerp(760, 640, reach)], hR: [1310, 760] })}</g>`;
  const R = rng(21);
  for (let i = 0; i < 30; i++) { const a = R() * 6.28, r = 80 + R() * 220, ph = R() * 6; s += `<circle cx="${1260 + Math.cos(a + t * .3) * r}" cy="${700 + Math.sin(a + t * .3) * r * .9 - ((t * 30 + ph * 40) % 120)}" r="${2 + R() * 4}" fill="${MINT}" opacity="${gk * .6}"/>`; }
  const touch = pulse(t, F('s07', .82), 1.2);
  if (touch > 0) s += `<circle cx="990" cy="600" r="${40 + touch * 60}" fill="#fff" opacity="${touch * .5}" filter="url(#soft)"/>`;
  s += tag('SOUTH KOREA · TV DOCUMENTARY', 60, 70, prog(t, F('s07', .05), F('s07', .12)));
  s += tag('VIRTUAL REALITY', 60, 140, prog(t, F('s07', .42), F('s07', .48)), SUN);
  return s;
}

function sceneEchoBrain(t) {
  let s = bgGrad('ebg', '#06121c', '#10283a') + grid(.04);
  const out = ease(prog(t, F('s08', .62), F('s08', .7)));
  const icons = [
    (x, y) => `<rect x="${x - 60}" y="${y - 90}" width="120" height="180" rx="20" fill="#162033" stroke="${MINT}" stroke-width="4"/><rect x="${x - 40}" y="${y - 50}" width="60" height="22" rx="11" fill="#2c3e57"/><rect x="${x - 20}" y="${y - 10}" width="60" height="22" rx="11" fill="${CORAL}"/><rect x="${x - 40}" y="${y + 30}" width="50" height="22" rx="11" fill="#2c3e57"/>`,
    (x, y) => `<rect x="${x - 100}" y="${y - 70}" width="200" height="130" rx="14" fill="#111" stroke="${MINT}" stroke-width="4"/><circle cx="${x}" cy="${y - 14}" r="28" fill="#f2cdb0"/><path d="M${x - 40} ${y + 50} C ${x - 40} ${y + 10}, ${x + 40} ${y + 10}, ${x + 40} ${y + 50} Z" fill="#9c7cc2"/><rect x="${x - 10}" y="${y + 60}" width="20" height="40" fill="#555"/>`,
    (x, y) => `<rect x="${x - 90}" y="${y - 40}" width="180" height="80" rx="30" fill="#1c1f2e" stroke="${MINT}" stroke-width="4"/><rect x="${x - 70}" y="${y - 6}" width="140" height="12" rx="6" fill="${MINT}"/>`,
  ];
  [520, 960, 1400].forEach((x, i) => {
    const k = back(prog(t, S('s08') + i * .15, S('s08') + i * .15 + .5)) * (1 - out);
    if (k <= 0) return;
    const ring = (t * .8 + i * .3) % 1;
    const grey = prog(t, F('s08', .2), F('s08', .3));
    s += `<g transform="translate(${x} ${400 - out * 200}) scale(${k})" opacity="${1 - out}">
      <circle r="${150 + ring * 80}" fill="none" stroke="${MINT}" stroke-width="4" opacity="${(1 - ring) * .5 * grey}"/>
      <circle r="150" fill="#10283a" stroke="${MINT}" stroke-opacity=".4" stroke-width="4"/>${icons[i](0, 0)}
      ${text('ECHO', 0, 210, { size: 44, font: 'JetBrains Mono', weight: 800, fill: MINT, op: grey })}</g>`;
  });
  const cmp = inOut(t, F('s08', .3), F('s08', .36), F('s08', .58), F('s08', .64));
  if (cmp > 0) {
    s += `<g opacity="${cmp}">${text('WHAT A PERSON SAID', 560, 800, { size: 52, fill: '#fff' })}${text('✓', 560, 880, { size: 80, fill: MINT })}
      ${text('HOW A PERSON THINKS', 1360, 800, { size: 52, fill: '#fff' })}${text('✗', 1360, 880, { size: 80, fill: CORAL })}</g>`;
  }
  const ol = prog(t, F('s08', .64), F('s08', .84));
  if (ol > 0 && t < F('s08', .86)) {
    s += `<g opacity="${.7 * clamp(ol * 3)}" transform="translate(960 540) rotate(${t * 8}) translate(-960 -540)"><circle cx="960" cy="540" r="330" fill="none" stroke="${MINT}" stroke-width="5" stroke-dasharray="18 22"/></g>`;
    s += brainShape(960, 540, 1.5, 'none', MINT, .25 + .3 * ol);
    s += text('MUCH MORE…', 960, 960, { size: 56, font: 'JetBrains Mono', weight: 800, fill: MINT, op: clamp(ol * 3) });
  }
  const bk = back(prog(t, F('s08', .84), F('s08', .92)));
  if (bk > 0) {
    const p = 1 + .04 * Math.sin(t * 6);
    s += `<circle cx="960" cy="540" r="${380 * bk}" fill="${MINT}" opacity=".12" filter="url(#glow)"/>`;
    for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28 + t * .2; s += `<line x1="${960 + Math.cos(a) * 300 * bk}" y1="${540 + Math.sin(a) * 300 * bk}" x2="${960 + Math.cos(a) * 470 * bk}" y2="${540 + Math.sin(a) * 470 * bk}" stroke="${MINT}" stroke-width="6" opacity=".35" stroke-linecap="round"/>`; }
    s += brainShape(960, 540, 1.5 * bk * p, '#ff9eb5', '#d9607e');
  }
  return s;
}

// ======================= GEHIRN-KARTE =======================
const NET = (() => {
  const R = rng(99), nodes = [];
  for (let i = 0; i < 240; i++) { const a = R() * 6.28, r = Math.sqrt(R()); nodes.push([Math.cos(a) * r * 330, Math.sin(a) * r * 250, R()]); }
  const edges = [];
  nodes.forEach((p, i) => { for (let j = i + 1; j < nodes.length; j++) { const q = nodes[j]; const d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < 70) edges.push([i, j, R()]); } });
  return { nodes, edges };
})();
function fly(x, y, s, t) {
  const wing = 1 + Math.sin(t * 60) * .12;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="-60" cy="-70" rx="130" ry="${55 * wing}" fill="#dff6ff" opacity=".55" transform="rotate(-25 -60 -70)"/>
    <ellipse cx="60" cy="-70" rx="130" ry="${55 * wing}" fill="#dff6ff" opacity=".55" transform="rotate(25 60 -70)"/>
    ${[-1, 1].map(sd => [0, 1, 2].map(i => `<path d="M${sd * 30} ${10 + i * 30} q ${sd * 60} 10 ${sd * 90} 70" stroke="#5a3a1a" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('')).join('')}
    <ellipse cx="0" cy="70" rx="56" ry="110" fill="#c8913a"/>${[0, 1, 2].map(i => `<rect x="-52" y="${60 + i * 36}" width="104" height="14" rx="7" fill="#7a4e1e"/>`).join('')}
    <ellipse cx="0" cy="-20" rx="62" ry="58" fill="#b07a2e"/>
    <circle cx="0" cy="-100" r="62" fill="#c8913a"/>
    <ellipse cx="-42" cy="-108" rx="34" ry="40" fill="#d9302b"/><ellipse cx="42" cy="-108" rx="34" ry="40" fill="#d9302b"/>
    <circle cx="-50" cy="-120" r="9" fill="#fff" opacity=".7"/><circle cx="34" cy="-120" r="9" fill="#fff" opacity=".7"/></g>`;
}
function network(cx, cy, k, t, col = MINT) {
  let s = '';
  NET.edges.forEach(([i, j, r]) => { if (r < k) { const p = NET.nodes[i], q = NET.nodes[j]; s += `<line x1="${cx + p[0]}" y1="${cy + p[1]}" x2="${cx + q[0]}" y2="${cy + q[1]}" stroke="${col}" stroke-width="2" opacity=".45"/>`; } });
  NET.nodes.forEach(([x, y, r]) => { if (r < k * 1.3) s += `<circle cx="${cx + x}" cy="${cy + y}" r="${3 + (r > .9 ? 3 : 0)}" fill="${col}" opacity="${.5 + .5 * Math.sin(t * 3 + r * 20) ** 2}"/>`; });
  return s;
}
function sceneFly(t) {
  let s = bgGrad('flbg', '#06121c', '#0e2a3a') + grid(.035);
  const fk = back(prog(t, S('s09'), S('s09') + .6));
  s += fly(400, 560, .95 * fk, t);
  const zk = ease(prog(t, F('s09', .2), F('s09', .3)));
  if (zk > 0) {
    s += `<path d="M430 470 L${lerp(430, 900, zk)} ${lerp(470, 180, zk)} M430 470 L${lerp(430, 900, zk)} ${lerp(470, 760, zk)}" stroke="${MINT}" stroke-width="3" stroke-dasharray="10 10" opacity=".5"/>
      <circle cx="430" cy="470" r="60" fill="none" stroke="${MINT}" stroke-width="5"/>`;
    s += `<g opacity="${zk}"><ellipse cx="1260" cy="460" rx="400" ry="310" fill="#0b1f2c" stroke="${MINT}" stroke-opacity=".5" stroke-width="4"/>${network(1260, 460, prog(t, F('s09', .25), F('s09', .8)), t)}</g>`;
  }
  const c1 = prog(t, F('s09', .38), F('s09', .55)), c2 = prog(t, F('s09', .58), F('s09', .78));
  s += counter(fmt(139255 * easeOut(c1)), 1000, 870, 'NERVE CELLS', c1 > 0 ? 1 : 0, { size: 84 });
  s += counter((54.5 * easeOut(c2)).toFixed(1) + ' MILLION', 1560, 870, 'CONNECTIONS', c2 > 0 ? 1 : 0, { size: 74 });
  s += tag('2024 · FIRST FULL MAP OF A FLY BRAIN', 60, 70, prog(t, F('s09', .04), F('s09', .12)));
  s += tag('IT TOOK YEARS', 60, 140, prog(t, F('s09', .88), F('s09', .93)), SUN);
  return s;
}
function sceneHuman(t) {
  let s = bgGrad('hbg', '#06121c', '#0e2a3a') + grid(.035);
  const head = `M1180 900 C 1180 820, 1150 780, 1120 740 C 1080 690, 1040 600, 1050 500 C 1060 330, 1200 210, 1380 210 C 1560 210, 1700 340, 1700 500 C 1700 600, 1660 660, 1640 700 L1680 780 L1640 800 L1650 860 C 1650 890, 1610 900, 1560 890 L1520 900 L1520 980 Z`;
  const hk = prog(t, S('s10'), S('s10') + .6);
  const glowK = pulse(t, F('s10', .86), 1.4);
  s += `<path d="${head}" fill="#10283a" stroke="${MINT}" stroke-width="5" opacity="${hk}"/>`;
  s += `<clipPath id="headclip"><path d="${head}"/></clipPath>`;
  const fill = prog(t, F('s10', .42), F('s10', .82));
  const R = rng(7); let dots = '';
  for (let i = 0; i < 520; i++) {
    const x = 1080 + R() * 600, y = 230 + R() * 600, d = R();
    if (d > fill) continue;
    const fall = clamp((fill - d) * 8);
    dots += `<circle cx="${x}" cy="${lerp(y - 500, y, easeOut(fall))}" r="6" fill="${MINT}" opacity="${.35 + .5 * fall}"/>`;
  }
  s += `<g clip-path="url(#headclip)">${dots}</g>`;
  if (glowK > 0) s += `<path d="${head}" fill="${MINT}" opacity="${glowK * .35}" filter="url(#glow)"/>`;
  const c = prog(t, F('s10', .02), F('s10', .35));
  s += counter(fmt(86e9 * easeOut(c)), 560, 400, 'NERVE CELLS IN YOUR BRAIN', c > 0 ? 1 : 0, { size: 110 });
  const k2 = prog(t, F('s10', .45), F('s10', .52));
  if (k2 > 0) s += `<g transform="translate(560 680) scale(${back(k2)})">${fly(-230, 0, .32, t)}${text('× 600,000+', 60, 0, { size: 90, fill: SUN, glow: SUN })}</g>`;
  s += headline(['IN ONE HEAD.'], 560, 900, t, F('s10', .86), E('s10') + 2, { size: 80, hl: 0 });
  return s;
}
function scenePiano(t) {
  let s = bgGrad('pbg', '#0f3466', '#0a2550') + grid(.12, 60, '#ffffff');
  const k = ease(prog(t, S('s11') - .2, F('s11', .45)));
  const L = 3000;
  const st = `stroke="#e8f4ff" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - k)}"`;
  s += `<g transform="translate(560 300)">
    <path d="M0 260 L0 120 C 0 40, 60 0, 160 0 L520 0 C 700 0, 820 60, 880 160 L940 260 Z" ${st}/>
    <path d="M0 260 L940 260 L940 300 L0 300 Z" ${st}/>
    <path d="M40 300 L40 480 M900 300 L900 480 M470 300 L470 470" ${st}/>
    <path d="M60 230 L880 230" ${st} stroke-dasharray="12 10"/>
    ${Array.from({ length: 20 }, (_, i) => `<line x1="${120 + i * 36}" y1="260" x2="${120 + i * 36}" y2="300" stroke="#e8f4ff" stroke-width="3" opacity="${k}"/>`).join('')}
    <path d="M0 -50 L940 -50 M0 -64 L0 -36 M940 -64 L940 -36" stroke="#9ec9ff" stroke-width="3" opacity="${k}"/>
    ${text('1.83 m', 470, -80, { size: 30, font: 'JetBrains Mono', weight: 800, fill: '#9ec9ff', op: k })}</g>`;
  s += `<rect x="1460" y="900" width="420" height="140" fill="none" stroke="#e8f4ff" stroke-width="3" opacity=".6"/>
    ${text('BLUEPRINT · PIANO', 1670, 945, { size: 28, font: 'JetBrains Mono', weight: 800, fill: '#e8f4ff', op: .8 })}${text('SHEET 1 / 1', 1670, 995, { size: 24, font: 'JetBrains Mono', weight: 700, fill: '#9ec9ff', op: .8 })}`;
  const nk = prog(t, F('s11', .55), E('s11') + .8);
  if (nk > 0) for (let i = 0; i < 5; i++) {
    const kk = clamp(nk * 1.6 - i * .15); if (kk <= 0) continue;
    s += `<g transform="translate(${900 + i * 90} ${300 - kk * 200}) " opacity="${(1 - kk) * .9}">${text(i % 2 ? '♪' : '♫', 0, 0, { size: 80, fill: '#9ec9ff' })}</g>`;
  }
  s += headline(['A MAP', 'IS NOT A MIND.'], 380, 150, t, F('s11', .02), E('s11') + 2, { size: 70 });
  if (nk > .3) s += text('?', 1500, 360, { size: 160, fill: SUN, glow: SUN, op: clamp((nk - .3) * 3) });
  return s;
}

// ======================= LABOR =======================
function sceneLab(t) {
  const MX = 620, RX = 1340, FLOOR = 980;
  const scanK = prog(t, F('s12', .3), S('s13'));
  const power = ease(prog(t, F('s13', .45), F('s13', .6)));
  const flash = t >= S('s13') ? Math.exp(-(t - S('s13')) * 5) : 0;
  const glassUp = ease(prog(t, F('s13', .65), E('s13') + .4));
  let s = `<linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1b29"/><stop offset="1" stop-color="#1b4a5c"/></linearGradient>
    <rect x="-400" y="-400" width="${W + 800}" height="${FLOOR + 400}" fill="url(#lw)"/>`;
  for (let i = 0; i < 10; i++) s += `<rect x="${60 + i * 190}" y="140" width="150" height="760" rx="20" fill="none" stroke="${MINT}" stroke-opacity=".06" stroke-width="3"/>`;
  s += `<rect x="-400" y="${FLOOR}" width="${W + 800}" height="500" fill="#081620"/><ellipse cx="${RX}" cy="${FLOOR + 6}" rx="300" ry="40" fill="${MINT}" opacity="${.1 + power * .25}" filter="url(#soft)"/>`;
  const p0 = [MX, 470], p1 = [MX - 60, 80], p2 = [RX, 0], p3 = [RX, 200];
  s += `<path d="M${p0} C ${p1} ${p2} ${p3}" stroke="#0a1620" stroke-width="26" fill="none"/><path d="M${p0} C ${p1} ${p2} ${p3}" stroke="#25506a" stroke-width="14" fill="none"/>`;
  if (scanK > 0 && scanK < 1) for (let i = 0; i < 18; i++) {
    const k = (t * .8 + i / 18) % 1, u = 1 - k;
    const px = u * u * u * p0[0] + 3 * u * u * k * p1[0] + 3 * u * k * k * p2[0] + k * k * k * p3[0];
    const py = u * u * u * p0[1] + 3 * u * u * k * p1[1] + 3 * u * k * k * p2[1] + k * k * k * p3[1];
    s += `<rect x="${px - 8}" y="${py - 8}" width="16" height="16" rx="3" fill="${i % 3 ? MINT : '#fff'}" filter="url(#glowS)" transform="rotate(${t * 200 + i * 40} ${px} ${py})"/>`;
  }
  // Kapsel + Roboter
  s += `<rect x="${RX - 170}" y="${FLOOR - 50}" width="340" height="60" rx="18" fill="#2b3a4f"/><rect x="${RX - 180}" y="160" width="360" height="66" rx="22" fill="#2b3a4f"/>`;
  const rLook = t > S('s13r') - .3 ? [-10, 0] : [0, 0];
  const wave = inOut(t, S('s13r'), S('s13r') + .3, E('s13r') + .4, E('s13r') + .8);
  s += robot({ x: RX, neck: 560, t, power, eyes: t > S('s13r') ? 'happy' : 'on', look: rLook, legs: 'stand', foot: FLOOR - 50, mouth: t > S('s13r') && t < E('s13r') ? 'talk' : 'smile',
    hR: wave > 0 ? [RX + 110 + Math.sin(t * 11) * 22, lerp(756, 420, wave)] : null });
  s += `<g transform="translate(0 ${-glassUp * 1100})"><rect x="${RX - 150}" y="226" width="300" height="${FLOOR - 276}" rx="48" fill="${MINT}" opacity=".12" stroke="${MINT}" stroke-opacity=".5" stroke-width="4"/>
    <rect x="${RX - 120}" y="270" width="22" height="600" rx="11" fill="#fff" opacity=".16"/></g>`;
  if (flash > 0) s += `<rect x="${RX - 200}" y="140" width="400" height="${FLOOR - 100}" rx="70" fill="#e9fff8" opacity="${flash * .9}" filter="url(#soft)"/>`;
  // Papa im Scanner-Stuhl
  s += `<rect x="${MX - 110}" y="450" width="220" height="300" rx="44" fill="#20465a"/><rect x="${MX - 130}" y="730" width="260" height="40" rx="18" fill="#20465a"/>
    <rect x="${MX - 14}" y="770" width="28" height="${FLOOR - 770}" fill="#163444"/>`;
  const surprised = t > S('s13r') - .2;
  const helmet = (x, hy, sc) => {
    const on = scanK > 0 && scanK < 1 ? (Math.sin(t * 14) > 0 ? 1 : .3) : .3;
    hy -= 30 * sc;
    return `<path d="M${x - 66 * sc} ${hy - 4 * sc} A ${66 * sc} ${66 * sc} 0 0 1 ${x + 66 * sc} ${hy - 4 * sc} Z" fill="#cfd8e3"/><rect x="${x - 72 * sc}" y="${hy - 14 * sc}" width="${144 * sc}" height="${18 * sc}" rx="8" fill="#8796a8"/>
      ${[-1, 0, 1].map(i => `<circle cx="${x + i * 28 * sc}" cy="${hy - 50 * sc}" r="${8 * sc}" fill="${MINT}" opacity="${on}"/>`).join('')}`;
  };
  s += person({ x: MX, neck: 560, s: 1.05, legs: 'sit', foot: FLOOR, hair: 'dad', hairCol: '#3b2a24', beard: true, shirt: CORAL, pants: '#2d3a5a', t,
    look: surprised ? [12, 0] : (scanK > 0 ? [0, -6] : [4, 0]), mouth: surprised ? 'o' : (scanK > 0 ? 'flat' : 'smile'), brows: surprised ? 'up' : (scanK > 0 ? 'worried' : 'neutral'),
    blink: blinkAt(t, 0), hL: [MX - 46, 792], hR: [MX + 46, 792], sweat: scanK > .2 && scanK < .7 ? prog(scanK, .2, .7) : 0, hat: t < F('s13', .5) ? helmet : null });
  // Fortschritt
  const bk = inOut(t, F('s12', .28), F('s12', .34), F('s13', .6), F('s13', .7));
  if (bk > 0) {
    const pct = Math.round(scanK * 100);
    const label = pct >= 100 ? 'UPLOAD COMPLETE' : `SCANNING CONNECTIONS · ${fmt(scanK * 1e14)}`;
    s += `<g opacity="${bk}" transform="translate(1180 1030)">${text(label, 0, -44, { size: 34, font: 'JetBrains Mono', weight: 800, fill: MINT })}
      <rect x="-460" y="-14" width="920" height="34" rx="17" fill="#0a1a26" stroke="${MINT}" stroke-opacity=".5" stroke-width="3"/>
      <rect x="-452" y="-7" width="${904 * scanK}" height="20" rx="10" fill="${MINT}" filter="url(#glowS)"/></g>`;
  }
  s += bubble(1560, 230, 'Hi. Did I miss anything?', inOut(t, S('s13r') + .05, S('s13r') + .3, E('s13r') + .5, E('s13r') + .8), { robot: true, tail: -120, size: 38 });
  s += tag('THE YEAR 2080', 60, 70, prog(t, F('s12', .15), F('s12', .2)));
  const c = [lerp(1, 1.06, prog(t, S('s12'), E('s13r'))), 960, 540];
  return `<g transform="${cam(...c)}">${s}</g>`;
}

// ======================= DIE TESTS =======================
function testCard(n, title, t, a, x = 330, y = 160) {
  const k = prog(t, a, a + .5);
  return card(x, y, 460, 170, k, `${text('TEST ' + n, 0, -34, { size: 34, font: 'JetBrains Mono', weight: 800, fill: MINT, ls: 4 })}${text(title, 0, 30, { size: 64, fill: '#fff' })}`);
}
function thought(x, y, k, inner) {
  if (k <= 0) return '';
  return `<g transform="translate(${x} ${y}) scale(${back(k)})" opacity="${clamp(k * 2)}"><circle r="110" fill="#fff"/>${inner}</g>`;
}
function sceneTest1(t) {
  let s = bgGrad('t1', '#06121c', '#10283a') + grid(.035);
  s += robot({ x: 960, neck: 520, t, legs: 'stand', foot: 1040, eyes: t > F('s14', .9) ? 'happy' : 'on', look: [0, -4], mouth: t > F('s14', .9) ? 'smile' : 'flat' });
  s += headline(['IS IT', 'REALLY HIM?'], 960, 140, t, S('s14') + .05, F('s14', .2), { size: 90 });
  s += testCard(1, 'MEMORY', t, F('s14', .2));
  // Gedankenblasen
  const rings = `<circle cx="-24" cy="0" r="40" fill="none" stroke="${SUN}" stroke-width="12"/><circle cx="24" cy="0" r="40" fill="none" stroke="#d9a84e" stroke-width="12"/><path d="M-30 -48 L-24 -62 L-18 -48 Z" fill="#9ff7e0"/>`;
  const pw = `<rect x="-80" y="-30" width="160" height="60" rx="14" fill="#eef2f6" stroke="${INK}" stroke-width="4"/>${text('••••••', 0, 2, { size: 40, fill: INK, font: 'JetBrains Mono' })}<circle cx="0" cy="-58" r="18" fill="none" stroke="${INK}" stroke-width="8"/>`;
  const song = `${text('♪', -20, 0, { size: 110, fill: '#b07cff' })}<circle cx="50" cy="30" r="26" fill="#f8d8bc"/><ellipse cx="40" cy="38" rx="8" ry="5" fill="#ff8a8a"/><ellipse cx="60" cy="38" rx="8" ry="5" fill="#ff8a8a"/><path d="M42 26 l6 -4 M58 26 l-6 -4" stroke="${INK}" stroke-width="3"/>`;
  s += thought(560, 520, prog(t, F('s14', .4), F('s14', .47)), rings) + `<circle cx="720" cy="470" r="18" fill="#fff" opacity="${prog(t, F('s14', .4), F('s14', .45))}"/>`;
  s += thought(1380, 380, prog(t, F('s14', .52), F('s14', .59)), pw);
  s += thought(1420, 720, prog(t, F('s14', .64), F('s14', .71)), song);
  s += stamp('PASS', 960, 880, prog(t, F('s14', .9), F('s14', .96)), MINT, -8, 90);
  return s;
}
function sceneTest2(t) {
  let s = bgGrad('t2', '#06121c', '#10283a') + grid(.035);
  s += testCard(2, 'CHANGE', t, S('s15') + .05);
  // Mensch links: lernt, vergisst, ändert Meinung
  s += person({ x: 560, neck: 460, s: 1.05, legs: 'stand', foot: 1020, hair: 'dad', hairCol: '#3b2a24', beard: true, shirt: CORAL, t,
    look: [0, -6], mouth: 'smile', blink: blinkAt(t, 0), hL: [470, 640], hR: [650, 640],
    item: (x, y) => prog(t, F('s15', .2), F('s15', .25)) > 0 ? `<g transform="translate(${x - 90} ${y - 30})"><rect x="0" y="0" width="80" height="100" rx="6" fill="#4c6ef5"/><rect x="80" y="0" width="80" height="100" rx="6" fill="#5c7cff"/><line x1="80" y1="0" x2="80" y2="100" stroke="#fff" stroke-width="4"/></g>` : '' });
  const icon = (x, y, f, inner) => { const k = back(prog(t, F('s15', f), F('s15', f) + .3)); return k > 0 ? `<g transform="translate(${x} ${y}) scale(${k})">${inner}</g>` : ''; };
  s += icon(330, 400, .2, text('LEARN', 0, 0, { size: 40, font: 'JetBrains Mono', weight: 800, fill: MINT }));
  s += icon(560, 280, .3, `<g opacity="${.4 + .6 * Math.abs(Math.sin(t * 2))}">${text('FORGET', 0, 0, { size: 40, font: 'JetBrains Mono', weight: 800, fill: '#9ab' })}</g>`);
  s += icon(790, 400, .4, `${text('CHANGE', 0, -20, { size: 40, font: 'JetBrains Mono', weight: 800, fill: SUN })}<path d="M-50 20 L50 20 M30 4 L50 20 L30 36" stroke="${SUN}" stroke-width="6" fill="none"/>`);
  // Roboter als Foto
  const fk = back(prog(t, F('s15', .58), F('s15', .66)));
  if (fk > 0) {
    const talk = t > F('s15', .82);
    s += `<g transform="translate(1360 560) rotate(4) scale(${fk})">
      <rect x="-250" y="-330" width="500" height="620" rx="10" fill="#f4efe6"/><rect x="-220" y="-300" width="440" height="460" fill="#2a3a4a"/>
      <clipPath id="ph"><rect x="-220" y="-300" width="440" height="460"/></clipPath>
      <g clip-path="url(#ph)" filter="url(#sepia)">${robot({ x: 0, neck: -40, s: .9, t, eyes: 'on', mouth: talk ? 'talk' : 'smile', blink: 1 })}</g>
      ${text('2080', 0, 230, { size: 50, font: 'JetBrains Mono', weight: 800, fill: '#555' })}</g>`;
  }
  s += stamp('A PHOTO THAT TALKS', 1360, 960, prog(t, F('s15', .86), F('s15', .94)), CORAL, -6, 50);
  return s;
}
function sceneTwoDads(t) {
  let s = bgGrad('td', '#3a2438', '#6a3a4a');
  s += `<rect x="-400" y="900" width="${W + 800}" height="400" fill="#2a1a24"/>`;
  // Philosophen-Büsten
  const bk = prog(t, F('s17', .55), F('s17', .7));
  if (bk > 0) [320, 960, 1600].forEach((x, i) => {
    const k = back(clamp(bk * 2 - i * .3)); if (k <= 0) return;
    s += `<g transform="translate(${x} 330) scale(${k * .8})" opacity=".85"><rect x="-70" y="80" width="140" height="160" fill="#cfc8bf"/><rect x="-90" y="60" width="180" height="30" fill="#e2ddd5"/>
      <ellipse cx="0" cy="-20" rx="70" ry="84" fill="#e2ddd5"/><path d="M-60 10 C -60 110, 60 110, 60 10 C 40 40, -40 40, -60 10 Z" fill="#cfc8bf"/>
      <path d="M-30 -30 L-14 -30 M14 -30 L30 -30" stroke="#a69f95" stroke-width="6"/>${text('?', 90, -110, { size: 80, fill: SUN })}</g>`;
  });
  s += testCard(3, 'TWO OF YOU', t, S('s16') + .05, 1590, 120);
  const look = t > F('s16', .35);
  const point = inOut(t, F('s16', .62), F('s16', .7), E('s16') + .2, E('s16') + .5);
  // Schlüssel / Pizza
  const keysK = inOut(t, S('s17') - .1, S('s17') + .3, F('s17', .3), F('s17', .36));
  const pizzaK = inOut(t, F('s17', .3), F('s17', .38), F('s17', .6), F('s17', .66));
  const tug = Math.sin(t * 9) * 18;
  const midY = 620;
  let dadHR = [700 + 60, 760], botHL = [1220 - 62, 756];
  if (point > 0) { dadHR = [lerp(760, 900, point), lerp(760, 560, point)]; botHL = [lerp(1158, 1020, point), lerp(756, 560, point)]; }
  const grab = Math.max(keysK, pizzaK);
  if (grab > 0) { dadHR = [lerp(dadHR[0], 930 + tug, grab), lerp(dadHR[1], midY, grab)]; botHL = [lerp(botHL[0], 990 + tug, grab), lerp(botHL[1], midY, grab)]; }
  s += person({ x: 700, neck: 440, s: 1.05, legs: 'stand', foot: 1000, hair: 'dad', hairCol: '#3b2a24', beard: true, shirt: CORAL, t,
    look: look ? [12, 0] : [0, 0], mouth: point > 0 || grab > 0 ? 'open' : (look ? 'o' : 'smile'), brows: grab > 0 || point > 0 ? 'angry' : 'up', blink: blinkAt(t, 0), hR: dadHR });
  s += robot({ x: 1220, neck: 450, t, legs: 'stand', foot: 1000, look: look ? [-10, 0] : [0, 0], eyes: 'on', mouth: point > 0 || grab > 0 ? 'talk' : 'o', hL: botHL });
  if (keysK > 0) s += `<g transform="translate(${960 + tug} ${midY}) scale(${keysK})"><circle cx="0" cy="-20" r="26" fill="none" stroke="${SUN}" stroke-width="10"/><rect x="-8" y="0" width="16" height="70" rx="6" fill="${SUN}"/><rect x="8" y="40" width="20" height="10" fill="${SUN}"/><rect x="8" y="58" width="14" height="10" fill="${SUN}"/></g>`;
  if (pizzaK > 0) s += `<g transform="translate(${960 + tug} ${midY}) scale(${pizzaK})"><path d="M-60 -40 L60 -40 L0 80 Z" fill="#f2b84b"/><path d="M-66 -46 L66 -46 L60 -30 L-60 -30 Z" fill="#c8843a"/><circle cx="-14" cy="-6" r="12" fill="#d9472b"/><circle cx="16" cy="12" r="10" fill="#d9472b"/>
     <path d="M-60 -10 Q -80 ${20 + Math.abs(tug)} -100 0 M60 -10 Q 80 ${20 + Math.abs(tug)} 100 0" stroke="#ffe08a" stroke-width="6" fill="none"/></g>`;
  s += bubble(560, 200, "I'M THE REAL ONE!", inOut(t, F('s16', .7), F('s16', .76), E('s16') + .1, E('s16') + .4), { tail: 60, size: 40 });
  s += bubble(1360, 200, "NO, I AM!", inOut(t, F('s16', .8), F('s16', .86), E('s16') + .1, E('s16') + .4), { robot: true, tail: -60, size: 40 });
  const sk = prog(t, F('s17', .84), F('s17', .9));
  if (sk > 0) s += card(960, 160, 420, 150, sk, `${text('ROUND 2,400', 0, -36, { size: 26, font: 'JetBrains Mono', weight: 800, fill: '#9ab' })}${text('0 : 0', 0, 22, { size: 80, fill: MINT, glow: MINT })}`);
  return s;
}

// ======================= GESCHÄFT & REGELN =======================
function warnCard(x, y, k, title, icon) {
  return card(x, y, 620, 200, k, `<g transform="translate(-60 0)">${icon}</g>${text(title, -150, 2, { size: 44, anchor: 'start', fill: '#fff' })}`, { fill: '#2a1418', stroke: CORAL });
}
function sceneBusiness(t) {
  let s = bgGrad('bz', '#06121c', '#10283a') + grid(.035);
  const dollar = t > F('s18', .12);
  s += robot({ x: 960, neck: 470, t, legs: 'stand', foot: 1040, eyes: dollar ? 'dollar' : 'on', mouth: dollar ? 'smile' : 'flat' });
  s += tag('UNIVERSITY OF CAMBRIDGE · 2024', 60, 70, prog(t, F('s18', .25), F('s18', .3)));
  const cart = `<g transform="translate(-170 0)"><path d="M-40 -30 L-26 -30 L-10 26 L40 26 L52 -14 L-20 -14" stroke="${CORAL}" stroke-width="8" fill="none" stroke-linejoin="round"/><circle cx="-4" cy="44" r="9" fill="${CORAL}"/><circle cx="34" cy="44" r="9" fill="${CORAL}"/></g>`;
  const kid = `<g transform="translate(-170 0)"><circle cx="0" cy="-10" r="34" fill="#f8d8bc"/><circle cx="-12" cy="-14" r="5" fill="${INK}"/><circle cx="12" cy="-14" r="5" fill="${INK}"/>${text('?', 44, -50, { size: 50, fill: CORAL })}<path d="M-30 50 C -30 20, 30 20, 30 50 Z" fill="${SUN}"/></g>`;
  const ghost = `<g transform="translate(-170 0)"><path d="M-36 50 L-36 -10 C -36 -60, 36 -60, 36 -10 L36 50 L24 38 L12 50 L0 38 L-12 50 L-24 38 Z" fill="#eef2f6"/><circle cx="-12" cy="-10" r="7" fill="${INK}"/><circle cx="12" cy="-10" r="7" fill="${INK}"/></g>`;
  s += warnCard(410, 330, prog(t, F('s18', .55), F('s18', .62)), 'SELL YOU THINGS', cart);
  s += warnCard(410, 720, prog(t, F('s18', .7), F('s18', .77)), 'CONFUSE KIDS', kid);
  s += warnCard(1520, 520, prog(t, F('s18', .82), F('s18', .89)), 'HAUNT PEOPLE', ghost);
  return s;
}
function sceneRules(t) {
  let s = bgGrad('rl', '#06121c', '#10283a') + grid(.035);
  s += headline(['THE RULES'], 760, 120, t, S('s20') + .1, E('s20') + 2, { size: 80, hl: 0 });
  const rows = [['Always know it is a machine', .2], ['A way to switch it off', .45], ['A digital funeral', .72]];
  const bk = prog(t, S('s20'), S('s20') + .5);
  s += card(760, 580, 1080, 620, bk, '');
  let active = -1;
  rows.forEach(([str, f], i) => {
    const k = prog(t, F('s20', f), F('s20', f) + .3);
    if (k > 0) active = i;
    const y = 400 + i * 180;
    s += `<g opacity="${.35 + .65 * clamp(k * 2)}"><rect x="290" y="${y - 50}" width="100" height="100" rx="20" fill="none" stroke="${MINT}" stroke-width="6"/>
      ${k > 0 ? `<path d="M310 ${y} L335 ${y + 28} L375 ${y - 30}" stroke="${MINT}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="120" stroke-dashoffset="${120 * (1 - easeOut(k))}"/>` : ''}
      ${text(str, 430, y + 2, { size: 50, anchor: 'start', fill: '#fff' })}</g>`;
  });
  const ix = 1580, iy = 560;
  const ik = (i) => inOut(t, F('s20', rows[i][1]), F('s20', rows[i][1]) + .3, i < 2 ? F('s20', rows[i + 1][1]) : E('s20') + 2, i < 2 ? F('s20', rows[i + 1][1]) + .2 : E('s20') + 3);
  if (ik(0) > 0) s += `<g transform="translate(${ix} ${iy}) scale(${back(ik(0)) * .8})">${robot({ x: 0, neck: -40, t, eyes: 'on' })}<rect x="-70" y="100" width="140" height="70" rx="14" fill="${SUN}"/>${text('AI', 0, 137, { size: 50, fill: INK })}</g>`;
  if (ik(1) > 0) s += `<g transform="translate(${ix} ${iy}) scale(${back(ik(1))})"><circle r="150" fill="#2a1418" stroke="${CORAL}" stroke-width="10"/><path d="M-60 -50 A 85 85 0 1 0 60 -50" stroke="${CORAL}" stroke-width="22" fill="none" stroke-linecap="round"/><line x1="0" y1="-110" x2="0" y2="-10" stroke="${CORAL}" stroke-width="22" stroke-linecap="round"/></g>`;
  if (ik(2) > 0) s += `<g transform="translate(${ix} ${iy}) scale(${back(ik(2))})"><path d="M-110 160 L-110 -40 C -110 -140, 110 -140, 110 -40 L110 160 Z" fill="#8a94a6"/>${text('R.I.P.', 0, -30, { size: 50, fill: '#2b3654' })}<circle cx="0" cy="50" r="28" fill="#2b3654"/><circle cx="-10" cy="46" r="6" fill="${MINT}"/><circle cx="10" cy="46" r="6" fill="${MINT}"/>
    <rect x="-150" y="150" width="300" height="20" rx="10" fill="#3a5a40"/><circle cx="-90" cy="140" r="16" fill="#e9dcf0"/><circle cx="-60" cy="146" r="12" fill="${SUN}"/>
    <rect x="130" y="70" width="22" height="80" rx="4" fill="#f4efe6"/><ellipse cx="141" cy="${58 + Math.sin(t * 9) * 3}" rx="8" ry="14" fill="${SUN}"/></g>`;
  return s;
}

// ======================= URTEIL =======================
function sceneVerdict(t) {
  let s = bgGrad('vd', '#06121c', '#10283a') + grid(.035);
  s += stamp('VERDICT', 960, 130, prog(t, S('s21'), S('s21') + .4), MINT, 0, 70);
  const X0 = 220, X1 = 1500, Y = 620;
  const yr = y => lerp(X0, X1, (y - 2020) / 80);
  const ak = ease(prog(t, S('s21') + .2, S('s21') + 1));
  s += `<line x1="${X0}" y1="${Y}" x2="${lerp(X0, 1760, ak)}" y2="${Y}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>`;
  [2020, 2040, 2060, 2080, 2100].forEach((y, i) => { const k = prog(t, S('s21') + .3 + i * .1, S('s21') + .5 + i * .1); s += `<g opacity="${k}"><line x1="${yr(y)}" y1="${Y - 16}" x2="${yr(y)}" y2="${Y + 16}" stroke="#fff" stroke-width="5"/>${text(String(y), yr(y), Y + 54, { size: 32, font: 'JetBrains Mono', weight: 800, fill: '#cfe' })}</g>`; });
  // Nebel rechts
  s += `<rect x="1520" y="380" width="520" height="480" fill="url(#fog)" opacity="${ak}"/>`;
  // Echos jetzt
  const ek = prog(t, F('s21', .08), F('s21', .14));
  const grow = ease(prog(t, F('s21', .16), F('s21', .3)));
  if (ek > 0) s += `<rect x="${yr(2024)}" y="${Y - 8}" width="${(yr(2080) - yr(2024)) * grow}" height="16" rx="8" fill="${MINT}" opacity=".8"/>
     <g transform="translate(${yr(2025)} ${Y - 120}) scale(${back(ek)})"><circle r="56" fill="#10283a" stroke="${MINT}" stroke-width="6"/>${text('))', 0, 4, { size: 48, fill: MINT })}</g>
     ${text('ECHOES: ALREADY HERE', yr(2025), Y - 220, { size: 38, fill: MINT, op: ek })}`;
  // Echte Kopie wandert ins Ungewisse
  const ck = prog(t, F('s21', .34), F('s21', .4));
  const slide = ease(prog(t, F('s21', .4), F('s21', .7)));
  if (ck > 0) s += `<g transform="translate(${lerp(yr(2060), 1760, slide)} ${Y - 170}) scale(${back(ck) * .5})">${robot({ x: 0, neck: -60, t, eyes: 'think' })}</g>${text('TRUE COPY: ???', lerp(yr(2060), 1700, slide), Y - 330, { size: 40, fill: SUN, op: ck })}`;
  // Schwierigkeit
  const dk = prog(t, F('s21', .5), F('s21', .56)), fill = ease(prog(t, F('s21', .54), F('s21', .68)));
  if (dk > 0) s += card(1560, 860, 460, 140, dk, `${text('DIFFICULTY', 0, -34, { size: 28, font: 'JetBrains Mono', weight: 800, fill: '#cfe' })}<rect x="-190" y="4" width="380" height="36" rx="18" fill="#0a1a26"/><rect x="-190" y="4" width="${380 * fill}" height="36" rx="18" fill="${mix(SUN, CORAL, fill)}"/>${fill > .95 ? text('MAX', 0, 24, { size: 28, fill: '#fff' }) : ''}`);
  // dieses Jahrhundert: nein
  const nk = prog(t, F('s21', .72), F('s21', .78));
  if (nk > 0) s += `<g opacity="${nk}"><path d="M${X0} ${Y + 100} L${X0} ${Y + 120} L${yr(2100)} ${Y + 120} L${yr(2100)} ${Y + 100}" stroke="${CORAL}" stroke-width="6" fill="none"/>${text('THIS CENTURY', (X0 + yr(2100)) / 2, Y + 170, { size: 40, fill: CORAL })}</g>${stamp('NOT LIKELY', (X0 + yr(2100)) / 2, Y + 280, prog(t, F('s21', .76), F('s21', .82)), CORAL, -6, 54)}`;
  s += tag('OUR OWN ESTIMATE', 60, 1010, prog(t, F('s21', .88), F('s21', .93)), SUN);
  return s;
}

// ======================= SCHLUSS =======================
function sceneOutro(t) {
  let s = bgGrad('ot', '#06121c', '#10283a') + grid(.035);
  const toNext = ease(prog(t, S('s27') - .3, S('s27') + .4));
  // Patentblatt
  const pk = back(prog(t, S('s26'), S('s26') + .5)) * (1 - toNext);
  if (pk > 0) {
    s += `<g transform="translate(700 560) rotate(-3) scale(${pk})"><rect x="-330" y="-430" width="660" height="860" rx="10" fill="#f4efe6"/>
      ${text('PATENT FUTURE', 0, -370, { size: 46, fill: INK, ls: 4 })}${text('FILE 001 · THE COPY', 0, -320, { size: 30, font: 'JetBrains Mono', weight: 800, fill: '#555' })}
      <line x1="-280" y1="-290" x2="280" y2="-290" stroke="#999" stroke-width="3"/>
      <g opacity=".75">${robot({ x: 0, neck: 20, s: .85, t, eyes: 'on' })}</g>
      ${Array.from({ length: 4 }, (_, i) => `<rect x="-280" y="${280 + i * 34}" width="${560 - (i % 2) * 140}" height="12" rx="6" fill="#c9c2b6"/>`).join('')}</g>`;
    s += `<g opacity="${1 - toNext}">${stamp('PENDING', 760, 640, prog(t, F('s26', .22), F('s26', .3)), CORAL, -14, 96)}</g>`;
  }
  s += `<g opacity="${1 - toNext}">${headline(['WOULD YOU SIT', 'AT THIS TABLE?'], 1420, 420, t, F('s26', .5), E('s26') + 5, { size: 76 })}</g>`;
  const ck = back(prog(t, F('s26', .78), F('s26', .86))) * (1 - toNext);
  if (ck > 0) s += `<g transform="translate(1420 700) scale(${ck})"><rect x="-260" y="-60" width="520" height="120" rx="60" fill="#fff"/><path d="M-190 50 L-210 100 L-150 56 Z" fill="#fff"/>${text('Tell us in the comments', 0, 2, { size: 38, fill: INK })}</g>`;
  // Nächstes Mal: Chip
  if (toNext > 0) {
    const ck2 = back(prog(t, S('s27'), S('s27') + .6));
    const glow = .6 + .4 * Math.sin(t * 4);
    s += `<g transform="translate(620 520) scale(${ck2})">
      <circle r="300" fill="${MINT}" opacity="${glow * .12}" filter="url(#glow)"/>
      ${Array.from({ length: 8 }, (_, i) => `<rect x="${-170 + i * 46}" y="-250" width="18" height="60" rx="6" fill="#c9ced6"/><rect x="${-170 + i * 46}" y="190" width="18" height="60" rx="6" fill="#c9ced6"/><rect x="-250" y="${-170 + i * 46}" width="60" height="18" rx="6" fill="#c9ced6"/><rect x="190" y="${-170 + i * 46}" width="60" height="18" rx="6" fill="#c9ced6"/>`).join('')}
      <rect x="-200" y="-200" width="400" height="400" rx="40" fill="#1c2b3c" stroke="${MINT}" stroke-width="6"/>
      ${brainShape(0, 0, .9, 'none', MINT, glow)}</g>`;
    s += headline(['NEXT TIME:', 'A CHIP THAT READS', 'YOUR THOUGHTS'], 1360, 300, t, S('s27') + .1, E('s27') + 5, { size: 64, hl: 2 });
    const sb = back(prog(t, F('s27', .6), F('s27', .7)));
    const click = pulse(t, F('s27', .85), .4);
    if (sb > 0) s += `<g transform="translate(1360 720) scale(${sb * (1 - click * .08)})"><rect x="-250" y="-60" width="500" height="120" rx="60" fill="${click > 0 || t > F('s27', .9) ? '#555' : CORAL}"/>${text(t > F('s27', .9) ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 3, { size: 48, fill: '#fff' })}</g>
      <g transform="translate(${lerp(1700, 1420, ease(prog(t, F('s27', .7), F('s27', .84))))} ${lerp(950, 760, ease(prog(t, F('s27', .7), F('s27', .84))))})"><path d="M0 0 L0 60 L16 46 L28 72 L40 66 L28 42 L48 42 Z" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`;
  }
  return s;
}

// ======================= ABLAUF =======================
const SCENES = [
  ['s01', 's03', sceneDinnerOpen], ['s04', 's04', sceneTitle], ['s05', 's05', sceneChat], ['s06', 's06', sceneFuneral],
  ['s07', 's07', sceneVR], ['s08', 's08', sceneEchoBrain], ['s09', 's09', sceneFly], ['s10', 's10', sceneHuman],
  ['s11', 's11', scenePiano], ['s12', 's13r', sceneLab], ['s14', 's14', sceneTest1], ['s15', 's15', sceneTest2],
  ['s16', 's17', sceneTwoDads], ['s18', 's18', sceneBusiness], ['s19r', 's19r', sceneDinnerAd], ['s20', 's20', sceneRules],
  ['s21', 's21', sceneVerdict], ['s22', 's22', sceneDinnerLapse], ['s23', 's25', sceneDinnerPayoff], ['s26', 's27', sceneOutro],
];
let CUTS = [];
function buildCuts() {
  CUTS = SCENES.map(([a, b, fn], i) => {
    const start = i === 0 ? 0 : (E(SCENES[i - 1][1]) + S(a)) / 2;
    const end = i === SCENES.length - 1 ? TL.duration : (E(b) + S(SCENES[i + 1][0])) / 2;
    return { start, end, fn };
  });
}

// Fragekarte (roter Faden) – Bildschirmkoordinaten
function questionCard(t) {
  const born = F('s03', .58), park = F('s03', .92), back0 = S('s23'), open = F('s23', .7), gone = S('s24') + .35;
  if (t < born || t > gone) return '';
  let x, y, sc;
  if (t < park) { const k = ease(prog(t, born + .6, park)); x = lerp(960, 1800, k); y = lerp(230, 90, k); sc = lerp(1.6, .6, k) * back(prog(t, born, born + .4)); }
  else if (t < back0) { x = 1800; y = 90; sc = .6 * (1 + .08 * pulse((t - park) % 9, 0, .6)); }
  else { const k = ease(prog(t, back0, back0 + 1)); x = lerp(1800, 960, k); y = lerp(90, 250, k); sc = lerp(.6, 1.8, k); }
  const openK = ease(prog(t, open, open + .6));
  const fade = 1 - prog(t, S('s24'), gone);
  return `<g transform="translate(${x} ${y}) scale(${sc})" opacity="${fade}">
    <rect x="-70" y="-50" width="140" height="100" rx="12" fill="${SUN}" opacity=".4" filter="url(#glow)"/>
    <rect x="-70" y="-50" width="140" height="100" rx="12" fill="#f4efe6"/>
    <path d="M-70 -50 L0 ${lerp(10, -110, openK)} L70 -50 Z" fill="#e6dccb" stroke="#cbbfa9" stroke-width="2"/>
    ${openK > .5 ? text('Are you still you?', 0, 12, { size: 15, fill: INK }) : text('?', 0, 14, { size: 54, fill: CORAL })}</g>`;
}
function chapterBanner(t) {
  let s = '';
  const ids = Object.keys(TL.chapters); let n = 0;
  ids.forEach((id, i) => {
    if (id === 's01') return;
    n = i;
    const a = S(id) + .2, k = inOut(t, a, a + .4, a + 2.6, a + 3);
    if (k <= 0) return;
    s += `<g transform="translate(${-460 * (1 - k)} 0)" opacity="${k}"><rect x="0" y="930" width="${TL.chapters[id].length * 30 + 120}" height="96" fill="#08121b" opacity=".85"/>
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
  L.push([F('s01', .5), 'pop'], [F('s01', .78), 'chime_low']);
  const r0 = F('s02', .6); L.push([r0 + .8, 'glug'], [r0 + 2.9, 'gulp'], [r0 + 3.9, 'hiss']);
  L.push([F('s03', .6), 'pop'], [F('s03', .9), 'swish']);
  L.push([S('s04') + .1, 'boom'], [F('s04', .66), 'glitch']);
  [.3, .4, .52, .62, .72, .8, .88, .95].forEach(f => L.push([F('s05', f), 'blip']));
  L.push([F('s05', .85), 'tick']);
  L.push([F('s08', .86), 'boom']);
  L.push([F('s09', .38), 'count'], [F('s09', .58), 'count'], [F('s10', .02), 'count'], [F('s10', .86), 'chime_low']);
  L.push([F('s12', .3), 'scan'], [S('s13'), 'power'], [F('s13', .65), 'hiss']);
  L.push([F('s14', .4), 'pop'], [F('s14', .52), 'pop'], [F('s14', .64), 'pop'], [F('s14', .9), 'stamp']);
  L.push([F('s15', .58), 'pop'], [F('s15', .86), 'stamp']);
  L.push([F('s16', .7), 'pop'], [F('s16', .8), 'pop'], [S('s17'), 'pop'], [F('s17', .3), 'pop'], [F('s17', .84), 'stamp']);
  L.push([F('s18', .55), 'warn'], [F('s18', .7), 'warn'], [F('s18', .82), 'warn'], [S('s19r') + .2, 'jingle'], [F('s19r', .7), 'stamp']);
  L.push([F('s20', .2), 'tick2'], [F('s20', .45), 'tick2'], [F('s20', .72), 'tick2']);
  L.push([S('s21'), 'stamp'], [F('s21', .76), 'stamp']);
  L.push([F('s22', .12), 'lapse']);
  L.push([S('s23'), 'swish'], [F('s23', .7), 'chime_low'], [F('s25', .86), 'blip']);
  L.push([F('s26', .22), 'stamp'], [F('s27', .85), 'click']);
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
    <filter id="sepia"><feColorMatrix type="matrix" values=".39 .77 .19 0 0 .35 .69 .17 0 0 .27 .53 .13 0 0 0 0 0 1 0"/></filter>
    <radialGradient id="lampGlow" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#ffd79a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd79a" stop-opacity="0"/></radialGradient>
    <linearGradient id="tvShine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="fog" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#10283a" stop-opacity="0"/><stop offset=".5" stop-color="#9fc" stop-opacity=".12"/><stop offset="1" stop-color="#cfe" stop-opacity=".25"/></linearGradient>
    <radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
  </defs>
  ${cut.fn(t)}
  ${motes(t, '#fff3dd', 28)}
  ${chapterBanner(t)}
  ${questionCard(t)}
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect width="${W}" height="${H}" fill="#000" opacity="${Math.max(dip * .85, fadeIn, fadeOut)}"/>`;
}

function init(tl) { setTimeline(tl); buildCuts(); window.SFX = sfxList(); window.DURATION = TL.duration; }
