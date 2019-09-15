// @flow
/*::
import type { Config } from './models/config';
*/
const { createServer } = require('http');
const { join } = require('path');
const { createListener, notFound } = require('@lukekaalim/server');

const { createRoutes } = require('./routes.2');

const { createAuthService } = require('./services/authentication');
const { createJSONStreamLog } = require('./services/log/streamLog');
//const { createStorage } = require('./services/storage');
const { createMemoryMapStore } = require('./services/storage');
const { createUserService } = require('./services/userService');
const { createSessionService } = require('./services/atlas/sessionService');
//const { createEncounterService } = require('./services/atlas/encounter');
const { createHeartbeat } = require('./services/heartbeat');

const { toUser, toUserID } = require('./models/user');
const { respondRoute, errorRoute } = require('./events/routeEvents');
const { boundPort, appShutdown } = require('./events/applicationEvents');

const createLogService = (logType) => {
  switch (logType) {
    case 'stdout':
      return createJSONStreamLog(process.stdout);
    default:
      return (logType/*: empty*/);
  }
};

const createCartographer = async (config/*: Config*/) => {
  const logger = createLogService('stdout');
  const heart = createHeartbeat(logger, 10000);

  //const { users, userIds, encounters } = await createStorage(config.storage);
  const authService = createAuthService(config);
  const userService = await createUserService(logger, config);
  const sessionService = createSessionService(createMemoryMapStore());
  //const encounterService = createEncounterService(encounters);
  const routes = await createRoutes(logger, userService, sessionService, config);

  const server = createServer(createListener(routes, () => notFound()));

  const open = async () => new Promise(res => {
    server.listen(config.port, () => {
      logger.log(boundPort(config.port));
      res();
    });
  });

  const stop = async (reason/*: string*/ = '(Reason for shutdown not provided)') => new Promise((res, rej) => {
    heart.stop();
    logger.log(appShutdown(reason));
    server.close(err => err ? rej(err) : res());
  });


  return {
    open,
    stop,
  }
};

module.exports = {
  createCartographer,
};