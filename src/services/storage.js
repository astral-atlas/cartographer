// @flow

export type Storage<TKey, TValue> = {
  create: (key: TKey, value: TValue) => Promise<void>,
  read: (key: TKey) => Promise<TValue>,
  update: (key: TKey, value: TValue) => Promise<void>,
  delete: (key: TKey) => Promise<void>,
};
