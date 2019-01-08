// @flow

export type IndexableStorage<TKey> = {
  getLength: () => Promise<number>,
  getKeys: () => Promise<Array<TKey>>,
};
