import { getTile } from './board.js';

function virtualGetLineLen(board, staged, x, y, direction) {
  const isHoriz = direction === 'horizontal';
  const primary = isHoriz ? x : y;
  const secondary = isHoriz ? y : x;

  function vGet(px, py) {
    const k = `${px},${py}`;
    if (staged.has(k)) return staged.get(k);
    return getTile(board, px, py);
  }

  let count = 1;
  for (let p = primary - 1; vGet(isHoriz ? p : secondary, isHoriz ? secondary : p) !== null; p--) count++;
  for (let p = primary + 1; vGet(isHoriz ? p : secondary, isHoriz ? secondary : p) !== null; p++) count++;
  return count;
}

/**
 * Score a set of placements against the current board (before committing).
 * Returns integer score for this turn.
 */
export function scorePlacements(board, placements) {
  if (placements.length === 0) return 0;

  const staged = new Map(placements.map(p => [`${p.x},${p.y}`, p.tile]));
  let score = 0;

  const xs = new Set(placements.map(p => p.x));
  const ys = new Set(placements.map(p => p.y));
  const isHoriz = ys.size === 1;

  if (placements.length === 1) {
    const { x, y } = placements[0];
    const hLen = virtualGetLineLen(board, staged, x, y, 'horizontal');
    const vLen = virtualGetLineLen(board, staged, x, y, 'vertical');
    score += hLen;
    if (hLen === 6) score += 6;
    if (vLen > 1) {
      score += vLen;
      if (vLen === 6) score += 6;
    }
    return score;
  }

  // Score the shared line once
  const rep = placements[0];
  const lineDir = isHoriz ? 'horizontal' : 'vertical';
  const lineLen = virtualGetLineLen(board, staged, rep.x, rep.y, lineDir);
  score += lineLen;
  if (lineLen === 6) score += 6;

  // Score each tile's perpendicular line if > 1
  const perpDir = isHoriz ? 'vertical' : 'horizontal';
  for (const { x, y } of placements) {
    const perpLen = virtualGetLineLen(board, staged, x, y, perpDir);
    if (perpLen > 1) {
      score += perpLen;
      if (perpLen === 6) score += 6;
    }
  }

  return score;
}
