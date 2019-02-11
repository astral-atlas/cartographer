// @flow
import type { UserService } from '../user';
import type { User } from '../../lib/user';

export const buildBasicUserService = (
  defaultUser: User,
  users: Array<User>,
): UserService => {
  const getUser = async (inc) => {
    const userName = inc.headers.get('user');
    const user = users.find(user => user.name === userName);
    if (!user) {
      throw new Error('User Not Found');
    }
    return user;
  };
  const getAllUsers = async () => {
    return users;
  };
  return {
    getUser,
    getAllUsers,
  };
};
