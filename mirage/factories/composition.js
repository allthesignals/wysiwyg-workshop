import { Factory, faker, trait } from 'ember-cli-mirage';

const { internet, company } = faker;
const { catchPhraseAdjective, catchPhraseDescriptor } = company;

export default Factory.extend({
  width: 500,
  height: 500,
  color: internet.color,
  title() {
    return `${catchPhraseAdjective()} ${catchPhraseDescriptor()}`;
  },

  grid: trait({
    height: 500,
    width: 500,
    afterCreate(composition, server) {
      server.createList('layer', 25, 'gridMember', { composition });
    }
  })
});
