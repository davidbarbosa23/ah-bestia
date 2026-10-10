/** Equal spacing represents distinct contact positions, beginning at the road. */
export const skidPatchAngles = (count: number) =>
  Array.from({ length: count }, (_, index) => -Math.PI / 2 + index * Math.PI * 2 / count);

/** Solve a two-link leg in the bicycle plane, with the knee bending forward. */
export function kneePosition(hipX: number, hipY: number, footX: number, footY: number, thigh = 0.62, shin = 0.60) {
  const dx = footX - hipX;
  const dy = footY - hipY;
  const distance = Math.max(0.0001, Math.hypot(dx, dy));
  const reach = Math.max(0.0001, Math.min(distance, thigh + shin - 0.0001));
  const along = (thigh * thigh - shin * shin + reach * reach) / (2 * reach);
  const bend = Math.sqrt(Math.max(0, thigh * thigh - along * along));
  return { x: hipX + dx / distance * along - dy / distance * bend, y: hipY + dy / distance * along + dx / distance * bend };
}

/** Radians travelled over real elapsed time; independent of display frame rate. */
export function driveRotation(cadence: number, ratio: number, seconds: number) {
  const crank = cadence / 60 * Math.PI * 2 * seconds;
  return { crank, wheel: crank * ratio };
}
