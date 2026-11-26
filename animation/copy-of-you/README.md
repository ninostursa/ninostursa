# The Copy Of You That Never Dies

Short im Hochformat 1080×1920, 30 fps, 44 s, mit Ton. Eigener flacher 2D-Stil: Petrol/Mint im Labor, warmes Abendlicht im Esszimmer, Figuren mit dunkelblauen Köpfen und ovalen Augen.

## Ablauf

| Zeit | Szene |
|---|---|
| 0–5 s | Labor. Titel „The Copy Of You That Never Dies“. Max sitzt mit Scan-Helm im Stuhl, daneben der Roboter in der Glaskapsel |
| 5–11 s | Upload: Datenpakete fliegen durchs Kabel, Fortschrittsbalken bis 100 %, Max schwitzt |
| 11–17 s | Roboter erwacht (Gong, Lichtblitz), Glas fährt hoch. Spiegel-Gag: beide neigen gleichzeitig den Kopf und winken gleichzeitig. „Same memories. Same jokes.“ |
| 17–29 s | Sonntagsessen. Alle essen Spaghetti, der Roboter schenkt sich Öl ein, trinkt es, aus der Antenne dampft es. Max und Roboter sagen gleichzeitig „Delicious!“, das Kind schaut hin und her. Kind und Roboter stoßen an (Saft gegen Öl) |
| 29–37 s | Zeitraffer 2061 → 2163: Fenster wechselt Tag/Nacht, Pflanze wächst, Bilderrahmen werden mehr. Max wird grau und verschwindet (sein Bild hängt jetzt golden an der Wand), Frau geht, Kind wächst auf, wird alt, geht. Neue Generation setzt sich an den Tisch. Der Roboter trinkt weiter Öl und bekommt ein Pflaster |
| 37–44 s | Zoom auf den Roboter: „Would it still be you?“, er zwinkert in die Kamera |

## Sprechertext (Vorschlag, ca. 40 s)

**Deutsch**
> Stell dir vor, man könnte dein Gehirn komplett hochladen. Jede Erinnerung, jeder Gedanke, jeder schlechte Witz.
> *(Upload)* Ein paar Sekunden später wacht er auf: deine Kopie. Sie kennt deinen Namen, deine Familie, sogar dein WLAN-Passwort.
> *(Essen)* Sonntagsessen. Fast wie immer. Nur dass einer am Tisch Motoröl trinkt und es „lecker“ findet.
> *(Zeitraffer)* Die Jahre vergehen. Du wirst alt. Deine Kinder werden alt. Aber deine Kopie? Die bleibt. Hundert Jahre. Vielleicht für immer.
> *(Schluss)* Also: Wäre das noch DU? Oder nur jemand, der genau so lacht wie du? Schreib's in die Kommentare.

**English**
> Imagine uploading your entire brain. Every memory, every thought, every bad joke.
> Seconds later, it wakes up: your copy. It knows your name, your family, even your Wi-Fi password.
> Sunday dinner. Almost normal. Except one of you is drinking motor oil and calling it delicious.
> Years pass. You get old. Your kids get old. But your copy? It stays. A hundred years. Maybe forever.
> So… would it still be YOU? Or just someone who laughs exactly like you? Tell me in the comments.

## Rendern

```bash
node render.js --lang en           # → copy-of-you_en.mp4
node render.js --lang de           # → copy-of-you_de.mp4
node render.js --stills 3,20,41    # → Testbilder still_<t>.png
```

Benötigt Node.js, Playwright (Chromium) und ffmpeg. Texte stehen oben in `scene.html` im Objekt `TXT`.
