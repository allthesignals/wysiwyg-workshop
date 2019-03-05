import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';

const { round } = Math;

@tagName('')
export default class CanvasZoom extends Component {
  action;

  @computed('percent')
  get formattedPercent() {
    return `${round(this.percent * 100)}%`;
  }

  @action
  increment(amount) {
    const { percent } = this;
    this.action(percent + amount);
  }
}
