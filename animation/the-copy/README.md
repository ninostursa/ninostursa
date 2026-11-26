# Patent 2080 · File 009 · The Copy (Neuauflage im 2D-Stil)

Erklärvideo 1920×1080, 30 fps, **3:22**, englische Erzählung mit den ElevenLabs-Stimmen des Wissenskanals.

## Roter Faden & Spannung

- **Kalt-Einstieg mit Witz und Schock:** Sonntagsessen bei den Millers. Papa ist seit drei Jahren tot, kommt aber trotzdem jeden Sonntag zum Essen, als Roboter, der Motoröl trinkt.
- **Offene Schleife:** „Es gibt eine Frage, die diese Familie ihm nie zu stellen gewagt hat.“ Die Fragekarte (Umschlag mit „?“) bleibt das ganze Video über oben rechts zu sehen und wird erst am Ende geöffnet.
- **Versprechen an den Zuschauer:** „Am Ende des Videos entscheidest du, ob du an diesem Tisch sitzen würdest.“
- **Kapitel mit Fakten,** jede Szene mit eigenem Bild-Gag: Chat, Beerdigung, VR, Fliegenhirn, Klavier-Blaupause, Labor, drei Tests, Werbe-Unterbrechung des Roboters, Regeln, Urteil, Zeitraffer.
- **Auflösung:** Lily fragt „Dad? Are you still you?“, der Roboter antwortet „I think so. But I would say that, wouldn't I?“ und zwinkert.
- **Schluss wie im Kanal:** „Patent status: pending“, Kommentar-Frage und Vorschau auf das nächste File (Gedankenchip).

## Stimmen

| Rolle | ElevenLabs-Stimme | ID |
|---|---|---|
| Erzähler | Jarnathan (wie Wissenskanal), Tempo 1,1 | `c6SfcYrb2t09NHXiT80T` |
| Roboter-Papa | Retro Robot | `ZEcx3Wdpj4EvM8PltzHY` |
| Lily | Jessica | `cgSgspJ2msm6clMCkdW9` |

## Dateien

- `narration.py`: Sprechertext, Stimmen, erzeugt `audio/*.mp3` und `timeline.json`
- `lib.js`: Zeichen-Bibliothek (gezeichnete Menschen, Roboter, Requisiten, Text)
- `scenes.js`: die 20 Szenen, die Kamera, der rote Faden, Kapitel-Einblendungen und die Soundeffekt-Liste
- `mix.py`: Musik und Effekte synthetisieren, Erzählung mischen, Ducking, Lautheit auf -14 LUFS bringen
- `render.js`: Bilder rendern und das MP4 bauen

```bash
python3 narration.py          # Stimme (nur fehlende Clips; --force = alle neu)
node render.js --sheet        # Übersicht stills/sheet.png
node render.js                # komplettes Video the-copy.mp4
```

Für ElevenLabs muss der API-Schlüssel verfügbar sein. In der Cloud-Umgebung setzt der Proxy ihn automatisch ein.

## Quellen (für die Beschreibung)

- Joshua Barbeau / Project December: San Francisco Chronicle, „The Jessica Simulation“ (2021)
- Marina Smith / StoryFile, Beerdigung 2022: BBC und andere Berichte (2022)
- „Meeting You“, MBC (Südkorea, 2020): Mutter trifft ihre verstorbene Tochter in VR
- FlyWire, vollständiger Schaltplan des Fliegenhirns: Dorkenwald et al., *Nature* (Okt. 2024), 139.255 Neuronen, ca. 54,5 Mio. Synapsen
- Menschliches Gehirn mit ca. 86 Milliarden Neuronen: Azevedo et al. (2009)
- Warnung vor „Deadbots“/Grief-Bots: Hollanek & Nowaczyk-Basińska, Univ. Cambridge, *Philosophy & Technology* (2024)
- Das Urteil „nicht in diesem Jahrhundert“ ist eine eigene Einschätzung und wird im Video auch so genannt.
