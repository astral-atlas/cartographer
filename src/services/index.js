//@flow
import { AtlasScribeError } from '../errors';

/**
 * Throw this error to describe any generic issue that happened in a service.
 */
export function InternalServiceError(serviceName: string, message: string) {
  return new AtlasScribeError(`${message}\nThe service ${serviceName} threw an exception`);
}
