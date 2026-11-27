"""Mischt Erzählstimme + synthetische Musik + Soundeffekte zu mix.wav (-14 LUFS).
Liest timeline.json, sfx.json (von render.js aus der Szene exportiert) und audio/*.mp3."""
import json, subprocess, pathlib
import numpy as np

HERE = pathlib.Path(__file__).parent
SR = 44100
TL = json.loads((HERE / "timeline.json").read_text())
SFX = json.loads((HERE / "sfx.json").read_text())
DUR = TL["duration"]
N = int(DUR * SR) + SR
rng = np.random.default_rng(7)


def load(p):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(p), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"])
    return np.frombuffer(raw, dtype=np.float32).copy()


def lowpass(x, a):            # einpoliger Tiefpass, a in (0,1): kleiner = dunkler
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y


def env(n, attack=.005, decay=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(attack, 1e-4))
    if decay: e *= np.exp(-t / decay)
    return e


def tone(f0, dur, f1=None, decay=.2, wave="sine"):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f0 if f1 is None else f0 * (f1 / f0) ** (t / dur)
    ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, (n,))) / SR
    s = np.sin(ph) if wave == "sine" else np.sign(np.sin(ph)) * .5
    return s * env(n, .003, decay)


def noise(dur):
    return rng.uniform(-1, 1, int(dur * SR))


def sfx(kind):
    if kind == "whoosh":
        n = noise(.5); sweep = np.sin(np.linspace(0, np.pi, len(n))) ** 2
        return lowpass(n, .25) * sweep * .5
    if kind == "swish":
        n = noise(.3); return (n - lowpass(n, .3)) * np.sin(np.linspace(0, np.pi, len(n))) * .25
    if kind == "pop": return tone(500, .12, 900, .04) * .35
    if kind == "blip": return tone(1250, .08, None, .03) * .18
    if kind == "tick2": return tone(1000, .15, None, .05) * .25 + tone(1500, .15, None, .04) * .15
    if kind == "chime_low": return (tone(392, 1.6, None, .6) + .6 * tone(587, 1.6, None, .5) + .3 * tone(784, 1.6, None, .4)) * .2
    if kind == "power": return (tone(880, 2, None, .8) + .6 * tone(1318, 2, None, .7) + .4 * tone(1760, 2, None, .6) + tone(110, 2, 55, .5)) * .2
    if kind == "glug":    # Einschenken: viele kleine Blasen, Tonhöhe steigt beim Füllen
        dur = 1.1; out = np.zeros(int(dur * SR)); tt = 0.0
        while tt < dur - .06:
            fill = tt / dur
            f0 = 380 + 520 * fill + rng.uniform(-60, 120)
            n = int(.05 * SR); tau = np.arange(n) / SR
            f = f0 * (1 + 2.2 * tau / .05)
            b = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tau / .016) * rng.uniform(.08, .22)
            i = int(tt * SR); out[i:i + n] += b[:len(out) - i]
            tt += rng.exponential(1 / 30)
        stream = lowpass(noise(dur), .12) * .05 * np.sin(np.linspace(0, np.pi, len(out))) ** .5
        return (out + stream) * np.minimum(1, np.arange(len(out)) / (SR * .04))
    if kind == "gulp":    # drei Schlucke
        out = np.zeros(int(1.0 * SR))
        for k, at in enumerate([0, .32, .64]):
            n = int(.11 * SR); tau = np.arange(n) / SR
            f = 170 * (1 + 1.6 * tau / .11)
            g = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tau / .045) * .45
            i = int(at * SR); out[i:i + n] += g
        return out
    if kind == "hiss":
        n = noise(1.2); return (n - lowpass(n, .4)) * env(len(n), .01, .3) * .12
    if kind == "boom":
        return tone(80, 1.6, 35, .5) * .7 + lowpass(noise(1.6), .03) * env(int(1.6 * SR), .005, .3) * 1.5
    if kind == "glitch":
        n = noise(.45); gate = (np.floor(np.arange(len(n)) / (SR * .03)) % 2); return np.round(n * 4) / 4 * gate * .12
    if kind == "tick":
        out = np.zeros(int(2.2 * SR))
        for k in range(22): i = int(k * .1 * SR); c = tone(2200, .03, None, .006) * .25; out[i:i + len(c)] += c
        return out
    if kind == "count":
        out = np.zeros(int(1.6 * SR))
        for k in range(24): i = int(k * 1.5 / 24 * SR); c = tone(900 + k * 40, .03, None, .008) * .14; out[i:i + len(c)] += c
        return out
    if kind == "scan": return tone(200, 3.5, 900, 3) * np.sin(np.linspace(0, np.pi, int(3.5 * SR))) * .08
    if kind == "stamp": return tone(90, .35, 50, .09) * .9 + lowpass(noise(.35), .2) * env(int(.35 * SR), .001, .04) * .8
    if kind == "warn": return np.concatenate([tone(740, .14, None, .2), tone(520, .2, None, .2)]) * .16
    if kind == "jingle":
        out = np.zeros(int(1.2 * SR))
        for k, f in enumerate([523, 659, 784, 1046]): c = tone(f, .5, None, .2) * .2; i = int(k * .13 * SR); out[i:i + len(c)] += c
        return out
    if kind == "lapse":
        n = noise(7); sw = np.linspace(0, 1, len(n)) ** 2 * np.minimum(1, (len(n) - np.arange(len(n))) / (SR * .4))
        return (n - lowpass(n, .2)) * sw * .18
    if kind == "click": return tone(1800, .05, None, .01) * .3
    if kind == "typing":  # Tastatur: unregelmäßige kurze Anschläge
        dur = 2.4; out = np.zeros(int(dur * SR)); tt = 0.0
        while tt < dur - .05:
            n = int(.03 * SR); b = noise(.03); b = (b - lowpass(b, .35)) * np.exp(-np.arange(n) / (SR * .006)) * rng.uniform(.15, .3)
            b += tone(rng.uniform(2500, 3500), .03, None, .004) * .05
            i = int(tt * SR); out[i:i + n] += b[:len(out) - i]
            tt += rng.uniform(.06, .14)
        return out
    if kind == "lock":    # Vorhängeschloss schnappt zu: metallisches Klacken
        n = noise(.2); clank = (n - lowpass(n, .3)) * env(len(n), .001, .02) * .4
        return tone(1400, .2, None, .025) * .25 + tone(320, .2, 210, .05) * .35 + clank
    if kind == "unlock":  # Schloss springt auf + kleiner Glanz
        a = tone(1700, .06, None, .012) * .25
        b = np.concatenate([np.zeros(int(.09 * SR)), tone(1500, .06, None, .012) * .25])
        c = np.concatenate([np.zeros(int(.2 * SR)), tone(880, .7, 1320, .25) * .12 + tone(1320, .7, 1980, .2) * .06])
        out = np.zeros(len(c)); out[:len(a)] += a; out[:len(b)] += b; return out + c
    if kind == "chess":   # Holzfigur setzt auf
        n = noise(.12); return tone(950, .12, 620, .02) * .35 + lowpass(n, .4) * env(len(n), .001, .012) * .5
    if kind == "door":    # Tür fällt ins Schloss
        n = noise(.6); return tone(68, .6, 42, .14) * .9 + lowpass(n, .08) * env(len(n), .002, .05) * 1.2 + tone(1100, .6, None, .03) * .06
    if kind == "scratch":  # Schallplatte bremst (peinlicher Moment)
        dur = .45; n = noise(dur); tt = np.arange(len(n)) / SR
        band = lowpass(n, .5) - lowpass(n, .06)
        wob = np.abs(np.sin(2 * np.pi * (14 - 22 * tt) * tt))
        return band * wob * np.exp(-tt / .25) * .6 + tone(520, dur, 140, .25) * .12
    return np.zeros(1)


