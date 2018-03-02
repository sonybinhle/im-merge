import { isObject, isEmpty } from './utils';

const IM_MERGE_TYPE_KEY = '__IM_MERGE_TYPE__';

const MERGE_TYPES = {
  INSERT: 'INSERT',
  INSERT_FIRST: 'INSERT_FIRST',
  INSERT_LAST: 'INSERT_LAST',
  // INSERT_AFTER_MATCH: 'INSERT_AFTER_MATCH',
  // INSERT_BEFORE_MATCH: 'INSERT_BEFORE_MATCH',
  REMOVE: 'REMOVE',
  REMOVE_FIRST: 'REMOVE_FIST',
  REMOVE_LAST: 'REMOVE_LAST'
  // REMOVE_MATCH: 'REMOVE_MATCH'
};

export const insertType = (data, index, flatten) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.INSERT,
  data,
  index,
  flatten
});

export const insertFisrtType = (data, flatten) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.INSERT_FIRST,
  data,
  flatten
});

export const insertLastType = (data, flatten) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.INSERT_LAST,
  data,
  flatten
});

export const removeType = (index, flatten) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.REMOVE,
  index,
  flatten
});

export const removeFirstType = (flatten) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.REMOVE_FIRST,
  flatten
});

export const removeLastType = (flatten) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.REMOVE_LAST,
  flatten
});

const mergeArrayType = (data, source) => {
  const {
    [IM_MERGE_TYPE_KEY]: type,
    data: sourceData,
    index = 0,
    flatten = true
  } = source;

  const arraySourceData = Array.isArray(sourceData)
    ? (flatten ? sourceData : [ sourceData ])
    : [ sourceData ];

  switch (type) {
    case MERGE_TYPES.INSERT:
      return [...data.slice(0, index), ...arraySourceData, ...data.slice(index)];
    case MERGE_TYPES.INSERT_FIRST:
      return [...arraySourceData, ...data];
    case MERGE_TYPES.INSERT_LAST:
      return [...data, ...arraySourceData];
    case MERGE_TYPES.REMOVE:
      return [...data.slice(0, index), ...data.slice(index + 1)];
    case MERGE_TYPES.REMOVE_FIRST:
      return data.slice(1);
    case MERGE_TYPES.REMOVE_LAST:
      return data.slice(0, data.length - 1);
  }
};

const imMerge = (data, source) => {
  if (Array.isArray(data) && isObject(source) && source[IM_MERGE_TYPE_KEY]) {
    return mergeArrayType(data, source);
  }
  if (Array.isArray(data) && Array.isArray(source)) {
    if (!source.length) return data;

    return [...data, ...source];
  }
  if (isObject(data) && isObject(source) && !(Array.isArray(data) || Array.isArray(source))) {
    if (isEmpty(source)) return data;

    return Object.keys(source).reduce((acc, key) => {
      acc[key] = imMerge(acc[key], source[key]);

      return acc;
    }, { ...data });
  }

  return source;
};

export default imMerge;
