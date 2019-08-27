// @flow
/*::
import type { Config } from './models/config';
*/
const { createServer } = require('http');
const { join } = require('path');
const { createListener } = require('@lukekaalim/server');

const { createRoutes } = require('./routes.2');
const { createJSONStreamLog } = require('./services/log/streamLog');
const { createStorage } = require('./services/storage.2');
const { createUserService } = require('./services/userService.2');
const { createEncounterService } = require('./services/atlas/encounter');
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

class UnhandledRouteError extends Error {
  constructor(url) {
    return super(`No route found @ "${url}"`);
  }
}

class UnknownRouteError extends Error {
  constructor(url) {
    return super(`An uncaught error was throw by a route @ "${url}"`);
  }
}

const onNotFound = (logger) => (inc, res) => {
  const error = new UnhandledRouteError(inc.url);
  logger.log(errorRoute(error.message, error.stack));
  logger.log(respondRoute(inc.url, inc.method, 404));
  res.writeHead(404);
  res.end();
};

const onError = (logger) => (inc, res) => {
  const error = new UnknownRouteError(inc.url);
  logger.log(errorRoute(error.message, error.stack));
  logger.log(respondRoute(inc.url, inc.method, 500));
  res.writeHead(500);
  res.end();
};

const createCartographer = async (config/*: Config*/) => {
  const logger = createLogService('stdout');
  const heart = createHeartbeat(logger, 10000);

  const { users, userIds, encounters } = await createStorage(config.storage);
  const userService = createUserService(userIds, users);
  const encounterService = createEncounterService(encounters);
  const routes = await createRoutes(logger, userService, encounterService);

  const server = createServer(createListener(routes, onNotFound(logger), onError(logger)));

  const stop = async () => new Promise((res, rej) => {
    heart.stop();
    logger.log(appShutdown());
    server.close(err => err ? rej(err) : res());
  });

  server.listen(config.port, () => logger.log(boundPort(config.port)));

  return {
    stop,
  }
};

module.exports = {
  createCartographer,
};