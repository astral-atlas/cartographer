// @flow
import type { SerializableValue } from '../../types';
import type { StorageService } from '../storage';
import type { MemoryLockService } from '../memoryLock';

/**
 * This interface describes a storage mechanism that can create an atomic lock on a resource.
 * The atomic service that has been passed in can only operate on the keys specified in the
 */
export type LockableStorageService = {
  atomicEdit: (
    keys: Array<string>,
    operation: (atomicService: StorageService) => Promise<void>,
  ) => Promise<void>,
  load: (key: string) => Promise<SerializableValue>,
};

export const buildLockableStorage = (
  storage: StorageService,
  { openLock }: MemoryLockService,
  retryMs: number = 100,
): LockableStorageService => {
  const atomicEdit = async (keys, operation) => {
    const closeLocks = keys.map(openLock);
    if (!closeLocks.every(Boolean)) {
      const timeUntilRetry = Math.floor(Math.random() * retryMs);
      await new Promise(resolve => setInterval(resolve, timeUntilRetry));
      return await atomicEdit(keys, operation);
    }
    await operation({
      save: (key, contents) => console.log(`Writing to ${key}!`) || storage.save(key, contents),
      load: storage.load,
    });
    closeLocks.filter(Boolean).forEach(close => close());
  };

  return {
    atomicEdit,
    load: storage.load,
  };
};