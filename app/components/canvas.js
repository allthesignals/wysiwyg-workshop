import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { reads } from '@ember-decorators/object/computed';
import { computed, action } from '@ember-decorators/object';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class CanvasComponent extends Component {
  @service layerState;
  @service layerSelection;

  workspaceTranslation = [0, 0];
  workspaceRotation = 0;
  workspaceZoom = 1;

  @action
  updateTranslation(/* offset */) {
    // TODO: Handle translation
  }

  @action
  updateZoom(/* amount */) {
    // TODO: Handle Zoom.
  }

  @reads('layerState.layers') layers;

  @computed('{width,height}')
  get backgroundStyles() {
    return {
      width: `${this.width}px`,
      height: `${this.height}px`
    };
  }
}
