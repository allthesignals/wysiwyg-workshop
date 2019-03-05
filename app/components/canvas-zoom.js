import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';

@tagName('')
export default class CanvasZoom extends Component {
  action;
  percent;
}
