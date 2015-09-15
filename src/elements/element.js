import TYPES from 'types';

const getValueType = ({element, content}) => {
  if (element === 'member') {
    return content.value.element;
  }

  return element;
};

const isObject = (element) => {
  return element === TYPES.OBJECT;
};

const isArray = (element) => {
  return element === TYPES.ARRAY;
};

const isObjectOrArray = (element) => {
  return isObject(element) || isArray(element);
};

export {
  getValueType,
  isObject,
  isArray,
  isObjectOrArray
};