import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupLayerState from 'ember-wysiwyg/tests/helpers/setup-layer-state';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

module('Integration | Component | composition-shortcuts', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupLayerState(hooks);

  let layerSelection, layerState;

  hooks.beforeEach(function() {
    layerSelection = this.owner.lookup('service:layer-selection');
    layerState = this.owner.lookup('service:layer-state');
  });

  test('select all works', async function(assert) {
    await this.createLayers(3);

    await render(hbs`<CompositionShortcuts />`);

    assert.equal(layerSelection.selectedLayers.length, 0);

    await triggerKeyEvent(document, 'keydown', 'A', {
      metaKey: true
    });

    assert.equal(layerSelection.selectedLayers.length, 3);
  });

  test('delete works', async function(assert) {
    const DELETE = 8;
    const [layer1] = await this.createLayers(2);

    layerSelection.selectLayer(layer1);

    await render(hbs`<CompositionShortcuts />`);

    await triggerKeyEvent(document, 'keydown', DELETE);

    assert.equal(layerState.layers.length, 1);
  });

  test('escape works', async function(assert) {
    const ESCAPE = 27;
    const [layer1] = await this.createLayers(2);

    layerSelection.selectLayer(layer1);

    await render(hbs`<CompositionShortcuts />`);

    await triggerKeyEvent(document, 'keydown', ESCAPE);

    assert.equal(layerSelection.selectedLayers.length, 0);
  });

  module('nudging', () => {
    const nudge = (direction, options = {}) =>
      triggerKeyEvent(document, 'keydown', direction, {
        metaKey: !!options.metaKey,
        shiftKey: !!options.shiftKey
      });

    test('nudging right/left works', async function(assert) {
      const layer = await this.createLayer({ left: 0 });

      await render(hbs`<CompositionShortcuts />`);

      layerSelection.selectLayer(layer);

      assert.numberEqual(layer.sprite.dimensions.x, 0);

      await nudge(RIGHT);

      assert.numberEqual(layer.sprite.dimensions.x, 1);

      await nudge(LEFT, { metaKey: true });

      assert.numberEqual(layer.sprite.dimensions.x, -4);

      await nudge(RIGHT, { metaKey: true, shiftKey: true });

      assert.numberEqual(layer.sprite.dimensions.x, 21);
    });

    test('nudging up/down works', async function(assert) {
      const layer = await this.createLayer({ top: 0 });

      await render(hbs`<CompositionShortcuts />`);

      layerSelection.selectLayer(layer);

      assert.numberEqual(layer.sprite.dimensions.y, 0);

      await nudge(DOWN);

      assert.numberEqual(layer.sprite.dimensions.y, 1);

      await nudge(UP, { metaKey: true });

      assert.numberEqual(layer.sprite.dimensions.y, -4);

      await nudge(DOWN, { metaKey: true, shiftKey: true });

      assert.numberEqual(layer.sprite.dimensions.y, 21);
    });

    test('nudging multiple layers', async function(assert) {
      const [layer1, layer2] = await this.createLayers(2, {
        left: i => i * 20
      });

      await render(hbs`<CompositionShortcuts />`);

      layerSelection.selectLayers(layerState.layers);

      assert.numberEqual(layer1.sprite.dimensions.x, 0);
      assert.numberEqual(layer2.sprite.dimensions.x, 20);

      await nudge(RIGHT);

      assert.numberEqual(layer1.sprite.dimensions.x, 1);
      assert.numberEqual(layer2.sprite.dimensions.x, 21);
    });
  });
});
