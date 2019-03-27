// @flow
import type { UserService } from '../services/user';
import type { RoleService } from '../services/role';

import { ok, internalServerError } from '../lib/routeHandlerOutput';
import {
  createStdRouteFromApiRoute,
  createStdRouteFromOptionsRoute,
} from '../lib/route';
import { toUserId } from '../lib/user';

const corsOptions = {
  origin: 'http://localhost:5000',
  allowedMethods: ['GET'],
  exposedHeaders: ['ETag'],
  allowedHeaders: ['user-id'],
};

export const createUserRoutes = (
  userService: UserService,
  roleService: RoleService,
) => {
  const getUsersHandler = async () => {
    try {
      return ok(await userService.getAllUsers());
    } catch (err) {
      return internalServerError();
    }
  };

  const getRolesHandler = async (inc) => {
    try {
      const userId = toUserId(inc.queries.get('userId'));
      const roleIds = await roleService.getRolesForUser(userId);
      const roles = await Promise.all(roleIds.map(roleId => roleService.getRole(roleId)));
      return ok(roles);
    } catch (err) {
      return internalServerError();
    }
  };

  const getUserRoute = {
    path: '/users',
    handler: getUsersHandler,
    method: 'GET',
    corsOptions,
  };
  const getRolesRoute = {
    path: '/users/roles',
    handler: getRolesHandler,
    method: 'GET',
    corsOptions,
  };
  const usersOptionsRoute = {
    path: '/users',
    corsOptions,
  };
  const rolesOptionsRoute = {
    path: '/users/role',
    corsOptions,
  };

  return [
    createStdRouteFromApiRoute(getUserRoute),
    createStdRouteFromOptionsRoute(usersOptionsRoute),
    createStdRouteFromApiRoute(getRolesRoute),
    createStdRouteFromOptionsRoute(rolesOptionsRoute),
  ];
};
