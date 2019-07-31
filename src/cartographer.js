// @flow
/*::
import type { Config } from './models/config';
*/
const { createServer } = require('http');
const { join } = require('path');

const { createRoutes } = require('./routes.2');
const { createJSONStreamLog } = require('./services/log/streamLog');
const { createStorage } = require('./services/storage.2');
const { createUserService } = require('./services/userService.2');
const { createEncounterService } = require('./services/atlas/encounter');

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

class UnhandledRouteError extends Error {
  constructor(url) {
    return super(`No Route found for the url: "${url}"`);
  }
}

const createListener = (routes, { log }) => {
  const listener = (inc, res) => {
    const route = routes.find(route => route.test(inc));
    if (!route) {
      const error = new UnhandledRouteError(inc.url);
      log(errorRoute(error.message, error.stack));
      log(respondRoute(inc.url, inc.method, 404));
      res.statusCode = 404;
      res.end();
      return;
    }
    route.handler(inc, res);
  };
  return listener;
};

const createCartographer = async (config/*: Config*/) => {
  const logger = createLogService('stdout');

  const { users, userIds, encounters } = await createStorage(config.storage);
  const userService = createUserService(userIds, users);
  const encounterService = createEncounterService(encounters);
  const routes = await createRoutes(logger, userService, encounterService);

  const server = createServer(createListener(routes, logger));

  const stop = async () => new Promise(res => {
    logger.log(appShutdown());
    server.close(res);
  });

  server.listen(config.port, () => logger.log(boundPort(config.port)));

  return {
    stop,
  }
};

module.exports = {
  createCartographer,
};