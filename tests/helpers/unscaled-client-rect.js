const boxKeys = ['bottom', 'height', 'left', 'right', 'top', 'width', 'x', 'y'];

export function getScaleForElement(element) {
  const { offsetHeight, offsetWidth } = element;
  const { height, width } = element.getBoundingClientRect();

  if (offsetHeight !== 0) {
    return height / offsetHeight;
  } else if (offsetWidth !== 0) {
    return width / offsetWidth;
  } else {
    throw new Error(
      'The element must have at least height or width greater than 0'
    );
  }
}

export default function getUnscaledClientRect(element) {
  const box = element.getBoundingClientRect();
  const scale = getScaleForElement(element);
  const resultBox = {};

  for (const key of boxKeys) {
    const value = box[key];
    resultBox[key] = value / scale;
  }

  return resultBox;
}
