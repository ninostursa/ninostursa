# Umzug in den neuen Chat: alles zu „Patent Future“

> **So benutzen:** Neuen Chat in der Claude-App **auf dem PC** im Ordner
> `D:\CloudeCodeAI\Patent Future Youtube Kanal` starten und als erste Nachricht schreiben:
> „Lies `UEBERGABE.md` und mach dort weiter.“ (Diese Datei vorher in den Ordner legen.)
> Sprich mit mir auf **Deutsch**; die Videos selbst sind auf **Englisch**.

---

## 1. Der Kanal

| | |
|---|---|
| Name | **Patent Future** |
| Handle | **@patentfuture** |
| Konto | Brand-Konto unter dem Google-Konto von Nino (neben „Patent 2080“, „Lina & Milli“, „Nino Stursa“) |
| Konzept | Erfindungen, die es noch nicht gibt, erklärt: eine Zukunftsmaschine pro Folge, die echte Wissenschaft dahinter, der Haken und ein ehrliches Urteil |
| Slogan | „Inventions that don't exist yet. Explained.“ |
| Folgen heißen | **File 001, File 002, …** |
| Alter Kanal | „Patent 2080“ bleibt bestehen, wird aber nicht weiter bespielt. Der neue Kanal ist ein frischer Start mit neuem Stil. |

**Wichtig:** **Jede Folge hat ein komplett neues Thema mit neuen Figuren.** Wiedererkennbar ist der Kanal nur über Stil, Erzählstimme und festen Rahmen, nicht über wiederkehrende Figuren. Die Familie Miller und der Roboter-Papa gehören nur zu File 001.

---

## 2. Stand der Dinge

### Fertig
- **File 001 · The Copy:** Video 3:22, 1920×1080, 30 fps, -15,5 LUFS, englische Erzählung
  - Datei: `001-the-copy/the-copy.mp4`
  - Upload-Text: `001-the-copy/upload-text.txt` (3 Titelvorschläge, Beschreibung mit Kapiteln und Quellen, Tags, angepinnter Kommentar, Upload-Einstellungen)
  - Titel-Empfehlung: **„He Died 3 Years Ago. He Still Comes to Dinner.“**
- **Branding:** `branding/profilbild.png` (800×800, Mint-Glühbirne mit Roboter-Gesicht), `branding/banner.png` (2560×1440, Text im sicheren Bereich), `branding/kanal-beschreibung.txt` (Beschreibung und Keywords)

### Offen (nächste Schritte)
1. **Thumbnail für File 001** im gleichen Stil, Vorschlag: der Roboter-Papa am Esstisch mit Ölglas, Text „HE STILL COMES TO DINNER“
2. Profilbild, Banner und Beschreibung in **YouTube Studio → Anpassung** hochladen
3. File 001 hochladen. Bei „Veränderte oder synthetische Inhalte“ **Ja** wählen, die Stimmen sind KI-generiert.
4. **Zu jeder Folge einen Short** (9:16, ca. 30 s) als Zubringer
5. **Thema für File 002** aussuchen. Am Ende von File 001 wird angekündigt: „Next time: a chip that could read your thoughts.“ File 002 sollte also der **Gedankenchip** sein.
6. Vor dem Start 3–5 Folgen auf Vorrat produzieren und dann regelmäßig hochladen (Idee aus dem alten Kanal: etwa alle 4 Tage)

### Hinweis
Im alten Wissenskanal-Projekt (`D:\CloudeCodeAI\YoutubeCloude`) gibt es bereits ein „09-digital-copy“ zum selben Thema, im alten Stil. Für Patent Future gilt nur die neue Version.

---

## 3. Stil (verbindlich für alle Folgen)

Die ausführliche Vorlage steht in `animation/STIL.md`. Die Referenz ist der Code von File 001 in `animation/the-copy/`.

