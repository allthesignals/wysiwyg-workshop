import ApplicationSerializer from './application';

const serialize = ApplicationSerializer.prototype.serialize;
const { isArray } = Array;

function makeLayerMap(layers = []) {
  const map = new Map();

  for (const layer of layers) {
    map.set(layer.id, layer.attributes);
  }

  return map;
}

function makeLayerAttrs(data, layerMap) {
  const { id, type, relationships, attributes } = data;

  attributes.layers = relationships.layers.data.map(({ id }) =>
    layerMap.get(id)
  );

  return { id, type, attributes };
}

export default ApplicationSerializer.extend({
  include: () => ['layers'],

  serialize() {
    const { data: ogData, included } = serialize.apply(this, arguments);
    const layerMap = makeLayerMap(included);
    const data = isArray(ogData)
      ? ogData.map(comp => makeLayerAttrs(comp, layerMap))
      : makeLayerAttrs(ogData, layerMap);

    return { data };
  }
});
