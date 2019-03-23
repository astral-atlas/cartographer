// @flow
import { InternalLibraryError } from '../lib';

export function DeserializationError(
  targetType: string,
  value: mixed,
  valueType: string
) {
  const serializedValue = JSON.stringify(value);
  if (serializedValue === undefined) {
    return new InternalLibraryError(
      'Serialization',
      'DeserializationError: Could not deserialize "undefined" to '+
      `${targetType}.`
    );
  }
  return new InternalLibraryError(
    'Serialization',
    `DeserializationError: Could not deserialize "${serializedValue}" to `+
    `${targetType} as it was actually ${valueType}.`
  );
}

export const fromJsonString = (jsonString: string): mixed => (
  JSON.parse(jsonString)
);

export const toBoolean = (value: mixed): boolean => {
  if (typeof value !== 'boolean') {
    throw new DeserializationError('boolean', value, typeof value);
  }
  return value;
};

export const toString = (value: mixed): string => {
  if (typeof value !== 'string') {
    throw new DeserializationError('string', value, typeof value);
  }
  return value;
};

export const toNumber = (value: mixed): number => {
  if (typeof value !== 'number') {
    throw new DeserializationError('number', value, typeof value);
  }
  return value;
};

export const toArray = <T>(
  value: mixed,
  toElement: (element: mixed) => T,
): Array<T> => {
  if (!Array.isArray(value) || typeof value === 'string') {
    throw new DeserializationError('array', value, typeof value);
  }
  return value.map(toElement);
};

export const toObject = <T>(
  value: mixed,
  toType: (value: { [key: string]: mixed }) => T,
): T => {
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    throw new DeserializationError('object', value, typeof value);
  }
  return toType(value);
};
