'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const nested = require('postcss-nested');
const cssImport = require('postcss-import');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    cssModules: {
      plugins: {
        before: [nested],
        after: [cssImport]
      }
    }
  });

  app.import('node_modules/normalize.css/normalize.css');

  return app.toTree();
};
