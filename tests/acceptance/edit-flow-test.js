import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import dragEvent from 'ember-wysiwyg/tests/helpers/drag-event';
import a11yAudit from 'ember-a11y-testing/test-support/audit';

const axeOptions = {
  rules: {
    'color-contrast': {
      enabled: false
    }
  }
};

module('Acceptance | edit flow', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('editing a composition', async function(assert) {
    this.server.timing = 0;
    this.server.logging = true;

    const [comp] = this.server.createList('composition', 3, 'grid');
    const { id } = comp;

    const [firstLayer] = comp.layers.models;

    assert.equal(firstLayer.left, 0, 'initial left is 0');
    assert.equal(firstLayer.top, 0, 'initial top is 0');

    await visit('/');

    assert.equal(currentURL(), '/compositions');

    await a11yAudit(axeOptions);

    await click(`[data-test-composition-item="${id}"] [data-test-edit-link]`);

    assert.equal(currentURL(), `/composition/${id}`);

    await dragEvent('[data-test-interactive-layer]', [25, 25]);

    await a11yAudit(axeOptions);

    await click('[data-test-composition] [data-test-save]');

    assert.equal(currentURL(), '/compositions');

    const updatedComp = this.server.schema.compositions.find(id);
    const [updatedLayer] = updatedComp.layers.models;

    assert.equal(updatedLayer.left, 25, 'updated left is 25');
    assert.equal(updatedLayer.top, 25, 'updated top is 25');
  });

  test('editing and canceling a composition', async function(assert) {
    this.server.timing = 0;
    this.server.logging = true;

    const [comp] = this.server.createList('composition', 3, 'grid');
    const { id } = comp;

    await visit('/');

    assert.equal(currentURL(), '/compositions');

    await click(`[data-test-composition-item="${id}"] [data-test-edit-link]`);

    assert.equal(currentURL(), `/composition/${id}`);

    await click('[data-test-composition] [data-test-cancel]');

    assert.equal(currentURL(), '/compositions');
  });

  test('creating and saving a composition', async function(assert) {
    await visit('/');
    await click('[data-test-new-composition]');

    assert.equal(currentURL(), `/composition/new`);

    await click('[data-test-tool=new-layer]');
    await dragEvent('[data-test-background-canvas]', [150, 150]);
    await click('[data-test-composition] [data-test-save]');

    assert.equal(currentURL(), '/compositions');
    assert.dom('[data-test-composition-item]').exists({ count: 1 });
  });
});
