// @flow
/*::
import type { EventLogger } from './services/log.2';
import type { UserService } from './services/userService.2';
import type { EncounterService } from './services/atlas/encounter';
*/
const { createUserRoutes } = require('./routes/users.2');
const { createEncounterRoutes } = require('./routes/encounter');

const createRoutes = async (
  logger/*: EventLogger*/,
  userService/*: UserService*/,
  encounterService/*: EncounterService*/,
) => {
  const userRoute = createUserRoutes(logger, userService);
  //const encounterRoutes = createEncounterRoutes(logger, encounterService);

  return [
    ...userRoute,
    //...encounterRoutes,
  ];
};

module.exports = {
  createRoutes,
};