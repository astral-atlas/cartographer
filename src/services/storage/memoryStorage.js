// @flow
import type { StorageService } from '../storage';
import { KeyNotFoundError, KeyAlreadyExistsError } from '../storage';

class MapDoesNotContainKeyError<TKey: string> extends KeyNotFoundError {
  constructor(key: TKey) {
    super('Memory Storage', `MapDoesNotContainKeyError: Internal map does not contain key: ${JSON.stringify(key)}`);
  }
}
class MapAlreadyHasKey<TKey: string> extends KeyAlreadyExistsError {
  constructor(key: TKey) {
    super('Memory Storage', `MapAlreadyHasKey: Internal map already has key: ${JSON.stringify(key)}`);
  }
}

export type MemoryStorageService<TKey, TValue> = StorageService<TKey, TValue> & {
  entries: () => Iterator<[TKey, TValue]>,
  values: () => Array<TValue>,
};

export const buildMemoryStorageService = <TKey: string, TValue>(
  store?: Map<TKey, TValue> = new Map()
): MemoryStorageService<TKey, TValue> => {
  const create = async (key, value) => {
    if (store.has(key)) {
      throw new MapAlreadyHasKey(key);
    }
    store.set(key, value);
  };
  const read = async (key) => {
    if (!store.has(key)) {
      throw new MapDoesNotContainKeyError(key);
    }
    // $FlowFixMe
    return (store.get(key): TValue);
  };
  const update = async (key, updater) => {
    if (!store.has(key)) {
      throw new MapDoesNotContainKeyError(key);
    }
    // $FlowFixMe
    const prevValue: TValue = store.get(key);
    store.set(key, updater(prevValue));
  };
  const _delete = async (key) => {
    if (!store.has(key)) {
      throw new MapDoesNotContainKeyError(key);
    }
    store.delete(key);
  };

  return {
    create,
    read,
    update,
    delete: _delete,
    entries: () => store.entries(),
    values: () => [...store.values()],
  };
};
