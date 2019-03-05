import makeFunctionalModifier from 'ember-functional-modifiers';
import { toCSS } from 'transformation-matrix';
import styles from './styles';

function sumSprites([sprite, ...offsetSprites]) {
  for (const offsetSprite of offsetSprites) {
    sprite = sprite.add(offsetSprite);
  }

  return sprite;
}

export default makeFunctionalModifier((element, positional) => {
  const sprites = positional.filter(Boolean);

  if (!sprites.length) {
    return;
  }

  const sprite = sumSprites(sprites).normalizeScale();
  const {
    transformMatrix,
    dimensions: { h, w }
  } = sprite;

  return styles(element, [
    {
      width: `${w}px`,
      height: `${h}px`,
      transform: toCSS(transformMatrix),
      position: 'absolute'
    }
  ]);
});
