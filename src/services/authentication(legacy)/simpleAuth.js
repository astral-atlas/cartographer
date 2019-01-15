// @flow
import type { User } from '../../lib/authentication';
import type { Storage } from '../storage';
import type { Authentication } from '../authentication';
import { UserAuthenticationError } from '../authentication';
import { KeyNotFoundError } from '../storage';
import { buildScopedStorage } from '../storage/scopedStorage';
import { buildTypedStorage } from '../storage/typedStorage';
import { toUserId, toUser } from '../../lib/authentication';

class InvalidTokenError extends UserAuthenticationError {
  constructor(userId) {
    super(
      `"${userId}" Attempted to log in, but the provided user`+
      ` token did not match the recorded one`
    );
  }
}

function UserNameNotFoundError(userName) {
  return new UserAuthenticationError(
    `"${userName}" Attempted to log in, we have no record of that username`,
  );
}

const USERNAME_ID_TABLE_KEY = 'USERNAME_ID_TABLE';
const USERID_USER_TABLE_KEY = 'USERID_USER_TABLE';

export const buildSimpleAuth = (
  storage: Storage<string>,
): Authentication => {
  const idByName = buildScopedStorage(
    buildTypedStorage(storage, JSON.stringify, value => toUserId(JSON.parse(value))),
    USERNAME_ID_TABLE_KEY
  );
  const userById = buildScopedStorage(
    buildTypedStorage(storage, JSON.stringify, value => toUser(JSON.parse(value))),
    USERID_USER_TABLE_KEY
  );

  const getUser = async (userName: string, userToken: string) => {
    let userId, user;
    try {
      userId = toUserId(await idByName.get(userName));
    } catch (err) {
      if (err instanceof KeyNotFoundError) {
        throw new UserNameNotFoundError(userName);
      }
      throw err;
    }
    user = toUser(await userById.get(userId));
    if (user.userToken !== userToken) {
      throw new InvalidTokenError(userId);
    }
    return user;
  };

  return {
    getUser,
  };
};
