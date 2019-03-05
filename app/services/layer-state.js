import Service from '@ember/service';
import { setProperties, set } from '@ember/object';
import { Sprite, getDifferences } from '../utils/sprites';
import { inject as service } from '@ember-decorators/service';

export default class LayerStateService extends Service {
  @service ariaAnnouncer;

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
    if (updatedAttrs.sprite) {
      const { label } = layer;
      const differences = getDifferences(layer.sprite, updatedAttrs.sprite);

      if (differences.length) {
        this.ariaAnnouncer.announce('moved_layer', { label });
      }

      for (const difference of differences) {
        this.ariaAnnouncer.announce('change_dimension', difference);
      }
    }

    setProperties(layer, updatedAttrs);
  }

  newLayer(layer) {
    this.initializeLayers([...this.layers, layer]);

    this.ariaAnnouncer.announce('layer_created');
    this.ariaAnnouncer.announce('layer_position', layer.sprite.dimensions);

    return layer;
  }

  deleteLayer(toDelete) {
    const kept = this.layers.filter(layer => layer !== toDelete);
    this.initializeLayers(kept);

    const { label } = toDelete;
    this.ariaAnnouncer.announce('deleted_layer', { label });
  }

  deleteLayers(toDelete) {
    const kept = this.layers.filter(layer => !toDelete.includes(layer));
    this.initializeLayers(kept);

    this.ariaAnnouncer.announce('deleted_layers', { count: toDelete.length });
  }
}
