// @flow
import type { Storage } from '../storage';
import type { MassLocker } from '../locker/massLocker';
import { InternalServiceError } from '../../services';

/**
 * This interface describes a storage mechanism that can create an atomic lock on a resource.
 * The atomic service that has been passed in can only operate on the keys specified in the
 */
export type SafeStorage<T> = {
  doWithSafeStorage: (
    keys: Array<string>,
    operation: (storage: Storage<T>) => Promise<void>,
  ) => Promise<void>,
  get: (key: string) => Promise<T>,
};

function MaxUnlockRetriesExceededError(retryCount, keys) {
  return new InternalServiceError(
    'Safe Storage',
    `Tried ${retryCount} times, but could not get a lock on `+
    `the following keys:\n${keys.join('\n')}`
  );
}

export const buildSafeStorage = <T>(
  storage: Storage<T>,
  { massUnlock }: MassLocker,
  retryMs?: number = 100,
  maxRetries?: number = 100,
): SafeStorage<T> => {
  const doWithSafeStorage = async (keys, operation, retryCount = 0) => {
    const lockInfo = await massUnlock(keys);
    if (lockInfo.result === 'failed') {
      if (retryCount > maxRetries) {
        throw new MaxUnlockRetriesExceededError(retryCount, keys);
      }
      // Randomness is important, because if the deadlocks are in sync
      // then having fixed retry times might result in the same deadlock.
      const timeUntilRetry = Math.floor(Math.random() * retryMs);
      await new Promise(resolve => setInterval(resolve, timeUntilRetry));
      return await doWithSafeStorage(keys, operation, retryCount + 1);
    }
    await operation({
      put: (key, contents) => storage.put(key, contents),
      get: storage.get,
    });
    lockInfo.relock();
  };

  return {
    doWithSafeStorage,
    get: storage.get,
  };
};
