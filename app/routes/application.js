import Route from '@ember/routing/route';
import { inject as service } from '@ember-decorators/service';

export default class ApplicationRoute extends Route {
  @service intl;

  beforeModel() {
    return this.intl.setLocale('en-us');
  }
}
