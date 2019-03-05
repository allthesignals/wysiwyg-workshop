import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class LayerPropertiesComponent extends Component {
  @service layerState;

  @computed('layer.sprite')
  get dimensions() {
    return this.layer.sprite.dimensions;
  }

  @action
  updateSprite(key, value) {
    const { layer } = this;
    const number = Number(value);

    if (!isNaN(number)) {
      const sprite = layer.sprite.updateDimensions({ [key]: number });
      this.layerState.updateLayer(layer, { sprite });
    }
  }
}
