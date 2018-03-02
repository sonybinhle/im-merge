import { isObject, isEmpty, isMatch } from './utils';

describe('isObject', () => {
  it('when test with object --> then return true', () => {
    expect(isObject({})).toBe(true);
  });

  it('when test with non-object --> then return false', () => {
    expect(isObject(3)).toBe(false);
  });

  it('when test with null --> then return false', () => {
    expect(isObject(null)).toBe(false);
  });
});

describe('isEmpty', () => {
  it('when test empty object --> then return true', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('when test with non-empty object --> then return false', () => {
    expect(isEmpty({ c: 1 })).toBe(false);
  });

  it('when test with non-object --> then return true', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(3)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
  });
});

describe('isMatch', () => {
  it('when test with matched object --> then return true', () => {
    const testMatched = (data, source) => expect(isMatch(data, source)).toBe(true);

    testMatched(1, 1);
    testMatched('a', 'a');
    testMatched({ x: 1 }, { x: 1 });
    testMatched({ x: 1, b: 2 }, { x: 1 });
    testMatched({ x: 1, b: { c: 3, d: 4 } }, { x: 1, b: { c: 3 } });
    testMatched(
      { x: 1, b: { c: 3, d: 4 }, t: { k: { z: {}, q: {} } } },
      { x: 1, b: { c: 3 }, t: { k: { z: {} } } }
    );
    testMatched(
      { x: { y: 2, z: 3 }, t: [{ a: 1 }, {b: [{ a: 1, b: 2 }]}, {c: 3}] },
      { x: { y: 2 }, t: [{ a: 1 }, {b: [{ b: 2 }]}] }
    );
  });

  it('when test with non-matched object --> then return false', () => {
    const testNonMatched = (data, source) => expect(isMatch(data, source)).toBe(false);

    testNonMatched(1, 2);
    testNonMatched('a', 'ab');
    testNonMatched([1, 2, 3], [1, 2, 4]);
    testNonMatched({ x: 1 }, { x: 2 });
    testNonMatched({ x: 1, b: 2 }, { x: 1, b: 4 });
    testNonMatched({ x: 1, b: { c: 3, d: 4 } }, { x: 1, b: { c: 3, k: 1 } });
    testNonMatched(
      { x: 1, b: { c: 3, d: 4 }, t: { k: { z: {}, q: {} } } },
      { x: 1, b: { c: 3 }, t: { k: { z: { x: 1 } } } }
    );
    testNonMatched(
      { x: { y: 2, z: 3 }, t: [{ a: 1 }, {b: [{ a: 1, b: 2 }]}, {c: 3}] },
      { x: { y: 2 }, t: [{ a: 1 }, {b: [{ b: 2 }, {}]}] }
    );
  });
});
