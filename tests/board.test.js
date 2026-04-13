import { createBoard, placeTile, getTile, getNeighbors, getLine } from '../src/board.js';
import { assert, assertEqual } from './helpers.js';

const T = (shape, color) => ({ shape, color });

export const tests = {
  'placeTile and getTile round-trip': () => {
    const board = createBoard();
    const tile = T('circle', 'red');
    placeTile(board, 0, 0, tile);
    assertEqual(getTile(board, 0, 0), tile, 'should retrieve placed tile');
  },
  'getTile returns null for empty cell': () => {
    const board = createBoard();
    assertEqual(getTile(board, 5, 5), null, 'empty cell should return null');
  },
  'getNeighbors returns orthogonal occupied cells': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    placeTile(board, 1, 0, T('cross', 'red'));
    placeTile(board, 0, 1, T('diamond', 'red'));
    const neighbors = getNeighbors(board, 0, 0);
    assertEqual(neighbors.length, 2, 'should have 2 neighbors');
  },
  'getLine horizontal returns all tiles in a row': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    placeTile(board, 1, 0, T('circle', 'blue'));
    placeTile(board, 2, 0, T('circle', 'green'));
    const line = getLine(board, 1, 0, 'horizontal');
    assertEqual(line.length, 3, 'horizontal line should have 3 tiles');
  },
  'getLine vertical returns all tiles in a column': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    placeTile(board, 0, 1, T('cross', 'red'));
    placeTile(board, 0, 2, T('diamond', 'red'));
    const line = getLine(board, 0, 1, 'vertical');
    assertEqual(line.length, 3, 'vertical line should have 3 tiles');
  },
  'getLine stops at gaps': () => {
    const board = createBoard();
    placeTile(board, 0, 0, T('circle', 'red'));
    placeTile(board, 2, 0, T('circle', 'blue'));
    const line = getLine(board, 0, 0, 'horizontal');
    assertEqual(line.length, 1, 'line should stop at gap');
  },
};
