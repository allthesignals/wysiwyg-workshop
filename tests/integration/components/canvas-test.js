import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import setupLayerState from 'ember-wysiwyg/tests/helpers/setup-layer-state';
import dragEvent from 'ember-wysiwyg/tests/helpers/drag-event';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { render, find, triggerKeyEvent } from '@ember/test-helpers';

const CANVAS = '[data-test-canvas]';
const RENDERED_LAYER = '[data-test-rendered-layer]';
const INTERACTIVE_LAYER = '[data-test-interactive-layer]';
const PAN = '[data-test-canvas-pan]';
const BACKGROUND = '[data-test-background-canvas]';

module('Integration | Component | canvas', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupLayerState(hooks);

  test('renders canvas according to height/width', async function(assert) {
    await render(hbs`<Canvas @width=200 @height=300 />`);

    assert.dom(CANVAS).hasStyle({
      height: '300px',
      width: '200px'
    });
  });

  test('can zoom into canvas', async function(assert) {
    const PLUS = 187;

    await render(hbs`<Canvas @width=200 @height=300 />`);

    const canvas = find(CANVAS);
    const { width: initialWidth } = canvas.getBoundingClientRect();

    await triggerKeyEvent(document, 'keydown', PLUS, { metaKey: true });

    const { width: afterWidth } = canvas.getBoundingClientRect();

    assert.equal(afterWidth / initialWidth, 1.1);
  });

  test('canvas renders all layers', async function(assert) {
    await this.createLayers(3);
    await render(hbs`<Canvas @width=200 @height=300 />`);

    assert.dom(RENDERED_LAYER).exists({ count: 3 });
    assert.dom(INTERACTIVE_LAYER).exists({ count: 3 });
  });

  test('can pan the canvas', async function(assert) {
    const SPACEBAR = 32;

    await render(hbs`<Canvas @width=200 @height=300 />`);

    const canvas = find(CANVAS);
    const { left: leftStart, top: topStart } = canvas.getBoundingClientRect();

    await triggerKeyEvent(document, 'keydown', SPACEBAR);
    await dragEvent(PAN, [-10, 10], { scaleEvent: true });

    const { left: leftEnd, top: topEnd } = canvas.getBoundingClientRect();

    assert.equal(leftEnd - leftStart, -10);
    assert.equal(topEnd - topStart, 10);
  });

  test('can select via background canvas', async function(assert) {
    const selection = this.owner.lookup('service:layer-selection');

    await this.createLayers(3, {
      width: 80,
      height: 300,
      top: 0,
      left: i => i * 100,
      rotation: 0
    });

    await render(hbs`
      <div style="position: relative; width: 500px; height: 500px">
        <Canvas @width=300 @height=300 />
      </div>
    `);

    await dragEvent(BACKGROUND, [250, 200]);

    assert.equal(selection.selectedLayers.length, 2, 'two layers selected');
  });
});
