// @flow

type Iterator<T> = {
  current: T,
  done: boolean,
  index: number,
  iterate: () => Iterator<T>,
};

type GenericTable<TPrimaryKey, TValue> = {
  get: (key: TPrimaryKey) => Promise<TValue>,
  getAll: () => Promise<Array<TValue>>,
  getLength: () => Promise<number>,
  getIterator: () => Promise<Iterator<{ key: TPrimaryKey, value: TValue }>>,
};

type ReferenceTable<TPrimaryKey, TForeignKey> = {
  join: <TForeignType>(
    storageToJoin: GenericTable<TForeignKey, TForeignType>
  ) => GenericTable<TForeignKey, TForeignType>,
};


