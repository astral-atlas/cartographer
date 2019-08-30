// @flow strict
/*::
import type { Result } from '../lib/result';
*/

class StorageServiceError extends Error {
  internalError/*: Error*/;
  constructor(internalError/*: Error*/) {
    super('There was an issue reading or writing from/to the underlying storage');
    this.internalError = internalError;
  }
}

/*::
type NotCreatedFailure = {
  type: 'not-created',
};
type AlreadyCreatedFailure = {
  type: 'already-created',
};
type InternalErrorFailure = {
  type: 'error',
  error: StorageServiceError,
};
*/

/*::
export type ReadStorageValue<T> = {
  read: () => Promise<Result<T, NotCreatedFailure | InternalErrorFailure>>,
};
export type WriteStorageValue<T> = {
  create: (value: T) => Promise<Result<void, AlreadyCreatedFailure | InternalErrorFailure>>,
  update: (value: T) => Promise<Result<void, NotCreatedFailure | InternalErrorFailure>>,
  destroy: () => Promise<Result<void, NotCreatedFailure | InternalErrorFailure>>,
};
*/

module.exports = {
  StorageServiceError,
};