// @flow
import type { UserService } from '../services/user';

import { ok, internalServerError } from '../lib/routeHandlerOutput';
import {
  createStdRouteFromApiRoute,
  createStdRouteFromOptionsRoute,
} from '../lib/route';

const corsOptions = {
  origin: 'http://localhost:5000',
  allowedMethods: ['GET'],
  exposedHeaders: ['ETag'],
  allowedHeaders: ['USER_ID'],
};

export const createUserRoutes = (
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
    corsOptions,
  };
  const usersOptionsRoute = {
    path: '/users',
    corsOptions,
  };

  return [
    createStdRouteFromApiRoute(getUserRoute),
    createStdRouteFromOptionsRoute(usersOptionsRoute),
  ];
};
