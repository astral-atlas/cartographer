// @flow

const DEFAULT_FROM_VALUE = value => JSON.stringify(value, null, 2) || '';

/**
 * This function accepts a backing storage, and attempts
 * to convert (using JSON.parse and JSON.stringify) to
 * and from serialzed representations of an object
 */
export const createSerializedStorageService = /*:: <TKey, TValue>*/(
  backingStorage/*: {
    read: (key: TKey) => Promise<string>,
    write: (key: TKey, value: string) => Promise<void>,
  }*/,
  toValue/*: mixed => TValue*/,
  fromValue/*: TValue => string*/ = DEFAULT_FROM_VALUE,
)/*: { read: (key: TKey) => Promise<TValue>, write: (key: TKey, value: TValue) => Promise<void> }*/ => {
  const read = async (key) => {
    return toValue(JSON.parse(await backingStorage.read(key)));
  };
  const write = async (key, value) => {
    await backingStorage.write(key, fromValue(value));
  };

  return {
    read,
    write,
  };
};

export const createSerializedStorageService2 = /*:: <TValue>*/(
  backingStorage/*: {
    read: () => Promise<string>,
    write: (value: string) => Promise<void>,
  }*/,
  toValue/*: mixed => TValue*/,
  fromValue/*: TValue => string*/ = DEFAULT_FROM_VALUE,
)/*: { read: () => Promise<TValue>, write: (value: TValue) => Promise<void> }*/ => {
  const read = async () => {
    return toValue(JSON.parse(await backingStorage.read()));
  };
  const write = async (value) => {
    await backingStorage.write(fromValue(value));
  };

  return {
    read,
    write,
  };
};