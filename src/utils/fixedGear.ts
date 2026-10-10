export const MIN_CHAINRING = 28;
export const MAX_CHAINRING = 60;
export const MIN_SPROCKET = 9;
export const MAX_SPROCKET = 23;

export interface GearSetup {
  chainring: number;
  sprocket: number;
  circumferenceMm: number;
  ambidextrous: boolean;
}

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

export function calculateGear({ chainring, sprocket, circumferenceMm, ambidextrous }: GearSetup) {
  const ratio = chainring / sprocket;
  const divisor = gcd(chainring, sprocket);
  const basePatches = sprocket / divisor;
  const patches = ambidextrous && (chainring / divisor) % 2 === 1
    ? basePatches * 2
    : basePatches;
  return { ratio, patches, rolloutM: (circumferenceMm / 1000) * ratio };
}

export function findEquivalentGears(ratio: number): Array<[number, number]> {
  const combinations: Array<[number, number]> = [];
  for (let ring = MIN_CHAINRING; ring <= MAX_CHAINRING; ring += 1) {
    for (let cog = MIN_SPROCKET; cog <= MAX_SPROCKET; cog += 1) {
      const delta = Math.abs((ring / cog) - ratio) / ratio;
      if (delta <= 0.02) combinations.push([ring, cog]);
    }
  }
  return combinations.sort((a, b) => (a[0] / a[1]) - (b[0] / b[1]));
}

export const speedAtCadence = (rolloutM: number, rpm: number) => rolloutM * rpm * 60 / 1000;
