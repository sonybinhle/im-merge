import imMerge, {
  mergeType,
  insertType,
  insertFisrtType,
  insertLastType,
  insertBeforeMatchType,
  insertAfterMatchType,
  removeType,
  removeFirstType,
  removeLastType,
  removeMatchType
} from './imMerge';

describe('imMerge', () => {
  it('when merge data with source --> then return new deeply merged object', () => {
    // given
    const data = { a: { b: { c: 1, d: 2 }, e: { f: '3' } } };
    const source = { a: { b: { c: 2, dd: 3 }, ee: { f: '4' } } };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
  });

  it('when merge data with empty source --> then return original object', () => {
    // given
    const data = { a: { b: { c: 1, d: 2 }, e: { f: '3' } } };
    const source = { };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toBe(data);
  });

  it('when merge data with child empty source --> then return original child object', () => {
    // given
    const data = { a: { b: { c: 1, d: 2 }, e: { f: '3' } } };
    const source = { a: { e: {} } };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj.a.e).toBe(data.a.e);
    expect(mergedObj.a).not.toBe(data.a);
  });

  it('when merge data with some non-collision keys --> then non-collision objects will return original references', () => {
    // given
    const data = { a: { b: { c: 1, d: 2 }, e: { f: '3' } } };
    const source = { a: { b: { c: 2 }, e: {} }, d: {} };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj.a.e).toBe(data.a.e);
    expect(mergedObj.a).not.toBe(data.a);
    expect(mergedObj.a.b.c).toBe(source.a.b.c);
    expect(mergedObj.a.b.d).toBe(data.a.b.d);
    expect(mergedObj.d).toBe(source.d);
    expect(mergedObj.d).not.toBe(data.d);
  });

  it('when merge data source array --> then default behavior is appended', () => {
    // given
    const data = { a: { b: { c: 1, d: 2 }, e: [{ x: 1 }, { x: 2 }] } };
    const source = { a: { b: { c: 2 }, e: [{ x: 3 }] } };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.a.e[0]).toBe(data.a.e[0]);
    expect(mergedObj.a.e[1]).toBe(data.a.e[1]);
    expect(mergedObj.a.e[2]).toBe(source.a.e[0]);
  });

  it('when source is a empty array --> then return original data', () => {
    // given
    const data = { a: { b: { c: 1, d: 2 }, e: [{ x: 1 }, { x: 2 }] } };
    const source = { a: { b: { c: 2 }, e: [] } };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj.a.e).toBe(data.a.e);
    expect(mergedObj.a.e.length).toBe(2);
  });
});

