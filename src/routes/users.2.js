// @flow
const { createRESTRoute, createRESTResponse } = require('@lukekaalim/server');
const { toUserID } = require('../models/user');
const { enhanceRouteWithMiddleware } = require('./routeMiddleware');
const { errorRoute } = require('../events/routeEvents');
/*::
import type { UserService } from '../services/userService.2';
import type { EventLogger } from '../services/log.2';
*/

const ok =                  body => createRESTResponse(200, body);
const invalidRequest =      body => createRESTResponse(400, body);
const notFound =            body => createRESTResponse(404, body);
const internalServerError = body => createRESTResponse(500, body);

const createUserRoutes = (logger/*: EventLogger*/, userService/*:UserService*/) => {
  const createRouteWithMiddleware = enhanceRouteWithMiddleware(logger, createRESTRoute);

  const getUsers = createRouteWithMiddleware('GET', '/users', async (query) => {
    const allUsersResult = await userService.getAllUsers();
    if (allUsersResult.type === 'failure') {
      logger.log(errorRoute(allUsersResult.failure.internalError.message, allUsersResult.failure.internalError.stack));
      return internalServerError(JSON.stringify({ message: 'There was an issue with the User Service' }));
    }
    return ok(JSON.stringify(allUsersResult.success));
  });

  const postUser = createRouteWithMiddleware('POST', '/users', async (query) => {
    const user = await userService.addUser();
    return ok(JSON.stringify(user));
  });

  const deleteUser = createRouteWithMiddleware('DELETE', '/users', async (query) => {
    const queryUserId = query.get('userID')
    if (!queryUserId) {
      return invalidRequest();
    }
    const userId = toUserID(queryUserId);
    await userService.deleteUser(userId);
    return ok(JSON.stringify(userId));
  });

  return [getUsers, postUser, deleteUser];
};

module.exports = {
  createUserRoutes,
};