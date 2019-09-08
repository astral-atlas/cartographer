// @flow strict
/*::
import type { Result } from '../lib/result';
*/
const { createMap2 } = require('../lib/map2');
const { succeed, fail, handleResult } = require('../lib/result');

/*::
type InternalFailure = {
  type: 'internal-failure',
  error: Error,
};
*/

/*::
export type StorageService<ReadValue, WriteValue> = {
  read: () => Promise<ReadValue>,
  write: (value: WriteValue) => Promise<void>,
};
*/

/*::
export type ReadMap<TKey, TValue> = {
  list: () => Promise<Array<TKey>>,
  get: (key: TKey) => TValue,
};
*/

/*::
export type STDMapStore<Key, Value> = ReadMap<
  Key,
  StorageService<
    Result<null | Value, InternalFailure>,
    null | Value
  >,
>;
*/

const createMemoryMapStore = /*:: <K, V>*/()/*: STDMapStore<K, V>*/ => {
  const internalMap = createMap2/*:: <K, V>*/();

  const list = async () => {
    return Array.from(internalMap.entries()).map(([key, value]) => key);
  };
  const get = (key) => {
    const read = async () => handleResult(internalMap.get(key),
      value => succeed(value),
      failure => failure.type === 'key-not-found' ?
        succeed(null) :
        fail({ type: 'internal-failure', error: new Error() }),
    );
    const write = async (value) => {
      if (value === null) {
        internalMap.delete(key);
        return;
      } else {
        internalMap.set(key, value);
        return;
      }
    };
    return { read, write };
  };
  return { get, list };
};

const { readFile, writeFile, readdir, unlink } = require('fs');
const { join } = require('path');

const createDirectoryMapStore = (path/*: string*/)/*: STDMapStore<string, string>*/ => {;
  const list = () => new Promise((resolve, reject) => {
    readdir(path, (err, files) => {
      resolve(files);
    });
  });

  const get = (key) => {
    const read = async () => {
      if ((await list()).includes(key)) {
        return new Promise((resolve, reject) => {
          readFile(join(path, key), 'utf8', (error, data) => resolve(succeed(data)));
        });
      } else {
        return succeed(null);
      }
    };
    const write = async (value) => {
      if (value === null) {
        return new Promise((resolve, reject) => {
          unlink(join(path, key), (error) => resolve());
        })
      } else {
        return new Promise((resolve, reject) => {
          writeFile(join(path, key), value, 'utf8', (error, data) => resolve());
        });
      }
    };
    return { read, write };
  };
  return { get, list };
};