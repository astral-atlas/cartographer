// @flow
import { InternalServiceError } from '../../services';

export type Storage<T> = {
  put: (key: string, contents: T) => Promise<void>,
  get: (key: string) => Promise<T>,
};

export function KeyNotFoundError(
  serviceName: string,
  key: string, message: string,
) {
  return new InternalServiceError(
    serviceName,
    `Could not locate the resource at the Key: "${key}".\n${message}`
  );
}
