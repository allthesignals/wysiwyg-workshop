import { Factory, faker, trait } from 'ember-cli-mirage';

const { random, internet, lorem, commerce } = faker;

const number = (min, max) => () => random.number({ min, max });

export default Factory.extend({
  left: number(0, 400),
  top: number(0, 400),
  width: number(10, 100),
  height: number(10, 100),
  rotation: number(0, 360),
  background: internet.color,
  color: internet.color,
  text() {
    const count = random.number({ min: 1, max: 5 });
    return lorem.words(count);
  },

  label() {
    const product = commerce.product();
    return `${product} layer`;
  },

  gridMember: trait({
    rotation: 0,
    width: 100,
    height: 100,
    left: i => (i % 5) * 100,
    top: i => Math.floor((i % 25) / 5) * 100
  })
});
