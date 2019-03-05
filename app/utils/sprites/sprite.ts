import { computed } from '@ember-decorators/object';
import Vector from './vector';
import rectanglesIntersect from './rectangle-intersection';
import roundTo from './round-to';
import { Direction, TOP, BOTTOM, RIGHT, LEFT } from './directions';
import {
  rotateDEG,
  translate,
  transform,
  scale,
  Matrix
} from 'transformation-matrix';

const { round } = Math;

/**
 * A representation of a 2D object. This sprite is composed of
 * three vectors, and a scaling factor.
 *
 * - The center vector represents the Sprite's x/y coordinates
 * - X Vector represents the width of the sprite
 * - Y Vector represents the height of the sprite
 *
 * A new sprite can be created from dimensions:
 *
 * @example
 * const sprite = Sprite.fromDimensions({
 *   h: 150,
 *   w: 50,
 *   x: 25,
 *   y: 3,
 *   r: 24,
 *   s: 1.5
 * });
 */
export default class Sprite {
  center: Vector;
  xVec: Vector;
  yVec: Vector;
  curScale: number;

  private constructor(c: Vector, x: Vector, y: Vector, s: number) {
    this.center = c;
    this.xVec = x;
    this.yVec = y;
    this.curScale = s;
  }

  private clone() {
    const { curScale, center, xVec, yVec } = this;
    return new Sprite(center, xVec, yVec, curScale);
  }

  /**
   * Creates a new Sprite, with the specified dimensions.
   *
   * See [SpriteArgs] for more details.
   *
   * @param sprite.w Width
   * @param sprite.h Height
   * @param sprite.x (optional) X Coordinate (default 0)
   * @param sprite.y (optional) Y Coordinate (default 0)
   * @param sprite.r (optional) Radius (default 0)
   * @param sprite.s (optional) Scale (default 1)
   */
  static fromDimensions(sprite: SpriteArgs) {
    const { w, h, x = 0, y = 0, r = 0, s = 1 } = sprite;
    const halfW = w / 2;
    const halfH = h / 2;
    const cx = x + halfW;
    const cy = y + halfH;

    return new Sprite(
      new Vector([cx, cy]),
      new Vector([halfW, 0]).rotate(r),
      new Vector([0, halfH]).rotate(r),
      s
    );
  }

  /**
   * Returns a boolean indicating whether the two sprites
   * intersect.
   *
   * @param s1 sprite
   * @param s2 sprite
   */
  static intersects(s1: Sprite, s2: Sprite): boolean {
    return rectanglesIntersect(s1.points, s2.points);
  }

  /**
   * Returns a new updated sprite, having applied the changes
   * to the dimensions provided.
   *
   * @param updated The dimensions to update.
   */
  updateDimensions(updated: SpriteDimensionUpdate): Sprite {
    const { dimensions } = this;
    return Sprite.fromDimensions({
      ...dimensions,
      ...updated
    });
  }

  /**
   * Returns the current dimensions of the sprite.
   *
   * @returns SpriteDimensions
   */
  @computed('{scale,center,xVec,yVec}')
  get dimensions(): SpriteDimensions {
    const { curScale, center, xVec, yVec } = this;
    const [cx, cy] = center;
    const w = roundTo(xVec.length * 2);
    const h = roundTo(yVec.length * 2);
    const x = roundTo(cx - w / 2);
    const y = roundTo(cy - h / 2);
    const r = roundTo(xVec.angle);
    const s = roundTo(curScale);

    return { w, h, x, y, r, s };
  }

  /**
   * Returns the current transform matrix given the sprite
   * dimensions and scale.
   */
  @computed('dimensions')
  get transformMatrix(): Matrix {
    const { x, y, r, s, w, h } = this.dimensions;
    const halfW = w / 2;
    const halfH = h / 2;

    return transform(
      translate(-1 * halfW, -1 * halfH),
      scale(s),
      translate(halfW, halfH),
      translate(x, y),
      rotateDEG(r)
    );
  }

  /**
   * Returns a new sprite with the scale dimension set to 0 and the
   * other dimensions scaled appropriately.
   *
   * This can be used to render a containing box with a 1px border,
   * regardless of the scale (a 1px borderd, scaled up 3x, would render
   * as 3px).
   *
   * @returns Sprite
   */
  normalizeScale(): Sprite {
    const { curScale, center, xVec, yVec } = this;

    return new Sprite(
      center.scale(curScale),
      xVec.scale(curScale),
      yVec.scale(curScale),
      1
    );
  }

  /**
   * Scales the size of the sprite by the given amount arond the
   * center origin.
   *
   * @param factor Amount to scale (base 1)
   */
  scale(factor: number): Sprite {
    const sprite = this.clone();

    sprite.curScale *= factor;

    return sprite;
  }

  /**
   * This translates the vector, accounting for the vector's current
   * scale. For example, if the vector has a scale of 2, this would
   * move the Sprite to the right by 10.
   *
   * ```ts
   * const translated = sprite.translate([10, 0]);
   * ```
   *
   * @param vector The vector representing amount to translate.
   */
  translate(vector: VectorInterface): Sprite {
    const sprite = this.clone();
    const { center, curScale } = sprite;
    const deltaVector = new Vector(vector).scale(1 / curScale);

    sprite.center = center.add(deltaVector);

    return sprite;
  }

