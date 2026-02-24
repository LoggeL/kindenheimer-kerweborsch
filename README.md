# 🍷 Kindenheimer Kerweborsch

Offizielle Website der **Kindenheimer Kerweborsch** — dem Traditionsverein aus Kindenheim in der Pfalz.

🌐 **[kindenheimer-kerweborsch.de](https://kindenheimer-kerweborsch.de)**

---

## Was ist das?

Eine statische Website (GitHub Pages), die den Verein und seine jährlichen Events vorstellt. Kein Framework, kein Build-Step — einfach HTML, CSS und ein bisschen JavaScript.

## Events

| Event | Datum | Seite |
|-------|-------|-------|
| 🥾 **Wein per Pedes** | 10. Mai (Muttertag) | [`/wein-per-pedes`](https://kindenheimer-kerweborsch.de/wein-per-pedes/) |
| 🍻 **1. Mai** | 1. Mai | [`/mai`](https://kindenheimer-kerweborsch.de/mai/) |
| 👨 **Vatertag** | Christi Himmelfahrt | [`/vatertag`](https://kindenheimer-kerweborsch.de/vatertag/) |
| 🧀 **Käskuchenwanderung** | Sommer | [`/kaeskuchenwanderung`](https://kindenheimer-kerweborsch.de/kaeskuchenwanderung/) |
| 🎪 **Kerwe** | 4. September | [`/kerwe`](https://kindenheimer-kerweborsch.de/kerwe/) |
| 🎤 **Meets X** | variabel | [`/meets-x`](https://kindenheimer-kerweborsch.de/meets-x/) |

## Interaktive Karte (Wein per Pedes)

Unter [`/wein-per-pedes/map`](https://kindenheimer-kerweborsch.de/wein-per-pedes/map/) gibt es eine Leaflet-basierte Karte mit:

- 🍷 8 Weingut-/Vereinsstationen mit Angeboten & Preisen
- 🅿️ Parkplätze
- 🚶 Wanderroute (~9 km)
- 📍 Live-Standortverfolgung (GPS)

### Dev Mode

Für die Bearbeitung der Kartenroute: `?dev=1` an die Map-URL hängen.

- Marker (Stationen & Parkplätze) per Drag verschieben
- Auf den Pfad klicken → neuen Wegpunkt einfügen
- Rechtsklick auf Wegpunkt → entfernen
- Wegpunkte per Drag verschieben
- **📋 Copy stations.js** / **📋 Copy path** → aktualisierte Daten in die Zwischenablage

## Projektstruktur

```
├── index.html              # Hauptseite (Countdown, Galerie, Events)
├── CNAME                   # Custom Domain
├── favicon.svg
├── logo.svg / .png / .jpg
├── wein-per-pedes/
│   ├── index.html          # Event-Seite
│   └── map/
│       ├── index.html      # Interaktive Karte
│       ├── script.js       # Leaflet-Logik + Dev Mode
│       ├── stations.js     # Stationen, Parkplätze, Wegpunkte
│       └── styles.css
├── kerwe/
├── mai/
├── vatertag/
├── kaeskuchenwanderung/
└── meets-x/
```

## Tech Stack

- Vanilla HTML/CSS/JS — kein Build nötig
- [Leaflet](https://leafletjs.com/) für die Karte (Esri Satellite Tiles)
- [Font Awesome](https://fontawesome.com/) Icons
- Google Fonts (Playfair Display + Lato/Inter)
- GitHub Pages + Cloudflare (Custom Domain)

## Deployment

Push auf `main` → GitHub Pages baut und deployed automatisch.

## Lizenz

© 2026 Kindenheimer Kerweborsch — Kindenheim, Pfalz
