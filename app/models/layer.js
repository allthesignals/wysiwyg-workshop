import Fragment from 'ember-data-model-fragments/fragment';
import { attr } from '@ember-decorators/data';

export default class CompositionModel extends Fragment {
  @attr styles;
  @attr sprite;
  @attr text;
  @attr label;
}
