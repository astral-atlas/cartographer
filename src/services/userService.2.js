// @flow
const { createUser } = require('../models/user');
const { succeed, fail } = require('../lib/result');
/*::
import type { Result } from '../lib/result';
import type { User, UserID } from '../models/user';
import type { Storage } from './storage.2';
*/

class StorageError extends Error {
  internalError/*: Error*/;
  constructor(internalError/*: Error*/) {
    super(`${internalError.message}\nThere was an error in the User Service Storage`);
    this.internalError = internalError;
  }
}

/*::
export type UserService = {
  getAllUsers: () => Promise<Result<Array<User>, StorageError>>,
  addUser: () => Promise<User>,
  deleteUser: (userId: UserID) => Promise<void>,
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
      return fail(new StorageError(internalError));
    }
  };
  const addUser = async () => {
    const user = createUser();
    await userStorage.write(user.id, user);
    const userIds = await userIdStorage.read(null);
    await userIdStorage.write(null, [...userIds, user.id]);
    return user;
  };
  const deleteUser = async (userIdToRemove) => {
    const userIds = await userIdStorage.read(null);
    await userIdStorage.write(null, userIds.filter(userId => userId !== userIdToRemove));
  };

  return {
    getAllUsers,
    addUser,
    deleteUser,
  }
};

module.exports = {
  createUserService,
};