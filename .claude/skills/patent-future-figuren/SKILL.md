---
name: patent-future-figuren
description: Regeln und Prüfliste für gezeichnete Figuren in Patent-Future-Videos, Thumbnails und Shorts (Haare ohne Glatzenstellen, Bart folgt dem Blick, sitzen mit Händen auf dem Tisch, ganzer Körper, natürliche Arme). Verwenden, bevor Figuren mit person()/robot() aus lib.js gezeichnet, geändert oder geprüft werden.
---

# Figuren zeichnen für Patent Future

Die Figuren entstehen mit `person()` und `robot()` aus `repo/animation/<folge>/lib.js`. Ninos Wünsche sind verbindlich. Prüfe jedes Bild mit Figuren, **bevor** du es zeigst.

## Verbindliche Regeln

1. **Richtig gezeichnete Menschen, keine Strichmännchen.** Sie haben Haut, Haare, Kleidung, Augen mit Glanzpunkt, Brauen, Nase und einen Mund mit Ausdruck.
2. **Haare ohne Glatzenstellen.** Bei jeder Frisur außer `bald` muss der Scheitel lückenlos mit Haar bedeckt sein. Über dem Haaransatz darf keine Haut durchblitzen. `person()` zeichnet dafür eine Haarkappe in der Haarfarbe. Wer eine neue Frisur in `HAIR` anlegt, prüft sie auf der Testtafel.
3. **Bart folgt dem Blick.** Wenn eine Figur nach links, rechts, oben oder unten schaut (`look`), wandern Augen, Mund **und Bart** mit. Der Bart bleibt innerhalb der Kopfform und liegt unter dem Mund. Das erledigt `person()` automatisch, sofern der Bart über `beard: true` kommt. Bärte nie getrennt nachzeichnen.
4. **Immer der ganze Körper.** Wer am Tisch sitzt, sitzt auf einem Stuhl, und die Beine sind unter dem Tisch sichtbar (`legs: 'sit'`, `foot: FLOOR`). Wer steht, steht mit den Füßen auf dem Boden (`legs: 'stand'`). Nichts wirkt abgeschnitten. Am Bildrand angeschnittene **Gegenstände** sind okay.
5. **Am Tisch sitzen alle ruhig.** Die Hände liegen auf dem Tisch, Standardhaltung `hL: [x - 58*s, TY - 4]`, `hR: [x + 58*s, TY - 4]`. Es gibt keine Ess- und keine unnötigen Armbewegungen. Lebendig wirken die Figuren durch Blicke, Blinzeln (`blinkAt`) und Mimik (`mouth`, `brows`). Diese bewährte Haltung nicht eigenmächtig „verbessern“: Nino fand gestreckte Arme an der Tischkante unnatürlich.
6. **Arme natürlich.** Die Ellbogen zeigen nach unten und außen, nie über den Körper. Die Hände haben einen Daumen in Richtung Unterarm. Ärmel haben einen feinen dunkleren Rand. Das macht `elbow()`, also Handpositionen so wählen, dass die Arme nicht überstreckt sind.
7. **Porträts an der Wand** werden immer auf den Rahmen beschnitten (`clipPath`). Nichts ragt heraus.
8. **Text und Symbole überlappen nie.** Karten lieber breiter machen oder den Text umbrechen. Schlagzeilen im Thumbnail dürfen keine Gesichter verdecken.
9. **Jede Folge hat neue Figuren.** Keine wiederkehrenden Figuren, keine Gags oder Querverweise aus anderen Folgen oder Kanälen.

## Prüfablauf

1. **Testtafel** bei Änderungen an `lib.js` oder neuen Frisuren rendern. Sie zeigt alle Frisuren × Blick links/geradeaus/rechts, mit und ohne Bart:
   ```
   cd repo/animation && node thumb.js mind-reader/test-figuren.html mind-reader/stills/test-figuren.png
   ```
   Dann das Bild ansehen: keine Haut am Scheitel, der Bart sitzt in jeder Blickrichtung unter dem Mund.
2. **Übersicht der Folge** mit `node render.js --sheet` rendern und ansehen.
3. **Detailbilder** der Szenen mit Figuren mit `node render.js --stills t1,t2,…` rendern, vor allem Nahaufnahmen, Reaktionen und Szenen mit Bart oder Seitenblick. Bei Nahaufnahmen genau auf Haaransatz, Bart und Hände achten.
4. Erst danach das ganze Video rendern (`node render.js`) und Nino Ergebnisse zeigen.

## Häufige Fehler
- Haut über dem Haaransatz (Haar reicht nicht bis zum Scheitel): Haarkappe fehlt oder eine neue Frisur ist zu flach.
- Der Bart bleibt stehen, während Augen und Mund zur Seite schauen.
- Hände verschwinden hinter Tellern oder Tischkanten. Wie im Video lassen, solange die Standardhaltung genutzt wird.
- Bei liegenden Figuren (z. B. im Scanner) die Drehrichtung prüfen: Der Kopf muss sichtbar sein.
