import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';

@tagName('')
export default class CompositionShortcutsComponent extends Component {
  @service layerState;
  @service layerSelection;

  @action
  deleteSelected() {
    const { layerSelection, layerState } = this;
    const toDelete = layerSelection.selectedLayers;

    layerState.deleteLayers(toDelete);
    layerSelection.clearSelection();
  }
}
