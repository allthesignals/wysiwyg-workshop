import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';

@tagName('')
export default class BackgroundCanvasComponent extends Component {
  isDrawingBox = true;
  startPosition = [100, 100];
  currentOffset = [200, 200];

  height;
  width;

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
