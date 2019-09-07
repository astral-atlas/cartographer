// @flow
const { createUser } = require('../models/user');
const { succeed, fail } = require('../lib/result');
/*::
import type { Result } from '../lib/result';
import type { User, UserID } from '../models/user';
import type { Storage } from './storage.2';
*/

class InternalUserServiceError extends Error {
  internalError/*: Error*/;
  constructor(internalError/*: Error*/) {
    super('There was an unexpected error with the User Service');
    this.internalError = internalError;
  }
}

class NoSuchUserError extends Error {
  constructor() {
    super(`This UserID does not exist`);
  }
}

/*::
export type UserService = {
  getAllUsers: () => Promise<Result<Array<User>, InternalUserServiceError>>,
  addUser: () => Promise<Result<User, InternalUserServiceError>>,
  deleteUser: (userId: UserID) => Promise<Result<User, InternalUserServiceError | NoSuchUserError>>,
  getUser: (userId: UserID) => Promise<Result<User, InternalUserServiceError | NoSuchUserError>>,
};
*/

const createUserService = (
  userIdStorage/*: Storage<null, Array<UserID>>*/,
  userStorage/*: Storage<UserID, User>*/,
)/*: UserService*/ => {
  const getAllUsers = async () => {
    try {
      const userIds = await userIdStorage.read(null);
      const users = await Promise.all(userIds.map(id => userStorage.read(id)));
      return succeed(users);
    } catch (internalError) {
      return fail(new InternalUserServiceError(internalError));
    }
  };
  const addUser = async () => {
    try {
      const user = createUser();
      await userStorage.write(user.id, user);
      const userIds = await userIdStorage.read(null);
      await userIdStorage.write(null, [...userIds, user.id]);
      return succeed(user);
    } catch (error) {
      return fail(new InternalUserServiceError(error));
    }
  };
  const deleteUser = async (userIdToRemove) => {
    const userIds = await userIdStorage.read(null);
    await userIdStorage.write(null, userIds.filter(userId => userId !== userIdToRemove));
    return succeed(await userStorage.read(userIdToRemove));
  };
  const getUser = async (userId) => {
    try {
      const userIds = await userIdStorage.read(null);
      if(userIds.includes(userId)) {
        return succeed(await userStorage.read(userId));
      }
      return fail(new NoSuchUserError());
    } catch (error) {
      throw error;
    }
  }

  return {
    getAllUsers,
    addUser,
    deleteUser,
    getUser,
  }
};

module.exports = {
  createUserService,
};