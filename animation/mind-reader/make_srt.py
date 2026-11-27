"""Untertitel (.srt) aus Sprechertext + timeline.json.
Satzgrenzen werden an echten Sprechpausen im Audio (ffmpeg silencedetect) ausgerichtet.
Aufruf: python make_srt.py  → subtitles_en.srt
"""
import json, pathlib, re, subprocess, sys

HERE = pathlib.Path(__file__).parent
MAX = 84  # Zeichen pro Untertitel (2 Zeilen à 42)


def silences(mp3, dur):
    out = subprocess.run(["ffmpeg", "-i", str(mp3), "-af", "silencedetect=noise=-35dB:d=0.12", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    # Mitte jeder Pause; Stille am Anfang und am Ende der Aufnahme ist keine Satzgrenze
    return [((a + b) / 2) for a, b in zip(st, en) if a > 0.05 and b < dur - 0.15]


def split_long(s):
    """Langen Satz an dem Komma teilen, das der Mitte am nächsten liegt."""
    if len(s) <= MAX:
        return [s]
    ok = lambda i: 25 <= i <= len(s) - 25                       # keine Mini-Stücke wie "In 2024,"
    cuts = [m.end() for m in re.finditer(r"[,;:] ", s) if ok(m.end())] or [m.end() for m in re.finditer(r" ", s) if ok(m.end())]
    c = min(cuts, key=lambda i: abs(i - len(s) / 2))
    return split_long(s[:c].strip()) + split_long(s[c:].strip())


def align(lens, dur, pauses):
    """Satzgrenzen auf echte Sprechpausen legen. Gewählt wird die Kombination, bei der jeder Satz
    so lange dauert, wie seine Zeichenzahl erwarten lässt (gleichmäßiges Sprechtempo).
    Pausen an Kommas bleiben so übrig, statt einen Satz zu zerschneiden."""
    n = len(lens) - 1                        # Anzahl Grenzen
    if n == 0:
        return []
    total = sum(lens)
    exp = [dur * l / total for l in lens]
    # Kandidaten: echte Pausen (ohne Aufschlag) + Grenzen nach Sprechtempo (mit Aufschlag, nur als Notlösung)
    acc, guesses = 0, []
    for l in lens[:-1]:
        acc += l; guesses.append(dur * acc / total)
    cand = sorted([(p, 0.0) for p in pauses] + [(g, 0.6) for g in guesses])
    P = [0.0] + [c[0] for c in cand]
    PEN = [0.0] + [c[1] for c in cand]
    INF = float("inf")
    m = len(P)
    best = [[INF] * m for _ in range(n + 1)]
    back = [[0] * m for _ in range(n + 1)]
    best[0][0] = 0.0
    for i in range(1, n + 1):
        for j in range(1, m):
            for k in range(j):
                if best[i - 1][k] < INF and P[j] - P[k] > 0.3:
                    c = best[i - 1][k] + (P[j] - P[k] - exp[i - 1]) ** 2 + PEN[j]
                    if c < best[i][j]:
                        best[i][j], back[i][j] = c, k
    j = min(range(1, m), key=lambda j: best[n][j] + (dur - P[j] - exp[n]) ** 2)
    out = []
    for i in range(n, 0, -1):
        out.append(P[j]); j = back[i][j]
    return out[::-1]


def wrap(s):
    if len(s) <= 42:
        return s
    sp = [m.start() for m in re.finditer(" ", s)]
    c = min(sp, key=lambda i: abs(i - len(s) / 2))
    return s[:c] + "\n" + s[c + 1:]


def ts(t):
    ms = int(round(t * 1000))                     # erst runden, dann zerlegen (sonst wird 55,9999 zu "55,000")
    h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


tl = json.loads((HERE / "timeline.json").read_text(encoding="utf-8"))
cues = []
for c in tl["clips"]:
    text = re.sub(r"\s*<break[^>]*/>\s*", " ", c["text"]).strip()
    sents = [s.strip() for s in re.split(r"(?<=[.?!])\s+", text) if s.strip()]
    # Sprecher kennzeichnen, wenn nicht der Erzähler spricht
    who = {"T": "TOM (THINKING): "}.get(c["voice"], "")
    if who:
        sents[0] = who + sents[0]
    dur = c["end"] - c["start"]
    # Grenzen: zuerst proportional nach Zeichen, dann auf die nächste echte Pause schieben
    total = sum(len(s) for s in sents)
    pauses = silences(HERE / "audio" / f"{c['id']}.mp3", dur)
    bounds = align([len(s) for s in sents], dur, pauses)
    if "--debug" in sys.argv:
        print(c["id"], round(dur, 2), "Pausen", [round(p, 2) for p in pauses], "Grenzen", [round(b, 2) for b in bounds], [len(s) for s in sents])
    edges = [0.0] + bounds + [dur]
    for i, s in enumerate(sents):
        a, b = edges[i], edges[i + 1]
        parts = split_long(s)
        n = sum(len(p) for p in parts)
        x = a
        for p in parts:
            y = x + (b - a) * len(p) / n
            cues.append((c["start"] + x, c["start"] + y, p))
            x = y

# kleine Lücke zwischen Untertiteln, Mindestdauer
out = []
for i, (a, b, s) in enumerate(cues):
    b = max(b, a + 0.8)
    if i + 1 < len(cues):
        b = min(b, cues[i + 1][0] - 0.05)
    out.append(f"{i + 1}\n{ts(a)} --> {ts(b)}\n{wrap(s)}\n")
(HERE / "subtitles_en.srt").write_text("\n".join(out), encoding="utf-8")
print(len(out), "Untertitel →", HERE / "subtitles_en.srt")
