import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { reads } from '@ember-decorators/object/computed';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class LayerListComponent extends Component {
  @service layerState;
  @service layerSelection;

  @reads('layerState.layers') layers;
  @reads('layerSelection.selectedLayers') selected;
}
