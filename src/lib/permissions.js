// @flow
import type { UserID } from './authentication';
import { UserAuthenticationError } from '../services/authentication';
import { toUserId, GLOBAL_USER } from './authentication';
import { toObject, toArray } from './serialization';

export type Permissions = {
  readPermissions: Array<UserID>,
  writePermissions: Array<UserID>,
};

export function CantWriteAsGlobalError() {
  return new UserAuthenticationError(
    'There was an attempt to write a resource as the GLOBAL_USER, '+
    'which is not allowed.'
  );
}

export const toPermissions = (value: mixed): Permissions => (
  toObject(value, objectValue => ({
    readPermissions: toArray(objectValue.readPermissions, toUserId),
    writePermissions: toArray(objectValue.writePermissions, toUserId),
  }))
);

export const canUserWrite = (permiss: Permissions, userId: UserID) => {
  return permiss.writePermissions.includes(userId) &&
    userId !== GLOBAL_USER.userId;
};

export const canUserRead = (permiss: Permissions, userId: UserID) => {
  return permiss.readPermissions.includes(userId) ||
    permiss.readPermissions.includes(GLOBAL_USER.userId);
};
