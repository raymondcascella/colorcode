export const SHAPES = ['circle', 'cross', 'diamond', 'square', 'star', 'clover'];
export const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

export const KIDS_SHAPES = ['circle', 'square', 'star', 'diamond'];
export const KIDS_COLORS = ['red', 'yellow', 'green', 'blue'];

/** Create and shuffle a tile bag. Pass kidsMode=true for the 4×4×3 (48-tile) kids set. */
export function createBag(kidsMode = false) {
  const shapes = kidsMode ? KIDS_SHAPES : SHAPES;
  const colors = kidsMode ? KIDS_COLORS : COLORS;
  const tiles = [];
  for (const shape of shapes) {
    for (const color of colors) {
      for (let i = 0; i < 3; i++) {
        tiles.push({ shape, color });
      }
    }
  }
  // Fisher-Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

/**
 * Draw `count` tiles from the bag (mutates bag in place).
 * Returns drawn tiles. If bag has fewer than count, returns all remaining.
 */
export function drawTiles(bag, count) {
  return bag.splice(0, Math.min(count, bag.length));
}
