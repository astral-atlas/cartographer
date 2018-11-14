//@flow
import type { LoggingService } from './logging';
import type { ChaptersService } from './scribe/chapters';
import type { ScribeConfig } from '../config';

import { AtlasScribeError } from '../errors';
import { buildLoggingService } from './logging';
import { buildLocalStorageService } from './storage/localStorage';
import { buildLockableStorage } from './storage/lockableStorage';
import { buildMemoryLock } from './memoryLock';
import { buildChapterService } from './scribe/chapters';

export type Services = {
  logging: LoggingService,
  scribe: {
    chapters: ChaptersService,
  }
};

/**
 * Throw this error to describe any generic issue that happened in a service.
 */
export function InternalServiceError(serviceName: string, message: string) {
  return new AtlasScribeError(`${message}\nThe service ${serviceName} threw an exception`);
}

/**
 * Throw this error to describe any generic issue that occured during a service's startup
 */
export function InternalServiceInitializationError(serviceName: string, message: string) {
  return new InternalServiceError(serviceName, `${message}\nWhile initializing`);
}

/**
 * Try to catch any non-scribe errors, but re-throw scribe error if we do catch any.
 */
export const tryBuildService = <TService>(serviceName: string, serviceBuilder: () => TService): TService => {
  try {
    return serviceBuilder();
  } catch (err) {
    if (err instanceof AtlasScribeError) {
      throw err;
    }
    throw new InternalServiceError(serviceName, err.message);
  }
};

export const buildServices = async (conf: ScribeConfig) => {
  const logging = buildLoggingService(conf.services.logging);
  const localStorage = buildLocalStorageService(conf.services.localStorage);
  const memoryLock = buildMemoryLock();
  const lockStore = buildLockableStorage(localStorage, memoryLock);
  const chapters = buildChapterService(lockStore);

  return {
    scribe: { chapters },
    logging,
  };
};
