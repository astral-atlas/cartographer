// @flow
import type { UserService } from '../services/user';

import { ok, internalServerError, addHeaders } from '../lib/routeHandlerOutput';
import {
  createStdRouteFromApiRoute,
  createStdRouteFromOptionsRoute,
} from '../lib/route';

export const buildUserRoutes = () => console.warn('DEPRECATED METHOD CALL: buildUserRoutes()') || []; // eslint-disable-line no-console

export const createUserRoutes = (
  userService: UserService,
) => {
  const getUsersHandler = async () => {
    try {
      return addHeaders(ok(await userService.getAllUsers()), new Map([['TestHeader', 'Testvalue']]));
    } catch (err) {
      return internalServerError();
    }
  };

  const corsOptions = {
    origin: 'http://localhost:5000',
    allowedMethods: ['GET'],
    exposedHeaders: ['ETag'],
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
