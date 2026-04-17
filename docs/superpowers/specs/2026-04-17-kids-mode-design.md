# Kids Mode — Design Spec
**Date:** 2026-04-17

## Overview

A selectable "Kids Mode" for Color Code targeting pre-readers (ages 4–6). Activated from the start screen, it uses a reduced tile set, simplified rules (no swap/pass), and a bright visual theme. All existing game logic modules are unchanged.

## Start Screen

A mode toggle is added above the player count selector: two large buttons — "Classic" (default, current dark style) and a kids icon button (e.g. 🎨). Selecting kids mode highlights that button and stores a `kidsMode: true` flag passed into the game on start. Player count and name entry work identically in both modes.

## Tile Set & Rules

Kids mode uses a reduced bag:
- **4 colors:** red, yellow, green, blue
- **4 shapes:** circle, square, star, diamond
- **3 copies each → 48 tiles total**

Placement rules are identical to classic mode — match by color OR shape, no duplicates in a line. Scoring is identical.

**Swap and Pass buttons are hidden entirely.** Each turn a player must place at least one valid tile. If no valid placement exists, the turn is auto-skipped with a visual cue (shake animation + emoji flash). End-game detection is unchanged — bag empty + hand empty, or all players consecutively auto-skipped.

## Visual Theme

When kids mode is active, a `kids-mode` class is added to `<body>`. CSS variable overrides drive the entire theme change with no structural HTML changes:

| Element | Classic | Kids Mode |
|---------|---------|-----------|
| Background | `#0e0e0e` | `#fffdf5` (soft cream) |
| Surface | `#161616` | `#f0f4ff` (light pastel) |
| Accent | `#e8ff47` (lime) | vibrant coral/orange |
| Font | Bebas Neue / DM Mono | Fredoka One (Google Fonts) |
| Tiles | standard cell size | larger cells, thicker outlines |
| Scores | small monospace numbers | large colorful numbers |
| Action buttons | Play / Swap / Pass | Play only, as large round ▶ icon |
| Sidebar labels | text (bag count, "Hand") | emoji (🎒, ✋) |
| Animations | none | bounce/pop on placement, score flash |

## Implementation Seam

Three files change; four are untouched.

### Changed

| File | Change |
|------|--------|
| `src/main.js` | Read `kidsMode` flag from start screen; pass to `Game` constructor; apply/remove `kids-mode` body class |
| `src/bag.js` | `createBag(kidsMode)` builds 4×4×3 set when true, 6×6×3 when false |
| `src/ui.js` | `kidsMode` controls larger cell size, hides Swap/Pass, renders emoji labels, triggers placement animations |

### Unchanged

`src/rules.js`, `src/scoring.js`, `src/board.js`, `src/game.js` — the smaller tile set naturally constrains valid moves without any rule logic changes. Auto-skip (no valid placement) is a new case in `game.js` alongside the existing all-pass end-game check.

## Data Flow

```
Start screen
  └─ kidsMode flag
       ├─ main.js → body.classList toggle (CSS theme)
       ├─ bag.js  → createBag(kidsMode) → 48 or 108 tiles
       └─ ui.js   → cell size, button visibility, emoji labels, animations
```

## Out of Scope

- Sound effects
- Animated characters or mascots
- Tutorial / guided first-turn walkthrough
- Touch/tablet-specific layout changes
