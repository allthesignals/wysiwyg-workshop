import Service from '@ember/service';
import { setProperties, set } from '@ember/object';
import { Sprite } from '../utils/sprites';

export default class LayerStateService extends Service {
  layers = [];

  initializeLayers(layers) {
    set(this, 'layers', layers.slice(0));
  }

  filterBySprite(outerSprite) {
    return this.layers.filter(layer =>
      Sprite.intersects(layer.sprite, outerSprite)
    );
  }

  updateLayer(layer, updatedAttrs) {
    setProperties(layer, updatedAttrs);
  }

  newLayer(layer) {
    this.initializeLayers([...this.layers, layer]);

    return layer;
  }

  deleteLayer(toDelete) {
    const kept = this.layers.filter(layer => layer !== toDelete);
    this.initializeLayers(kept);
  }

  deleteLayers(toDelete) {
    const kept = this.layers.filter(layer => !toDelete.includes(layer));
    this.initializeLayers(kept);
  }
}
