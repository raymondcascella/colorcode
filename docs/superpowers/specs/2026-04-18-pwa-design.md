# PWA Support — Design Spec
**Date:** 2026-04-18

## Overview

Add Progressive Web App support to Color Code so it can be installed on mobile and desktop and played offline. The game is fully static and client-side, so a simple cache-first strategy covers all offline needs with no architectural changes.

## Files Changed

| File | Action |
|------|--------|
| `manifest.json` | New — app metadata and icons |
| `sw.js` | New — cache-first service worker |
| `index.html` | Updated — link manifest, register SW |

## manifest.json

```json
{
  "name": "Color Code",
  "short_name": "Color Code",
  "start_url": "/colorcode/",
  "scope": "/colorcode/",
  "display": "standalone",
  "background_color": "#0e0e0e",
  "theme_color": "#e8ff47",
  "icons": [
    { "src": "icons/icon-192.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "any" },
    { "src": "icons/icon-512.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "any" }
  ]
}
```

- `display: standalone` — hides browser chrome when installed
- `theme_color` uses the lime accent from classic mode
- `start_url` and `scope` are scoped to `/colorcode/` to match GitHub Pages deployment

## Icons

Two SVG files in `icons/`: `icon-192.svg` and `icon-512.svg` (same design, different `viewBox` sizes).

Design: white circle background, bold "CC" letters filled with horizontal rainbow stripes (red → orange → yellow → green → blue → purple) using an SVG `<clipPath>`.

## sw.js — Service Worker

Cache name: `colorcode-v1`

**Install:** pre-cache the app shell:
- `/colorcode/` (or `index.html`)
- `src/main.js`, `src/bag.js`, `src/board.js`, `src/game.js`, `src/rules.js`, `src/scoring.js`, `src/ui.js`

**Fetch:** cache-first — serve from cache if present, fall back to network. Google Fonts requests are passed through (cross-origin, not cached).

**Activate:** delete any old cache versions (keys not matching `colorcode-v1`).

## index.html Changes

1. Add in `<head>`:
   ```html
   <link rel="manifest" href="manifest.json" />
   <meta name="theme-color" content="#e8ff47" />
   <link rel="apple-touch-icon" href="icons/icon-192.svg" />
   ```

2. Add before `</body>`:
   ```html
   <script>
     if ('serviceWorker' in navigator) {
       navigator.serviceWorker.register('sw.js');
     }
   </script>
   ```

## Scope

- Offline play works after first load
- Install prompt available on Chrome/Edge/Android/Safari
- No sound, no push notifications, no background sync
- Google Fonts degrade gracefully to system sans-serif if offline