  /**
   * Rotates the Sprite the given number of degrees around the
   * given anchor offset (defaults to Center).
   *
   * @param degrees Amount, in degrees, to rotate the sprite
   * @param anchor  Anchor point vector (from center)
   */
  rotate(degrees: number, anchor: VectorInterface = [0, 0]): Sprite {
    const sprite = this.clone();
    const { center, xVec, yVec } = sprite;

    const anchorVec = new Vector(anchor);
    const rotatedDelta = anchorVec.rotate(degrees);

    sprite.xVec = xVec.rotate(degrees);
    sprite.yVec = yVec.rotate(degrees);
    sprite.center = center.add(rotatedDelta).sub(anchorVec);

    return sprite;
  }

  /**
   * This method lets you apply vector transformations to the sprite given the
   * various "handles" they can be applied from.
   *
   * For example, dragging the EAST handle 10px to the right should make the sprite
   * increase its width by 10px.
   *
   * @param vector
   * @param handles Array of Directions
   * @param options.applyOpposite {Boolean} Wether to apply transform to opposite side
   * @param options.keepRatio {Boolean} Preserve aspect ratio
   */
  transformSize(
    vector: VectorInterface,
    handles: Direction[],
    options: TransformSizeOptions = {}
  ) {
    const sprite = this.clone();
    const { center, curScale, xVec, yVec } = sprite;
    const { applyOpposite = false, keepRatio = false } = options;
    const deltaVector = new Vector(vector).scale(1 / curScale);

    // If Multiple Handles & Keep Ratio, project delta onto Angle vector
    const handleVector = this.vectorForHandles(handles);

    // Project onto the handle if constrain scale or one handle
    const directionScale = applyOpposite ? 1 : 0.5;

    let handleDelta = deltaVector.scale(directionScale);

    if (handles.length === 1 || keepRatio) {
      handleDelta = handleDelta.project(handleVector);
    }

    if (handles.length === 1 && keepRatio) {
      const isWestOrSouth = handles.includes(BOTTOM) || handles.includes(LEFT);
      const ratio = xVec.length / yVec.length;
      const scaleDelta = handleDelta
        .scale(isWestOrSouth ? -1 * ratio : ratio)
        .rotate(90);

      handleDelta = handleDelta.add(scaleDelta);
    }

    const xDiffVect = handleDelta.project(xVec);
    const yDiffVect = handleDelta.project(yVec);

    const xScale = handles.includes(LEFT) ? -1 : 1;
    const yScale = handles.includes(TOP) ? -1 : 1;

    const newXVec = xVec.add(xDiffVect.scale(xScale));
    const newYVec = yVec.add(yDiffVect.scale(yScale));
    const newCVec = applyOpposite
      ? center.clone()
      : center.add(xDiffVect).add(yDiffVect);

    return new Sprite(newCVec, newXVec, newYVec, curScale);
  }

  /**
   * Rotate the sprite based on a vector applied to one of the
   * "handles" on the vector.
   *
   * @param vector Offset from Handle
   * @param handles Array of Directions
   */
  transformRotation(
    vector: VectorInterface,
    handles: Direction[],
    options: TransformRotationOptions = {}
  ): Sprite {
    const { curScale } = this;
    const deltaVector = new Vector(vector).scale(1 / curScale);
    const handleVector = this.vectorForHandles(handles);
    const resultVector = handleVector.add(deltaVector);
    const { clampPercent = false } = options;

    let offsetAngle = (resultVector.angle - handleVector.angle) % 180;

    if (clampPercent) {
      offsetAngle = round(offsetAngle / 15) * 15;
    }

    return this.rotate(offsetAngle);
  }

  /**
   * Adds the transformations to this sprite and returns
   * a new sprite with the transformations applied.
   *
   * @param addedSprite Sprite to "add"
   */
  add(addedSprite: Sprite): Sprite {
    const { dimensions, center } = addedSprite;
    const { x, y, r, s } = dimensions;
    const anchorVector = center.sub(this.center).invert();
    const translateVector = new Vector([x, y]).rotate(r);

    return this.rotate(r, anchorVector)
      .translate(translateVector)
      .scale(s);
  }

  /**
   * Subtracts the transformations from this sprite and returns
   * a new sprite with the transformations applied.
   *
   * @param subtractSprite Sprite to "subtract"
   */
  subtract(subtractSprite: Sprite): Sprite {
    const { dimensions, center } = subtractSprite;
    const { x, y, r, s } = dimensions;
    const anchorVector = center.sub(this.center).invert();

    return this.scale(1 / s)
      .rotate(-1 * r, anchorVector)
      .translate([-1 * x, -1 * y]);
  }

  private vectorForHandle(handle: Direction): Vector {
    const { yVec, xVec } = this;
    const isVertical = handle === TOP || handle === BOTTOM;
    const invert = handle === TOP || handle === LEFT;
    const vec = isVertical ? yVec : xVec;

    return invert ? vec.invert() : vec;
  }

  private vectorForHandles(handles: Direction[]): Vector {
    return handles
      .map(handle => this.vectorForHandle(handle))
      .reduce((sum, vector) => sum.add(vector), new Vector([0, 0]));
  }

  @computed('{center,xVec,yVec}')
  private get points() {
    const { center } = this;
    const handleGroups = [
      [TOP, LEFT],
      [TOP, RIGHT],
      [BOTTOM, RIGHT],
      [BOTTOM, LEFT]
    ];

    return handleGroups
      .map(handles => this.vectorForHandles(handles))
      .map(vector => center.add(vector));
  }
}
