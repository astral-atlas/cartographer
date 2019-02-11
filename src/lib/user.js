// @flow
import type { UUID } from './uuid';
import { toObject, toString } from './serialization';
import { toUUID, generateUUID } from './uuid';

export opaque type UserID: UUID = UUID;

export type User = {
  id: UserID,
  name: string,
};

export const toUserId = (value: mixed): UserID => toUUID(value);

export const toUser = (value: mixed): User => toObject(value, (object) => ({
  name: toString(object.name),
  id: toUserId(object.id),
}));

export const generateUser = (name: string): User => ({
  name,
  id: generateUUID()
});

