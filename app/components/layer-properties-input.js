import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { tagName } from '@ember-decorators/component';

let UUID = 0;

@tagName('')
export default class LayerPropertiesInputComponent extends Component {
  @computed('label')
  get inputId() {
    const { label } = this;
    return `${label}-${++UUID}`;
  }
}
