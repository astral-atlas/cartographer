// @flow
import type { ScribeConfig } from './config';
import type { ScribeRoute } from './routes';

import { buildStdoutLogger } from './services/logger/stdLogger';
import { buildErrorLogger } from './services/logger/errorLogger';

import { buildSafeStorage } from './services/storage/safeStorage';
import { buildLocalStorage } from './services/storage/localStorage';
import { buildScopedStorage } from './services/storage/scopedStorage';

import { buildMemoryLocker } from './services/locker/memoryLocker';
import { buildMassLocker } from './services/locker/massLocker';

import { buildSimpleAuth } from './services/authentication/simpleAuth';

import { buildScribe } from './services/scribe';

import { buildFallbackRoute } from './routes/lifecycle';
import { buildChapterRoutes } from './routes/chapters';

export const buildAppRoutes = async (
  conf: ScribeConfig,
): Promise<Array<ScribeRoute>> => {
  const logger = buildStdoutLogger();
  const errorLogger = buildErrorLogger(logger);
  const localStorage = buildLocalStorage(conf.services.storageRootDirectory);
  const locker = buildMassLocker(buildMemoryLocker());
  const safeStorage = buildSafeStorage(buildScopedStorage(localStorage, 'SAFE'), locker);
  const scribe = buildScribe(safeStorage);
  const authentication = buildSimpleAuth(buildScopedStorage(localStorage, 'AUTH'));

  return [
    ...buildChapterRoutes(scribe, errorLogger, authentication),
    ...buildFallbackRoute(logger),
  ];
};
