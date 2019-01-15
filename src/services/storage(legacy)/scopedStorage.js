// @flow
import type { Storage } from '../storage';
import type { SafeStorage } from './safeStorage';
import { buildScope } from '../../lib/scope';

export const buildScopedStorage = <T>(
  storage: Storage<T>,
  scopePrefix: string,
): Storage<T> => {
  const storageScope = buildScope(scopePrefix);
  return {
    put: (key, contents) => storage.put(storageScope(key), contents),
    get: (key) => storage.get(storageScope(key)),
  };
};


export const buildScopedLockableStorage = <T>(
  storage: SafeStorage<T>,
  scopePrefix: string,
): SafeStorage<T> => {
  const storageScope = buildScope(scopePrefix);
  return {
    get: (key) => storage.get(storageScope(key)),
    doWithSafeStorage: (keys, operation) => storage.doWithSafeStorage(
      keys.map(storageScope),
      storage => operation(buildScopedStorage(storage, scopePrefix))
    ),
  };
};
