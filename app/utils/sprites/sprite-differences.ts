import Sprite from './sprite';
import roundTo from './round-to';

const { entries } = Object;

type SpriteDifference = { key: string; value: number };
type DimensionKey = keyof SpriteDimensions;

export default function spriteDifferences(
  a: Sprite,
  b: Sprite
): SpriteDifference[] {
  const dimensionsA = a.dimensions;
  const dimensionsB = b.dimensions;

  const differences = [];

  for (const [key, valueA] of entries(dimensionsA)) {
    const valueB = dimensionsB[key as DimensionKey];

    if (valueA !== valueB) {
      differences.push({ key, value: roundTo(valueB - valueA, 1) });
    }
  }

  return differences;
}
