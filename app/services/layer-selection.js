import Service from '@ember/service';
import { computed } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';

export default class LayerSelectionService extends Service {
  @service ariaAnnouncer;

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

    const count = toSelect.length;
    this.ariaAnnouncer.announce('selected_layers', { count });

    if (selected.size > 0) {
      this.ariaAnnouncer.announce('post_selection', { count: selected.size });
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

    const { label } = layer;
    this.ariaAnnouncer.announce('selected_layer', { label });
    this.ariaAnnouncer.announce('post_selection', { count: selected.size });
  }

  clearSelection() {
    const count = this.__selectedSet.size;
    this.__selectedSet.clear();
    this.didUpdate();

    this.ariaAnnouncer.announce('deselected_layers', { count });
  }

  deselectLayer(deselectedLayer) {
    const selected = this.__selectedSet;
    selected.delete(deselectedLayer);
    this.didUpdate();

    const { label } = deselectedLayer;
    this.ariaAnnouncer.announce('deselected_layer', { label });

    if (selected.size > 0) {
      this.ariaAnnouncer.announce('post_selection', { count: selected.size });
    }
  }

  isSelected(layer) {
    return this.__selectedSet.has(layer);
  }
}
