// @flow
import type { SerializableValue } from '../types';
import { InternalLibraryError } from '../lib';

function DeserializationError(targetType, value, valueType) {
  return new InternalLibraryError(
    'Serialization',
    `Could not deserialize "${JSON.stringify(value)}" to ${targetType} as it was actually ${valueType}.`
  );
}

export const toBoolean = (value: SerializableValue): boolean => {
  if (typeof value !== 'boolean') {
    throw new DeserializationError('boolean', value, typeof value);
  }
  return value;
};

export const toString = (value: SerializableValue): string => {
  if (typeof value !== 'string') {
    throw new DeserializationError('string', value, typeof value);
  }
  return value;
};

export const toNumber = (value: SerializableValue): number => {
  if (typeof value !== 'number') {
    throw new DeserializationError('number', value, typeof value);
  }
  return value;
};

export const toArray = <T>(value: SerializableValue, map: (value: SerializableValue) => T): Array<T> => {
  if (!Array.isArray(value) || typeof value === 'string') {
    throw new DeserializationError('array', value, typeof value);
  }
  return value.map(map);
};

export const toObject = <T>(value: SerializableValue, to: (value: { [key: SerializableValue]: SerializableValue }) => T): T => {
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new DeserializationError('object', value, typeof value);
  }
  return to(value);
};
