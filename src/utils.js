export const isObject = o => o !== null && typeof o === 'object';

export const isEmpty = o => !isObject(o) || Object.keys(o).length === 0;

export const isMatch = (data, source) => {
  if (Array.isArray(data) && Array.isArray(source)) {
    return source.every((item, index) => isMatch(data[index], item));
  }

  if (isObject(data) && isObject(source)) {
    return Object.keys(source).every(key => isMatch(data[key], source[key]));
  }

  return data === source;
};
