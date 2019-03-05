import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('new-composition', { path: 'composition/new' });
  this.route('composition', { path: 'composition/:id' });
  this.route('compositions');
});

export default Router;
