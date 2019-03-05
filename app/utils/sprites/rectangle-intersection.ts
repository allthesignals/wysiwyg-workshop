// https://martin-thoma.com/how-to-check-if-a-point-is-inside-a-rectangle/
const { abs, pow } = Math;

type Point = VectorInterface;
type Rectangle = Point[];

function areaOfRect(rect: Rectangle): number {
  const [[ax, ay], [bx, by], [cx, cy], [dx, dy]] = rect;
  return 0.5 * abs((ay - cy) * (dx - bx) + (by - dy) * (ax - cx));
}

function areaOfTriangle([pointA, pointB, pointC]: Rectangle): number {
  const [ax, ay] = pointA;
  const [bx, by] = pointB;
  const [cx, cy] = pointC;

  const numerator = ax * (by - cy) + bx * (cy - ay) + cx * (ay - by);
  return abs(numerator / 2);
}

function pointInRect(testPoint: Point, rect: Rectangle): boolean {
  const rectArea = areaOfRect(rect);

  if (rectArea === 0) {
    return false;
  }

  const triangles = rect.map((curPoint, i) => {
    const nextPoint = rect[(i + 1) % 4];
    return [testPoint, curPoint, nextPoint];
  });

  const trianglesArea = triangles.reduce(
    (prev, triangle) => prev + areaOfTriangle(triangle),
    0
  );

  return fix(trianglesArea) == fix(rectArea);
}

function fix(n: number): number {
  return parseInt((n * pow(10, 6)).toString());
}

export default function rectanglesIntersect(
  rectA: Rectangle,
  rectB: Rectangle
): boolean {
  const initial = rectA.some(point => pointInRect(point, rectB));

  if (initial) {
    return true;
  }

  return rectB.some(point => pointInRect(point, rectA));
}
