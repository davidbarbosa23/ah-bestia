import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chainrings, sprockets, tires } from '../src/data/fixedGearOptions.ts';
import { calculateGear, findEquivalentGears, speedAtCadence } from '../src/utils/fixedGear.ts';

test('default gearing retains the published analysis and cadence values', () => {
  const result = calculateGear({ chainring: 48, sprocket: 17, circumferenceMm: 2105, ambidextrous: false });
  assert.equal(result.ratio.toFixed(2), '2.82');
  assert.equal(result.patches, 17);
  assert.equal(result.rolloutM.toFixed(2), '5.94');
  assert.equal(speedAtCadence(result.rolloutM, 90).toFixed(1), '32.1');
  assert.equal((speedAtCadence(result.rolloutM, 90) / 1.609344).toFixed(1), '19.9');
  assert.equal((result.rolloutM * 39.3701).toFixed(1), '234.0');
});

test('skid patches match distinct wheel positions for every selectable gear and leading foot', () => {
  for (const chainring of chainrings) {
    for (const sprocket of sprockets) {
      for (const ambidextrous of [false, true]) {
        const positions = new Set();
        for (let turn = 0; turn < sprocket; turn += 1) {
          positions.add((2 * chainring * turn) % (2 * sprocket));
          if (ambidextrous) positions.add((chainring * (2 * turn + 1)) % (2 * sprocket));
        }
        const result = calculateGear({ chainring, sprocket, circumferenceMm: 2105, ambidextrous });
        assert.equal(result.patches, positions.size, `${chainring} × ${sprocket}, both feet: ${ambidextrous}`);
      }
    }
  }
});

test('equivalents include precisely the gears within 2%, in stable ascending ratio order', () => {
  for (const ring of chainrings) {
    for (const cog of sprockets) {
      const ratio = ring / cog;
      const equivalents = findEquivalentGears(ratio);
      assert.ok(equivalents.some(([a, b]) => a === ring && b === cog));
      const keys = new Set(equivalents.map(([a, b]) => `${a}/${b}`));
      for (const a of chainrings) {
        for (const b of sprockets) assert.equal(keys.has(`${a}/${b}`), Math.abs((a / b) - ratio) / ratio <= 0.02);
      }
      equivalents.slice(1).forEach(([a, b], index) => {
        const [previousRing, previousCog] = equivalents[index];
        assert.ok(previousRing / previousCog <= a / b);
      });
    }
  }
});

test('tire circumference scales rollout and cadence speed without changing ratio or patches', () => {
  for (const [, circumferenceMm] of tires) {
    const result = calculateGear({ chainring: 48, sprocket: 16, circumferenceMm, ambidextrous: true });
    assert.equal(result.ratio, 3);
    assert.equal(result.patches, 2);
    assert.equal(result.rolloutM, circumferenceMm / 1000 * 3);
    assert.equal(speedAtCadence(result.rolloutM, 0), 0);
    assert.equal(speedAtCadence(result.rolloutM, 120), 2 * speedAtCadence(result.rolloutM, 60));
  }
});
