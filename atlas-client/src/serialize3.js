// @flow
export class NotAStringError extends Error {}
export class NotANumberError extends Error {}
export class NotAnObjectError extends Error {}
export class InvalidJSONError extends Error {}
export class NullValueError extends Error {}
export class NotAnArrayError extends Error {}

export const toString = <T>(next: string => T): (value: mixed) => (T | [1, NotAStringError]) => (value) => {
  if (typeof value === 'string') {
    return next(value);
  } else {
    return [1, new NotAStringError()];
  }
};

export const toNumber = <T>(next: number => T): (value: mixed) => (T | [1, NotANumberError]) => (value) => {
  if (typeof value === 'number') {
    return next(value);
  } else {
    return [1, new NotANumberError()];
  }
};

export const toObject = <T>(next: { [string]: mixed } => T): (value: mixed) => (T | [1, NotAnObjectError]) => (value) => {
  if (typeof value === 'object' && value !== null) {
    return next(value);
  } else {
    return [1, new NotAnObjectError()];
  }
};

export const withProperty = <TReturn, TObject: {}, TPropName: string, TPropValue, TPropError: Error>(
  propName: TPropName,
  propValue: mixed => [0, TPropValue] | [1, TPropError],
  next: (TObject & { [TPropName]: TPropValue }) => TReturn,
): (value: TObject) => (TReturn | [1, TPropError]) => (value) => {
    const [err, propVal] = propValue(value[propName]);
    if (err === 1) {
      return [1, propVal];
    }
    return next({ ...value, [propName]: propVal });
  };

export const fromJson = <T>(next: mixed => T): (value: string) => T | [1, InvalidJSONError] => (value) => {
  try {
    return next(JSON.parse(value));
  } catch (error) {
    return [1, new InvalidJSONError(error.message)];
  }
};

export const toArray = <TReturn, TArrayElement>(
  toElement: mixed => TArrayElement,
  next: Array<TArrayElement> => TReturn,
): (value: mixed) => (TReturn | [1, NotAnArrayError]) => (value) => {
    if (Array.isArray(value)) {
      return next(value.map(toElement));
    } else {
      return [1, new NotAnArrayError()];
    }
  };

export const toUser = withProperty(
  ('id': 'id'),
  toString((value: mixed): ([0, mixed]) => [0, value]),
  (value: mixed): [0, mixed] => [0, value],
);
