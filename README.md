# Color Code

A browser-based, local multiplayer tile placement game for 2–6 players. No installation required — plays directly in the browser, pass-and-play on a single device.

**[Play now →](https://raymondcascella.github.io/tilegame)**

---

## How to Play

Players take turns placing tiles from their hand onto a shared board. Each tile has a **color** and a **shape**. Tiles placed in a line must share exactly one attribute — all the same color with different shapes, or all the same shape with different colors. No duplicates allowed in a line.

On your turn you can:
- **Place** one or more tiles (same row or column, all valid)
- **Swap** tiles from your hand back into the bag
- **Pass** your turn

The game ends when the bag empties and a player clears their hand, or when all players pass consecutively.

## Scoring

Each tile scores points equal to the length of every line it contributes to. Complete a full line of 6 to earn a **Color Code bonus** (+6 points). The player who empties their hand when the bag runs out earns an extra +6.

## Kids Mode

A dedicated **Kids Mode** for ages 4–6 features:
- Reduced 48-tile set (4 colors × 4 shapes × 3 copies)
- Bright pastel theme with larger tiles and playful fonts
- Auto-skip when no valid move exists — no Swap or Pass needed

## Tech

- Vanilla JavaScript, ES modules — no build step
- HTML5 Canvas board with pan and zoom
- Hosted on GitHub Pages

## v1.0.0

Initial release. Classic mode (2–6 players, 108 tiles) and Kids Mode both ship in this version.
