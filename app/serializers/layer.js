import { Sprite } from '../utils/sprites';
import JSONSerializer from 'ember-data/serializers/json';

const { assign } = Object;

function num(val) {
  const result = Number(val);
  return isNaN(result) ? 0 : result;
}

function spriteFromAttrs(attrs) {
  const { left, top, width, height, rotation } = attrs;

  return Sprite.fromDimensions({
    x: num(left),
    y: num(top),
    w: num(width),
    h: num(height),
    r: num(rotation)
  });
}

function attrsFromSprite(sprite) {
  const { x, y, w, h, r } = sprite.dimensions;
  return {
    left: x,
    top: y,
    width: w,
    height: h,
    rotation: r
  };
}

const STYLE_KEYS = ['background', 'color'];

function stylesFromAttrs(attrs) {
  const styles = {};

  for (const key of STYLE_KEYS) {
    styles[key] = attrs[key];
  }

  return styles;
}

function normalizeAttributes(typeClass, attrs) {
  const attributes = {};

  typeClass.eachAttribute(key => {
    switch (key) {
      case 'sprite':
        attributes.sprite = spriteFromAttrs(attrs);
        break;
      case 'styles':
        attributes.styles = stylesFromAttrs(attrs);
        break;
      default:
        attributes[key] = attrs[key];
        break;
    }
  });

  return attributes;
}

export default class LayerSerializer extends JSONSerializer {
  normalize(typeClass, hash) {
    const attributes = normalizeAttributes(typeClass, hash);
    return { data: { attributes } };
  }

  serialize(snapshot) {
    const json = {};

    snapshot.eachAttribute(key => {
      const value = snapshot.attr(key);
      switch (key) {
        case 'sprite':
          assign(json, attrsFromSprite(value));
          break;
        case 'styles':
          assign(json, value);
          break;
        default:
          json[key] = value;
          break;
      }
    });

    return json;
  }
}
