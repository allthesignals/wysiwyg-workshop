import Sprite from 'ember-wysiwyg/utils/sprites/sprite';
import { module, test } from 'qunit';
import { applyToPoint as _applyToPoint, Matrix } from 'transformation-matrix';
import {
  TOP,
  BOTTOM,
  RIGHT,
  LEFT
} from 'ember-wysiwyg/utils/sprites/directions';

function applyToPoint(matrix: Matrix, [x, y]: [number, number]) {
  const p = _applyToPoint(matrix, { x, y });
  const round = (n: number) => parseFloat(n.toFixed(5));
  return [round(p.x), round(p.y)];
}

module('Unit | Utility | sprites/sprite', function() {
  module('dimensions', () => {
    test('input dimensions map to output', assert => {
      const sprite = Sprite.fromDimensions({
        x: 25,
        y: 10,
        w: 100,
        h: 50,
        r: 15,
        s: 2
      });

      const { dimensions } = sprite;

      assert.deepNumberEqual(dimensions, {
        x: 25,
        y: 10,
        w: 100,
        h: 50,
        r: 15,
        s: 2
      });
    });

    test('updating dimensions', assert => {
      const sprite = Sprite.fromDimensions({
        x: 25,
        y: 10,
        w: 100,
        h: 50,
        r: 15,
        s: 2
      });

      const sprite2 = sprite.updateDimensions({ x: 100, r: 20 });
      const { dimensions } = sprite2;

      assert.notEqual(sprite, sprite2);
      assert.deepNumberEqual(dimensions, {
        x: 100,
        y: 10,
        w: 100,
        h: 50,
        r: 20,
        s: 2
      });
    });
  });

  module('scale', () => {
    test('normalizing scale resets scale to 1', assert => {
      const sprite = Sprite.fromDimensions({
        x: 25,
        y: 10,
        w: 100,
        h: 50,
        r: 15,
        s: 2
      });

      const normalized = sprite.normalizeScale();

      const { dimensions } = normalized;

      assert.notEqual(sprite, normalized, 'normalizing is immutable');
      assert.deepNumberEqual(dimensions, {
        x: 50,
        y: 20,
        w: 200,
        h: 100,
        r: 15,
        s: 1
      });
    });

    test('applying a new scale', assert => {
      const sprite = Sprite.fromDimensions({ w: 100, h: 200 });
      const scaled = sprite.scale(5);

      assert.notEqual(sprite, scaled, 'scaling is immutable');

      const { w, h, s } = scaled.dimensions;

      assert.deepNumberEqual([w, h, s], [100, 200, 5]);
    });
  });

  module('translating', () => {
    const baseSprite = { w: 100, h: 50, x: 10, y: 50 };

    test('no translation', assert => {
      const sprite = Sprite.fromDimensions(baseSprite).translate([0, 0]);

      const { x, y, w, h } = sprite.dimensions;

      assert.deepNumberEqual({ x, y, w, h }, { x: 10, y: 50, w: 100, h: 50 });
    });

    test('translation is immutable', assert => {
      const sprite = Sprite.fromDimensions(baseSprite);
      const sprite2 = sprite.translate([0, 0]);

      assert.notEqual(sprite, sprite2);
    });

    test('translation affects C Point', assert => {
      const sprite = Sprite.fromDimensions(baseSprite).translate([10, 20]);

      const { x, y } = sprite.dimensions;

      assert.deepNumberEqual({ x, y }, { x: 20, y: 70 });
    });
  });

  module('rotate', () => {
    test('rotate is immutable', assert => {
      const s1 = Sprite.fromDimensions({ w: 10, h: 10 });
      const s2 = s1.rotate(45);

      assert.notEqual(s1, s2);
    });

    test('can rotate around center', assert => {
      const base = { x: 100, y: 200, w: 100, h: 100 };
      const sprite = Sprite.fromDimensions(base).rotate(45);

      const { x, y, r } = sprite.dimensions;

      assert.deepEqual(
        { x, y, r },
        {
          x: 100,
          y: 200,
          r: 45
        }
      );
    });

    test('can rotate around bottom right', assert => {
      const base = { w: 100, h: 100 };
      const sprite = Sprite.fromDimensions(base).rotate(45, [50, 50]);
      const hypotenuse = Math.sqrt(50 * 50 * 2);

      const { x, y, r } = sprite.dimensions;

      assert.deepNumberEqual(
        { x, y, r },
        {
          x: -50,
          y: hypotenuse - 50,
          r: 45
        }
      );
    });
  });

  module('transformSize', () => {
    module('no modifiers', () => {
      test('translation affects RIGHT point', assert => {
        const base = { w: 100, h: 50, x: -40, y: 25 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [5, 15],
          [RIGHT]
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual(
          { x, y, w, h },
          { x: -40, y: 25, w: 105, h: 50 }
        );
      });

      test('negative translation affects RIGHT point', assert => {
        const base = { w: 100, h: 50, x: 10, y: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [-5, 15],
          [RIGHT]
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 10, y: 50, w: 95, h: 50 });
      });

      test('translation affects BOTTOM point', assert => {
        const base = { x: 10, y: 50, w: 100, h: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [5, 15],
          [BOTTOM]
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 10, y: 50, w: 100, h: 65 });
      });

      test('translation affects LEFT point', assert => {
        const base = { w: 100, h: 50, x: 10, y: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [5, 15],
          [LEFT]
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 15, y: 50, w: 95, h: 50 });
      });

      test('translation affects BOTTOM LEFT point', assert => {
        const base = { x: 0, y: 0, w: 100, h: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [5, 15],
          [BOTTOM, LEFT]
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 5, y: 0, w: 95, h: 65 });
      });

      test('translation affects BOTTOM RIGHT point', assert => {
        const base = { x: 0, y: 0, w: 100, h: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [10, 0],
          [BOTTOM, RIGHT]
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 0, y: 0, w: 110, h: 50 });
      });

      test('translation affects TOP point', assert => {
        const base = { w: 100, h: 50, x: 10, y: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [5, 15],
          [TOP]
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 10, y: 65, w: 100, h: 35 });
      });
    });

    module('with scaled sprite', () => {
      test('RIGHT point translation on scaled sprite', assert => {
        const base = { w: 100, h: 50, x: -40, y: 25, s: 2 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [10, 30],
          [RIGHT]
        );

        const { x, y, w, h, s } = sprite.dimensions;

        assert.deepNumberEqual(
          { x, y, w, h, s },
          { x: -40, y: 25, w: 105, h: 50, s: 2 }
        );
      });
    });

    module('`applyOpposite`', () => {
      test('translation RIGHT affects BOTTOM RIGHT point', assert => {
        const base = { w: 100, h: 50, x: 10, y: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [5, 15],
          [RIGHT],
          { applyOpposite: true }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 5, y: 50, w: 110, h: 50 });
      });

      test('negative translation affects BOTTOM RIGHT point', assert => {
        const base = { w: 100, h: 50, x: 10, y: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [-5, 15],
          [RIGHT],
          { applyOpposite: true }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 15, y: 50, w: 90, h: 50 });
      });

      test('translation affects BOTTOM RIGHT point', assert => {
        const base = { w: 100, h: 50, x: 10, y: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [5, 15],
          [BOTTOM],
          { applyOpposite: true }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 10, y: 35, w: 100, h: 80 });
      });

      test('translation affects LEFT/RIGHT point', assert => {
        const base = { w: 100, h: 50, x: 10, y: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [5, 15],
          [LEFT],
          { applyOpposite: true }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 15, y: 50, w: 90, h: 50 });
      });

      test('translation affects TOP/BOTTOM point', assert => {
        const base = { w: 100, h: 50, x: 10, y: 50 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [5, 15],
          [TOP],
          { applyOpposite: true }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 10, y: 65, w: 100, h: 20 });
      });
    });

    module('`constrainAspectRatio`', () => {
      test('RIGHT handle affects TOP/BOTTOM handle', assert => {
        const base = { w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [10, 5],
          [RIGHT],
          {
            keepRatio: true
          }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 0, y: 0, w: 110, h: 110 });
      });

      test('TOP handle affects RIGHT/LEFT handle', assert => {
        const base = { w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [10, 5],
          [TOP],
          {
            keepRatio: true
          }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 0, y: 5, w: 95, h: 95 });
      });

      test('BOTTOM handle affects LEFT/RIGHT handle', assert => {
        const base = { w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [10, 5],
          [BOTTOM],
          {
            keepRatio: true
          }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 0, y: 0, w: 105, h: 105 });
      });

      test('LEFT handle affects TOP/BOTTOM handle', assert => {
        const base = { w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [10, 5],
          [BOTTOM],
          {
            keepRatio: true
          }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 0, y: 0, w: 105, h: 105 });
      });

      test('BOTTOM RIGHT handle transform', assert => {
        const base = { w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [12, 8],
          [BOTTOM, RIGHT],
          {
            keepRatio: true
          }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual({ x, y, w, h }, { x: 0, y: 0, w: 110, h: 110 });
      });

      test('TOP LEFT handle transform', assert => {
        const base = { w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [-12, -8],
          [TOP, LEFT],
          {
            keepRatio: true
          }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual(
          { x, y, w, h },
          { x: -10, y: -10, w: 110, h: 110 }
        );
      });
    });

    module('opposite & constrain', () => {
      test('RIGHT handle affects all handles', assert => {
        const base = { w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [10, 5],
          [RIGHT],
          {
            keepRatio: true,
            applyOpposite: true
          }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual(
          { x, y, w, h },
          { x: -10, y: -10, w: 120, h: 120 }
        );
      });

      test('TOP LEFT handle affects all handles', assert => {
        const base = { w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [10, 5],
          [TOP, LEFT],
          {
            keepRatio: true,
            applyOpposite: true
          }
        );

        const { x, y, w, h } = sprite.dimensions;

        assert.deepNumberEqual(
          { x, y, w, h },
          { x: 7.5, y: 7.5, w: 85, h: 85 }
        );
      });
    });

    module('when rotated', () => {
      const { sqrt, cos, PI } = Math;

      test('translation affects RIGHT point when rotated', assert => {
        const base = { w: 100, h: 100, r: 45 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [30, 30],
          [RIGHT]
        );

        const addedLength = sqrt(30 * 30 * 2);
        const xDelta = cos((45 / 180) * PI) * 30;

        const { x, y, w, h, r } = sprite.dimensions;

        assert.deepNumberEqual(
          { x, y, w, h, r },
          {
            x: 15 - xDelta,
            y: 15,
            w: 100 + addedLength,
            h: 100,
            r: 45
          }
        );
      });

      test('translation affects TOP RIGHT point when rotated', assert => {
        const base = { w: 100, h: 100, r: 45 };
        const sprite = Sprite.fromDimensions(base).transformSize(
          [30, 0],
          [TOP, RIGHT]
        );

        const initialSide = sqrt(100 * 100 * 2);
        const finalSide = sqrt(130 * 130 * 2);

        const addedLength = (finalSide - initialSide) / 2;

        const { w, h, r } = sprite.dimensions;

        assert.deepNumberEqual(
          { w, h, r },
          {
            w: 100 + addedLength,
            h: 100 + addedLength,
            r: 45
          }
        );
      });
    });
  });

  module('transformRotation', () => {
    module('handles', () => {
      test('rotating from TOP LEFT point', assert => {
        const base = { x: 100, y: 200, w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformRotation(
          [50, 0],
          [TOP, LEFT]
        );

        assert.equal(sprite.dimensions.r, 45);
      });

      test('rotating from TOP point', assert => {
        const base = { x: 100, y: 200, w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformRotation(
          [50, 0],
          [TOP]
        );

        assert.equal(sprite.dimensions.r, 45);
      });

      test('rotating from TOP RIGHT point', assert => {
        const base = { x: 100, y: 200, w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformRotation(
          [0, 50],
          [TOP, RIGHT]
        );

        assert.equal(sprite.dimensions.r, 225);
      });

      test('rotating from RIGHT point', assert => {
        const base = { x: 100, y: 200, w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformRotation(
          [0, 50],
          [RIGHT]
        );

        assert.equal(sprite.dimensions.r, 45);
      });

      test('rotating from BOTTOM RIGHT point', assert => {
        const base = { x: 100, y: 200, w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformRotation(
          [-50, 0],
          [BOTTOM, RIGHT]
        );

        assert.equal(sprite.dimensions.r, 45);
      });

      test('rotating from BOTTOM point', assert => {
        const base = { x: 100, y: 200, w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformRotation(
          [-50, 0],
          [BOTTOM]
        );

        assert.equal(sprite.dimensions.r, 45);
      });

      test('rotating from BOTTOM LEFT point', assert => {
        const base = { x: 100, y: 200, w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformRotation(
          [-50, -50],
          [BOTTOM, LEFT]
        );

        assert.equal(sprite.dimensions.r, 45);
      });

      test('rotating from LEFT point', assert => {
        const base = { x: 100, y: 200, w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformRotation(
          [0, -50],
          [LEFT]
        );

        assert.equal(sprite.dimensions.r, 45);
      });
    });

    module('clamp percent', () => {
      test('rotation clamped to nearest 15° increment', assert => {
        const base = { x: 100, y: 200, w: 100, h: 100 };
        const sprite = Sprite.fromDimensions(base).transformRotation(
          [60, 0],
          [TOP, LEFT],
          { clampPercent: true }
        );

        assert.equal(sprite.dimensions.r, 60);
      });
    });
  });

  module('intersecting layers', () => {
    test('unrotated intersecting layers', assert => {
      const sprite1 = Sprite.fromDimensions({ w: 10, h: 10 });
      const sprite2 = Sprite.fromDimensions({ w: 10, h: 10, x: 5, y: 5 });

      assert.ok(Sprite.intersects(sprite1, sprite2));
    });

    test('rotated intersecting layers', assert => {
      const sprite1 = Sprite.fromDimensions({ w: 10, h: 10 });
      const sprite2 = Sprite.fromDimensions({
        w: 10,
        h: 10,
        x: 5,
        y: 5,
        r: 15
      });

      assert.ok(Sprite.intersects(sprite1, sprite2));
    });

    test('unrotated non-intersecting layers', assert => {
      const sprite1 = Sprite.fromDimensions({ w: 10, h: 10 });
      const sprite2 = Sprite.fromDimensions({ w: 10, h: 10, x: 15, y: 15 });

      assert.notOk(Sprite.intersects(sprite1, sprite2));
    });

    test('unrotated fully overlapping', assert => {
      const sprite1 = Sprite.fromDimensions({ w: 20, h: 20 });
      const sprite2 = Sprite.fromDimensions({ w: 5, h: 5, x: 10, y: 10 });

      assert.ok(Sprite.intersects(sprite1, sprite2));
    });

    test('rotated intersecting layers', assert => {
      const sprite1 = Sprite.fromDimensions({ w: 50, h: 50 });
      const sprite2 = Sprite.fromDimensions({
        w: 50,
        h: 50,
        x: 58,
        y: 10,
        r: 45
      });

      assert.ok(Sprite.intersects(sprite1, sprite2));
    });

    test('rotated non-intersecting layers', assert => {
      const sprite1 = Sprite.fromDimensions({ w: 50, h: 50 });
      const sprite2 = Sprite.fromDimensions({
        w: 50,
        h: 50,
        x: 10,
        y: 62,
        r: 45
      });

      assert.notOk(Sprite.intersects(sprite1, sprite2));
    });

    test('rotated non-intersecting layers (unrotated box intersecting)', assert => {
      const sprite1 = Sprite.fromDimensions({ w: 100, h: 10, x: 205, y: 85 });
      const sprite2 = Sprite.fromDimensions({
        w: 100,
        h: 100,
        x: 300,
        y: 0,
        r: 45
      });

      assert.notOk(Sprite.intersects(sprite1, sprite2));
    });

    test('no height/width never intersects', assert => {
      const sprite1 = Sprite.fromDimensions({ w: 0, h: 0, x: 200, y: 200 });
      const sprite2 = Sprite.fromDimensions({ w: 100, h: 100 });

      assert.notOk(Sprite.intersects(sprite1, sprite2));
    });
  });

  module('add / subtract', () => {
    module('adding scale', hooks => {
      let child: Sprite;
      let parent: Sprite;

      hooks.beforeEach(() => {
        parent = Sprite.fromDimensions({ w: 100, h: 100, r: 0, s: 2 });
        child = Sprite.fromDimensions({ w: 50, h: 50, r: 0 }).add(parent);
      });

      test('child, scaled', assert => {
        const { transformMatrix, dimensions } = child;
        const { w, h, x, y } = dimensions;

        assert.deepNumberEqual({ w, h, x, y }, { w: 50, h: 50, x: 0, y: 0 });
        assert.deepNumberEqual(applyToPoint(transformMatrix, [0, 0]), [25, 25]);
        assert.deepNumberEqual(applyToPoint(transformMatrix, [50, 50]), [
          125,
          125
        ]);
      });

      test('child, normalized', assert => {
        const { transformMatrix, dimensions } = child.normalizeScale();
        const { w, h, x, y } = dimensions;

        assert.deepNumberEqual({ w, h, x, y }, { w: 100, h: 100, x: 0, y: 0 });
        assert.deepNumberEqual(applyToPoint(transformMatrix, [0, 0]), [0, 0]);
        assert.deepNumberEqual(applyToPoint(transformMatrix, [100, 100]), [
          100,
          100
        ]);
      });
    });

    module('subtracting scale', hooks => {
      let child: Sprite;
      let parent: Sprite;

      hooks.beforeEach(() => {
        parent = Sprite.fromDimensions({
          x: 100,
          y: 100,
          w: 100,
          h: 100,
          s: 2
        });
        child = Sprite.fromDimensions({
          x: 100,
          y: 100,
          w: 50,
          h: 50,
          s: 2
        }).subtract(parent);
      });

      test('child, scaled', assert => {
        const { transformMatrix, dimensions } = child;
        const { w, h, x, y } = dimensions;

        assert.deepNumberEqual({ w, h, x, y }, { w: 50, h: 50, x: 0, y: 0 });
        assert.deepNumberEqual(applyToPoint(transformMatrix, [0, 0]), [0, 0]);
        assert.deepNumberEqual(applyToPoint(transformMatrix, [50, 50]), [
          50,
          50
        ]);
      });

      test('child, normalized', assert => {
        const { transformMatrix, dimensions } = child.normalizeScale();
        const { w, h, x, y } = dimensions;

        assert.deepNumberEqual({ w, h, x, y }, { w: 50, h: 50, x: 0, y: 0 });
        assert.deepNumberEqual(applyToPoint(transformMatrix, [0, 0]), [0, 0]);
        assert.deepNumberEqual(applyToPoint(transformMatrix, [50, 50]), [
          50,
          50
        ]);
      });
    });

    module('rotation', () => {
      test('add rotation', assert => {
        const parent = Sprite.fromDimensions({ w: 100, h: 100, r: 45 });
        const child = Sprite.fromDimensions({ w: 100, h: 100 }).add(parent);

        const { transformMatrix: childMatrix } = child;
        const { transformMatrix: parentMatrix } = parent;

        assert.deepNumberEqual(
          applyToPoint(childMatrix, [0, 0]),
          applyToPoint(parentMatrix, [0, 0])
        );
      });
    });
  });
});
