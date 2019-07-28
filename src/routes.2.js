// @flow
/*::
import type { EventLogger } from './services/log.2';
import type { UserService } from './services/userService.2';
*/
import { createUserRoutes } from './routes/users.2';

export const createRoutes = async (
  logger/*: EventLogger*/,
  userService/*: UserService*/,
) => {
  const userRoute = createUserRoutes(logger, userService);

  return [
    ...userRoute,
  ];
};
