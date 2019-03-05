import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { set } from '@ember/object';
import { inject as service } from '@ember-decorators/service';
import { computed, action } from '@ember-decorators/object';
import { Sprite } from '../utils/sprites';

const { abs } = Math;

@tagName('')
export default class BackgroundCanvasComponent extends Component {
  isDrawingBox = false;
  startPosition = [0, 0];
  currentOffset = [0, 0];

  height;
  width;

  @service layerSelection;
  @service layerState;

  generateSelectionSprite(offsetParent, dimensions) {
    const parentBox = offsetParent.getBoundingClientRect();
    const [startX, startY] = this.startPosition;
    const [w, h] = dimensions;
    const x = startX - parentBox.width / 2 + this.width / 2;
    const y = startY - parentBox.height / 2 + this.height / 2;

    return Sprite.fromDimensions({ x, y, w, h });
  }

  @action
  backgroundDrag({ event, offset, element }) {
    const { type } = event;

    if (type === 'mousedown') {
      const { offsetX, offsetY } = event;
      set(this, 'isDrawingBox', true);
      set(this, 'currentOffset', [0, 0]);
      set(this, 'startPosition', [offsetX, offsetY]);
      return;
    }

    if (type === 'mousemove') {
      set(this, 'currentOffset', offset);
      return;
    }

    set(this, 'isDrawingBox', false);

    const drawnSprite = this.generateSelectionSprite(element, offset);
    const intersectingLayers = this.layerState.filterBySprite(drawnSprite);
    this.layerSelection.selectLayers(intersectingLayers);
  }

  @computed('{startPosition,currentOffset}')
  get boxStyles() {
    const [startX, startY] = this.startPosition;
    const [offsetX, offsetY] = this.currentOffset;

    const width = abs(offsetX);
    const height = abs(offsetY);

    const x = offsetX > 0 ? startX : startX + offsetX;
    const y = offsetY > 0 ? startY : startY + offsetY;

    return {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`
    };
  }
}
