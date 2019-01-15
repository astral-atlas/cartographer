// @flow
import uuid from 'uuid/v4';
import { InternalLibraryError } from '../lib';

export opaque type UUID: string = string;

export const generateUUID = (): UUID => (
  uuid()
);

function InvalidUUIDTypeError(incorrectType) {
  return new InternalLibraryError(
    'UUID',
    `Tried to convert ${incorrectType} to UUID, which failed because it was not a string (or it zero characters).`
  );
}

export const toUUID = (value: mixed): UUID => {
  if (typeof value === 'string' && value !== '') {
    return (value: UUID);
  }
  throw new InvalidUUIDTypeError(typeof value);
};
