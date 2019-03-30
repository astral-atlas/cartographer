// @flow
import type { StorageService } from '../storage';
import { writeToFile, readFromFile } from '../../lib/fs';
import { buildMemoryStorageService } from './memoryStorage';

export class JSONFileStorageInitializationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ReadSerializedStorageError extends JSONFileStorageInitializationError {
  constructor(filePath: string, message: string) {
    super(`Could not read ${filePath} to initialize json file storage.\n${message}`);
  }
}

const readOrCreateJSONStorageFile = async (path: string): Promise<Array<string>> => {
  try {
    return JSON.parse(await readFromFile(path));
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeToFile(path, JSON.stringify([]));
      return [];
    }
    throw error;
  }
};

type FileStorage<TKey, TValue> = StorageService<TKey, TValue> & {
  entries: () => Iterator<[TKey, TValue]>
};

export const createFileStorage = async function <TKey: string, TValue>(
  filePath: string,
  serializer: (key: TKey, value: TValue) => string = (key, value) => JSON.stringify([key, value]),
  deserializer: (serializedValue: string) => [TKey, TValue] = (serializedValue) => JSON.parse(serializedValue),
): Promise<FileStorage<TKey, TValue>> {
  try {
    const fileContents = await readOrCreateJSONStorageFile(filePath);
    const deserializedContents = fileContents.map<[TKey, TValue]>(deserializer);
    const memoryStorage = buildMemoryStorageService(new Map(deserializedContents));

    const writeMapToStorage = async () => {
      const serializedContents = [...memoryStorage.entries()].map(([key, value]) => serializer(key, value));
      await writeToFile(filePath, JSON.stringify(serializedContents));
    };

    return {
      create: async (key, value) => {
        await memoryStorage.create(key, value);
        await writeMapToStorage();
      },
      read: memoryStorage.read,
      update: async (key, value) => {
        await memoryStorage.update(key, value);
        await writeMapToStorage();
      },
      delete: async (key) => {
        await memoryStorage.delete(key);
        await writeMapToStorage();
      },
      entries: () => memoryStorage.entries(),
    };
  } catch (error) {
    switch (error.code) {
    case 'EACCES':
    case 'ENOENT':
      throw new ReadSerializedStorageError(filePath, error.message);
    default:
      throw error;
    }
  }
};
