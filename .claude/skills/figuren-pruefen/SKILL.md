---
name: figuren-pruefen
description: Pflicht-Check für gezeichnete Figuren in den Patent-Future-Animationen (animation/*/lib.js, scenes.js). Verwenden, sobald eine Figur, Frisur, ein Bart oder ein Gesicht neu gebaut oder geändert wird, und vor jedem Rendern eines Videos, Shorts, Thumbnails oder Banners.
---

# Figuren prüfen (Wünsche von Nino, verbindlich)

## Regeln
1. **Keine Glatzen bei Figuren mit Haaren.** Das Vorderhaar muss den ganzen Oberkopf bedecken. Der Scheitelpunkt
   der Haar-Kurve liegt mindestens 6 Einheiten über der Kopfoberkante (`hy - 58*s`). Haut darf oben nur bei
   der Frisur `bald` sichtbar sein, und `bald` nur, wenn die Rolle das ausdrücklich verlangt.
2. **Keine Bärte ohne Freigabe.** Neue Figuren bekommen standardmäßig keinen Bart. Ein Bart kommt nur dazu, wenn Nino
   ihn vorher auf einem Probebild freigegeben hat (bisher freigegeben: der kurze Vollbart `full` beim Papa in File 001).
   Der Bart sitzt fest am Kinn und wandert beim Seitenblick nicht mit, damit keine Hautlücke entsteht.
3. Ganzer Körper, natürliche Arme (Ellbogen nach unten/außen), Hände mit Daumen, Figuren am Tisch sitzen ruhig.
4. Porträts an der Wand sind auf den Rahmen beschnitten, Texte überlappen keine Symbole.

## Ablauf
1. Frisuren automatisch prüfen:
   ```
   cd animation && node tools/check-hair.js the-copy/lib.js   # bzw. lib.js der aktuellen Folge
   ```
   Jede Zeile muss `OK` sein. Danach `animation/tools/hair-check.png` ansehen (Übersicht aller Frisuren).
2. Bei `FEHLER`: die Vorderhaar-Kurve in `HAIR.<stil>[1]` höher ziehen (Kontrollpunkte etwa `y - 86*s`) und erneut prüfen.
3. Nahaufnahmen prüfen: `node render.js --stills <zeiten>` für jede Szene mit einer neuen oder geänderten Figur,
   Köpfe ausschneiden und ansehen (Haaransatz, Bart, Augen, Hände).
4. Änderungen am Aussehen zuerst als **Probebild** zeigen und erst nach Ninos Freigabe überall einbauen.
5. Lib-Änderungen betreffen auch `the-copy/thumbnail.html` und `branding/branding.html` (Banner):
   beide danach neu rendern und ansehen.
