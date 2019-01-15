// @flow
import type { StorageService } from '../storage';

type MemoryStorage<TKey, TValue> = StorageService<TKey, TValue> & {
  entries: () => Iterator<[TKey, TValue]>,
};

export const buildMemoryStorageService = <TKey, TValue>(
  store?: Map<TKey, TValue> = new Map()
): MemoryStorage<TKey, TValue> => {
  const create = async (key, value) => {
    if (store.has(key)) {
      throw new Error();
    }
    store.set(key, value);
  };
  const read = async (key) => {
    if (!store.has(key)) {
      throw new Error();
    }
    // $FlowFixMe
    return (store.get(key): TValue);
  };
  const update = async (key, value) => {
    if (!store.has(key)) {
      throw new Error();
    }
    store.set(key, value);
  };
  const _delete = async (key) => {
    if (!store.has(key)) {
      throw new Error();
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
