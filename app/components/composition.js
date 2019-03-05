import Component from '@ember/component';
import { set } from '@ember/object';
import { inject as service } from '@ember-decorators/service';
import { computed, action } from '@ember-decorators/object';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class CompositionComponent extends Component {
  @service layerState;
  @service layerSelection;

  @computed('layerSelection.selectedLayers')
  get singlySelectedLayer() {
    const layers = this.layerSelection.selectedLayers;
    return layers.length === 1 && layers[0];
  }

  didReceiveAttrs() {
    const { layers } = this.composition;
    this.layerState.initializeLayers(layers);
  }

  @action
  handleCancel() {
    // Rollback changes.
    const { composition } = this;

    composition.rollbackAttributes();
    composition.layers.forEach(layer => layer.rollbackAttributes());

    this.onFinish();
  }

  @action
  async handleSave() {
    const { composition } = this;
    const { layers } = this.layerState;

    // Clear any layers from the composition.
    // Destroy any records that are no longer in the layer state.
    set(composition, 'layers', layers);

    await composition.save();

    this.onFinish();
  }
}
