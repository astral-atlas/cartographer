// @flow
/*::
import type { EventLogger } from './services/log.2';
import type { UserService } from './services/userService';
import type { SessionService } from './services/atlas/sessionService';
import type { SpellService } from './services/atlas/spellService';
import type { Config } from './models/config';
//import type { EncounterService } from './services/atlas/encounter';
*/
const { createUserRoutes } = require('./routes/users.2');
const { createSessionRoutes } = require('./routes/sessionRoutes');
//const { createEncounterRoutes } = require('./routes/encounter');
const { createSpellRoutes } = require('./routes/spellRoutes');

const createRoutes = async (
  logger/*: EventLogger*/,
  userService/*: UserService*/,
  sessionService/*: SessionService*/,
  spellService/*: SpellService*/,
  config/*: Config*/,
  //encounterService/*: EncounterService*/,
) => {
  const userRoute = createUserRoutes(logger, config, userService);
  const sessionRoutes = createSessionRoutes(logger, config, sessionService);
  const spellRoutes = createSpellRoutes(spellService, logger, config);
  //const encounterRoutes = createEncounterRoutes(logger, encounterService);

  return [
    ...userRoute,
    ...sessionRoutes,
    ...spellRoutes,
    //...encounterRoutes,
  ];
};

module.exports = {
  createRoutes,
};