# Übergabe für den neuen Chat (Claude auf dem PC)

Diesen Text in den neuen Chat einfügen, der im Ordner `D:\CloudeCodeAI\Patent Future Youtube Kanal` läuft:

---

Wir machen weiter mit meinem neuen YouTube-Kanal **Patent Future** (@patentfuture). Alles bisherige liegt auf GitHub im Repository `ninostursa/ninostursa`, Branch `claude/light-speed-animation-c9s1xx`.

1. Hol dir den Branch in diesen Ordner (git clone bzw. fetch des Branches), ohne vorhandene Dateien hier zu löschen.
2. Lies zuerst `animation/STIL.md` (Stil-Vorlage: Look, Erzählung, Spannung, Stimmen) und `patent-future/README.md` (Ordnerstruktur).
3. Die fertige Referenzfolge ist **File 001 · The Copy** in `animation/the-copy/`:
   - `narration.py`: Sprechertext + ElevenLabs (liest `ELEVENLABS_API_KEY` aus `.env`)
   - `lib.js`: Zeichen-Bibliothek (gezeichnete Menschen mit natürlichen Armen und Händen, Roboter, Requisiten)
   - `scenes.js`: Szenen, Kamera, roter Faden, Kapitel, Soundeffekte
   - `mix.py`: Musik, Effekte und Mischung auf -14 LUFS (braucht numpy)
   - `render.js`: Bilder mit Playwright/Chromium rendern, MP4 mit ffmpeg bauen
4. Die Kanal-Dateien gehören in diese Ordnerstruktur:
   `branding\` (Profilbild, Banner, Kanalbeschreibung), `001-the-copy\` (Video, Upload-Text), `002-...\` usw.

**Regeln für alle Folgen:**
- Jede Folge hat ein komplett neues Thema mit neuen Figuren. Gleich bleiben Stil, Erzähler (Jarnathan), Rahmen und Aufbau.
- Rahmen: „This is Patent Future. File number X.“ … „Patent status: pending.“ plus Vorschau auf das nächste File.
- Englisch, 16:9, etwa 3–3,5 Minuten, Spannung halten wie in File 001.
- Zu jeder Folge: Video, Thumbnail, Upload-Text (Titel, Beschreibung mit Kapiteln und Quellen, Tags, angepinnter Kommentar).

Nächster Schritt: Thumbnail für File 001, danach Thema für File 002 auswählen.

---

## Was auf dem PC installiert sein muss
- Python mit `numpy` (`pip install numpy`)
- Node.js mit Playwright (`npm i playwright` und `npx playwright install chromium`)
- ffmpeg (ist bei dir schon über winget installiert)
- `.env` mit `ELEVENLABS_API_KEY=sk_...` im Kanal-Ordner oder darüber

Der neue Chat kann das alles selbst prüfen und einrichten.
