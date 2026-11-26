# Szene 01 – Raketenstart (Lichtgeschwindigkeit-Short)

Flacher 2D-Vektorstil mit Strichmännchen, Hochformat 1080×1920, 30 fps, 12 s, mit Ton.

| Zeit | Was passiert |
|---|---|
| 0–3 s | Startrampe im Sonnenuntergang, Jahreszahl **2032** ploppt auf, Figuren atmen und blinzeln, langsamer Kamera-Zoom |
| 3–4 s | Greifarm klappt weg, Triebwerk zündet, Rauch, Kamerawackeln, Figuren schauen staunend nach oben |
| 4–8 s | Rakete hebt ab, Kamera schwenkt mit, eine Figur winkt |
| 8–12 s | Nacht bricht herein, Sterne erscheinen, Jahreszahl rast von 2032 auf **2256** (Zeitdilatation) |

## Neu rendern

```bash
node render.js            # → szene01.mp4
node render.js --still 5  # → still.png (Einzelbild bei 5 s, zum schnellen Testen)
```

Benötigt Node.js, Playwright (Chromium) und ffmpeg.

## Anpassen

Alles steht in `scene.html` und ist eine Funktion der Zeit `t`:

- Farben des Himmels: `sky()`
- Figuren (Kittel, Brille, Helm, Winken): `people()` / `stickman()`
- Start-Zeitpunkt und Beschleunigung der Rakete: `rocketLift()`
- Jahres-Zähler (Start- und Endjahr): `yearAt()`
- Nacht-Übergang: `nightFactor()`
