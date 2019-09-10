// @flow
/*::
import type { EventLogger } from './services/log.2';
import type { UserService } from './services/userService';
import type { SessionService } from './services/atlas/sessionService';
//import type { EncounterService } from './services/atlas/encounter';
*/
const { createUserRoutes } = require('./routes/users.2');
const { createSessionRoutes } = require('./routes/sessionRoutes');
//const { createEncounterRoutes } = require('./routes/encounter');

const createRoutes = async (
  logger/*: EventLogger*/,
  userService/*: UserService*/,
  sessionService/*: SessionService*/,
  //encounterService/*: EncounterService*/,
) => {
  const userRoute = createUserRoutes(logger, userService);
  const sessionRoutes = createSessionRoutes(logger, sessionService);
  //const encounterRoutes = createEncounterRoutes(logger, encounterService);

  return [
    ...userRoute,
    ...sessionRoutes,
    //...encounterRoutes,
  ];
};

module.exports = {
  createRoutes,
};