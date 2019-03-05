import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | shortcut', function(hooks) {
  setupRenderingTest(hooks);

  test('basic keydown event works', async function(assert) {
    this.handle = sinon.stub();

    await render(hbs`
      <Shortcut @key="shift+a" @down={{action this.handle}} />
    `);

    await triggerKeyEvent(document, 'keydown', 'A', {
      shiftKey: true
    });

    const [event] = this.handle.getCall(0).args;

    assert.equal(this.handle.callCount, 1);
    assert.equal(event.keyCode, 65);
    assert.equal(event.shiftKey, true);
  });

  test('basic keyup event works', async function(assert) {
    this.handle = sinon.stub();

    await render(hbs`
      <Shortcut @key="shift+a" @up={{action this.handle}} />
    `);

    await triggerKeyEvent(document, 'keydown', 'A', { shiftKey: true });
    await triggerKeyEvent(document, 'keyup', 'A', { shiftKey: true });

    const [event] = this.handle.getCall(0).args;

    assert.equal(this.handle.callCount, 1);
    assert.equal(event.keyCode, 65);
    assert.equal(event.shiftKey, true);
  });

  test('keydown events removed on destroy element', async function(assert) {
    this.handle = sinon.stub();
    this.shouldRender = true;

    await render(hbs`
      {{#if shouldRender}}
        <Shortcut @key="a" @down={{action this.handle}} />
      {{/if}}
    `);

    this.set('shouldRender', false);

    await settled();

    await triggerKeyEvent(document, 'keydown', 'A');

    assert.equal(this.handle.callCount, 0);
  });

  test('keydown event only fires once per same shortcut', async function(assert) {
    this.handle = sinon.stub();

    await render(hbs`
      <Shortcut @key="shift+a" @down={{action this.handle}} />
    `);

    // eslint-disable-next-line
    for (const _ of new Array(5).fill()) {
      await triggerKeyEvent(document, 'keydown', 'A', {
        shiftKey: true
      });
    }

    assert.equal(this.handle.callCount, 1);
  });
});
