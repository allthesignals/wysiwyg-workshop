import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const ZOOM_IN = '[data-test-zoom-in]';
const ZOOM_OUT = '[data-test-zoom-out]';
const ZOOM_PERCENT = '[data-test-zoom-percent]';

module('Integration | Component | canvas-zoom', function(hooks) {
  setupRenderingTest(hooks);

  test('display percent rounded', async function(assert) {
    this.amount = 0.983644;
    this.action = () => {};

    await render(hbs`
      <CanvasZoom
        @percent={{this.amount}}
        @action={{this.action}}
      />
    `);

    assert.dom(ZOOM_PERCENT).hasText('98%');
  });

  test('can increment percent with button', async function(assert) {
    this.amount = 1;
    this.action = sinon.stub();

    await render(hbs`
      <CanvasZoom
        @percent={{this.amount}}
        @action={{this.action}}
      />
    `);

    await click(ZOOM_IN);

    assert.ok(this.action.calledWith(1.1));
  });

  test('can decrement percent with button', async function(assert) {
    this.amount = 1;
    this.action = sinon.stub();

    await render(hbs`
      <CanvasZoom
        @percent={{this.amount}}
        @action={{this.action}}
      />
    `);

    await click(ZOOM_OUT);

    assert.ok(this.action.calledWith(0.9));
  });

  test('can increment percent with `command+=`', async function(assert) {
    const PLUS = 187;

    this.amount = 1;
    this.action = sinon.stub();

    await render(hbs`
      <CanvasZoom
        @percent={{this.amount}}
        @action={{this.action}}
      />
    `);

    await triggerKeyEvent(document, 'keydown', PLUS, { metaKey: true });

    assert.ok(this.action.calledWith(1.1));
  });

  test('can increment percent with `command+=`', async function(assert) {
    const MINUS = 189;

    this.amount = 1;
    this.action = sinon.stub();

    await render(hbs`
      <CanvasZoom
        @percent={{this.amount}}
        @action={{this.action}}
      />
    `);

    await triggerKeyEvent(document, 'keydown', MINUS, { metaKey: true });

    assert.ok(this.action.calledWith(0.9));
  });

  test('can reset percent with `command+0`', async function(assert) {
    this.amount = 0.5;
    this.action = sinon.stub();

    await render(hbs`
      <CanvasZoom
        @percent={{this.amount}}
        @action={{this.action}}
      />
    `);

    await triggerKeyEvent(document, 'keydown', '0', { metaKey: true });

    assert.ok(this.action.calledWith(1));
  });
});