# ---------- Erzählung ----------
voice = np.zeros(N, np.float32)
active = np.zeros(N, np.float32)
for c in TL["clips"]:
    x = load(HERE / "audio" / f"{c['id']}.mp3")
    rms = np.sqrt(np.mean(x[np.abs(x) > .01] ** 2)) + 1e-6
    x = x * (.12 / rms)
    i = int(c["start"] * SR); voice[i:i + len(x)] += x[:N - i]
    active[i:i + len(x)] = 1

# ---------- Musik ----------
t = np.arange(N) / SR
CH = {"Am": [110, 130.81, 164.81], "F": [87.31, 110, 130.81], "C": [130.81, 164.81, 196], "G": [98, 123.47, 146.83], "Dm": [146.83, 174.61, 220], "E": [82.41, 103.83, 123.47]}
S = {c["id"]: c["start"] for c in TL["clips"]}
E = {c["id"]: c["end"] for c in TL["clips"]}
warm = ["Am", "F", "C", "G"]
tense = ["Am", "Am", "F", "E"]
bar = 4.8
music = np.zeros(N, np.float32)
idx = (t // bar).astype(int)
for k in range(idx.max() + 1):
    a, b = int(k * bar * SR), min(N, int((k + 1) * bar * SR + .4 * SR))
    tt = t[a:b]
    mid = k * bar
    seq = tense if S["s06"] - 2 < mid < E["s21"] else warm
    notes = CH[seq[k % 4]]
    e = np.minimum(1, (tt - k * bar) / .6) * np.minimum(1, np.maximum(0, (k + 1) * bar + .4 - tt) / .6)
    seg = sum(np.sin(2 * np.pi * f * tt) + .25 * np.sin(2 * np.pi * 2 * f * tt + .5) + .12 * np.sin(2 * np.pi * 1.005 * f * tt) for f in notes)
    music[a:b] += (seg * e * .05).astype(np.float32)
    # Arpeggio (gezupft)
    step = bar / 16
    for j in range(16):
        f = notes[j % 3] * (4 if j % 4 == 3 else 2)
        p = tone(f, .6, None, .22) * .05
        i = int((k * bar + j * step) * SR); music[i:i + len(p)] += p[:max(0, N - i)]
# Puls in den Erklärkapiteln (Spannung)
beat = 60 / 100
pt = S["s06"] - 1
while pt < E["s21"]:
    k = tone(70, .35, 40, .12) * .35
    i = int(pt * SR); music[i:i + len(k)] += k
    pt += beat
# Ducking: Musik leiser, wenn gesprochen wird
duck = lowpass(active, 1 / (SR * .25)) if False else None
win = int(SR * .3)
kern = np.ones(win) / win
act_s = np.convolve(active, kern, mode="same")
gain = 1 - .62 * np.clip(act_s, 0, 1)
music *= gain.astype(np.float32)
music *= np.minimum(1, t / 2) * np.minimum(1, np.maximum(0, DUR - t) / 2)

# ---------- Effekte ----------
fx = np.zeros(N, np.float32)
for at, kind in SFX:
    x = sfx(kind).astype(np.float32)
    i = max(0, int(at * SR)); fx[i:i + len(x)] += x[:max(0, N - i)]

mix = voice + music * .9 + fx * .8
mix = mix[:int(DUR * SR)]
raw = HERE / "mix_raw.wav"
pcm = (np.clip(mix / max(1, np.abs(mix).max()), -1, 1) * 32767).astype(np.int16)
import wave
with wave.open(str(raw), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2", str(HERE / "mix.wav")])
raw.unlink()
print("mix.wav fertig")
