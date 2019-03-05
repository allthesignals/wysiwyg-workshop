import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const ANNOUNCER = '[data-test-aria-announcer]';

module('Integration | Component | aria-announcer', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.announcer = this.owner.lookup('service:aria-announcer');
  });

  test('i t has the correct aria attributes', async function(assert) {
    await render(hbs`<AriaAnnouncer />`);
    assert.dom(ANNOUNCER).hasAttribute('aria-live', 'assertive');
  });

  test('it renders last announcement', async function(assert) {
    await render(hbs`<AriaAnnouncer />`);

    this.announcer.announce('layer_created');

    await settled();

    assert.dom(ANNOUNCER).hasText('A new layer was created.');
  });
});
