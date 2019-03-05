import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import setupLayerState from 'ember-wysiwyg/tests/helpers/setup-layer-state';
import { Sprite } from 'ember-wysiwyg/utils/sprites';

module('Unit | Service | layer-state', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);
  setupLayerState(hooks);

  let layerState;

  hooks.beforeEach(function() {
    layerState = this.owner.lookup('service:layer-state');
  });

  test('layers are initialized', async function(assert) {
    await this.createLayers(3);
    assert.ok(layerState.layers.length, 3);
  });

  test('can filter layers by a sprite', async function(assert) {
    await this.createLayers(3, {
      width: 80,
      height: 300,
      top: 0,
      left: i => i * 100,
      rotation: 0
    });

    const filterSprite = Sprite.fromDimensions({ w: 150, h: 10 });
    const layers = layerState.filterBySprite(filterSprite);

    assert.equal(layers.length, 2);
  });

  test('can update layer attributes', async function(assert) {
    const [layer] = await this.createLayers(3);

    assert.notEqual(layer.text, 'new text!');

    layerState.updateLayer(layer, { text: 'new text!' });

    assert.equal(layer.text, 'new text!');
  });

  test('can create new layers', async function(assert) {
    const sprite = Sprite.fromDimensions({ w: 150, h: 10 });
    const layer = layerState.newLayer({ text: 'hello', sprite });

    assert.equal(layer.text, 'hello');
    assert.equal(layerState.layers.length, 1);
  });

  test('can delete layers', async function(assert) {
    const [layer1, layer2] = await this.createLayers(3);

    layerState.deleteLayers([layer1, layer2]);

    assert.equal(layerState.layers.length, 1);
  });

  test('can delete single layer', async function(assert) {
    const [layer1] = await this.createLayers(3);

    layerState.deleteLayer(layer1);

    assert.equal(layerState.layers.length, 2);
  });
});
