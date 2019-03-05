import makeFunctionalModifier from 'ember-functional-modifiers';

const { entries } = Object;

export default makeFunctionalModifier((element, [stylesObj], keyValue) => {
  const styles = { ...stylesObj, ...keyValue };

  for (let [style, value] of entries(styles)) {
    element.style[style] = value;
  }
});
