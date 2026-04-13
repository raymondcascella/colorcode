import { getTile } from './board.js';

/**
 * Validate a proposed set of placements against the current board.
 * placements: Array<{ x, y, tile }>
 * Returns { valid: boolean, reason?: string }
 */
export function validatePlacement(board, placements) {
  if (placements.length === 0) return { valid: false, reason: 'No tiles placed' };

  const xs = placements.map(p => p.x);
  const ys = placements.map(p => p.y);
  const sameRow = new Set(ys).size === 1;
  const sameCol = new Set(xs).size === 1;
  if (!sameRow && !sameCol) return { valid: false, reason: 'Tiles must be in same row or column' };

  const posSet = new Set(placements.map(p => `${p.x},${p.y}`));
  if (posSet.size !== placements.length) return { valid: false, reason: 'Duplicate positions in placement' };

  const staged = new Map(placements.map(p => [`${p.x},${p.y}`, p.tile]));

  function virtualGet(x, y) {
    const k = `${x},${y}`;
    if (staged.has(k)) return staged.get(k);
    return getTile(board, x, y);
  }

  // Contiguity check
  if (placements.length > 1) {
    if (sameRow) {
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const y = ys[0];
      for (let x = minX; x <= maxX; x++) {
        if (virtualGet(x, y) === null) return { valid: false, reason: 'Gap in placement' };
      }
    } else {
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const x = xs[0];
      for (let y = minY; y <= maxY; y++) {
        if (virtualGet(x, y) === null) return { valid: false, reason: 'Gap in placement' };
      }
    }
  }

  function virtualGetLine(x, y, direction) {
    const isHoriz = direction === 'horizontal';
    const primary = isHoriz ? x : y;
    const secondary = isHoriz ? y : x;
    const coords = [primary];
    for (let p = primary - 1; ; p--) {
      const tx = isHoriz ? p : secondary;
      const ty = isHoriz ? secondary : p;
      if (virtualGet(tx, ty) === null) break;
      coords.push(p);
    }
    for (let p = primary + 1; ; p++) {
      const tx = isHoriz ? p : secondary;
      const ty = isHoriz ? secondary : p;
      if (virtualGet(tx, ty) === null) break;
      coords.push(p);
    }
    coords.sort((a, b) => a - b);
    return coords.map(p => {
      const tx = isHoriz ? p : secondary;
      const ty = isHoriz ? secondary : p;
      return { x: tx, y: ty, tile: virtualGet(tx, ty) };
    });
  }

  function validateLine(lineTiles) {
    if (lineTiles.length <= 1) return null;
    const tiles = lineTiles.map(lt => lt.tile);
    const allSameColor = new Set(tiles.map(t => t.color)).size === 1;
    const allSameShape = new Set(tiles.map(t => t.shape)).size === 1;
    if (allSameColor && allSameShape) return 'Duplicate tile in line';
    if (!allSameColor && !allSameShape) return 'Line must share exactly one attribute';
    const tileKeys = tiles.map(t => `${t.shape}:${t.color}`);
    if (new Set(tileKeys).size !== tileKeys.length) return 'Duplicate tile in line';
    return null;
  }

  for (const { x, y } of placements) {
    const hErr = validateLine(virtualGetLine(x, y, 'horizontal'));
    if (hErr) return { valid: false, reason: hErr };
    const vErr = validateLine(virtualGetLine(x, y, 'vertical'));
    if (vErr) return { valid: false, reason: vErr };
  }

  if (board.size > 0) {
    const touchesExisting = placements.some(({ x, y }) =>
      [[x-1,y],[x+1,y],[x,y-1],[x,y+1]].some(([nx,ny]) => getTile(board, nx, ny) !== null)
    );
    if (!touchesExisting) return { valid: false, reason: 'Placement must connect to existing tiles' };
  }

  return { valid: true };
}
