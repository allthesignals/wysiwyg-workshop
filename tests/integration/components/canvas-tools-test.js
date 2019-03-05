import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const TOOL = '[data-test-tool]';
const SELECTED_TOOL = '[data-test-tool-selected]';
const TOOL_NAME = name => `[data-test-tool=${name}]`;

module('Integration | Component | canvas-tools', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders the defaults', async function(assert) {
    await render(hbs`<CanvasTools />`);

    assert.dom(TOOL).exists({ count: 3 });
    assert.dom(SELECTED_TOOL).exists({ count: 1 });
    assert.dom(TOOL_NAME('select') + SELECTED_TOOL).exists();
  });

  test('clicking a tool changes to that tool', async function(assert) {
    await render(hbs`<CanvasTools />`);
    await click(TOOL_NAME('hand'));
    assert.dom(TOOL_NAME('hand') + SELECTED_TOOL).exists();
  });
});
