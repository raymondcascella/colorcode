import { createGame, stagePlace, unstage, commitTurn, swapTiles, passTurn } from '../src/game.js';
import { assert, assertEqual } from './helpers.js';

const names = ['Alice', 'Bob'];

export const tests = {
  'createGame deals 6 tiles to each player': () => {
    const game = createGame(names);
    for (const p of game.players) {
      assertEqual(p.hand.length, 6, `${p.name} should have 6 tiles`);
    }
  },
  'createGame sets currentPlayerIndex': () => {
    const game = createGame(names);
    assert(game.currentPlayerIndex >= 0 && game.currentPlayerIndex < names.length, 'valid player index');
  },
  'stagePlace moves tile from hand to staged': () => {
    const game = createGame(names);
    const cp = game.players[game.currentPlayerIndex];
    const tile = cp.hand[0];
    stagePlace(game, 0, 0, tile);
    assertEqual(cp.hand.length, 5, 'hand should have 5 tiles after staging');
    assertEqual(game.staged.length, 1, 'staged should have 1 tile');
  },
  'unstage returns tile to hand': () => {
    const game = createGame(names);
    const cp = game.players[game.currentPlayerIndex];
    const tile = cp.hand[0];
    stagePlace(game, 0, 0, tile);
    unstage(game, 0, 0);
    assertEqual(cp.hand.length, 6, 'hand should be restored after unstage');
    assertEqual(game.staged.length, 0, 'staged should be empty after unstage');
  },
  'commitTurn advances to next player': () => {
    const game = createGame(names);
    const first = game.currentPlayerIndex;
    const cp = game.players[first];
    const tile = cp.hand[0];
    stagePlace(game, 0, 0, tile);
    commitTurn(game);
    const next = (first + 1) % names.length;
    assertEqual(game.currentPlayerIndex, next, 'should advance to next player');
  },
  'commitTurn draws back up to 6': () => {
    const game = createGame(names);
    const firstIdx = game.currentPlayerIndex;
    const cp = game.players[firstIdx];
    const tile = cp.hand[0];
    stagePlace(game, 0, 0, tile);
    commitTurn(game);
    const prev = game.players[firstIdx];
    assertEqual(prev.hand.length, 6, 'player should draw back to 6 after turn');
  },
  'passTurn advances player and increments consecutivePasses': () => {
    const game = createGame(names);
    const first = game.currentPlayerIndex;
    passTurn(game);
    assertEqual(game.consecutivePasses, 1, 'consecutivePasses should be 1');
    assertEqual(game.currentPlayerIndex, (first + 1) % names.length, 'should advance player');
  },
  'commitTurn resets consecutivePasses': () => {
    const game = createGame(names);
    passTurn(game);
    const cp = game.players[game.currentPlayerIndex];
    const tile = cp.hand[0];
    stagePlace(game, 5, 5, tile);
    commitTurn(game);
    assertEqual(game.consecutivePasses, 0, 'commit should reset consecutivePasses');
  },
  'game over when all players pass consecutively': () => {
    const game = createGame(names);
    for (let i = 0; i < names.length; i++) passTurn(game);
    assertEqual(game.over, true, 'game should be over after all players pass');
  },
};