**Look**
- Flache 2D-Vektorgrafik ohne Umrisslinien, mit weichen Verläufen, Leuchten, schwebendem Staub und dunkler Vignette
- Farben: Navy/Petrol `#06121c` → `#10283a`, Mint `#5ef2c8`, Koralle `#ff7a59`, Sonnengelb `#ffd166`. Szenen zu Hause in warmem Pflaume-Abendlicht.
- Schrift: Inter Black für Schlagzeilen, JetBrains Mono für Daten und Etiketten
- Format 16:9 (1920×1080), Länge etwa 3–3,5 Minuten

**Figuren (Wünsche von Nino, unbedingt einhalten)**
- **Richtig gezeichnete Menschen, keine Strichmännchen:** Haut, Haare, Kleidung, Augen mit Glanzpunkt, Brauen, Nase, Mund
- **Immer ganzer Körper:** Wer am Tisch sitzt, sitzt auf einem Stuhl, und die Beine sind unter dem Tisch sichtbar. Nichts wirkt abgeschnitten.
- **Figuren am Tisch sitzen ruhig.** Keine Essbewegungen und keine unnötigen Armbewegungen, die Hände liegen auf dem Tisch. Lebendig wirken sie durch Blicke, Blinzeln und Mimik.
- **Arme natürlich:** Ellbogen zeigen nach unten und außen, nie über den Körper. Hände mit Daumen, die der Unterarm-Richtung folgen. Ärmel haben einen feinen dunkleren Rand, damit sie sich vom Shirt abheben.
- **Bilder an der Wand:** Porträts werden immer auf den Rahmen beschnitten, nichts ragt heraus.
- **Keine Glatzen bei Figuren mit Haaren und keine Bärte ohne Freigabe.** Vor jedem Rendern `node animation/tools/check-hair.js` laufen lassen. Die Regeln stehen im Skill `.claude/skills/figuren-pruefen/SKILL.md`. Liegt der PC-Ordner nicht direkt im Repository, den Ordner `.claude` aus dem Repository mit hineinkopieren, damit der Skill geladen wird.
- Texte in Karten oder Kästen dürfen sich nie mit Symbolen überlappen. Im Zweifel die Karte breiter machen oder den Text umbrechen.

**Ton**
- Musik wird selbst erzeugt: Flächenklang, Arpeggio und in den Erklärkapiteln ein Puls. Sie wird automatisch leiser, wenn gesprochen wird.
- Soundeffekte zu jeder Aktion (Ploppen, Stempel, Whoosh, Zähler)
- **Geräusche müssen realistisch klingen.** Flüssigkeit eingießen klingt nach Blubbern und Gluckern, nicht nach Rauschen.
- Endlautstärke etwa -14 LUFS

---

## 4. Erzählung und Spannungsaufbau

**Stimmen (ElevenLabs, Modell `eleven_multilingual_v2`)**

| Rolle | Stimme | ID | Einstellungen |
|---|---|---|---|
| Erzähler (immer) | Jarnathan | `c6SfcYrb2t09NHXiT80T` | stability .75, similarity .75, style 0, **speed 1.1** |
| Roboter (File 001) | Retro Robot | `ZEcx3Wdpj4EvM8PltzHY` | stability .55, style .2 |
| Kind (File 001) | Jessica | `cgSgspJ2msm6clMCkdW9` | stability .45, style .3 |

Pausen werden mit `<break time="0.5s" />` gesetzt. Der Schlüssel steht in `.env` als `ELEVENLABS_API_KEY=sk_...`.

