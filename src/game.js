import { createBag, drawTiles } from './bag.js';
import { createBoard, placeTile } from './board.js';
import { scorePlacements } from './scoring.js';
import { hasAnyValidPlacement } from './rules.js';

/**
 * Create a new game state.
 * playerNames: string[]  (2–6)
 * kidsMode: boolean  (default false)
 */
export function createGame(playerNames, kidsMode = false) {
  const bag = createBag(kidsMode);
  const players = playerNames.map(name => ({
    name,
    hand: drawTiles(bag, 6),
    score: 0,
  }));
  return {
    bag,
    board: createBoard(),
    players,
    currentPlayerIndex: Math.floor(Math.random() * players.length),
    staged: [],
    consecutivePasses: 0,
    over: false,
    kidsMode,
  };
}

/** Stage a tile from the current player's hand onto (x, y). */
export function stagePlace(game, x, y, tile) {
  const cp = game.players[game.currentPlayerIndex];
  const idx = cp.hand.indexOf(tile);
  if (idx === -1) throw new Error('Tile not in hand');
  cp.hand.splice(idx, 1);
  game.staged.push({ x, y, tile });
}

/** Remove staged placement at (x, y), return tile to current player's hand. */
export function unstage(game, x, y) {
  const idx = game.staged.findIndex(p => p.x === x && p.y === y);
  if (idx === -1) throw new Error('No staged tile at position');
  const [{ tile }] = game.staged.splice(idx, 1);
  game.players[game.currentPlayerIndex].hand.push(tile);
}

/** Commit staged placements, score, advance turn. */
export function commitTurn(game) {
  const cp = game.players[game.currentPlayerIndex];

  cp.score += scorePlacements(game.board, game.staged);

  for (const { x, y, tile } of game.staged) {
    placeTile(game.board, x, y, tile);
  }

  const bagEmptyBonus = game.bag.length === 0 && cp.hand.length === 0;
  if (bagEmptyBonus) cp.score += 6;

  const drawn = drawTiles(game.bag, 6 - cp.hand.length);
  cp.hand.push(...drawn);

  game.staged = [];
  game.consecutivePasses = 0;

  if (bagEmptyBonus) {
    game.over = true;
    return;
  }

  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
}

/** Swap selected tiles with bag, advance turn. */
export function swapTiles(game, tiles) {
  const cp = game.players[game.currentPlayerIndex];
  for (const tile of tiles) {
    const idx = cp.hand.indexOf(tile);
    if (idx === -1) throw new Error('Tile not in hand');
    cp.hand.splice(idx, 1);
  }
  const drawn = drawTiles(game.bag, tiles.length);
  cp.hand.push(...drawn);
  for (const tile of tiles) {
    const pos = Math.floor(Math.random() * (game.bag.length + 1));
    game.bag.splice(pos, 0, tile);
  }
  game.staged = [];
  game.consecutivePasses = 0;
  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
}

/** Pass this turn. */
export function passTurn(game) {
  const cp = game.players[game.currentPlayerIndex];
  for (const { tile } of game.staged) cp.hand.push(tile);
  game.staged = [];
  game.consecutivePasses++;
  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  if (game.consecutivePasses >= game.players.length) {
    game.over = true;
  }
}

/**
 * In kids mode only: if the current player has no valid placement, auto-skip their turn.
 * Returns true if a skip occurred, false otherwise.
 */
export function autoSkipTurn(game) {
  if (!game.kidsMode) return false;
  const cp = game.players[game.currentPlayerIndex];
  if (hasAnyValidPlacement(game.board, cp.hand)) return false;
  game.consecutivePasses++;
  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  if (game.consecutivePasses >= game.players.length) game.over = true;
  return true;
}
