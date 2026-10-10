import { MIN_CHAINRING, MAX_CHAINRING, MIN_SPROCKET, MAX_SPROCKET } from '../utils/fixedGear.ts';

export const chainrings = Array.from({ length: MAX_CHAINRING - MIN_CHAINRING + 1 }, (_, index) => index + MIN_CHAINRING);
export const sprockets = Array.from({ length: MAX_SPROCKET - MIN_SPROCKET + 1 }, (_, index) => index + MIN_SPROCKET);
export const tires = [
  ['700 × 20', 2079],
  ['700 × 23', 2096],
  ['700 × 25', 2105],
  ['700 × 28', 2136],
  ['700 × 32', 2155],
  ['700 × 35', 2168],
  ['700 × 38', 2180],
  ['700 × 44', 2224],
  ['700 × 50', 2289],
  ['650 × 25', 1952],
  ['26 × 1.50', 2010],
] as const;
export const cadences = [50, 60, 70, 80, 90, 100, 110, 120, 130];

