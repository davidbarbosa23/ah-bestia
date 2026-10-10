import assert from 'node:assert/strict';
import { test } from 'node:test';
import { driveRotation, kneePosition, skidPatchAngles } from '../src/utils/fixedGearMotion.ts';
import { calculateGear, speedAtCadence } from '../src/utils/fixedGear.ts';

test('rider knees maintain both leg lengths throughout a full pedal revolution', () => {
  for (let degree = 0; degree < 360; degree++) {
    const phase = degree * Math.PI / 180;
    const x = -0.12 + Math.cos(phase) * 0.255;
    const y = 0.55 - Math.sin(phase) * 0.255 + 0.07;
    const knee = kneePosition(-0.39, 1.52, x, y);
    assert.ok(Math.abs(Math.hypot(knee.x + 0.39, knee.y - 1.52) - 0.62) < 1e-10);
    assert.ok(Math.abs(Math.hypot(knee.x - x, knee.y - y) - 0.60) < 1e-10);
    assert.ok(knee.x > -0.39, 'knee bends toward the handlebars');
  }
});

test('wheel revolutions reproduce the analysis speed at every cadence and several ratios', () => {
  for (const [chainring, sprocket] of [[28, 23], [48, 17], [48, 16], [60, 9]]) {
    for (const circumferenceMm of [1952, 2105, 2289]) {
      const gear = calculateGear({ chainring, sprocket, circumferenceMm, ambidextrous: false });
      for (let rpm = 30; rpm <= 150; rpm++) {
        const oneMinute = driveRotation(rpm, gear.ratio, 60);
        assert.ok(Math.abs(oneMinute.crank / (2 * Math.PI) - rpm) < 1e-10);
        const kmh = oneMinute.wheel / (2 * Math.PI) * circumferenceMm / 1e6 * 60;
        assert.ok(Math.abs(kmh - speedAtCadence(gear.rolloutM, rpm)) < 1e-10);
      }
    }
  }
});

test('rotation is independent of frame rate and cadence changes preserve wheel phase', () => {
  const ratio = 48 / 17;
  for (const fps of [10, 30, 60, 144]) {
    let wheel = 0;
    let crank = 0;
    for (let frame = 0; frame < fps * 2; frame++) {
      const step = driveRotation(frame < fps ? 60 : 120, ratio, 1 / fps);
      wheel += step.wheel;
      crank += step.crank;
    }
    assert.ok(Math.abs(crank / (2 * Math.PI) - 3) < 1e-10);
    assert.ok(Math.abs(wheel / (2 * Math.PI) - 3 * ratio) < 1e-10);
  }
});

test('wear markers are unique and equally spaced for every supported patch count', () => {
  for (let count = 1; count <= 46; count++) {
    const angles = skidPatchAngles(count);
    assert.equal(angles.length, count);
    assert.equal(new Set(angles).size, count);
    assert.equal(angles[0], -Math.PI / 2);
    angles.forEach((angle, index) => {
      const next = index + 1 < count ? angles[index + 1] : angles[0] + 2 * Math.PI;
      assert.ok(Math.abs(next - angle - 2 * Math.PI / count) < 1e-10);
    });
  }
});
