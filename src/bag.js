export const SHAPES = ['circle', 'cross', 'diamond', 'square', 'star', 'clover'];
export const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

/** Create and shuffle a full 108-tile bag. Returns a new array. */
export function createBag() {
  const tiles = [];
  for (const shape of SHAPES) {
    for (const color of COLORS) {
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
