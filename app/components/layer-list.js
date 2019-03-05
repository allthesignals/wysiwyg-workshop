import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { tagName } from '@ember-decorators/component';

const { max, min } = Math;

@tagName('')
export default class LayerListComponent extends Component {
  @service layerState;
  @service layerSelection;

  prevLayerSelected = null;

  @reads('layerState.layers') layers;
  @reads('layerSelection.selectedLayers') selected;

  @action
  selectLayer(layer, { metaKey, shiftKey }) {
    const prevLayer = this.prevLayerSelected;

    if (shiftKey && prevLayer) {
      const { layers } = this;
      const prevIndex = layers.indexOf(prevLayer);
      const curIndex = layers.indexOf(layer);
      const startIndex = min(prevIndex, curIndex);
      const endIndex = max(prevIndex, curIndex);

      const layersToSelect = layers.slice(startIndex, endIndex + 1);

      this.layerSelection.selectLayers(layersToSelect, true);
    } else {
      this.layerSelection.selectLayer(layer, metaKey);
    }

    this.prevLayerSelected = layer;
  }
}
