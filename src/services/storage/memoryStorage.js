// @flow
import type { StorageService } from '../storage';
import { KeyNotFoundError, KeyAlreadyExists } from '../storage';

class MapDoesNotContainKeyError<TKey> extends KeyNotFoundError {
  constructor(key: TKey) {
    super(JSON.stringify(key));
  }
}
class MapAlreadyHasKey<TKey> extends KeyAlreadyExists {
  constructor(key: TKey) {
    super(JSON.stringify(key));
  }
}

type MemoryStorage<TKey, TValue> = StorageService<TKey, TValue> & {
  entries: () => Iterator<[TKey, TValue]>,
};

export const buildMemoryStorageService = <TKey, TValue>(
  store?: Map<TKey, TValue> = new Map()
): MemoryStorage<TKey, TValue> => {
  const create = async (key, value) => {
    if (store.has(key)) {
      throw new MapAlreadyHasKey<TKey>(key);
    }
    store.set(key, value);
  };
  const read = async (key) => {
    if (!store.has(key)) {
      throw new MapDoesNotContainKeyError<TKey>(key);
    }
    // $FlowFixMe
    return (store.get(key): TValue);
  };
  const update = async (key, value) => {
    if (!store.has(key)) {
      throw new MapDoesNotContainKeyError<TKey>(key);
    }
    store.set(key, value);
  };
  const _delete = async (key) => {
    if (!store.has(key)) {
      throw new MapDoesNotContainKeyError<TKey>(key);
    }
    store.delete(key);
  };

  return {
    create,
    read,
    update,
    delete: _delete,
    entries: () => store.entries(),
  };
};
