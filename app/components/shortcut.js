import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import hotkeys from 'hotkeys-js';

@tagName('')
export default class ShortcutComponent extends Component {
  lastShortcut = null;
  preventDefault = true;
  down = () => {};
  up = () => {};

  isSameShortcut() {
    const { lastShortcut } = this;
    return lastShortcut && lastShortcut.includes(this.key);
  }

  @action
  handleKeydown(e, handler) {
    if (this.isSameShortcut()) {
      return;
    }

    if (this.preventDefault) {
      e.preventDefault();
    }

    this.down(e);
    this.lastShortcut = handler.shortcut;
  }

  @action
  handleKeyUp(e) {
    if (this.isSameShortcut()) {
      this.up(e);
      this.lastShortcut = null;
    }
  }

  didInsertElement() {
    hotkeys(this.key, this.handleKeydown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  willDestroyElement() {
    hotkeys.unbind(this.key);
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}
