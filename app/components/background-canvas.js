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
  parentSprite = Sprite.fromDimensions({ h: 10, w: 10 });
  startPosition = [0, 0];
  currentOffset = [0, 0];

  height;
  width;

  @service canvasTools;
  @service layerSelection;
  @service layerState;

  generateSelectionSprite(offsetParent, dimensions) {
    const { parentSprite, startPosition } = this;
    const parentBox = offsetParent.getBoundingClientRect();
    const [startX, startY] = startPosition;
    const [w, h] = dimensions;
    const x = startX - parentBox.width / 2;
    const y = startY - parentBox.height / 2;

    return Sprite.fromDimensions({ x, y, w, h }).subtract(parentSprite);
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
    this.handleDrawnSprite(drawnSprite);
  }

  handleDrawnSprite(sprite) {
    if (this.canvasTools.isSelectTool) {
      const intersectingLayers = this.layerState.filterBySprite(sprite);
      this.layerSelection.selectLayers(intersectingLayers);
    } else {
      const text = 'New Text Layer';
      const label = 'New Layer';
      const layer = this.layerState.newLayer({ sprite, text, label });

      this.canvasTools.chooseSelectTool();
      this.layerSelection.selectLayer(layer);
    }
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
