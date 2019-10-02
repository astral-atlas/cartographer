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

type NotFoundFailure = {
  type: 'not-found'
};
*/

/*::
export type STDMapStore<Key, Value> = {
  list: () => Promise<Result<Array<Key>, InternalFailure>>,
  read: (key: Key) => Promise<Result<Value, NotFoundFailure | InternalFailure>>,
  write: (key: Key, value: Value) => Promise<Result<void, InternalFailure>>,
  destroy: (key: Key) => Promise<Result<void, NotFoundFailure | InternalFailure>>,
};
*/

const createMemoryMapStore = /*:: <K, V>*/()/*: STDMapStore<K, V>*/ => {
  const internalMap = createMap2/*:: <K, V>*/();

  const list = async () => succeed(
    Array.from(internalMap.entries()).map(([key, value]) => key)
  );
  const read = async (key) => handleResult(internalMap.get(key),
    value => succeed(value),
    failure => fail({ type: 'not-found' }),
  );
  const write = async (key, value) => handleResult(internalMap.set(key, value),
    () => succeed(),
    empt => empt,
  );
  const destroy = async (key) => handleResult(internalMap.delete(key),
    value => succeed(),
    failure => fail({ type: 'not-found' }),
  );
  return { read, write, list, destroy };
};

const { readFile, writeFile, readdir, unlink, stat, mkdir } = require('fs').promises;
const { join } = require('path');

const directoryExists = async (path) => {
  try {
    return (await stat(path, {})).isDirectory();
  } catch (error) {
    if (error.code === 'EEXIST' || error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
};

const createDirectoryMapStore = async (path/*: string*/)/*: Promise<STDMapStore<string, string>>*/ => {
  if (!await directoryExists(path)) {
    await mkdir(path, { recursive: true });
  }
  const list = async () => {
    try {
      return succeed(await readdir(path));
    } catch (error) {
      return fail({ type: 'internal-failure', error });
    }
  };
  const read = async (key) => {
    const filename = join(path, key);
    try {
      return succeed(await readFile(filename));
    } catch (error) {
      if (error.code === 'EEXIST' || error.code === 'ENOENT') {
        return fail({ type: 'not-found' });
      }
      return fail({ type: 'internal-failure', error });
    }
  };
  const write = async (key, value) => {
    const filename = join(path, key);
    try {
      return succeed(await writeFile(filename, value));
    } catch (error) {
      return fail({ type: 'internal-failure', error });
    }
  };
  const destroy = async (key) => {
    const filename = join(path, key);
    try {
      return succeed(await unlink(path));
    } catch (error) {
      if (error.code === 'EEXIST' || error.code === 'ENOENT') {
        return fail({ type: 'not-found' });
      }
      return fail({ type: 'internal-failure', error });
    }
  };
  return { read, write, list, destroy };
};

/*::
import type { Model } from '@lukekaalim/model';
*/
const { chain } = require('@lukekaalim/result');

const createJSONModeledStorage = /*:: <Key: string, Value>*/(
  mapStore/*: STDMapStore<string, string>*/,
  valueModel/*: Model<Value>*/,
  keyModel/*: Model<Key>*/,
  stringFromKey/*: Key => string*/ = (k) => k,
  stringFromValue/*: Value => string*/ = (v) => JSON.stringify(v, null, 3) || '',
)/*: STDMapStore<Key, Value>*/ => {
  const list = async () => chain(await mapStore.list())
    .then(stringKeys => {
      const keys = [];
      for (const stringKey of stringKeys) {
        const keyModelResult = keyModel.from(stringKey);
        if (keyModelResult.type === 'failure') {
          return fail({ type: 'internal-failure', error: new Error(keyModelResult.failure.message) });
        }
        keys.push(keyModelResult.success);
      }
      return succeed(keys);
    })
    .result();
  const read = async (key) => chain(await mapStore.read(stringFromKey(key)))
    .then(content => succeed(JSON.parse(content)))
    .then(value => valueModel.from(value))
    .catch(failure => {
      switch (failure.type) {
        case 'cast-failure':
          return fail({ type: 'internal-failure', error: new Error(failure.message) })
        case 'internal-failure':
        case 'not-found':
          return fail(failure);
        default:
          return (failure/*: empty*/);
      }
    })
    .result();
  const write = async (key, value) => await mapStore.write(stringFromKey(key), stringFromValue(value));
  const destroy = async (key) => await mapStore.destroy(stringFromKey(key));

  return {
    list,
    read,
    write,
    destroy,
  }
};

module.exports = {
  createMemoryMapStore,
  createDirectoryMapStore,
  createJSONModeledStorage,
};
