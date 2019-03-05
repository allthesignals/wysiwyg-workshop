import Component from '@ember/component';
import { set } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { computed, action } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';

const SPACEBAR = 32;

@tagName('')
export default class InteractiveLayerComponent extends Component {
  @service layerSelection;
  @service layerState;

  @action
  handleKeyDown(e) {
    if (e.keyCode !== SPACEBAR) {
      return;
    }

    const { layerSelection, layer } = this;
    layerSelection.selectLayer(layer);
  }

  @action
  translate({ event, offset }) {
    if (!this.isSelected) {
      return;
    }

    const { layer } = this;
    const sprite = layer.sprite.translate(offset);

    set(this, 'offsetSprite', sprite);

    if (event.type === 'mouseup') {
      this.layerState.updateLayer(layer, { sprite });
      set(this, 'offsetSprite', null);
    }
  }

  @action
  selectLayer(e) {
    this.layerSelection.selectLayer(this.layer, e.metaKey || e.shiftKey);
  }

  @computed('layerSelection.selectedLayers', 'layer')
  get isSelected() {
    return this.layerSelection.selectedLayers.includes(this.layer);
  }

  @computed('{offsetSprite,layer.sprite}')
  get currentSprite() {
    const { layer, offsetSprite } = this;
    return offsetSprite ? offsetSprite : layer.sprite;
  }
}
