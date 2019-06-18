// @flow
import { createServer } from 'http';
import { join, isAbsolute } from 'path';
import { createRoutes } from './routes.2';
import { toArray } from './lib/typing';
import { createJSONStreamLog } from './services/log/streamLog';
import { createS3Service } from './services/s3Storage';
import { createDirService, createFileService } from './services/fsStorage';
import { createSerializedStorageService, createSerializedStorageService2 } from './services/storage.2';
import { createUserService } from './services/userService.2';
import { toUser, toUserID } from './models/user';
import { createRouteResponseEvent, createRouteErrorEvent } from './events/routeEvents';
import {
  createApplicationPortBindEvent,
  createApplicationStartupEvent,
  createApplicationShutdownEvent,
  createApplicationLoadConfigEvent,
} from './events/applicationEvents';
/*::
import type { Config } from './lib/config';
*/

class UnimplementedError extends Error {}

const createStorage = (storageConfig) => {
  switch (storageConfig.type) {
    case 'local-json':
      const storageRoot = isAbsolute(storageConfig.storageRootDir) ?
        storageConfig.storageRootDir :
        join(process.cwd(), storageConfig.storageRootDir);
      const usersDirectory = createDirService(join(storageRoot, 'users'), '.json');
      const usersIdFile = createFileService(join(storageRoot, 'userIds.json'));
      const userStorage = createSerializedStorageService(usersDirectory, toUser);
      const userIdStorage = createSerializedStorageService2(usersIdFile, toArray(toUserID));
      return {
        userStorage,
        userIdStorage,
      };
    case 's3-json':
    default:
      throw new UnimplementedError('Didnt do this yet lol');
  }
};

const createLogService = (logType) => {
  switch (logType) {
    case 'stdout':
      return createJSONStreamLog(process.stdout);
    default:
      return (logType/*: empty*/);
  }
};

export const createCartographer = async (config/*:: :Config*/) => {
  const logService = createLogService(config.logging);
  logService.logEvent(createApplicationLoadConfigEvent(config.name));
  const { userIdStorage, userStorage } = createStorage(config.storage);
  const userService = createUserService(userIdStorage, userStorage);
  const routes = await createRoutes(logService, userService);

  const listener = (inc, res) => {
    const route = routes.find(route => route.test(inc));
    if (!route) {
      logService.logEvent(createRouteResponseEvent(inc.url, inc.method, 404));
      res.statusCode = 404;
      res.end();
      return;
    }
    route.handler(inc, res);
  };

  const server = createServer(listener);

  const start = async () => new Promise(res => {
    logService.logEvent(createApplicationStartupEvent());
    server.listen(config.port, () => {
      logService.logEvent(createApplicationPortBindEvent(config.port));
      res();
    });
  });

  const stop = async () => new Promise(res => {
    logService.logEvent(createApplicationShutdownEvent());
    server.close(() => {
      res();
    });
  });

  return {
    start,
    stop,
  }
};