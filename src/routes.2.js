// @flow
/*::
import type { EventLogger } from './services/log.2';
import type { UserService } from './services/userService.2';
*/
const { createUserRoutes } = require('./routes/users.2');

const createRoutes = async (
  logger/*: EventLogger*/,
  userService/*: UserService*/,
) => {
  const userRoute = createUserRoutes(logger, userService);

  return [
    ...userRoute,
  ];
};

module.exports = {
  createRoutes,
};