// @flow
import type { UserService } from '../user';
import type { User } from '../../lib/user';

export const buildBasicUserService = (
  defaultUser: User,
  users: Array<User>,
): UserService => {
  const getUser = async (inc) => {
    if (!inc.headers.has('USER_ID')) {
      return defaultUser;
    }
    const userId = inc.headers.get('USER_ID');
    const user = users.find(user => user.id === userId);
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
