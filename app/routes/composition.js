import Route from '@ember/routing/route';
import { inject as service } from '@ember-decorators/service';

export default class CompositionRoute extends Route {
  @service store;

  model({ id }) {
    return this.store.find('composition', id);
  }
}
