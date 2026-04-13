import { createBoard, placeTile } from '../src/board.js';
import { scorePlacements } from '../src/scoring.js';
import { assert, assertEqual } from './helpers.js';

const T = (shape, color) => ({ shape, color });

export const tests = {
  'single tile on empty board scores 1': () => {
    const board = createBoard();
    const score = scorePlacements(board, [{ x: 0, y: 0, tile: T('circle', 'red') }]);
    assertEqual(score, 1, 'single tile should score 1');
  },
  'extending a line of 2 to 3 scores 3': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    placeTile(board, 1, 0, T('cross', 'red'));
    const score = scorePlacements(board, [{ x: 2, y: 0, tile: T('diamond', 'red') }]);
    assertEqual(score, 3, 'extending to 3-tile line should score 3');
  },
  'tile at intersection scores both lines': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    placeTile(board, 1, 0, T('circle', 'blue'));
    placeTile(board, 0, -1, T('cross', 'red'));
    const score = scorePlacements(board, [{ x: 0, y: 1, tile: T('diamond', 'red') }]);
    // vertical line: (0,-1),(0,0),(0,1) = 3; horizontal: (0,1) alone = 1
    assertEqual(score, 4, 'tile at intersection should score sum of both lines');
  },
  'completing a line of 6 scores 12': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    placeTile(board, 1, 0, T('circle', 'blue'));
    placeTile(board, 2, 0, T('circle', 'green'));
    placeTile(board, 3, 0, T('circle', 'yellow'));
    placeTile(board, 4, 0, T('circle', 'orange'));
    const score = scorePlacements(board, [{ x: 5, y: 0, tile: T('circle', 'purple') }]);
    assertEqual(score, 12, 'completing 6-tile line should score 12 (6 + 6 bonus)');
  },
  'multi-tile placement scores line length once': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    const placements = [
      { x: 1, y: 0, tile: T('cross', 'red') },
      { x: 2, y: 0, tile: T('diamond', 'red') },
    ];
    const score = scorePlacements(board, placements);
    assertEqual(score, 3, 'multi-tile in same line scores line length once');
  },
};
