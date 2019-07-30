// @flow
const { createRESTRoute } = require('../lib/route.2');
const { ok, internalServerError, notFound } = require('../lib/response');
const { toUserID } = require('../models/user');
/*::
import type { UserService } from '../services/userService.2';
import type { EventLogger } from '../services/log.2';
*/

const createUserRoutes = (logger/*: EventLogger*/, userService/*:UserService*/) => {
  const createUserRoute = createRESTRoute(logger);

  const getUsers = createUserRoute('/users', async (query) => {
    const allUsers = await userService.getAllUsers();
    return ok(JSON.stringify(allUsers));
  }, 'GET');

  const postUser = createUserRoute('/users', async (query, headers) => {
    const user = await userService.addUser();
    return ok(JSON.stringify(user));
  }, 'POST');

  const deleteUser = createUserRoute('/users', async (query) => {
    const [,queryUserId] = query.find(([queryName]) => queryName === 'userId') || [, null];
    if (queryUserId === null) {
      return notFound();
    }
    const userId = toUserID(queryUserId);
    await userService.deleteUser(userId);
    return ok(JSON.stringify(userId));
  }, 'DELETE');

  return [getUsers, postUser, deleteUser];
};

module.exports = {
  createUserRoutes,
};