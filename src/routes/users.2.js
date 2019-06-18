// @flow
import { createRESTRoute } from '../lib/route.2';
import { ok, internalServerError } from '../lib/response';
import { readStream } from '../lib/stream';
import { toString } from '../lib/typing';
import { toUserID } from '../models/user';
import { createRouteErrorEvent, createRouteResponseEvent } from '../events/routeEvents';
/*::
import type { UserService } from '../services/userService.2';
import type { LogService } from '../services/log.2';
*/

export const createUserRoutes = (logService/*: LogService*/, userService/*:UserService*/) => {
  const getUsers = createRESTRoute('/users', async (query) => {
    try {
      const allUsers = await userService.getAllUsers();
      logService.logEvent(createRouteResponseEvent('/users', 'GET', 200));
      return ok(allUsers);
    } catch (error) {
      logService.logEvent(createRouteErrorEvent(error.message, error.stack));
      logService.logEvent(createRouteResponseEvent('/users', 'GET', 500));
      return internalServerError();
    } 
  }, 'GET');

  const postUser = createRESTRoute('/users', async (query, headers, body) => {
    try {
      const userName = toString(JSON.parse(await readStream(body)), 'userName');
      const user = await userService.addUser(userName);
      logService.logEvent(createRouteResponseEvent('/users', 'POST', 200));
      return ok(user);
    } catch (error) {
      logService.logEvent(createRouteErrorEvent(error.message, error.stack));
      logService.logEvent(createRouteResponseEvent('/users', 'POST', 500));
      return internalServerError();
    } 
  }, 'POST');

  const deleteUser = createRESTRoute('/users', async (query) => {
    try {
      const [,queryUserId] = query.find(([queryName]) => queryName === 'userId') || [];
      const userId = toUserID(queryUserId);
      await userService.deleteUser(userId);
      logService.logEvent(createRouteResponseEvent('/users', 'DELETE', 200));
      return ok();
    } catch (error) {
      logService.logEvent(createRouteErrorEvent(error.message, error.stack));
      logService.logEvent(createRouteResponseEvent('/users', 'DELETE', 500));
      return internalServerError();
    } 
  }, 'DELETE');

  return [getUsers, postUser, deleteUser];
};