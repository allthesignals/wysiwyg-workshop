import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class LayerListComponent extends Component {
  @service layerState;
  @service layerSelection;

  @reads('layerState.layers') layers;
  @reads('layerSelection.selectedLayers') selected;

  @action
  selectLayer(layer, { metaKey }) {
    this.layerSelection.selectLayer(layer, metaKey);
  }
}
