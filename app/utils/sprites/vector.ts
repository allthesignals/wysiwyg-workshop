import { computed } from '@ember-decorators/object';

const { sqrt, atan2, PI, cos, sin } = Math;

function dotProduct(a: VectorInterface, b: VectorInterface): number {
  const [ax, ay] = a;
  const [bx, by] = b;

  return ax * bx + ay * by;
}

/**
 * A class for manipulating [Vectors](https://en.wikipedia.org/wiki/Vector_(mathematics_and_physics))
 *
 * ```ts
 * const vector = new Vector([25, 35]);
 * vector.rotate(15).scale(2);
 * ```
 */
export default class Vector implements VectorInterface {
  x: number;
  y: number;

  /**
   * Create a new instance of a Vector with coordinates.
   *
   * @param v vector coordinates [x, y]
   */
  constructor(v: VectorInterface) {
    const [x, y] = v;
    this.x = x;
    this.y = y;
  }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }

  /**
   * Creates a copy of the current vector.
   *
   * @returns New Vector
   */
  clone(): Vector {
    const { x, y } = this;
    return new Vector([x, y]);
  }

  /**
   * Computes the length of the vector.
   *
   * ```ts
   * const v = new Vector([30, 40]);
   * v.length; // 50
   * ```
   *
   * @returns length
   */
  @computed('{x,y}')
  get length(): number {
    const { x, y } = this;
    return sqrt(x * x + y * y);
  }

  /**
   * Computes the angle of the vector in
   * [radians](https://en.wikipedia.org/wiki/Radian).
   *
   * @returns angle in radians
   */
  @computed('{x,y}')
  get radians(): number {
    const { x, y } = this;
    return atan2(y, x);
  }

  /**
   * Computes the angle of the vector in degrees
   *
   * @returns angle in degrees
   */
  @computed('radians')
  get angle(): number {
    const { radians } = this;
    const degrees = (180 * radians) / PI;
    return (360 + degrees) % 360;
  }

  /**
   * Rotates the vector by the amount passed.
   *
   * @param degrees Degrees to rotate
   */
  rotate(degrees: number): Vector {
    const [startX, startY] = this;
    const radians = (degrees * PI) / 180;
    const cosRes = cos(radians);
    const sinRes = sin(radians);

    const x = cosRes * startX - sinRes * startY;
    const y = sinRes * startX + cosRes * startY;

    return new Vector([x, y]);
  }

  /**
   * Scale the vector by the given ratio. For example:
   *
   * ```ts
   * const v = new Vector([30, 40]);
   * v.length; // 50
   * v.scale(1.5);
   * v.length; // 75
   * ```
   *
   * @param factor The amount to scale
   * @returns Vector
   */
  scale(factor: number): Vector {
    const [x, y] = this;
    return new Vector([x * factor, y * factor]);
  }

  /**
   * Reverse the direction of the Vector.
   *
   * Equivalent to calling `v.scale(-1)`.
   *
   * @returns Vector
   */
  invert(): Vector {
    return this.scale(-1);
  }

  /**
   * Add one vector to the other. See
   * [Vector Addition](http://mathworld.wolfram.com/VectorAddition.html)
   *
   *
   * @param addedVector Vector to add.
   */
  add(addedVector: VectorInterface): Vector {
    const [ax, ay] = this;
    const [bx, by] = addedVector;
    return new Vector([ax + bx, ay + by]);
  }

  /**
   * Subtract one vector from another. Opposite of adding a vector. See
   * [Vector Difference](http://mathworld.wolfram.com/VectorDifference.html)
   * @param subVector Vector to remove.
   */
  sub(subVector: VectorInterface): Vector {
    const [ax, ay] = this;
    const [bx, by] = subVector;
    return new Vector([ax - bx, ay - by]);
  }

  /**
   * Project one vector onto another and return the new vector.
   *
   * See [Vector Projection](https://en.wikipedia.org/wiki/Vector_projection)
   *
   * @param v source vector
   * @param along project along vector
   */
  project(along: VectorInterface): Vector {
    const scaleFactor = dotProduct(this, along) / dotProduct(along, along);
    return new Vector(along).scale(scaleFactor);
  }
}
