// @flow strict
const { ok, createRoute, internalServerError, badRequest } = require('@lukekaalim/server');
const { toUserID } = require('../models/user');
const { createSTDMiddlewareEnhancer } = require('./routeMiddleware');
const { errorRoute } = require('../events/routeEvents');
const { handleResult } = require('../lib/result');
/*::
import type { UserService } from '../services/userService';
import type { EventLogger } from '../services/log.2';
import type { Config } from '../models/config';
import type { Route } from '@lukekaalim/server';
*/

const createUserRoutes = (
  logger/*: EventLogger*/,
  config/*: Config*/,
  userService/*: UserService*/
)/*: Array<Route>*/ => {
  const enhanceRoute = createSTDMiddlewareEnhancer(logger, config);

  const listUsersRoute = createRoute('/users', 'GET', async (request) => {
    const allUsersResult = await userService.getAllUsers();
    if (allUsersResult.type === 'failure')
      return internalServerError('There was an error in the User Service');
    return ok(JSON.stringify(allUsersResult.success));
  });

  const addUserRoute = createRoute('/users', 'POST', async (request) => {
    const addUserResult = await userService.addUser();
    if (addUserResult.type === 'failure')
      return internalServerError('There was an error in the User Service');
    return ok(JSON.stringify(addUserResult.success));
  });

  const deleteUserRoute = createRoute('/users', 'DELETE', async (request) => {
    const queryUserId = request.query.get('userId')
    if (queryUserId === undefined) {
      return badRequest('Missing ?userId=${UserID}');
    }
    const userId = toUserID(queryUserId);
    const getUserResult = await userService.getUser(userId);
    if (getUserResult.type === 'failure') {
      return internalServerError(`There was an error in the User Service, could not retrieve user "${userId}"`);
    }
    const deleteUserResult = await userService.deleteUser(userId);
    if (deleteUserResult.type === 'failure')
      return internalServerError(`There was an error in the User Service, could not delete user "${userId}"`);
    return ok();
  });

  return [
    listUsersRoute,
    addUserRoute,
    deleteUserRoute
  ].map(enhanceRoute);
};

module.exports = {
  createUserRoutes,
};