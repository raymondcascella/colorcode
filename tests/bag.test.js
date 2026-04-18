import { createBag, drawTiles, SHAPES, COLORS, KIDS_SHAPES, KIDS_COLORS } from '../src/bag.js';
import { assert, assertEqual } from './helpers.js';

export const tests = {
  'bag has 108 tiles': () => {
    const bag = createBag();
    assertEqual(bag.length, 108, 'bag should have 108 tiles');
  },
  'bag contains all combinations 3x': () => {
    const bag = createBag();
    for (const shape of SHAPES) {
      for (const color of COLORS) {
        const count = bag.filter(t => t.shape === shape && t.color === color).length;
        assertEqual(count, 3, `${shape}/${color} should appear 3 times`);
      }
    }
  },
  'drawTiles removes tiles from bag': () => {
    const bag = createBag();
    const drawn = drawTiles(bag, 6);
    assertEqual(drawn.length, 6, 'should draw 6 tiles');
    assertEqual(bag.length, 102, 'bag should have 102 tiles remaining');
  },
  'drawTiles draws fewer if bag is small': () => {
    const bag2 = createBag();
    bag2.splice(3);
    const drawn = drawTiles(bag2, 6);
    assertEqual(drawn.length, 3, 'should draw only what is available');
    assertEqual(bag2.length, 0, 'bag should be empty');
  },
  'SHAPES has 6 entries': () => {
    assertEqual(SHAPES.length, 6, 'should have 6 shapes');
  },
  'COLORS has 6 entries': () => {
    assertEqual(COLORS.length, 6, 'should have 6 colors');
  },
  'kids bag has 48 tiles': () => {
    const bag = createBag(true);
    assertEqual(bag.length, 48, 'kids bag should have 48 tiles');
  },
  'kids bag contains only kids colors and shapes': () => {
    const bag = createBag(true);
    for (const tile of bag) {
      assert(KIDS_COLORS.includes(tile.color), `unexpected color: ${tile.color}`);
      assert(KIDS_SHAPES.includes(tile.shape), `unexpected shape: ${tile.shape}`);
    }
  },
  'kids bag contains all kids combinations 3x': () => {
    const bag = createBag(true);
    for (const shape of KIDS_SHAPES) {
      for (const color of KIDS_COLORS) {
        const count = bag.filter(t => t.shape === shape && t.color === color).length;
        assertEqual(count, 3, `kids ${shape}/${color} should appear 3 times`);
      }
    }
  },
  'classic bag unaffected by kids flag': () => {
    const bag = createBag(false);
    assertEqual(bag.length, 108, 'classic bag should still have 108 tiles');
  },
};
