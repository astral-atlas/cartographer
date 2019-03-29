// @flow

export class DeserializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GenericDeserializationError';
  }
}

export class TypeMismatchDeserializationError extends DeserializationError {
  constructor(message: string) {
    super(message);
    this.name = 'TypeMismatchDeserializationError';
  }
}
class JSONDeserializationError extends DeserializationError {
  constructor(parserMessage: string) {
    super(`JSON parsing error during deserialization:\n"${parserMessage}"`);
    this.name = 'JSONDeserializationError';
  }
}

export const fromJsonString = (jsonString: string): mixed => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    throw new JSONDeserializationError(error.message);
  }
};

class BooleanDeserializationError extends TypeMismatchDeserializationError {
  constructor(incorrectType: string) {
    super(`Could not deserialize boolean, input was ${incorrectType} instead`);
    this.name = 'BooleanDeserializationError';
  }
}

export const toBoolean = (value: mixed): boolean => {
  if (typeof value !== 'boolean') {
    throw new BooleanDeserializationError(typeof value);
  }
  return value;
};

class StringDeserializationError extends TypeMismatchDeserializationError {
  constructor(incorrectType: string) {
    super(`Could not deserialize string, input was ${incorrectType} instead`);
    this.name = 'StringDeserializationError';
  }
}

export const toString = (value: mixed): string => {
  if (typeof value !== 'string') {
    throw new StringDeserializationError(typeof value);
  }
  return value;
};

export class StaticStringDeserializationError extends TypeMismatchDeserializationError {
  constructor(expected: string, actual: string) {
    super(`Expected value "${actual}" to equal static string "${expected}" during deserialization`);
    this.name = 'StaticStringDeserializationError';
  }
}

export const toStaticString = <T: string>(value: mixed, staticValue: T): T => {
  const stringValue = toString(value);
  if (stringValue !== staticValue) {
    throw new StaticStringDeserializationError(staticValue, stringValue);
  }
  return staticValue;
};

class NumberDeserializationError extends TypeMismatchDeserializationError {
  constructor(incorrectType: string) {
    super(`Could not deserialize number, input was ${incorrectType} instead`);
    this.name = 'StringDeserializationError';
  }
}

export const toNumber = (value: mixed): number => {
  if (typeof value !== 'number') {
    throw new NumberDeserializationError(typeof value);
  }
  return value;
};

class ArrayDeserializationError extends TypeMismatchDeserializationError {
  constructor(incorrectType: string) {
    super(`Could not deserialize array, input was ${incorrectType} instead`);
    this.name = 'StringDeserializationError';
  }
}

export const toArray = <T>(
  value: mixed,
  toElement: (element: mixed) => T,
): Array<T> => {
  if (!Array.isArray(value)) {
    throw new ArrayDeserializationError(typeof value);
  }
  return value.map(toElement);
};

class ObjectDeserializationError extends TypeMismatchDeserializationError {
  constructor(incorrectType: string) {
    super(`Could not deserialize object, input was ${incorrectType} instead`);
    this.name = 'StringDeserializationError';
  }
}

export const toObject = <T>(
  value: mixed,
  toType: (value: { [key: string]: mixed }) => T,
): T => {
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    throw new ObjectDeserializationError(typeof value);
  }
  return toType(value);
};
