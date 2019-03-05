window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-metal.getting-each' },
    { handler: 'silence', matchId: 'events.remove-all-listeners' },
    { handler: 'silence', matchId: 'ember-inflector.globals' },
    {
      handler: 'silence',
      matchId:
        'ember-decorators.utils.decorator.descriptor-mutation-by-reference'
    }
  ]
};
