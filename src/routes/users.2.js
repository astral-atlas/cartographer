// @flow
const { createRESTRoute, createRESTResponse } = require('@lukekaalim/server');
const { toUserID } = require('../models/user');
const { enhanceRouteWithMiddleware } = require('./routeMiddleware');
const { errorRoute } = require('../events/routeEvents');
const { handleResult } = require('../lib/result');
const { createOPTIONSRoute } = require('../lib/route');
/*::
import type { UserService } from '../services/userService';
import type { EventLogger } from '../services/log.2';
*/

const ok =                  body => createRESTResponse(200, body);
const invalidRequest =      body => createRESTResponse(400, body);
const notFound =            body => createRESTResponse(404, body);
const internalServerError = body => createRESTResponse(500, body);

const corsSettingsMap = new Map([
  ['localhost', {
    originAllowed: true,
    allowCredentials: false,
    exposedHeadersAllowed: [],
    headersAllowed: [],
    maxAgeSeconds: 60,
    methodsAllowed: ['GET', 'POST', 'DELETE', 'OPTIONS']
  }],
]);

const createUserRoutes = (logger/*: EventLogger*/, userService/*: UserService*/) => {
  const createRoute = enhanceRouteWithMiddleware(logger, createRESTRoute, corsSettingsMap);
  const defaultErrorResponse = (error) => {
    logger.log(errorRoute(error));
    return internalServerError(JSON.stringify({ message: 'There was an issue with the User Service' }));
  };

  const headUsers = createOPTIONSRoute('/users', corsSettingsMap);

  const getUsers = createRoute('GET', '/users', async (query) => {
    // Depending on if you present the ?userId=${userid} query, we show all of the users, or just one in detail
    if (query.has('userId')) {
      const userId = toUserID(query.get('userId'));
      const getUserResult = await userService.getUser(userId);
      return handleResult(getUserResult,
        user => ok(JSON.stringify(user)),
        error => notFound(JSON.stringify({ message: `User ${userId} does not exist` })),
      );
    } else {
      const allUsersResult = await userService.getAllUsers();
      return handleResult(allUsersResult,
        allUsers => ok(JSON.stringify(allUsers.map(user => user.id))),
        error => defaultErrorResponse(error)
      );
    }
  });

  const postUser = createRoute('POST', '/users', async (query) => {
    const userResult = await userService.addUser();
    return handleResult(userResult,
      user => ok(JSON.stringify(user)),
      error => defaultErrorResponse(error)
    );
  });

  const deleteUser = createRoute('DELETE', '/users', async (query) => {
    const queryUserId = query.get('userId')
    if (!queryUserId) {
      return invalidRequest();
    }
    const userId = toUserID(queryUserId);
    return handleResult(await userService.getUser(userId),
      async (user) => handleResult(await userService.deleteUser(userId),
        () => ok(JSON.stringify(userId)),
        error => defaultErrorResponse(error)
      ),
      error => notFound(JSON.stringify({ message: `User ${userId} does not exist` })),
    );
  });

  return [getUsers, postUser, deleteUser];
};

module.exports = {
  createUserRoutes,
};