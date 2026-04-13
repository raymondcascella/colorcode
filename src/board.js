/** Create an empty board (sparse Map). */
export function createBoard() {
  return new Map();
}

function key(x, y) {
  return `${x},${y}`;
}

/** Place a tile at (x, y). Mutates board. */
export function placeTile(board, x, y, tile) {
  board.set(key(x, y), tile);
}

/** Get tile at (x, y). Returns null if empty. */
export function getTile(board, x, y) {
  return board.get(key(x, y)) ?? null;
}

/**
 * Get occupied orthogonal neighbors of (x, y).
 * Returns array of { x, y, tile }.
 */
export function getNeighbors(board, x, y) {
  return [
    { x: x - 1, y }, { x: x + 1, y },
    { x, y: y - 1 }, { x, y: y + 1 },
  ].filter(({ x: nx, y: ny }) => getTile(board, nx, ny) !== null)
   .map(({ x: nx, y: ny }) => ({ x: nx, y: ny, tile: getTile(board, nx, ny) }));
}

/**
 * Get all tiles in a continuous line through (x, y).
 * direction: 'horizontal' | 'vertical'
 * Returns array of { x, y, tile } sorted by coordinate.
 */
export function getLine(board, x, y, direction) {
  const isHoriz = direction === 'horizontal';
  const primary = isHoriz ? x : y;
  const secondary = isHoriz ? y : x;

  const coords = [primary];

  for (let p = primary - 1; ; p--) {
    const tx = isHoriz ? p : secondary;
    const ty = isHoriz ? secondary : p;
    if (getTile(board, tx, ty) === null) break;
    coords.push(p);
  }

  for (let p = primary + 1; ; p++) {
    const tx = isHoriz ? p : secondary;
    const ty = isHoriz ? secondary : p;
    if (getTile(board, tx, ty) === null) break;
    coords.push(p);
  }

  coords.sort((a, b) => a - b);
  return coords.map(p => {
    const tx = isHoriz ? p : secondary;
    const ty = isHoriz ? secondary : p;
    return { x: tx, y: ty, tile: getTile(board, tx, ty) };
  });
}
