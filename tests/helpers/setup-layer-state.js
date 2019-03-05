export default function setupLayerState(hooks) {
  hooks.beforeEach(function() {
    if (!this.server) {
      throw new Error(
        'You must setup Mirage with `setupMirage(hooks)` before calling `setupLayerState(hooks)`'
      );
    }

    const { server } = this;
    const serializer = server.serializerOrRegistry.serializerFor('composition');
    const layerState = this.owner.lookup('service:layer-state');
    const store = this.owner.lookup('service:store');

    this.createLayer = async (config = {}) => {
      const [layer] = await this.createLayers(1, config);
      return layer;
    };

    this.createLayers = async (amount, config = {}) => {
      const composition = server.create('composition', {});

      server.createList('layer', amount, { composition, ...config });

      const payload = serializer.serialize(composition);

      await store.unloadAll();
      await store.pushPayload(payload);

      const { layers } = store.peekRecord('composition', composition.id);

      layerState.initializeLayers(layers);

      return layers.slice(0);
    };
  });
}
