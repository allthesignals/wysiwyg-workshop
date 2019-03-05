import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

const INPUT_CONTAINER = '[data-test-layer-properties-input]';
const LABEL = `${INPUT_CONTAINER} label`;
const INPUT = `${INPUT_CONTAINER} input`;

module('Integration | Component | layer-properties-input', function(hooks) {
  setupRenderingTest(hooks);

  test('renders the label', async function(assert) {
    this.set('update', () => {});

    await render(hbs`
      <LayerPropertiesInput
        @label="Howdy"
        @update={{action this.update}}
      />
    `);

    assert.dom(LABEL).hasText('Howdy');
  });

  test('sets the value by default', async function(assert) {
    this.set('update', () => {});

    await render(hbs`
      <LayerPropertiesInput
        @value="Howdy"
        @update={{action this.update}}
      />
    `);

    assert.dom(INPUT).hasValue('Howdy');
  });

  test('automatic ID association between label/input', async function(assert) {
    this.set('update', () => {});

    await render(hbs`<LayerPropertiesInput @update={{action this.update}} />`);

    const id = find(INPUT).getAttribute('id');

    assert.ok(id, 'id is meaningful');
    assert.dom(LABEL).hasAttribute('for', id);
  });

  test('calls update with updated value', async function(assert) {
    this.set('update', sinon.stub());

    await render(hbs`<LayerPropertiesInput @update={{action this.update}} />`);

    await fillIn(INPUT, 'Let it go!');

    const [value] = this.update.lastCall.args;

    assert.equal(value, 'Let it go!');
  });
});
