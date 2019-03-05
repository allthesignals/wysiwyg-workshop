import Route from '@ember/routing/route';
import { inject as service } from '@ember-decorators/service';

export default class NewCompositionRoute extends Route {
  @service store;

  model() {
    return this.store.createRecord('composition', {
      title: 'New Composition',
      color: 'grey',
      width: 500,
      height: 500
    });
  }
}
