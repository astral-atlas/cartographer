// @flow
import type { UserService } from '../services/user';

import { buildApiRoutes, ok, internalServerError } from '../lib/apiRoute';

export const buildUserRoutes = (
  userService: UserService,
) => {
  const getUsersHandler = async () => {
    try {
      return ok(await userService.getAllUsers());
    } catch (err) {
      return internalServerError();
    }
  };

  const getUserRoute = {
    path: '/users',
    handler: getUsersHandler,
    method: 'GET',
  };

  return buildApiRoutes([getUserRoute]);
};
