import QUnit from 'qunit';

const { assert } = QUnit;
const { entries } = Object;
const { isArray } = Array;
const { round } = Math;

function roundTo(num) {
  const precision = 1000;
  return round(num * precision) / precision;
}

function roundObject(obj) {
  if (isArray(obj)) {
    return obj.map(roundTo);
  }

  const result = {};

  for (const [key, val] of entries(obj)) {
    result[key] = roundTo(val);
  }

  return result;
}

assert.numberEqual = function(valA, valB, message) {
  const roundedA = roundTo(valA);
  const roundedB = roundTo(valB);
  assert.equal(roundedA, roundedB, message);
};

assert.deepNumberEqual = function(valA, valB, message) {
  assert.deepEqual(roundObject(valA), roundObject(valB), message);
};
