import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { set } from '@ember/object';
import { computed, action } from '@ember-decorators/object';

@tagName('')
export default class BackgroundCanvasComponent extends Component {
  isDrawingBox = false;
  startPosition = [0, 0];
  currentOffset = [0, 0];

  height;
  width;

  @action
  backgroundDrag({ event, offset }) {
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
  }

  @computed('{startPosition,currentOffset}')
  get boxStyles() {
    const [x, y] = this.startPosition;
    const [width, height] = this.currentOffset;

    return {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`
    };
  }
}
