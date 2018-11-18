// @flow
import type { Storage } from '../storage';

export const buildTypedStorage = <T>(
  storage: Storage<string>,
  serialize: (type: T) => string,
  deserialize: string => T,
): Storage<T> => ({
  get: async (key: string) => deserialize(await storage.get(key)),
  put: async (key: string, contents: T) => await storage.put(
    key,
    serialize(contents)
  ),
});
