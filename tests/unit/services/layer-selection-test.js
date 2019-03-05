import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | layer-selection', function(hooks) {
  setupTest(hooks);

  let selection;

  hooks.beforeEach(function() {
    selection = this.owner.lookup('service:layer-selection');
  });

  module('`selectLayer` & `deselectLayer`', () => {
    test('select layer', function(assert) {
      const layer = {};

      selection.selectLayer(layer);

      assert.equal(selection.selectedLayers.length, 1);
      assert.ok(selection.selectedLayers.includes(layer));
    });

    test('select layer multiple times', function(assert) {
      const layer = {};

      selection.selectLayer(layer);
      selection.selectLayer(layer);

      assert.equal(selection.selectedLayers.length, 1);
      assert.ok(selection.selectedLayers.includes(layer));
    });

    test('select layer multiple times with addToSelection deselects', function(assert) {
      const layer = {};

      selection.selectLayer(layer, true);
      selection.selectLayer(layer, true);

      assert.equal(selection.selectedLayers.length, 0);
    });

    test('select different layers', function(assert) {
      const layer1 = {};
      const layer2 = {};

      selection.selectLayer(layer1);
      selection.selectLayer(layer2);

      assert.equal(selection.selectedLayers.length, 1);
      assert.ok(selection.selectedLayers.includes(layer2));
    });

    test('clear selection', function(assert) {
      const layer1 = {};
      const layer2 = {};

      selection.selectLayers([layer1, layer2]);
      selection.clearSelection();

      assert.equal(selection.selectedLayers.length, 0);
    });

    test('select different layers, with addToSelection', function(assert) {
      const layer1 = {};
      const layer2 = {};

      selection.selectLayer(layer1);
      selection.selectLayer(layer2, true);

      assert.equal(selection.selectedLayers.length, 2);
    });

    test('deselect unselected layer is no op', function(assert) {
      const layer = {};

      assert.equal(selection.selectedLayers.length, 0);
      selection.deselectLayer(layer);
      assert.equal(selection.selectedLayers.length, 0);
    });

    test('deselect layer', function(assert) {
      const layer = {};

      selection.selectLayer(layer);
      selection.deselectLayer(layer);

      assert.equal(selection.selectedLayers.length, 0);
    });

    test('deselect layer preserves other selection', function(assert) {
      const layer1 = {};
      const layer2 = {};

      selection.selectLayer(layer1);
      selection.selectLayer(layer2, true);
      selection.deselectLayer(layer1);

      assert.equal(selection.selectedLayers.length, 1);
      assert.ok(selection.selectedLayers.includes(layer2));
    });
  });

  module('`selectLayers`', () => {
    test('can select multiple layers', function(assert) {
      const layer1 = {};
      const layer2 = {};

      selection.selectLayers([layer1, layer2]);

      assert.equal(selection.selectedLayers.length, 2);
    });

    test('select multiple replaces other selection', function(assert) {
      const layer1 = {};
      const layer2 = {};
      const layer3 = {};

      selection.selectLayer(layer1);
      selection.selectLayers([layer2, layer3]);

      assert.equal(selection.selectedLayers.length, 2);
      assert.ok(selection.selectedLayers.includes(layer2));
      assert.ok(selection.selectedLayers.includes(layer3));
    });

    test('select multiple adds to selection when addToSelection', function(assert) {
      const layer1 = {};
      const layer2 = {};
      const layer3 = {};

      selection.selectLayer(layer1);
      selection.selectLayers([layer2, layer3], true);

      assert.equal(selection.selectedLayers.length, 3);
    });

    test('selectLayers handles duplicates in selection', function(assert) {
      const layer1 = {};
      const layer2 = {};

      selection.selectLayers([layer1, layer2]);
      selection.selectLayers([layer1, layer2], true);

      assert.equal(selection.selectedLayers.length, 2);
    });
  });

  module('`isSelected`', () => {
    test('returns false when not selected', function(assert) {
      const layer = {};

      assert.notOk(selection.isSelected(layer));
    });

    test('returns true when selected', function(assert) {
      const layer = {};

      selection.selectLayer(layer);

      assert.ok(selection.isSelected(layer));
    });
  });
});
