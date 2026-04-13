# Tile Game (Qwirkle Clone) — Design Spec
**Date:** 2026-04-12

## Overview

A browser-based, local multiplayer Qwirkle clone for 2–6 players. Vanilla JavaScript with ES modules, hosted on GitHub Pages. No build tools required.

## Platform & Stack

- **Platform:** Web (GitHub Pages)
- **Multiplayer:** Local (pass-and-play, same device)
- **Players:** 2–6 (chosen at start screen)
- **Tech:** Vanilla JS ES modules, HTML5 Canvas, CSS
- **No build step** — load via `<script type="module">` in `index.html`

## Module Structure

| File | Responsibility |
|------|----------------|
| `index.html` | Entry point, canvas, hand/UI elements |
| `src/bag.js` | 108-tile draw bag (6 shapes × 6 colors × 3 copies), shuffle, draw |
| `src/rules.js` | Placement validation — a tile must match color OR shape with neighbors; a line can't mix both attributes |
| `src/board.js` | Sparse grid as `Map<"x,y", Tile>`, place/get/neighbors |
| `src/scoring.js` | Count tiles in each line through placed tile; 6-point Qwirkle bonus for completing a line of 6 |
| `src/game.js` | Turn state machine — whose turn, staged tiles, pass/swap logic, end-game detection |
| `src/ui.js` | Canvas rendering, pan/zoom, click-to-place interaction, player hands, scores |

## Data Model

```js
// Tile
{ shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'clover',
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' }

// Board
Map<string, Tile>  // key: "x,y"

// Player
{ name: string, hand: Tile[], score: number }

// Turn state
{ currentPlayerIndex: number,
  staged: Array<{ x, y, tile }>,  // placed this turn, not yet committed
  mode: 'place' | 'swap' | 'pass' }
```

## UI & Interaction

- **Board:** HTML5 `<canvas>`, tiles drawn as colored shapes on a grid
- **Pan/zoom:** Mouse drag to pan, scroll wheel to zoom
- **Tile selection:** Click a tile in hand to select it, click a board cell to stage it
- **Staged tiles:** Visible on board but recalled until "Play" is pressed
- **Actions:** "Play" (commit turn), "Swap" (exchange selected tiles with bag), "Pass" (skip turn)
- **Sidebar:** Current player name, all player scores, remaining bag count

## Game Flow

1. **Start screen:** Enter player count (2–6) and optionally player names
2. **Setup:** Shuffle bag, deal 6 tiles to each player, randomly pick first player
3. **Turn loop:**
   - Active player places 1+ tiles (same row or column, all valid), OR swaps, OR passes
   - After committing, draw back up to 6 tiles from bag
   - Pass turn to next player
4. **End condition:**
   - Bag is empty AND a player empties their hand → that player gets +6 bonus points
   - OR all players pass consecutively → game ends immediately
5. **Winner:** Player with highest score

## Placement Rules (Simplified)

- All tiles placed in a turn must be in the same row or column
- Each tile placed must form valid lines with its neighbors:
  - A line shares exactly one attribute (all same color, different shapes — OR all same shape, different colors)
  - No duplicate tiles in a line
- Staged tiles are validated together before committing

## Scoring

- Each tile placed scores points equal to the length of every line it contributes to (horizontal + vertical, minimum 1 per line)
- Completing a line of 6 (Qwirkle) awards a 6-point bonus on top
- Player who empties hand when bag is empty: +6 bonus

## File Layout

```
tilegame/
├── index.html
├── src/
│   ├── bag.js
│   ├── rules.js
│   ├── board.js
│   ├── scoring.js
│   ├── game.js
│   └── ui.js
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-12-tile-game-design.md
```
