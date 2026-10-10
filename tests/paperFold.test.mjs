import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculatePaperFold, easePageTurn, toBookPoint, paperClipPath, shadowClipPath } from '../src/utils/paperFold.ts';

test('turn easing starts and ends at the existing page positions', () => {
  assert.equal(easePageTurn(0), 0);
  assert.equal(easePageTurn(0.5), 0.5);
  assert.equal(easePageTurn(1), 1);
});

test('fold geometry remains finite and keeps the paper dimensions throughout a turn', () => {
  for (const [width, height] of [[150, 200], [600, 800], [800, 600]]) {
    for (let step = 0; step <= 100; step += 1) {
      const margin = Math.min(height / 10, width * 0.16);
      const progress = easePageTurn(Math.min(step / 100, 0.999));
      const fold = calculatePaperFold({ x: width - margin + (-2 * width + margin) * progress, y: height - margin + margin * progress }, width, height);
      assert.ok(fold);
      const corners = Object.values(fold.rect);
      corners.forEach(({ x, y }) => assert.ok(Number.isFinite(x) && Number.isFinite(y)));
      assert.ok(Math.abs(Math.hypot(fold.rect.topRight.x - fold.rect.topLeft.x, fold.rect.topRight.y - fold.rect.topLeft.y) - width) < 1e-8);
      assert.ok(Math.abs(Math.hypot(fold.rect.bottomLeft.x - fold.rect.topLeft.x, fold.rect.bottomLeft.y - fold.rect.topLeft.y) - height) < 1e-8);
      for (const direction of ['next', 'previous']) {
        const clip = paperClipPath(fold.flippingArea, fold.position, fold.angle, direction);
        assert.match(clip, /^polygon\(/);
        assert.doesNotMatch(clip, /NaN|Infinity/);
        assert.doesNotMatch(shadowClipPath(corners, fold.position, 0, fold.angle, direction), /NaN|Infinity/);
      }
    }
  }
});

test('book coordinates mirror the same fold between forward and backward turns', () => {
  const point = { x: 50, y: 70 };
  assert.deepEqual(toBookPoint(point, 'next', 200), { x: 250, y: 70 });
  assert.deepEqual(toBookPoint(point, 'previous', 200), { x: 150, y: 70 });
  assert.match(paperClipPath([null, point], { x: 0, y: 0 }, 0, 'next', true), /^polygon\(evenodd,/);
  assert.equal(calculatePaperFold({ x: 201, y: 300 }, 200, 300), null);
});
