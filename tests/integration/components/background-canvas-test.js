import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import sinon from 'sinon';
import setupLayerState from 'ember-wysiwyg/tests/helpers/setup-layer-state';
import { Sprite } from 'ember-wysiwyg/utils/sprites';
import dragEvent, {
  dragEventStages
} from 'ember-wysiwyg/tests/helpers/drag-event';

module('Integration | Component | background-canvas', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupLayerState(hooks);

  let selectionService;
  let layerState;
  let canvasTools;
  const CANVAS = '[data-test-background-canvas]';
  const SELECTION = '[data-test-background-selection]';

  hooks.beforeEach(function() {
    selectionService = this.owner.lookup('service:layer-selection');
    layerState = this.owner.lookup('service:layer-state');
    canvasTools = this.owner.lookup('service:canvas-tools');
  });

  test('clicking will clear the selection', async function(assert) {
    const layer = await this.createLayer();

    await render(hbs`<BackgroundCanvas />`);

    selectionService.selectLayer(layer);

    await click(CANVAS);

    assert.equal(selectionService.selectedLayers.length, 0);
  });

  test('dragging will render a selection box', async function(assert) {
    await render(hbs`<BackgroundCanvas />`);

    const [start, move, finish] = dragEventStages(CANVAS, [50, 100]);

    await start();

    const element = find(SELECTION);
    const startX = parseInt(element.style.left, 10);
    const startY = parseInt(element.style.top, 10);

    await move();

    assert.dom(SELECTION).hasStyle({
      width: '50px',
      height: '100px',
      left: `${startX}px`,
      top: `${startY}px`
    });

    await finish();

    assert.dom(SELECTION).doesNotExist('not visible after drag event');
  });

  test('dragging negative will render a selection box', async function(assert) {
    await render(hbs`<BackgroundCanvas />`);

    const [start, move, finish] = await dragEventStages(CANVAS, [-50, -100]);

    await start();

    const element = find(SELECTION);
    const startX = parseInt(element.style.left, 10);
    const startY = parseInt(element.style.top, 10);

    await move();

    assert.dom(SELECTION).hasStyle({
      width: '50px',
      height: '100px',
      left: `${startX - 50}px`,
      top: `${startY - 100}px`
    });

    await finish();

    assert.dom(SELECTION).doesNotExist('not visible after drag event');
  });

  test('dragging a box will select intersecting boxes', async function(assert) {
    const layer = await this.createLayer();
    const filterStub = sinon
      .stub(layerState, 'filterBySprite')
      .returns([layer]);

    await render(hbs`<BackgroundCanvas />`);

    await dragEvent(CANVAS, [50, 100]);

    const [filterSprite] = filterStub.lastCall.args;
    const { w, h } = filterSprite.dimensions;

    assert.equal(
      selectionService.selectedLayers.length,
      1,
      'the layer was selected'
    );
    assert.equal(w, 50, 'filter sprite had width of 50');
    assert.equal(h, 100, 'filter sprite had height of 100');
  });

  test('dragging a box with parent offset select intersecting boxes', async function(assert) {
    const parentSprite = Sprite.fromDimensions({ w: 100, h: 100 }).scale(2);

    const layer = await this.createLayer();
    const filterStub = sinon
      .stub(layerState, 'filterBySprite')
      .returns([layer]);

    this.set('parentSprite', parentSprite);

    await render(hbs`<BackgroundCanvas @parentSprite={{this.parentSprite}} />`);

    await dragEvent(CANVAS, [50, 100]);

    const [filterSprite] = filterStub.lastCall.args;
    const { w, h } = filterSprite.normalizeScale().dimensions;

    assert.equal(
      selectionService.selectedLayers.length,
      1,
      'the layer was selected'
    );
    assert.equal(w, 25, 'filter sprite has scaled width');
    assert.equal(h, 50, 'filter sprite has scaled height');
  });

  test('dragging a box when new layer tool selected creates new layer', async function(assert) {
    const createSpy = sinon.spy(layerState, 'newLayer');

    canvasTools.chooseNewLayerTool();
    await render(hbs`<BackgroundCanvas />`);
    await dragEvent(CANVAS, [50, 100]);

    const [{ sprite }] = createSpy.lastCall.args;

    assert.equal(sprite.dimensions.w, 50);
    assert.equal(sprite.dimensions.h, 100);
  });
});
