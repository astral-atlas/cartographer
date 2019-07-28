// @flow
/*::
import type { Config } from './lib/config';
*/
import { createServer } from 'http';
import { join } from 'path';

import { createRoutes } from './routes.2';
import { toArray } from './lib/typing';
import { createJSONStreamLog } from './services/log/streamLog';
import { createStorage } from './services/storage.2';
import { createUserService } from './services/userService.2';
import { toUser, toUserID } from './models/user';
import { respondRoute, createRouteErrorEvent } from './events/routeEvents';
import { boundPort, appShutdown } from './events/applicationEvents';

const createLogService = (logType) => {
  switch (logType) {
    case 'stdout':
      return createJSONStreamLog(process.stdout);
    default:
      return (logType/*: empty*/);
  }
};

const createListener = (routes, { log }) => {
  const listener = (inc, res) => {
    const route = routes.find(route => route.test(inc));
    if (!route) {
      log(respondRoute(inc.url, inc.method, 404));
      res.statusCode = 404;
      res.end();
      return;
    }
    route.handler(inc, res);
  };
  return listener;
};

export const createCartographer = async (config/*:: :Config*/) => {
  const logger = createLogService(config.logging);

  const { users, userIds } = createStorage(config.storage);
  const userService = createUserService(users, userIds);
  const routes = await createRoutes(logger, userService);

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