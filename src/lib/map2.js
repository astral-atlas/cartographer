// @flow strict
/*::
import type { Result } from './result';
*/
const { succeed, fail } = require('./result');

/*::

type KeyNotFoundFailure = {
  type: 'key-not-found',
};

type Map2<Key, Value> = {
  set: (key: Key, value: Value) => Result<void, empty>,
  get: (key: Key) => Result<Value, KeyNotFoundFailure>,
  delete: (key: Key) => Result<void, KeyNotFoundFailure>,
  entries: () => Iterator<[Key, Value]>,
};
*/

const createMap2 = /*:: <Key, Value>*/()/*: Map2<Key, Value>*/ => {
  const internalMap = new Map();

  const set = (key, value) => {
    internalMap.set(key, value);
    return succeed();
  };
  const get = (key) => {
    if (internalMap.has(key)) {
      // $FlowFixMe
      return succeed((internalMap.get(key)/*: Value*/));
    } else {
      return fail({ type: 'key-not-found' });
    }
  };
  const entries = () => {
    return internalMap.entries();
  };
  const _delete = (key) => {
    if (internalMap.has(key)) {
      internalMap.delete(key);
      return succeed();
    } else {
      return fail({ type: 'key-not-found' });
    }
  };
  return { set, get, entries, delete: _delete };
};

module.exports = {
  createMap2,
};