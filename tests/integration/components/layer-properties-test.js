import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import setupLayerState from 'ember-wysiwyg/tests/helpers/setup-layer-state';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | layer-properties', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupLayerState(hooks);

  test('can update the x position', async function(assert) {
    const layer = await this.createLayer({ left: 10 });
    const INPUT = '[data-test-x-input] input';

    this.set('layer', layer);

    await render(hbs`<LayerProperties @layer={{this.layer}} />`);

    assert.dom(INPUT).hasValue('10');

    await fillIn(INPUT, '50');

    assert.equal(layer.sprite.dimensions.x, 50);
  });

  test('can update the y position', async function(assert) {
    const layer = await this.createLayer({ top: 10 });
    const INPUT = '[data-test-y-input] input';

    this.set('layer', layer);

    await render(hbs`<LayerProperties @layer={{this.layer}} />`);

    assert.dom(INPUT).hasValue('10');

    await fillIn(INPUT, '50');

    assert.equal(layer.sprite.dimensions.y, 50);
  });

  test('can update the width', async function(assert) {
    const layer = await this.createLayer({ width: 10 });
    const INPUT = '[data-test-w-input] input';

    this.set('layer', layer);

    await render(hbs`<LayerProperties @layer={{this.layer}} />`);

    assert.dom(INPUT).hasValue('10');

    await fillIn(INPUT, '50');

    assert.equal(layer.sprite.dimensions.w, 50);
  });

  test('can update the height', async function(assert) {
    const layer = await this.createLayer({ height: 10 });
    const INPUT = '[data-test-h-input] input';

    this.set('layer', layer);

    await render(hbs`<LayerProperties @layer={{this.layer}} />`);

    assert.dom(INPUT).hasValue('10');

    await fillIn(INPUT, '50');

    assert.equal(layer.sprite.dimensions.h, 50);
  });

  test('can update the rotation', async function(assert) {
    const layer = await this.createLayer({ rotation: 10 });
    const INPUT = '[data-test-r-input] input';

    this.set('layer', layer);

    await render(hbs`<LayerProperties @layer={{this.layer}} />`);

    assert.dom(INPUT).hasValue('10');

    await fillIn(INPUT, '50');

    assert.equal(layer.sprite.dimensions.r, 50);
  });

  test('invalid numbers do not trigger updates', async function(assert) {
    const layer = await this.createLayer({ left: 10 });
    const INPUT = '[data-test-x-input] input';
    const { sprite } = layer;

    this.set('layer', layer);

    await render(hbs`<LayerProperties @layer={{this.layer}} />`);
    await fillIn(INPUT, 'NOT A NUMBER');

    assert.equal(sprite, layer.sprite, 'the sprite was not updated');
  });
});
