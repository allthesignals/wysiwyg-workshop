import Vector from 'ember-wysiwyg/utils/sprites/vector';
import { module, test } from 'qunit';

module('Unit | Utility | sprites/vector', function() {
  module('utilities', () => {
    test('clone', assert => {
      const v1 = new Vector([10, 20]);
      const v2 = v1.clone();

      assert.notEqual(v1, v2);
    });

    test('can spread into array', assert => {
      const v1 = new Vector([5, 15]);
      const result = [...v1];
      assert.deepEqual(result, [5, 15]);
    });
  });

  module('length', () => {
    test('horizontal length', assert => {
      const v = new Vector([0, 100]);
      assert.numberEqual(v.length, 100);
    });

    test('vertical length', assert => {
      const v = new Vector([100, 0]);
      assert.numberEqual(v.length, 100);
    });

    test('angled length', assert => {
      const v = new Vector([30, 40]);
      assert.numberEqual(v.length, 50);
    });
  });

  module('angles', () => {
    module('radians', () => {
      const { PI } = Math;

      test('horizontal', assert => {
        const v = new Vector([0, 10]);
        assert.numberEqual(v.radians, PI / 2);
      });

      test('vertical', assert => {
        const v = new Vector([10, 0]);
        assert.numberEqual(v.radians, 0);
      });

      test('angle', assert => {
        const v = new Vector([10, 10]);
        assert.numberEqual(v.radians, PI / 4);
      });

      test('reverse angle', assert => {
        const v = new Vector([-10, -10]);
        assert.numberEqual(v.radians, (-3 * PI) / 4);
      });
    });

    module('angle (degrees)', () => {
      test('horizontal', assert => {
        const v = new Vector([0, 10]);
        assert.numberEqual(v.angle, 90);
      });

      test('vertical', assert => {
        const v = new Vector([10, 0]);
        assert.numberEqual(v.angle, 0);
      });

      test('angle', assert => {
        const v = new Vector([10, 10]);
        assert.numberEqual(v.angle, 45);
      });

      test('reverse angle', assert => {
        const v = new Vector([-10, -10]);
        assert.numberEqual(v.angle, 225);
      });
    });

    module('rotating', () => {
      test('angle is computed', assert => {
        const v = new Vector([10, 0]).rotate(103);
        assert.numberEqual(v.angle, 103);
      });

      test('multiple rotations are cumulative', assert => {
        const v = new Vector([10, 0]).rotate(45).rotate(25);
        assert.numberEqual(v.angle, 70);
      });

      test('rotation above 360 is normalized', assert => {
        const v = new Vector([10, 0]).rotate(1490);
        assert.numberEqual(v.angle, 50);
      });

      test('rotating is immutable', assert => {
        const v = new Vector([10, 0]);
        const v2 = v.rotate(215);

        assert.notEqual(v, v2);
      });
    });
  });

  module('vector math', () => {
    test('invert', assert => {
      const v = new Vector([50, 100]);
      const v2 = v.invert();
      const { x, y } = v2;

      assert.notEqual(v, v2, 'invert is immutable');
      assert.numberEqual(x, -50);
      assert.numberEqual(y, -100);
    });

    test('add', assert => {
      const v1 = new Vector([2, 2]);
      const v2 = new Vector([3, 5]);

      const v3 = v1.add(v2);

      const { x, y } = v3;

      assert.numberEqual(x, 5);
      assert.numberEqual(y, 7);
      assert.notEqual(v1, v3, 'add is immutable');
    });

    test('sub', assert => {
      const v1 = new Vector([2, 2]);
      const v2 = new Vector([3, 5]);

      const v3 = v1.sub(v2);

      const { x, y } = v3;

      assert.numberEqual(x, -1);
      assert.numberEqual(y, -3);
      assert.notEqual(v1, v3, 'add is immutable');
    });

    test('scale', assert => {
      const v = new Vector([30, 40]);
      const v2 = v.scale(0.5);

      assert.numberEqual(v2.length, 25);
      assert.notEqual(v, v2, 'scale is immutable');
    });
  });

  module('projections', () => {
    test('vector projections on x axis', assert => {
      const a = new Vector([50, -50]);
      const alongX = new Vector([100, 0]);
      const v3 = a.project(alongX);

      assert.numberEqual(v3.x, 50);
      assert.numberEqual(v3.y, 0);
    });

    test('vector projections on y axis', assert => {
      const a = new Vector([50, 50]);
      const alongY = new Vector([0, 50]);
      const v3 = a.project(alongY);

      assert.numberEqual(v3.x, 0);
      assert.numberEqual(v3.y, 50);
    });

    test('vector projections on rotated axis', assert => {
      const a = new Vector([60, 80]);
      const alongAngle = new Vector([30, 40]);
      const v3 = a.project(alongAngle);

      assert.numberEqual(v3.x, 60);
      assert.numberEqual(v3.y, 80);
    });
  });
});
