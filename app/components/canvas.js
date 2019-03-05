import Component from '@ember/component';
import { set } from '@ember/object';
import { inject as service } from '@ember-decorators/service';
import { reads } from '@ember-decorators/object/computed';
import { computed, action } from '@ember-decorators/object';
import { Sprite } from '../utils/sprites';
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
  updateZoom(amount) {
    const zoom = this.workspaceZoom;
    set(this, 'workspaceZoom', zoom + amount);
  }

  @reads('layerState.layers') layers;

  @computed(
    '{workspaceTranslation,workspaceZoom,workspaceRotation}',
    '{width,height}'
  )
  get workspaceSprite() {
    const { width: w, height: h } = this;
    const {
      workspaceTranslation: [offsetX, offsetY],
      workspaceZoom: s,
      workspaceRotation: r
    } = this;

    const x = offsetX - w / 2;
    const y = offsetY - h / 2;

    return Sprite.fromDimensions({ x, y, h, w, s, r });
  }
}
