// @flow
const { createRESTRoute, createRESTResponse } = require('@lukekaalim/server');
const { toUserID } = require('../models/user');
const { enhanceRouteWithMiddleware } = require('./routeMiddleware');
const { errorRoute } = require('../events/routeEvents');
const { handleResult } = require('../lib/result');
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
  const defaultErrorResponse = (error) => {
    logger.log(errorRoute(error));
    return internalServerError(JSON.stringify({ message: 'There was an issue with the User Service' }));
  };

  const getUsers = createRouteWithMiddleware('GET', '/users', async (query) => {
    // Depending on if you present the ?userId=${userid} query, we show all of the users, or just one in detail
    if (query.has('userId')) {
      const userId = toUserID(query.get('userId'));
      const getUserResult = await userService.getUser(userId);
      return handleResult(getUserResult,
        user => ok(JSON.stringify(user)),
        error => defaultErrorResponse(error)
      );
    } else {
      const allUsersResult = await userService.getAllUsers();
      return handleResult(allUsersResult,
        allUsers => ok(JSON.stringify(allUsers.map(user => user.id))),
        error => defaultErrorResponse(error)
      );
    }
  });

  const postUser = createRouteWithMiddleware('POST', '/users', async (query) => {
    const userResult = await userService.addUser();
    return handleResult(userResult,
      user => ok(JSON.stringify(user)),
      error => defaultErrorResponse(error)
    );
  });

  const deleteUser = createRouteWithMiddleware('DELETE', '/users', async (query) => {
    const queryUserId = query.get('userId')
    if (!queryUserId) {
      return invalidRequest();
    }
    const userId = toUserID(queryUserId);
    const deletionResult = await userService.deleteUser(userId);
    return handleResult(deletionResult,
      () => ok(JSON.stringify(userId)),
      error => defaultErrorResponse(error)
    );
  });

  return [getUsers, postUser, deleteUser];
};

module.exports = {
  createUserRoutes,
};