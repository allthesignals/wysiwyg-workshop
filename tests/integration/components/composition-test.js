import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { render, triggerKeyEvent, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const LIST_LAYER = '[data-test-layer]';
const RENDERED_LAYER = '[data-test-rendered-layer]';
const SAVE = '[data-test-save]';
const CANCEL = '[data-test-cancel]';
const RIGHT = 39;

const selectAll = () =>
  triggerKeyEvent(document, 'keydown', 'A', {
    metaKey: true
  });

const nudge = () =>
  triggerKeyEvent(document, 'keydown', RIGHT, {
    metaKey: true
  });

module('Integration | Component | composition', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    const store = this.owner.lookup('service:store');
    const layers = this.server.createList('layer', 3);
    const { id } = this.server.create('composition', { layers });

    this.composition = await store.find('composition', id);
  });

  test('it renders a composition with all of its layers', async function(assert) {
    await render(hbs`<Composition @composition={{this.composition}} />`);

    assert.dom(LIST_LAYER).exists({ count: 3 });
    assert.dom(RENDERED_LAYER).exists({ count: 3 });
  });

  test('can perform select all shorcut', async function(assert) {
    const selection = this.owner.lookup('service:layer-selection');

    await render(hbs`<Composition @composition={{this.composition}} />`);

    assert.equal(selection.selectedLayers.length, 0);

    await selectAll();

    assert.equal(selection.selectedLayers.length, 3);
  });

  test('it can save changes to a composition', async function(assert) {
    this.onFinish = sinon.stub();

    await render(hbs`
      <Composition
        @composition={{this.composition}}
        @onFinish={{action this.onFinish}}
      />
    `);

    const initialX = this.composition.layers.firstObject.sprite.dimensions.x;

    await selectAll();
    await nudge();
    await click(SAVE);

    const updatedX = this.composition.layers.firstObject.sprite.dimensions.x;
    assert.equal(updatedX, initialX + 5);
    assert.equal(this.onFinish.callCount, 1, 'onFinish called');
  });

  test('it can cancel changes to a composition', async function(assert) {
    this.onFinish = sinon.stub();

    await render(hbs`
      <Composition
        @composition={{this.composition}}
        @onFinish={{action this.onFinish}}
      />
    `);

    const initialX = this.composition.layers.firstObject.sprite.dimensions.x;

    await selectAll();
    await nudge();
    await click(CANCEL);

    const updatedX = this.composition.layers.firstObject.sprite.dimensions.x;
    assert.equal(updatedX, initialX);
    assert.equal(this.onFinish.callCount, 1, 'onFinish called');
  });
});
