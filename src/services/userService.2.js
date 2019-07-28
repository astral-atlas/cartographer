// @flow
import { createUser } from '../models/user';
/*::
import type { User, UserID } from '../models/user';

export type UserService = {
  getAllUsers: () => Promise<Array<User>>,
  addUser: () => Promise<User>,
  deleteUser: (userId: UserID) => Promise<void>,
};
*/

export const createUserService = (
  userIdStorage/*: { read: () => Promise<Array<UserID>>, write: (userIds: Array<UserID>) => Promise<void> }*/,
  userStorage/*: { read: (key: string) => Promise<User>, write: (key: string, user: User) => Promise<void> }*/,
)/*: UserService*/ => {
  const getAllUsers = async () => {
    const userIds = await userIdStorage.read();
    const users = await Promise.all(userIds.map(id => userStorage.read(id)));
    return users;
  };
  const addUser = async () => {
    const user = createUser();
    await userStorage.write(user.id, user);
    const userIds = await userIdStorage.read();
    await userIdStorage.write([...userIds, user.id]);
    return user;
  };
  const deleteUser = async (userIdToRemove) => {
    const userIds = await userIdStorage.read();
    await userIdStorage.write(userIds.filter(userId => userId !== userIdToRemove));
  };

  return {
    getAllUsers,
    addUser,
    deleteUser,
  }
};