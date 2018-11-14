// @flow
import type { SerializableValue } from '../../types';
import type { LocalStorageServiceConfig } from './localStorage';

export type StorageService = {
  save: (key: string, contents: SerializableValue) => Promise<void>,
  load: (key: string) => Promise<SerializableValue>,
};

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

export type StorageServiceConfig = {
  localStorage: LocalStorageServiceConfig,
};
