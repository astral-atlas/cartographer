// @flow strict

export class TypingError extends Error {
  constructor(targetType/*:: :string*/, actualType/*:: :string*/, name/*: string*/ = 'value') {
    super(`${name} was ${actualType} instead of ${targetType}`);
  }
}

export const toString = (value/*:: :mixed*/, name/*:: ?:string*/) => {
  if (typeof value !== 'string') {
    throw new TypingError('string', typeof value, name);
  }
  return value;
};
export const toNumber = (value/*:: :mixed*/, name/*:: ?:string*/) => {
  if (typeof value !== 'number') {
    throw new TypingError('number', typeof value, name);
  }
  return value;
};
export const toObject = (value/*:: :mixed*/, name/*:: ?:string*/) => {
  if (typeof value !== 'object' || value === null) {
    throw new TypingError('object', typeof value, name);
  }
  return value;
};
export const toArray = /*:: <TElement>*/(toElement/*: mixed => TElement*/, name/*:: ?:string*/)/*: (mixed => Array<TElement>)*/ => (value) => {
  if (!Array.isArray(value)) {
    throw new TypingError('array', typeof value, name);
  }
  const elements = [];
  for (let i = 0; i < value.length; i++) {
    elements[i] = toElement(value[i]);
  }
  return elements;
}
