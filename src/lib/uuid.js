// @flow
import uuid from 'uuid/v4';

export opaque type UUID: string = string;

export const generateUUID = (): UUID => (
  uuid()
);
