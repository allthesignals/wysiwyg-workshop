function schemaizeLayers(schema, attributes) {
  attributes.layers = attributes.layers.map(layer =>
    schema.layers.create(layer)
  );
}

export default function() {
  this.timing = 50;
  this.get('/compositions');
  this.get('/compositions/:id');

  this.post('/compositions', (schema, req) => {
    const { attributes } = JSON.parse(req.requestBody).data;

    schemaizeLayers(schema, attributes);

    return schema.compositions.create(attributes);
  });

  this.patch('/compositions/:id', (schema, req) => {
    const { id, attributes } = JSON.parse(req.requestBody).data;
    const composition = schema.compositions.find(id);

    schemaizeLayers(schema, attributes);

    return composition.update(attributes);
  });
}
