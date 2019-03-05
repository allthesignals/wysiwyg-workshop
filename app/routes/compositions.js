import Route from '@ember/routing/route';
import { inject as service } from '@ember-decorators/service';

export default class Compositions extends Route {
  @service store;

  model() {
    return this.store.findAll('composition');
  }
}
