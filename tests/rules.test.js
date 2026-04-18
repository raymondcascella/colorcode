import { createBoard, placeTile } from '../src/board.js';
import { validatePlacement, hasAnyValidPlacement } from '../src/rules.js';
import { assert, assertEqual } from './helpers.js';

const T = (shape, color) => ({ shape, color });

export const tests = {
  'first tile on empty board is valid': () => {
    const board = createBoard();
    const result = validatePlacement(board, [{ x: 0, y: 0, tile: T('circle', 'red') }]);
    assertEqual(result.valid, true, 'first tile should always be valid');
  },
  'tile matching color in line is valid': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    const result = validatePlacement(board, [{ x: 1, y: 0, tile: T('cross', 'red') }]);
    assertEqual(result.valid, true, 'matching color in line should be valid');
  },
  'tile matching shape in line is valid': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    const result = validatePlacement(board, [{ x: 1, y: 0, tile: T('circle', 'blue') }]);
    assertEqual(result.valid, true, 'matching shape in line should be valid');
  },
  'tile not matching anything is invalid': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    const result = validatePlacement(board, [{ x: 1, y: 0, tile: T('cross', 'blue') }]);
    assertEqual(result.valid, false, 'non-matching tile should be invalid');
  },
  'duplicate tile in line is invalid': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    const result = validatePlacement(board, [{ x: 1, y: 0, tile: T('circle', 'red') }]);
    assertEqual(result.valid, false, 'duplicate tile in line should be invalid');
  },
  'mixed attributes in line is invalid': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    placeTile(board, 1, 0, T('cross', 'red'));
    const result = validatePlacement(board, [{ x: 2, y: 0, tile: T('cross', 'blue') }]);
    assertEqual(result.valid, false, 'mixing attributes in a line should be invalid');
  },
  'multi-tile placement must be in same row': () => {
    const board = createBoard();
    const placements = [
      { x: 0, y: 0, tile: T('circle', 'red') },
      { x: 1, y: 1, tile: T('cross', 'red') },
    ];
    const result = validatePlacement(board, placements);
    assertEqual(result.valid, false, 'tiles must be in same row or column');
  },
  'multi-tile placement must be contiguous': () => {
    const board = createBoard();
    const placements = [
      { x: 0, y: 0, tile: T('circle', 'red') },
      { x: 2, y: 0, tile: T('cross', 'red') },
    ];
    const result = validatePlacement(board, placements);
    assertEqual(result.valid, false, 'tiles must be contiguous');
  },
  'staged tiles are considered together for line validation': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    const placements = [
      { x: 1, y: 0, tile: T('cross', 'red') },
      { x: 2, y: 0, tile: T('diamond', 'red') },
    ];
    const result = validatePlacement(board, placements);
    assertEqual(result.valid, true, 'multi-tile placement with shared color should be valid');
  },
  'hasAnyValidPlacement returns true on empty board': () => {
    const board = createBoard();
    const hand = [{ shape: 'circle', color: 'red' }];
    assertEqual(hasAnyValidPlacement(board, hand), true, 'any tile can start on empty board');
  },
  'hasAnyValidPlacement returns true when a valid neighbor exists': () => {
    const board = createBoard();
    placeTile(board, 0, 0, { shape: 'circle', color: 'red' });
    const hand = [{ shape: 'circle', color: 'blue' }]; // same shape, different color — valid
    assertEqual(hasAnyValidPlacement(board, hand), true, 'circle/blue can extend circle/red line');
  },
  'hasAnyValidPlacement returns false when no valid placement': () => {
    const board = createBoard();
    // Fill a full line of 4 circles with all 4 kids colors
    placeTile(board, 0, 0, { shape: 'circle', color: 'red' });
    placeTile(board, 1, 0, { shape: 'circle', color: 'yellow' });
    placeTile(board, 2, 0, { shape: 'circle', color: 'green' });
    placeTile(board, 3, 0, { shape: 'circle', color: 'blue' });
    // A hand of only squares — can't connect to any adjacent empty cell without mixing attributes
    // Place a square/red at (0,1) — that would start a valid new line, so we need a fully blocked scenario
    // Instead: surround every adjacent cell by making a + shape that conflicts
    placeTile(board, 0, -1, { shape: 'square', color: 'red' });
    placeTile(board, 0, 1,  { shape: 'diamond', color: 'red' });
    placeTile(board, -1, 0, { shape: 'star', color: 'red' });
    // Now hand has only circle/red — duplicate in the only adjacent lines
    const hand = [{ shape: 'circle', color: 'red' }];
    assertEqual(hasAnyValidPlacement(board, hand), false, 'circle/red is duplicate in every adjacent line');
  },
  'hasAnyValidPlacement returns false for empty hand': () => {
    const board = createBoard();
    assertEqual(hasAnyValidPlacement(board, []), false, 'empty hand has no placements');
  },
};
