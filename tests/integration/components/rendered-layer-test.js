import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupLayerState from 'ember-wysiwyg/tests/helpers/setup-layer-state';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { Sprite } from 'ember-wysiwyg/utils/sprites';
import getUnscaledClientRect from 'ember-wysiwyg/tests/helpers/unscaled-client-rect';

const RENDERED_LAYER = '[data-test-rendered-layer]';

module('Integration | Component | rendered-layer', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupLayerState(hooks);

  test('attributes are passed through', async function(assert) {
    this.set('layer', await this.createLayer());

    await render(hbs`<RenderedLayer @layer={{this.layer}} class="my-layer" />`);

    assert.equal(find('.my-layer'), find(RENDERED_LAYER));
  });

  test('layer positioning', async function(assert) {
    const layerParams = {
      left: 50,
      top: 100,
      width: 100,
      height: 50,
      rotation: 0
    };

    this.set('layer', await this.createLayer(layerParams));

    await render(hbs`
      <div class="container" style="position: absolute; width: 100px; height: 100px;">
        <RenderedLayer @layer={{layer}} />
      </div>
    `);

    const containerBox = getUnscaledClientRect(find('.container'));
    const layerBox = getUnscaledClientRect(find(RENDERED_LAYER));

    assert.equal(layerBox.width, 100, 'width');
    assert.equal(layerBox.height, 50, 'height');
    assert.equal(layerBox.top - containerBox.top, 100, 'top');
    assert.equal(layerBox.left - containerBox.left, 50, 'left');
  });

  test('layer styles', async function(assert) {
    const layerParams = {
      background: 'red',
      color: 'blue',
      text: 'Hello, world!'
    };

    this.set('layer', await this.createLayer(layerParams));

    await render(hbs`<RenderedLayer @layer={{layer}} />`);

    const element = assert.dom(RENDERED_LAYER);

    element.exists();
    element.hasText('Hello, world!');
    element.hasStyle({
      backgroundColor: 'rgb(255, 0, 0)',
      color: 'rgb(0, 0, 255)'
    });
  });

  test('layer positioning - parent offset', async function(assert) {
    const layerParams = {
      left: 50,
      top: 100,
      rotation: 0
    };

    const offsetX = 100;
    const offsetY = 200;

    this.set('layer', await this.createLayer(layerParams));
    this.set(
      'parentSprite',
      Sprite.fromDimensions({ w: 50, h: 50 }).translate([offsetX, offsetY])
    );

    await render(hbs`
      <div class="container" style="position: absolute; width: 100px; height: 100px;">
        <RenderedLayer @layer={{layer}} @parentSprite={{parentSprite}} />
      </div>
    `);

    const containerBox = getUnscaledClientRect(find('.container'));
    const layerBox = getUnscaledClientRect(find(RENDERED_LAYER));

    assert.equal(layerBox.top - containerBox.top, 100 + offsetY, 'top');
    assert.equal(layerBox.left - containerBox.left, 50 + offsetX, 'left');
  });
});
