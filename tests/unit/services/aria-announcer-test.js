import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';

module('Unit | Service | aria-announcer', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.announcer = this.owner.lookup('service:aria-announcer');
  });

  // Replace this with your real tests.
  test('it translates messages', async function(assert) {
    this.announcer.announce('layer_created');

    await settled();

    assert.equal(this.announcer.liveText, 'A new layer was created.');
  });

  test('multiple messages in the same render loop are coalesced', async function(assert) {
    this.announcer.announce('layer_created');
    this.announcer.announce('deleted_layer', { label: 'Foo' });

    await settled();

    assert.equal(
      this.announcer.liveText,
      'A new layer was created. Foo was deleted.'
    );
  });
});
