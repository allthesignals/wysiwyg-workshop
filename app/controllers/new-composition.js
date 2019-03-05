import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';

export default class Composition extends Controller {
  @action
  finishEditing() {
    this.transitionToRoute('compositions');
  }
}
