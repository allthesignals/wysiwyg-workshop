import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import setupLayerState from 'ember-wysiwyg/tests/helpers/setup-layer-state';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const LAYER = `[data-test-layer]`;
const SELECTED_ATTR = 'data-test-layer-selected';
const SELECTED = `[${SELECTED_ATTR}]`;
const LAYER_AT = index => `[data-test-layer="${index}"]`;

module('Integration | Component | layer-list', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupLayerState(hooks);

  test('it renders all the layers', async function(assert) {
    await this.createLayers(4);

    await render(hbs`<LayerList />`);

    assert.dom(LAYER).exists({ count: 4 });
    assert.dom(SELECTED).doesNotExist();
  });

  test('a layer can be selected', async function(assert) {
    await this.createLayers(4);

    await render(hbs`<LayerList />`);

    await click(LAYER_AT(0));

    assert.dom(SELECTED).exists({ count: 1 });
    assert.dom(LAYER_AT(0)).hasAttribute(SELECTED_ATTR);
  });

  test('clicking multiple layers changes selection', async function(assert) {
    await this.createLayers(4);

    await render(hbs`<LayerList />`);

    await click(LAYER_AT(0));
    await click(LAYER_AT(2));

    assert.dom(SELECTED).exists({ count: 1 });
    assert.dom(LAYER_AT(0)).doesNotHaveAttribute(SELECTED_ATTR);
    assert.dom(LAYER_AT(2)).hasAttribute(SELECTED_ATTR);
  });

  test('clicking multiple layers with command adds to selection', async function(assert) {
    await this.createLayers(4);

    await render(hbs`<LayerList />`);

    await click(LAYER_AT(0));
    await click(LAYER_AT(2), { metaKey: true });

    assert.dom(SELECTED).exists({ count: 2 });
    assert.dom(LAYER_AT(0)).hasAttribute(SELECTED_ATTR);
    assert.dom(LAYER_AT(2)).hasAttribute(SELECTED_ATTR);
  });

  test('clicking multiple layers with shift selects in betweens', async function(assert) {
    await this.createLayers(4);

    await render(hbs`<LayerList />`);

    await click(LAYER_AT(1));
    await click(LAYER_AT(3), { shiftKey: true });

    assert.dom(SELECTED).exists({ count: 3 });
    assert.dom(LAYER_AT(1)).hasAttribute(SELECTED_ATTR);
    assert.dom(LAYER_AT(2)).hasAttribute(SELECTED_ATTR);
    assert.dom(LAYER_AT(3)).hasAttribute(SELECTED_ATTR);
  });

  test('clicking multiple layers in reverse with shift', async function(assert) {
    await this.createLayers(4);

    await render(hbs`<LayerList />`);

    await click(LAYER_AT(3));
    await click(LAYER_AT(1), { shiftKey: true });

    assert.dom(SELECTED).exists({ count: 3 });
    assert.dom(LAYER_AT(1)).hasAttribute(SELECTED_ATTR);
    assert.dom(LAYER_AT(2)).hasAttribute(SELECTED_ATTR);
    assert.dom(LAYER_AT(3)).hasAttribute(SELECTED_ATTR);
  });
});
