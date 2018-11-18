// @flow
import type { UUID } from './uuid';
import { toUUID } from './uuid';
import { toString, toObject } from './serialization';

export opaque type UserID: UUID = UUID

export type User = {
  userId: UserID,
  userName: string,
  userToken: string,
};

export type UserAuth = {
  name: string,
  token: string,
};

// By default, anybody/everybody is the global user. Dont ever
// give them write permission to anything though
export const GLOBAL_USER: User = {
  userId: toUUID('3dc51074-3e73-4fb9-ad23-3dd10ef80903'),
  userName: 'GLOBAL_USER',
  userToken: 'KOhKethK84UrqAUkON78HKVGPSz2dy',
};

export const toUserId = (value: mixed): UserID => {
  return toUUID(value);
};

export const toUser = (value: mixed): User => (
  toObject(value, (objectValue) => ({
    userId: toUserId(objectValue.userId),
    userName: toString(objectValue.userName),
    userToken: toString(objectValue.userToken),
  }))
);

export const getUserAuth = (
  headers: Map<string, string>,
): ?UserAuth => {
  const authHeader = headers.get('authorization');
  if (typeof authHeader !== 'string') {
    return null;
  }
  const [authType, credentials] = Buffer.from(authHeader, 'base64')
    .toString()
    .split(' ');
  if (authType !== 'Basic') {
    return null;
  }
  const [name, token] = credentials.split(':');
  if (!name || !token) {
    return null;
  }
  return { name, token };
};

export const getCurrentOrGlobalUser = async (
  headers: Map<string, string>,
  getUser: (name: string, token: string) => Promise<User>,
): Promise<User> => {
  const userAuth = getUserAuth(headers);
  if (userAuth) {
    const { name, token } = userAuth;
    return await getUser(name, token);
  }
  return GLOBAL_USER;
};
