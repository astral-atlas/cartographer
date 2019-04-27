// @flow

export type CustomMap<TKey, TValue> = {
  has: (key: TKey) => boolean,
  get: (key: TKey) => TValue,
  set: (key: TKey, value: TValue) => TValue,
  keys: () => Array<TKey>,
  values: () => Array<TValue>,
};

export const createCustomMap = <TKey, TValue>(areKeysEqual: (a: TKey, b: TKey) => boolean): CustomMap<TKey, TValue> => {
  const keys: Array<TKey> = [];
  const values: Array<TValue> = [];

  const has = (key: TKey): boolean => !!(
    keys.find(currentKey => areKeysEqual(key, currentKey))
  );

  const get = (key: TKey): TValue => (
    values[keys.findIndex(currentKey => areKeysEqual(key, currentKey))]
  );

  const set = (key: TKey, value: TValue) => {
    const index = keys.findIndex(currentKey => areKeysEqual(key, currentKey));
    if (index === -1) {
      keys.push(key);
      values.push(value);
    } else {
      values[index] = value;
    }
    return value;
  };

  return {
    has,
    get,
    set,
    keys: () => keys,
    values: () => values,
  };
};
