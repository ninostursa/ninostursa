# Stil-Vorlage für den neuen Kanal

Gilt für alle neuen Erklärvideos. Kanal: **Patent Future** (@patentfuture). Die Referenz ist `the-copy/` (File 001).

**Jede Folge hat ein komplett neues Thema mit eigenen Figuren und eigener Geschichte.** Wiedererkennbar ist der Kanal am Stil, an der Stimme und am festen Rahmen, nicht an wiederkehrenden Figuren.

## Look
- **Flache 2D-Vektorgrafik**, keine Umrisslinien, weiche Verläufe, Leuchten, schwebende Staubpartikel, dunkle Vignette.
- **Farben:** Erklärteile in Petrol/Navy (`#06121c` → `#10283a`) mit Mint `#5ef2c8`. Dazu Koralle `#ff7a59`, Sonnengelb `#ffd166` und warmes Pflaume-Abendlicht für Szenen zu Hause.
- **Figuren sind gezeichnete Menschen, keine Strichmännchen:** Haut, Haare, Kleidung, Augen mit Glanzpunkt, Brauen, Nase, Mund mit Ausdruck. Wer sitzt, sitzt auf einem Stuhl mit sichtbaren Beinen. Figuren am Tisch sitzen ruhig, die Hände liegen auf dem Tisch, ohne Ess- oder Armbewegungen. Lebendig wirken sie durch Blicke, Blinzeln und Mimik.
- **Bilder an der Wand:** Die Porträts werden immer auf den Rahmen beschnitten.
- **Figuren pro Folge neu:** passend zum Thema, aber immer im gleichen Zeichenstil (der Roboter-Papa und die Familie Miller gehören nur zu File 001).
- **Schrift:** Inter Black für Schlagzeilen, JetBrains Mono für Daten und Etiketten.

## Erzählung (wie im Wissenskanal)
- **Stimmen:** Englisch, ElevenLabs. Erzähler ist Jarnathan `c6SfcYrb2t09NHXiT80T` (Tempo 1,1), Roboter ist Retro Robot `ZEcx3Wdpj4EvM8PltzHY`, Kind ist Jessica `cgSgspJ2msm6clMCkdW9`.
- **Länge:** etwa 3–3,5 Minuten, ungefähr 28 Sätze.
- **Aufbau:**
  1. Kalt-Einstieg mit Witz und Schock in den ersten 10 Sekunden
  2. Offene Frage als roter Faden, dazu ein sichtbares Objekt in der Ecke
  3. Versprechen: „By the end of this video …“
  4. „This is Patent Future. File number X.“
  5. Kapitel mit echten Fakten und Quellen
  6. Mittendrin ein überraschender Gag
  7. Urteil als eigene Einschätzung
  8. Zeitraffer
  9. Auflösung der offenen Frage
  10. „Patent status: pending“, Kommentar-Frage und Vorschau auf das nächste File

## Spannung
- Alle 3–6 Sekunden passiert im Bild etwas Neues: Kamerafahrt, Ploppen, Zähler, Stempel.
- Jede Behauptung bekommt ein Bild: Etikett mit Ort und Jahr, große Zahlen als hochzählende Zähler.
- Zu jeder Aktion gehört ein Ton. Die Musik wird automatisch leiser, sobald jemand spricht. Ein Puls in den Erklärkapiteln hält die Spannung.

## Technik
`narration.py` → `render.js --sheet` (prüfen) → `render.js` (Video mit Ton, -14 LUFS).

## Was in jeder Folge gleich bleibt
- Zeichenstil, Farben, Schriften, Kapitel-Einblendungen, Etiketten, Stempel, Sounds
- Erzähler Jarnathan und der Rahmen „This is Patent Future. File number X.“ … „Patent status: pending“ mit Vorschau aufs nächste File
- Offene Frage als roter Faden mit einem passenden Objekt in der Ecke (das Objekt wechselt je nach Thema)
