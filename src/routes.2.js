// @flow
/*::
import type { LogService } from './services/log.2';
import type { UserService } from './services/userService.2';
*/
import { createUserRoutes } from './routes/users.2';

export const createRoutes = async (
  logService/*: LogService*/,
  userService/*: UserService*/,
) => {
  const userRoute = createUserRoutes(logService, userService);

  return [
    ...userRoute,
  ];
};
