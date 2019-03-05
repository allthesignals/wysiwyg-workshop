import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import dragEvent from 'ember-wysiwyg/tests/helpers/drag-event';
import sinon from 'sinon';

const SPACEBAR = 32;
const PAN_CONTAINER = '[data-test-canvas-pan]';

module('Integration | Component | canvas-pan', function(hooks) {
  setupRenderingTest(hooks);

  let canvasTools;

  hooks.beforeEach(function() {
    canvasTools = this.owner.lookup('service:canvas-tools');
  });

  test('pan area is visible by default when space down', async function(assert) {
    await render(hbs`<CanvasPan />`);

    assert.dom(PAN_CONTAINER).doesNotExist();

    await triggerKeyEvent(document, 'keydown', SPACEBAR);

    assert.dom(PAN_CONTAINER).exists();
  });

  test('pan area is made visible when hand tool preselected', async function(assert) {
    canvasTools.chooseHandTool();
    await render(hbs`<CanvasPan />`);
    assert.dom(PAN_CONTAINER).exists();
  });

  test('tool is reset after panning with spacebar', async function(assert) {
    await render(hbs`<CanvasPan />`);

    assert.notOk(canvasTools.isHandTool);

    await triggerKeyEvent(document, 'keydown', SPACEBAR);

    assert.ok(canvasTools.isHandTool);

    await triggerKeyEvent(document, 'keyup', SPACEBAR);

    assert.notOk(canvasTools.isHandTool);
  });

  test('pan area accepts passed in attributes', async function(assert) {
    await render(hbs`<CanvasPan data-test="hello" />`);

    await triggerKeyEvent(document, 'keydown', SPACEBAR);

    assert.dom('[data-test=hello]').exists();
  });

  test('pan area sends panning events', async function(assert) {
    const pan = sinon.stub();
    this.set('pan', pan);

    await render(hbs`<CanvasPan @onPan={{this.pan}} />`);

    await triggerKeyEvent(document, 'keydown', SPACEBAR);

    const panContainer = find(PAN_CONTAINER);

    await dragEvent(panContainer, [10, 50]);

    assert.deepNumberEqual(pan.lastCall.args[0], [10, 50]);
  });

  test('pan area sends panning events relative to initial pan', async function(assert) {
    const pan = sinon.spy(offset => this.set('offset', offset));

    this.set('pan', pan);
    this.set('offset', [50, 25]);

    await render(
      hbs`<CanvasPan @offset={{this.offset}} @onPan={{this.pan}} />`
    );

    await triggerKeyEvent(document, 'keydown', SPACEBAR);

    const panContainer = find(PAN_CONTAINER);

    await dragEvent(panContainer, [10, 50]);

    assert.deepNumberEqual(pan.lastCall.args[0], [60, 75]);

    await dragEvent(panContainer, [-10, 10]);

    assert.deepNumberEqual(pan.lastCall.args[0], [50, 85]);
  });
});
