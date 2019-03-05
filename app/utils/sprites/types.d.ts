/**
 * A vector-like value, likely either an instance of
 * the Vector class, or an array of two values.
 *
 * ```ts
 * const vector = new Vector([5, 10]);
 * const vectorLike = [23, 41]
 * ```
 */
interface VectorInterface {
  [Symbol.iterator](): IterableIterator<number>;
}

type VectorArgument = VectorInterface;
type HeightWidthKeys = 'h' | 'w';
type RestDimensionKeys = 'x' | 'y' | 'r' | 's';
type DimensionKeys = HeightWidthKeys | RestDimensionKeys;

type SpriteDimensions = { [key in DimensionKeys]: number };

type SpriteArgs = { [key in HeightWidthKeys]: number } &
  { [key in RestDimensionKeys]?: number };

type SpriteDimensionUpdate = { [key in DimensionKeys]?: number };

interface TransformSizeOptions {
  applyOpposite?: boolean;
  keepRatio?: boolean;
}

interface TransformRotationOptions {
  clampPercent?: boolean;
}
