// @flow

export const toIdentity = <TValue>(value: TValue): [null, TValue] => [null, value];

class JSONParseError extends Error {}

export const fromJSON = <TVal, TErr: Error>(next: mixed => [TErr, null] | [null, TVal]): (value: string) => (
  | [TErr, null]
  | [JSONParseError, null]
  | [null, TVal]
) => (value) => {
    try {
      return next(JSON.parse(value));
    } catch (error) {
      const parseError: JSONParseError = new JSONParseError(error.message);
      return [parseError, null];
    } 
  };

class NotAStringError extends Error {}

export const toString = function <TVal, TErr: ?Error>(next: string => [TErr, null] | [null, TVal]): (value: mixed) => (
  | [TErr, null]
  | [NotAStringError, null]
  | [null, TVal]
) {
  return (value) => {
    if (typeof value === 'string') {
      return next(value);
    } else {
      const error: NotAStringError = new NotAStringError();
      return [error, null];
    }
  };
};

class NotAnObject extends Error {}

export const toObject = <TVal, TErr: Error>(next: ({ [string]: mixed }) => [TErr, null] | [null, TVal]): (value: mixed) => (
  | [TErr, null]
  | [NotAnObject, null]
  | [null, TVal]
) => (value) => {
    if (typeof value === 'object' && value !== null) {
      return next(value);
    } else {
      const error: NotAnObject = new NotAnObject();
      return [error, null];
    }
  };

export const withProperty = function <TPropName: string, TPropValue, TPropTypeCastError: Error, TInputObject: {}, TVal, TErr: Error>(
  propName: TPropName,
  getProperty: (value: TInputObject) => [TPropTypeCastError, null] | [null, TPropValue],
  next: (TInputObject & { [TPropName]: TPropValue }) => ([TErr, null] | [null, TVal]),
): (value: TInputObject) => (
  | [TErr, null]
  | [TPropTypeCastError, null]
  | [NotAnObject, null]
  | [null, TVal]
) {
  return (value) => {
    const [propError, propValue] = getProperty(value);
    if (propError !== null) {
      return [(propError: TPropTypeCastError), null];
    } else {
      return next({ ...value, [propName]: propValue });
    }
  };
};

export const toUser = toObject(
  withProperty(('id': 'id'), toString(toIdentity),
    withProperty(('displayName': 'displayName'), toString(toIdentity),
      toIdentity
    )
  )
);
