import { triggerEvent, find } from '@ember/test-helpers';
import { getScaleForElement } from './unscaled-client-rect';

function eventOptions(x, y, options = {}) {
  return {
    ...options,
    clientX: x,
    clientY: y,
    screenX: x + 5,
    screenY: y + 95
  };
}

export function dragEventStages(...args) {
  return createDragEvent(...args);
}

export default async function dragEvent(...args) {
  const [start, move, finish] = createDragEvent(...args);
  await start();
  await move();
  await finish();
}

function createDragEvent(maybeElement, [x, y], eventConfig = {}) {
  const element = find(maybeElement);
  const { scaleEvent = false, ...options } = eventConfig;

  const scale = scaleEvent ? getScaleForElement(element) : 1;

  const { top, left } = element.getBoundingClientRect();

  const dx = x / scale;
  const dy = y / scale;
  const hdx = dx * 0.5;
  const hdy = dy * 0.5;

  const start = () =>
    triggerEvent(element, 'mousedown', eventOptions(left, top, options));

  const move = async () => {
    await triggerEvent(element, 'mousemove', eventOptions(left, top, options));
    await triggerEvent(
      element,
      'mousemove',
      eventOptions(left + hdx, top + hdy, options)
    );
    await triggerEvent(
      element,
      'mousemove',
      eventOptions(left + dx, top + dy, options)
    );
  };

  const finish = () =>
    triggerEvent(
      element,
      'mouseup',
      eventOptions(left + dx, top + dy, options)
    );

  return [start, move, finish];
}
