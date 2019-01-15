// @flow
import type { UserService } from '../user';
import type { User } from '../../lib/user';

export const buildBasicUserService = (
  defaultUser: User,
): UserService => {
  const getUser = async () => {
    return defaultUser;
  };
  return {
    getUser,
  };
};
