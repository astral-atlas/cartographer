// @flow
import type { MemoryStorageService } from './memoryStorage';
import { buildMemoryStorageService } from './memoryStorage';

export const createPersistantMemoryStorage = async function <TKey: string, TValue>(
  onLoad: () => Promise<Map<TKey, TValue>>,
  onSave: (storage: Map<TKey, TValue>) => Promise<void>,
): Promise<MemoryStorageService<TKey, TValue>> {
  const storageMap = await onLoad();
  const memoryStorage = buildMemoryStorageService(storageMap);

  return {
    create: async (key, value) => {
      await memoryStorage.create(key, value);
      await onSave(storageMap);
    },
    read: memoryStorage.read,
    update: async (key, value) => {
      await memoryStorage.update(key, value);
      await onSave(storageMap);
    },
    delete: async (key) => {
      await memoryStorage.delete(key);
      await onSave(storageMap);
    },
    entries: () => memoryStorage.entries(),
    values: () => memoryStorage.values(),
  };
};
