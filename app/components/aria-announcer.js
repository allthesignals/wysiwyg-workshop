import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember-decorators/service';

const ENABLE_DEBUG_MODE = false;

@tagName('')
export default class AriaAnnouncer extends Component {
  @service ariaAnnouncer;
  debug = ENABLE_DEBUG_MODE;
}
