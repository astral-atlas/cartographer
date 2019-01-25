// @flow
import type { StorageService } from '../storage';
import { KeyNotFoundError, KeyAlreadyExists } from '../storage';
import { getTupleSecond } from '../../lib/tuple';

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

export type MemoryStorageService<TKey, TValue> = StorageService<TKey, TValue> & {
  entries: () => Iterator<[TKey, TValue]>,
  values: () => Promise<Array<TValue>>,
};

export const buildMemoryStorageService = <TKey, TValue>(
  store?: Map<TKey, TValue> = new Map()
): MemoryStorageService<TKey, TValue> => {
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
    values: async () => [...store.entries()].map(getTupleSecond),
  };
};
