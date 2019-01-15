//@flow
import { AtlasScribeError } from '../errors';

/**
 * Throw this error to describe any generic issue that happened in a service.
 */
export class InternalServiceError extends AtlasScribeError {
  constructor(serviceName: string, message: string) {
    super(
      `The service ${serviceName} threw an exception\n${message}`
    );
  }
}

export const ServiceError = InternalServiceError;
