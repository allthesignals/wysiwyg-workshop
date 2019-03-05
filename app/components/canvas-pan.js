import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class CanvasPan extends Component {
  @service canvasTools;

  offset = [0, 0];
  onPan = () => {};
}
