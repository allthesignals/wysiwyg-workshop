import Service from '@ember/service';
import { inject as service } from '@ember-decorators/service';
import { set } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class AriaAnnouncer extends Service {
  @service intl;

  liveText = '';
  messageBuffer = [];

  flushMessageBuffer() {
    const text = this.messageBuffer.join(' ');
    set(this, 'liveText', text);
    this.messageBuffer = [];
  }

  announce(message, context = {}) {
    const translated = this.intl.t(message, context);
    this.messageBuffer.push(translated);
    scheduleOnce('afterRender', this, 'flushMessageBuffer');
  }
}
