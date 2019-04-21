// @flow

class NotAnObjectError extends Error {}
class NotAStringError extends Error {}
class NotAnArrayError extends Error {}

export type Response<T> =
  | { type: 'error', errorType: 'NotAnObjectError', error: NotAnObjectError, value: null }
  | { type: 'error', errorType: 'NotAStringError', error: NotAStringError, value: null }
  | { type: 'error', errorType: 'NotAnArrayError', error: NotAnArrayError, value: null }
  | { type: 'success', value: T }

export type Continue<T, Y> = (resolvedType: T) => Response<Y>;
export type Serializer<M, T> = (value: M) => Response<T>; 

export const succeed = <T>(value: T): Response<T> => ({ type: 'success', value }); 

export const fromJSON = <T>(cont: Continue<mixed, T>): Serializer<string, T> => (value: string): Response<T> => {
  return cont(JSON.parse(value));
};

export const withProperty = <T, Y, Z: { [string]: mixed }, S: string>(
  propName: S,
  toPropValue: Continue<mixed, Y>,
  next: Continue<{ [S]: Y } & Z, T>,
): Serializer<Z, T> => (value: Z): Response<T> => {
    const propValueResponse = toPropValue(value[propName]);
    if (propValueResponse.type === 'error') {
      return propValueResponse;
    }
    return next({ ...value, [propName]: propValueResponse.value });
  };

export const toObject = <T>(cont: Continue<{ [string]: mixed }, T>): Serializer<mixed, T> => (value: mixed): Response<T> => {
  if (typeof value !== 'object') {
    return {
      type: 'error',
      errorType: 'NotAnObjectError',
      error: new NotAnObjectError('Trying to cast to an object when the source is not an object'),
      value: null,
    };
  }
  if (value === null) {
    return {
      type: 'error',
      errorType: 'NotAnObjectError',
      error: new NotAnObjectError('Trying to cast to an object when the source is null'),
      value: null,
    };
  }
  return cont(value);
};

export const toArray = <T, Y>(toElement: Continue<mixed, Y>, cont: Continue<Array<Y>, T>): Serializer<mixed, T> => (value: mixed): Response<T> => {
  if (!Array.isArray(value)) {
    return {
      type: 'error',
      errorType: 'NotAnArrayError',
      error: new NotAnArrayError('Trying to cast to an array when the source is not an array'),
      value: null,
    };
  }
  const array: Array<Response<Y>> = value.map(toElement);
  const error = array.find(el => el.type === 'error');
  if (error && error.type === 'error') {
    return error;
  }
  const successArray: Array<{ type: 'success', value: Y }> = array.reduce((acc, curr) => curr.type === 'success' ? [...acc, curr] : acc, []);
  return cont(successArray.map(el => el.value));
};

export const toString = <T>(cont: Continue<string, T>): Serializer<mixed, T> => (value: mixed): Response<T> => {
  if (typeof value !== 'string') {
    return {
      type: 'error',
      errorType: 'NotAStringError',
      error: new NotAStringError('Value was not a string'),
      value: null,
    };
  }
  return cont(value);
};
