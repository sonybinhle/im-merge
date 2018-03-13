import {isObject, isEmpty, isMatch} from './utils';

const IM_MERGE_TYPE_KEY = '__IM_MERGE_TYPE__';

const MERGE_TYPES = {
  MERGE: 'MERGE',
  INSERT: 'INSERT',
  INSERT_FIRST: 'INSERT_FIRST',
  INSERT_LAST: 'INSERT_LAST',
  INSERT_BEFORE_MATCH: 'INSERT_BEFORE_MATCH',
  INSERT_AFTER_MATCH: 'INSERT_AFTER_MATCH',
  REMOVE: 'REMOVE',
  REMOVE_FIRST: 'REMOVE_FIST',
  REMOVE_LAST: 'REMOVE_LAST',
  REMOVE_MATCH: 'REMOVE_MATCH'
};

export const mergeType = (data) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.MERGE,
  data,
});

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

export const insertBeforeMatchType = (data, match, flatten) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.INSERT_BEFORE_MATCH,
  data,
  match,
  flatten
});

export const insertAfterMatchType = (data, match, flatten) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.INSERT_AFTER_MATCH,
  data,
  match,
  flatten
});

export const removeType = (index) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.REMOVE,
  index
});

export const removeFirstType = () => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.REMOVE_FIRST
});

export const removeLastType = () => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.REMOVE_LAST
});

export const removeMatchType = (match) => ({
  [IM_MERGE_TYPE_KEY]: MERGE_TYPES.REMOVE_MATCH,
  match
});

const mergeArrayType = (data, source) => {
  const {
    [IM_MERGE_TYPE_KEY]: type,
    data: sourceData,
    match,
    index = 0,
    flatten = true
  } = source;

  const arraySourceData = Array.isArray(sourceData)
    ? (flatten ? sourceData : [ sourceData ])
    : [ sourceData ];

  switch (type) {
    case MERGE_TYPES.MERGE:
      return data.map((item, index) => imMerge(item, sourceData[index]));
    case MERGE_TYPES.INSERT:
      return [...data.slice(0, index), ...arraySourceData, ...data.slice(index)];
    case MERGE_TYPES.INSERT_FIRST:
      return [...arraySourceData, ...data];
    case MERGE_TYPES.INSERT_LAST:
      return [...data, ...arraySourceData];
    case MERGE_TYPES.INSERT_BEFORE_MATCH:
    case MERGE_TYPES.INSERT_AFTER_MATCH:
      const matchedIndex = data.findIndex(item => isMatch(item, match));
      if (matchedIndex === -1) return data;
      const insertedIndex = type === MERGE_TYPES.INSERT_BEFORE_MATCH ? matchedIndex : matchedIndex + 1;
      return [...data.slice(0, insertedIndex), ...arraySourceData, ...data.slice(insertedIndex)];
    case MERGE_TYPES.REMOVE:
      return [...data.slice(0, index), ...data.slice(index + 1)];
    case MERGE_TYPES.REMOVE_FIRST:
      return data.slice(1);
    case MERGE_TYPES.REMOVE_LAST:
      return data.slice(0, data.length - 1);
    case MERGE_TYPES.REMOVE_MATCH:
      return data.filter(item => !isMatch(item, match));
    default:
      return data;
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
