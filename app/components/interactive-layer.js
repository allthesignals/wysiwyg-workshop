import Component from '@ember/component';
import { set } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { computed, action } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';
import { Sprite, TOP, BOTTOM, RIGHT, LEFT } from '../utils/sprites';

const SPACEBAR = 32;

@tagName('')
export default class InteractiveLayerComponent extends Component {
  @service layerSelection;
  @service layerState;

  parentSprite = Sprite.fromDimensions({ w: 100, h: 100 });

  directions = [
    { name: 'top', handles: [TOP] },
    { name: 'top-right', handles: [TOP, RIGHT] },
    { name: 'right', handles: [RIGHT] },
    { name: 'bottom-right', handles: [BOTTOM, RIGHT] },
    { name: 'bottom', handles: [BOTTOM] },
    { name: 'bottom-left', handles: [BOTTOM, LEFT] },
    { name: 'left', handles: [LEFT] },
    { name: 'top-left', handles: [TOP, LEFT] }
  ];

  @action
  handleKeyDown(e) {
    if (e.keyCode !== SPACEBAR) {
      return;
    }

    const { layerSelection, layer } = this;
    layerSelection.selectLayer(layer);
  }

  @action
  rotate({ event, offset }) {
    const parent = this.parentAdjustedSprite;
    const { type, shiftKey, metaKey } = event;

    const sprite = parent.transformRotation(offset, [TOP, LEFT], {
      clampPercent: shiftKey || metaKey
    });

    set(this, 'offsetSprite', sprite);

    if (type === 'mouseup') {
      this.finalizeLayerUpdate(sprite);
    }
  }

  @action
  translate({ event, offset }) {
    if (!this.isSelected) {
      return;
    }

    const sprite = this.parentAdjustedSprite.translate(offset);

    set(this, 'offsetSprite', sprite);

    if (event.type === 'mouseup') {
      this.finalizeLayerUpdate(sprite);
    }
  }

  @action
  resize(handles, { event, offset }) {
    const parent = this.parentAdjustedSprite;
    const { type, shiftKey, metaKey } = event;

    const sprite = parent.transformSize(offset, handles, {
      applyOpposite: !!metaKey,
      keepRatio: !!shiftKey
    });

    set(this, 'offsetSprite', sprite);

    if (type === 'mouseup') {
      this.finalizeLayerUpdate(sprite);
    }
  }

  finalizeLayerUpdate(offsetSprite) {
    const { layer, parentSprite } = this;
    const sprite = offsetSprite.subtract(parentSprite);

    this.layerState.updateLayer(layer, { sprite });
    set(this, 'offsetSprite', null);
  }

  @computed('layer.sprite', 'parentSprite')
  get parentAdjustedSprite() {
    const { parentSprite, layer } = this;
    return layer.sprite.add(parentSprite);
  }

  @action
  selectLayer(e) {
    this.layerSelection.selectLayer(this.layer, e.metaKey || e.shiftKey);
  }

  @computed('layerSelection.selectedLayers', 'layer')
  get isSelected() {
    return this.layerSelection.selectedLayers.includes(this.layer);
  }

  @computed('{isSelected,offsetSprite,parentAdjustedSprite}')
  get currentSprite() {
    const { parentAdjustedSprite, isSelected, offsetSprite } = this;
    return isSelected && offsetSprite ? offsetSprite : parentAdjustedSprite;
  }
}
