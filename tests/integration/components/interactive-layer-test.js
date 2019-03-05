import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  find,
  focus,
  triggerKeyEvent
} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupLayerState from 'ember-wysiwyg/tests/helpers/setup-layer-state';
import dragEvent from 'ember-wysiwyg/tests/helpers/drag-event';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

const INTERACTIVE_LAYER = '[data-test-interactive-layer]';

module('Integration | Component | interactive-layer', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupLayerState(hooks);

  hooks.beforeEach(async function() {
    const layer = await this.createLayer({
      top: 0,
      left: 0,
      width: 100,
      height: 100,
      rotation: 0
    });

    this.set('layer', layer);

    await render(hbs`
      <div style="position: relative; width: 200px; height: 200px;">
        <InteractiveLayer @layer={{layer}} />
      </div>
    `);
  });

  module('manipulating layers', hooks => {
    hooks.beforeEach(async function() {
      await click(INTERACTIVE_LAYER);
    });

    module('standard resizing', () => {
      test('resizing top', async function(assert) {
        const handle = find('[data-test-handle="top"]');

        await dragEvent(handle, [10, 50]);

        const { y, h } = this.layer.sprite.dimensions;

        assert.numberEqual(y, 50, 'y');
        assert.numberEqual(h, 50, 'h');
      });

      test('resizing top/right', async function(assert) {
        const handle = find('[data-test-handle="top-right"]');

        await dragEvent(handle, [50, -50]);

        const { x, y, h, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, 0, 'x');
        assert.numberEqual(y, -50, 'y');
        assert.numberEqual(h, 150, 'h');
        assert.numberEqual(w, 150, 'w');
      });

      test('resizing right', async function(assert) {
        const handle = find('[data-test-handle="right"]');

        await dragEvent(handle, [50, 10]);

        const { x, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, 0, 'x');
        assert.numberEqual(w, 150, 'w');
      });

      test('resizing bottom/right', async function(assert) {
        const handle = find('[data-test-handle="bottom-right"]');

        await dragEvent(handle, [50, -50]);

        const { x, y, h, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, 0, 'x');
        assert.numberEqual(y, 0, 'y');
        assert.numberEqual(h, 50, 'h');
        assert.numberEqual(w, 150, 'w');
      });

      test('resizing bottom', async function(assert) {
        const handle = find('[data-test-handle="bottom"]');

        await dragEvent(handle, [10, -50]);

        const { y, h } = this.layer.sprite.dimensions;

        assert.numberEqual(y, 0, 'y');
        assert.numberEqual(h, 50, 'h');
      });

      test('resizing bottom/left', async function(assert) {
        const handle = find('[data-test-handle="bottom-left"]');

        await dragEvent(handle, [50, -50]);

        const { x, y, h, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, 50, 'x');
        assert.numberEqual(y, 0, 'y');
        assert.numberEqual(h, 50, 'h');
        assert.numberEqual(w, 50, 'w');
      });

      test('resizing left', async function(assert) {
        const handle = find('[data-test-handle="left"]');

        await dragEvent(handle, [50, -10]);

        const { x, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, 50, 'x');
        assert.numberEqual(w, 50, 'w');
      });

      test('resizing top/left', async function(assert) {
        const handle = find('[data-test-handle="top-left"]');

        await dragEvent(handle, [50, -50]);

        const { x, y, h, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, 50, 'x');
        assert.numberEqual(y, -50, 'y');
        assert.numberEqual(h, 150, 'h');
        assert.numberEqual(w, 50, 'w');
      });
    });

    module('resizing with modifiers', () => {
      test('resizing bottom with Shift keeps aspect', async function(assert) {
        const handle = find('[data-test-handle="bottom"]');

        await dragEvent(handle, [10, -50], { shiftKey: true });

        const { x, y, h, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, 0, 'x');
        assert.numberEqual(y, 0, 'y');
        assert.numberEqual(h, 50, 'h');
        assert.numberEqual(w, 50, 'w');
      });

      test('resizing bottom/right with Shift keeps aspect', async function(assert) {
        const handle = find('[data-test-handle="bottom-right"]');

        await dragEvent(handle, [60, 50], { shiftKey: true });

        const { x, y, h, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, 0, 'x');
        assert.numberEqual(y, 0, 'y');
        assert.numberEqual(h, 155, 'h');
        assert.numberEqual(w, 155, 'w');
      });

      test('resizing bottom with Command applies opposite', async function(assert) {
        const handle = find('[data-test-handle="bottom"]');

        await dragEvent(handle, [10, 25], { metaKey: true });

        const { x, y, h, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, 0, 'x');
        assert.numberEqual(y, -25, 'y');
        assert.numberEqual(h, 150, 'h');
        assert.numberEqual(w, 100, 'w');
      });

      test('resizing bottom/right with Command applies opposite', async function(assert) {
        const handle = find('[data-test-handle="bottom-right"]');

        await dragEvent(handle, [25, 25], { metaKey: true });

        const { x, y, h, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, -25, 'x');
        assert.numberEqual(y, -25, 'y');
        assert.numberEqual(h, 150, 'h');
        assert.numberEqual(w, 150, 'w');
      });

      test('resizing bottom with Command+Shift key', async function(assert) {
        const handle = find('[data-test-handle="bottom"]');

        await dragEvent(handle, [10, 25], { shiftKey: true, metaKey: true });

        const { x, y, h, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, -25, 'x');
        assert.numberEqual(y, -25, 'y');
        assert.numberEqual(h, 150, 'h');
        assert.numberEqual(w, 150, 'w');
      });

      test('resizing bottom/right with Command+Shift key', async function(assert) {
        const handle = find('[data-test-handle="bottom-right"]');

        await dragEvent(handle, [30, 25], { shiftKey: true, metaKey: true });

        const { x, y, h, w } = this.layer.sprite.dimensions;

        assert.numberEqual(x, -27.5, 'x');
        assert.numberEqual(y, -27.5, 'y');
        assert.numberEqual(h, 155, 'h');
        assert.numberEqual(w, 155, 'w');
      });
    });

    module('rotating layers', () => {
      test('rotating layer', async function(assert) {
        const handle = find('[data-test-handle="rotate"]');

        await dragEvent(handle, [50, 0]);

        const { r } = this.layer.sprite.dimensions;

        assert.numberEqual(r, 45, 'r');
      });

      test('rotating layer with Shift key rounds to nearest 15', async function(assert) {
        const handle = find('[data-test-handle="rotate"]');

        await dragEvent(handle, [53, 0], { shiftKey: true });

        const { r } = this.layer.sprite.dimensions;

        assert.numberEqual(r, 45, 'r');
      });

      test('rotating layer with Meta key', async function(assert) {
        const handle = find('[data-test-handle="rotate"]');

        await dragEvent(handle, [53, 0], { metaKey: true });

        const { r } = this.layer.sprite.dimensions;

        assert.numberEqual(r, 45, 'r');
      });
    });
  });

  module('select and move layers', () => {
    test('can select a layer', async function(assert) {
      assert.dom('[data-test-handle="top"]').doesNotExist();
      await click(INTERACTIVE_LAYER);
      assert.dom('[data-test-handle="top"]').exists();
    });

    test('can move a layer', async function(assert) {
      const layer = find(INTERACTIVE_LAYER);
      await click(layer);
      await dragEvent(layer, [50, 100]);

      const { x, y } = this.layer.sprite.dimensions;

      assert.numberEqual(x, 50, 'x');
      assert.numberEqual(y, 100, 'y');
    });

    test('can select a layer with keyboard', async function(assert) {
      const SPACEBAR = 32;
      const layer = find(INTERACTIVE_LAYER);

      await focus(layer);
      await triggerKeyEvent(layer, 'keydown', SPACEBAR);

      assert.dom('[data-test-handle="top"]').exists();
    });
  });
});
