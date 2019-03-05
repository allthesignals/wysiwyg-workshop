import Service from '@ember/service';
import { computed } from '@ember-decorators/object';

export default class LayerSelectionService extends Service {
  __selectedSet = new Set();

  @computed('__selectedSet')
  get selectedLayers() {
    const selected = this.__selectedSet;
    return Array.from(selected);
  }

  didUpdate() {
    this.notifyPropertyChange('__selectedSet');
  }

  selectLayers(toSelect, addToSelection = false) {
    const selected = this.__selectedSet;

    if (!addToSelection) {
      selected.clear();
    }

    for (const layer of toSelect) {
      selected.add(layer);
    }

    this.didUpdate();
  }

  selectLayer(layer, addToSelection = false) {
    const selected = this.__selectedSet;
    const alreadySelected = this.isSelected(layer);

    if (alreadySelected && addToSelection) {
      return this.deselectLayer(layer);
    }

    if (alreadySelected) {
      return;
    }

    if (!addToSelection) {
      selected.clear();
    }

    selected.add(layer);
    this.didUpdate();
  }

  clearSelection() {
    this.__selectedSet.clear();
    this.didUpdate();
  }

  deselectLayer(deselectedLayer) {
    const selected = this.__selectedSet;
    selected.delete(deselectedLayer);
    this.didUpdate();
  }

  isSelected(layer) {
    return this.__selectedSet.has(layer);
  }
}
