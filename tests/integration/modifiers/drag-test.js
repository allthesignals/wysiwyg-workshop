import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Modifier | drag', function(hooks) {
  setupRenderingTest(hooks);

  test('standard drag event coordinates', async function(assert) {
    this.set('moveAction', sinon.stub());

    await render(hbs`
      <div id="thing" {{drag this.moveAction "layer-move"}}></div>
    `);

    await triggerEvent('#thing', 'mousedown', {
      clientX: 100,
      clientY: 200
    });

    {
      const { offset, event } = this.moveAction.lastCall.lastArg;
      assert.deepEqual(offset, [0, 0]);
      assert.equal(event.type, 'mousedown');
    }

    await triggerEvent('#thing', 'mousemove', {
      clientX: 150,
      clientY: 100
    });

    {
      const { offset, event } = this.moveAction.lastCall.lastArg;
      assert.deepEqual(offset, [50, -100]);
      assert.equal(event.type, 'mousemove');
    }

    await triggerEvent('#thing', 'mouseup', {
      clientX: 200,
      clientY: 0
    });

    {
      const { offset, event } = this.moveAction.lastCall.lastArg;
      assert.deepEqual(offset, [100, -200]);
      assert.equal(event.type, 'mouseup');
    }
  });

  test('multiple elements are dispatched same scope', async function(assert) {
    this.set('moveAction1', sinon.stub());
    this.set('moveAction2', sinon.stub());
    this.set('notMoveAction', sinon.stub());

    await render(hbs`
      <div id="thing1" {{drag this.moveAction1 "layer-move"}}></div>
      <div id="thing2" {{drag this.moveAction2 "layer-move"}}></div>
      <div id="thing2" {{drag this.notMoveAction "not-layer-move"}}></div>
    `);

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mousemove');
    await triggerEvent('#thing1', 'mousemove');
    await triggerEvent('#thing1', 'mouseup');

    assert.equal(this.moveAction1.callCount, 4);
    assert.equal(this.moveAction2.callCount, 4);
    assert.equal(this.notMoveAction.callCount, 0);
  });

  test('no scope provided is unique by default', async function(assert) {
    this.set('action1', sinon.stub());
    this.set('action2', sinon.stub());
    this.set('visible', true);

    await render(hbs`
      <div id="thing1" {{drag this.action1}}></div>
      <div id="thing2" {{drag this.action2}}></div>
    `);

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mouseup');

    assert.equal(this.action1.callCount, 2);
    assert.equal(this.action2.callCount, 0);

    await triggerEvent('#thing2', 'mousedown');
    await triggerEvent('#thing2', 'mouseup');

    assert.equal(this.action1.callCount, 2);
    assert.equal(this.action2.callCount, 2);
  });

  test('multiple events stop listening after mouse up', async function(assert) {
    this.set('moveAction', sinon.stub());

    await render(hbs`
      <div id="thing1" {{drag this.moveAction "layer-move"}}></div>
    `);

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mouseup');

    await triggerEvent('#thing1', 'mousemove');
    await triggerEvent('#thing1', 'mousemove');

    assert.equal(this.moveAction.callCount, 2);
  });

  test('drag events can happen repeatedly', async function(assert) {
    this.set('moveAction', sinon.stub());

    await render(hbs`
      <div id="thing1" {{drag this.moveAction "layer-move"}}></div>
    `);

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mouseup');

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mouseup');

    assert.equal(this.moveAction.callCount, 4);
  });

  test('removing an element will stop subscription', async function(assert) {
    this.set('action1', sinon.stub());
    this.set('action2', sinon.stub());
    this.set('visible', true);

    await render(hbs`
      <div id="thing1" {{drag this.action1 "layer-move"}}></div>

      {{#if visible}}
        <div id="thing2" {{drag this.action2 "layer-move"}}></div>
      {{/if}}
    `);

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mouseup');

    assert.equal(this.action2.callCount, 2);

    this.set('visible', false);

    await settled();

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mouseup');

    assert.equal(this.action2.callCount, 2);
  });

  test('changing actions works correctly', async function(assert) {
    this.set('action1', sinon.stub());
    this.set('action2', sinon.stub());
    this.set('useFirst', true);

    await render(hbs`
      <div
        id="thing1"
        {{drag (if useFirst this.action1 this.action2) "layer-move"}}
      ></div>
    `);

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mouseup');

    assert.equal(this.action1.callCount, 2);
    assert.equal(this.action2.callCount, 0);

    this.set('useFirst', false);

    await settled();

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mouseup');

    assert.equal(this.action1.callCount, 2);
    assert.equal(this.action2.callCount, 2);
  });

  test('changing actions from null action works', async function(assert) {
    this.set('action1', null);
    this.set('action2', sinon.stub());
    this.set('useFirst', true);

    await render(hbs`
      <div
        id="thing1"
        {{drag (if useFirst this.action1 this.action2) "layer-move"}}
      ></div>
    `);

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mouseup');

    assert.equal(this.action2.callCount, 0);

    this.set('useFirst', false);

    await settled();

    await triggerEvent('#thing1', 'mousedown');
    await triggerEvent('#thing1', 'mouseup');

    assert.equal(this.action2.callCount, 2);
  });
});
