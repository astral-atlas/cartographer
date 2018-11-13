//@flow
import type { LoggingService } from './logging';
import type { StorageService } from './storage';
import type { ScribeConfig } from '../config';
import { AtlasScribeError } from '../errors';
import { buildLoggingService } from './logging';
import { buildLocalStorageService } from './storage/localStorage';

export type Services = {
  logging: LoggingService,
  storage: StorageService,
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

export const buildServices = async (conf: ScribeConfig) => ({
  logging: buildLoggingService(conf.services.logging),
  storage: buildLocalStorageService(conf.services.localStorage),
});