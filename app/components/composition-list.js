import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { htmlSafe } from '@ember/string';

@tagName('')
export default class CompositionList extends Component {
  compositionColor(color) {
    return htmlSafe(`background: ${color};`);
  }
}