describe('imMerge-array', () => {
  it('when merge array with mergeType source array --> then deeply merge array items', () => {
    // given
    const data = { a: { b: [{ x: 1, z: {} }, { x: 2 }] } };
    const insertedData = [{ y: 1 }, { y: {} }];
    const source = { a: { b: mergeType(insertedData) } };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.a.b[0].z).toBe(data.a.b[0].z);
    expect(mergedObj.a.b[1].y).toBe(insertedData[1].y);
  });

  it('when merge array with insertType source array --> then default index is 0 and return new array with inserted object', () => {
    // given
    const data = { a: { b: {}, t: [{ x: 1 }, { x: 2 }] } };
    const insertedData = { x: 3 };
    const source = { a: { b: { c: 2 }, t: insertType(insertedData) } };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.a.t[0]).toBe(insertedData);
    expect(mergedObj.a.t[1]).toBe(data.a.t[0]);
    expect(mergedObj.a.t[2]).toBe(data.a.t[1]);
  });

  it('when merge array with insertType and index --> then return new array with inserted object', () => {
    // given
    const data = { a: { b: {}, t: [{ x: 1 }, { x: 2 }] } };
    const insertedData = { x: 3 };
    const source = { a: { b: { c: 2 }, t: insertType(insertedData, 1) } };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.a.t[0]).toBe(data.a.t[0]);
    expect(mergedObj.a.t[1]).toBe(insertedData);
    expect(mergedObj.a.t[2]).toBe(data.a.t[1]);
  });

  it('when merge array with insertType, index, default flatten --> then return new array with inserted objects', () => {
    // given
    const data = { a: { b: {}, t: [{ x: 1 }, { x: 2 }] } };
    const insertedData = [ { x: 3 }, { x: 4 } ];
    const source = { a: { b: { c: 2 }, t: insertType(insertedData, 1) } };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.a.t[0]).toBe(data.a.t[0]);
    expect(mergedObj.a.t[1]).toBe(insertedData[0]);
    expect(mergedObj.a.t[2]).toBe(insertedData[1]);
    expect(mergedObj.a.t[3]).toBe(data.a.t[1]);
  });

  it('when merge array with insertType, index, flatten=false --> then return new array with inserted objects', () => {
    // given
    const data = { a: { b: {}, t: [{ x: 1 }, { x: 2 }] } };
    const insertedData = [ { x: 3 }, { x: 4 } ];
    const source = { a: { b: { c: 2 }, t: insertType(insertedData, 1, false) } };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.a.t[0]).toBe(data.a.t[0]);
    expect(mergedObj.a.t[1]).toBe(insertedData);
    expect(mergedObj.a.t[2]).toBe(data.a.t[1]);
  });

  it('when merge array with insertFirstType --> then return new array with inserted object', () => {
    // given
    const data = { t: [{ x: 1 }, { x: 2 }, { x: 3 }] };
    const insertedData = { x: 4 };
    const source = { t: insertFisrtType(insertedData) };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.t[0]).toBe(insertedData);
    expect(mergedObj.t[1]).toBe(data.t[0]);
  });

  it('when merge array with insertLastType --> then return new array with inserted object', () => {
    // given
    const data = { t: [{ x: 1 }, { x: 2 }, { x: 3 }] };
    const insertedData = { x: 4 };
    const source = { t: insertLastType(insertedData) };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.t[2]).toBe(data.t[2]);
    expect(mergedObj.t[3]).toBe(insertedData);
  });

  it('when merge array with insertBeforeMatchType --> then return new array with inserted object', () => {
    // given
    const data = { t: [{ x: 1 }, { x: 2 }, { x: 3 }] };
    const insertedData = [{ x: 4 }, { x: 5 }];
    const source = { t: insertBeforeMatchType(insertedData, { x: 2 }) };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.t).toHaveLength(5);
    expect(mergedObj.t[3]).toBe(data.t[1]);
    expect(mergedObj.t[1]).toBe(insertedData[0]);
  });

  it('when merge array with insertAfterMatchType --> then return new array with inserted object', () => {
    // given
    const data = { t: [{ x: 1 }, { x: 2 }, { x: 3 }] };
    const insertedData = [{ x: 4 }, { x: 5 }];
    const source = { t: insertAfterMatchType(insertedData, { x: 2 }) };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.t).toHaveLength(5);
    expect(mergedObj.t[4]).toBe(data.t[2]);
    expect(mergedObj.t[2]).toBe(insertedData[0]);
  });

  it('when merge array with insertAfterMatchType and there is no matched items --> then return original object', () => {
    // given
    const data = { t: [{ x: 1 }, { x: 2 }, { x: 3 }] };
    const insertedData = { x: 4 };
    const source = { t: insertAfterMatchType(insertedData, { x: 5 }) };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj.t).toBe(data.t);
  });

  it('when merge array with removeType --> then return new array with object removed', () => {
    // given
    const data = { t: [{ x: 1 }, { x: 2 }, { x: 3 }] };
    const source = { t: removeType(1) };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.t[0]).toBe(data.t[0]);
    expect(mergedObj.t[1]).toBe(data.t[2]);
  });

  it('when merge array with removeFirstType --> then return new array with object removed', () => {
    // given
    const data = { t: [{ x: 1 }, { x: 2 }, { x: 3 }] };
    const source = { t: removeFirstType() };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.t[0]).toBe(data.t[1]);
    expect(mergedObj.t[1]).toBe(data.t[2]);
  });

  it('when merge array with removeLastType --> then return new array with object removed', () => {
    // given
    const data = { t: [{ x: 1 }, { x: 2 }, { x: 3 }] };
    const source = { t: removeLastType() };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.t[0]).toBe(data.t[0]);
    expect(mergedObj.t[1]).toBe(data.t[1]);
    expect(mergedObj.t[3]).toBe(undefined);
  });

  it('when merge array with removeMatchType --> then return new array with object removed', () => {
    // given
    const data = { t: [{ x: 1 }, { x: 2, y: 1 }, { x: 3 }] };
    const source = { t: removeMatchType({ y: 1 }) };

    // when
    const mergedObj = imMerge(data, source);

    // then
    expect(mergedObj).toMatchSnapshot();
    expect(mergedObj.t).toHaveLength(2);
    expect(mergedObj.t[0]).toBe(data.t[0]);
    expect(mergedObj.t[1]).toBe(data.t[2]);
  });
});
