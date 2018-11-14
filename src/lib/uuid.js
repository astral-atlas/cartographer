// @flow
import type { SerializableValue } from '../types';
// $FlowFixMe
import uuid from 'uuid/v4';
import { InternalLibraryError } from '../lib';

export opaque type UUID: string = string;

export const generateUUID = (): UUID => (
  uuid()
);

function InvalidUUIDTypeError(incorrectType) {
  return new InternalLibraryError(
    'UUID',
    `Tried to convert ${incorrectType} to UUID, which failed because it was not a string.`
  );
}

export const toUUID = (value: SerializableValue): UUID => {
  if (typeof value === 'string' && value !== '') {
    return (value: UUID);
  }
  throw new InvalidUUIDTypeError(typeof value);
};
