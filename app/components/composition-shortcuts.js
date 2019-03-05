import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import { Vector } from '../utils/sprites';

@tagName('')
export default class CompositionShortcutsComponent extends Component {
  @service layerState;
  @service layerSelection;

  @action
  selectAllTags() {
    const layers = this.layerState.layers;
    this.layerSelection.selectLayers(layers);
  }

  @action
  deselectAllTags() {
    this.layerSelection.clearSelection();
  }

  @action
  nudge(dx, dy, event) {
    let delta = new Vector([dx, dy]);

    if (event.shiftKey) {
      delta = delta.scale(5);
    }

    if (event.metaKey) {
      delta = delta.scale(5);
    }

    for (const layer of this.layerSelection.selectedLayers) {
      const sprite = layer.sprite.translate(delta);
      this.layerState.updateLayer(layer, { sprite });
    }
  }

  @action
  deleteSelected() {
    const { layerSelection, layerState } = this;
    const toDelete = layerSelection.selectedLayers;

    layerState.deleteLayers(toDelete);
    layerSelection.clearSelection();
  }
}