**Fester Aufbau jeder Folge**
1. **Kalt-Einstieg** (0–10 s) mit Witz und Schock
2. **Offene Frage als roter Faden** mit einem sichtbaren Objekt, das die ganze Folge über in der Ecke steht und am Ende aufgelöst wird
3. **Versprechen:** „By the end of this video, you will …“
4. **Titel:** „This is Patent Future." *(Pause)* „File number X." *(Pause)* „<Titel>.“
5. **Kapitel mit echten Fakten**, jeweils mit Etikett (Ort und Jahr) und hochzählenden Zahlen. Quellen kommen in die Beschreibung.
6. Mittendrin ein **überraschender Gag** (in File 001 macht der Roboter Werbung)
7. **Urteil** als eigene Einschätzung, im Video auch so benannt
8. **Zeitraffer** oder großer Ausblick
9. **Auflösung** der offenen Frage, mit Pointe
10. **Schluss:** „Patent status: pending.“, Kommentar-Frage und „Next time: …“ mit Abo-Aufruf

**Spannung:** Alle 3–6 Sekunden passiert etwas Neues im Bild. Jede Behauptung bekommt ein Bild. Etwa 28 kurze Sätze pro Folge.

---

## 5. Technik und Arbeitsablauf

Alles liegt auf GitHub: **`ninostursa/ninostursa`**, Branch **`claude/light-speed-animation-c9s1xx`**
(ZIP: https://github.com/ninostursa/ninostursa/archive/refs/heads/claude/light-speed-animation-c9s1xx.zip)

```
animation/
├── STIL.md                Stil-Vorlage
├── the-copy/              File 001 (Vorlage für neue Folgen: Ordner kopieren und anpassen)
│   ├── narration.py       Sprechertext + Stimmen → audio/*.mp3 + timeline.json
│   ├── lib.js             Zeichen-Bibliothek: person(), robot(), Requisiten, Text, Karten, Stempel
│   ├── scenes.js          Szenen, Kamera, roter Faden, Kapitel-Einblendungen, Soundeffekt-Liste
│   ├── mix.py             Musik + Effekte + Stimme mischen → mix.wav (-14 LUFS)
│   ├── render.js          Bilder rendern (Playwright/Chromium) + MP4 bauen (ffmpeg)
│   └── scene.html         lädt lib.js + scenes.js
└── branding/branding.html Profilbild und Banner (?mode=avatar / ?mode=banner)
patent-future/             Kanal-Ordner (branding/, 001-the-copy/, 002-next/)
```

**Ablauf für eine neue Folge**
1. `animation/the-copy/` nach `animation/<thema>/` kopieren
2. Recherche und Skript schreiben (etwa 28 Sätze, Aufbau siehe oben), in `narration.py` eintragen
3. `python narration.py`: erzeugt die Stimmen und `timeline.json` (die Länge prüfen)
4. In `scenes.js` neue Szenen bauen. Die Zeitsteuerung läuft über `S(id)`, `E(id)` und `F(id, Anteil)`, damit passt alles automatisch zur Stimme.
5. `node render.js --sheet`: Übersicht aller 4 s in `stills/sheet.png`. Einzelbilder mit `--stills 12,30`. Das Ergebnis immer ansehen und prüfen!
6. `node render.js`: Video mit Ton, dauert etwa 8 Minuten
7. Video, Thumbnail und Upload-Text nach `patent-future/<nnn>-<thema>/`

**Auf dem PC nötig:** Python mit `numpy`, Node.js mit `playwright` (`npx playwright install chromium`), ffmpeg (über winget vorhanden), `.env` mit dem ElevenLabs-Schlüssel.
Unter Windows eventuell Pfade in `render.js` anpassen (`file://`-Pfad, `python` statt `python3` in `render.js` beim Aufruf von `mix.py`).

---

## 6. Wie Nino arbeitet (Vorlieben)
- Kommunikation auf **Deutsch**, kurz und klar
- Ergebnisse **zeigen**, also Video oder Bilder schicken, und vorher selbst prüfen (Einzelbilder ansehen)
- Bei größeren Fragen (z. B. Kanalname) **erst antworten, dann umsetzen**
- Mag Witz in den Videos, aber die Figuren sollen natürlich und „normal gezeichnet“ wirken
- Vor dem Hochladen eines Videos noch nichts fest planen: erst mehrere Folgen fertig machen, dann gemeinsam den Zeitplan festlegen
