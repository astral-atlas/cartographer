// @flow
import type { UUID } from './uuid';
import { toObject } from './serialization';
import { toUUID, generateUUID } from './uuid';

export opaque type UserID: UUID = UUID;

export type User = {
  id: UserID,
};

export const toUserId = (value: mixed): UserID => toUUID(value);

export const toUser = (value: mixed): User => toObject(value, (object) => ({
  id: toUserId(object.id),
}));

export const generateUser = (): User => ({
  id: generateUUID()
});

