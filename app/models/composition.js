import Model from 'ember-data/model';
import { attr } from '@ember-decorators/data';
import { wrapComputed } from '@ember-decorators/object';
import { fragmentArray } from 'ember-data-model-fragments/attributes';

export default class CompositionModel extends Model {
  @wrapComputed(fragmentArray('layer')) layers;
  @attr('number') width;
  @attr('number') height;
  @attr('string') title;
  @attr('string') color;
}
