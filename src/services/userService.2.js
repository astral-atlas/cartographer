// @flow
const { createUser } = require('../models/user');
/*::
import type { User, UserID } from '../models/user';
import type { Storage } from './storage.2';

export type UserService = {
  getAllUsers: () => Promise<Array<User>>,
  addUser: () => Promise<User>,
  deleteUser: (userId: UserID) => Promise<void>,
};
*/

const createUserService = (
  userIdStorage/*: Storage<null, Array<UserID>>*/,
  userStorage/*: Storage<UserID, User>*/,
)/*: UserService*/ => {
  const getAllUsers = async () => {
    const userIds = await userIdStorage.read(null);
    const users = await Promise.all(userIds.map(id => userStorage.read(id)));
    return users;
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