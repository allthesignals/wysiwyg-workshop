import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { readOnly } from '@ember-decorators/object/computed';

@tagName('')
export default class CanvasPan extends Component {
  @service canvasTools;

  @readOnly('canvasTools.isHandTool') isPanning;

  offset = [0, 0];
  currentOffset = [0, 0];
  onPan = () => {};

  @action
  startPanning() {
    this.canvasTools.chooseHandTool();
  }

  @action
  stopPanning() {
    this.canvasTools.clearTool();
  }

  @action
  pan({ event, offset }) {
    if (event.type === 'mousedown') {
      this.startOffset = this.offset;
    }

    const [startX, startY] = this.startOffset;
    const [dx, dy] = offset;

    const nextDelta = [startX + dx, startY + dy];

    this.onPan(nextDelta);
  }
}
