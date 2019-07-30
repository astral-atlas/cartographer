// @flow
/*::
import type { StorageConfig } from '../models/config';
import type { UserID, User } from '../models/user';
*/
const { join } = require('path');
const { toArray } = require('@lukekaalim/to');
const { toUser, toUserID } = require('../models/user');
const { createDirectoryStorage, createFileStorage } = require('./storage/fsStorage');
const { createS3Storage } = require('./storage/s3Storage');

const DEFAULT_FROM_VALUE = value => JSON.stringify(value, null, 2) || '';

/*::
export type Storage<TKey, TValue> = {
  read: (key: TKey) => Promise<TValue>,
  write: (key: TKey, value: TValue) => Promise<void>,
};
*/

/**
 * This function accepts a backing storage, and attempts
 * to convert (using JSON.parse and JSON.stringify) to
 * and from serialzed representations of an object
 */
const createJSONStorage = /*:: <TKey, TValue>*/(
  backingStorage/*: Storage<TKey, string>*/,
  to/*: mixed => TValue*/,
  from/*: TValue => string*/ = DEFAULT_FROM_VALUE,
)/*: Storage<TKey, TValue>*/ => {
  const read = async (key) => {
    return to(JSON.parse(await backingStorage.read(key)));
  };
  const write = async (key, value) => {
    await backingStorage.write(key, from(value));
  };

  return {
    read,
    write,
  };
};

const transformKey = /*:: <TKey, TNewKey, TValue>*/(
  storage/*: Storage<TNewKey, TValue>*/,
  transKey/*: TKey => TNewKey*/,
)/*: Storage<TKey, TValue>*/ => ({
  read: (k) => storage.read(transKey(k)),
  write: (k, v) => storage.write(transKey(k), v),
});

const fixKey = /*:: <TKey, TValue>*/(
  storage/*: Storage<TKey, TValue>*/,
  key/*: TKey*/,
)/*: Storage<null, TValue>*/ => ({
  read: () => storage.read(key),
  write: (_, v) => storage.write(key, v),
});

const createStorage = (config/*: StorageConfig*/) => {
  switch (config.type) {
    case 'local-json': {
      const users = createJSONStorage/*:: <UserID, User>*/(
        transformKey(createDirectoryStorage(join(config.dir, 'users'), 'json'), toUserID), toUser
      );
      const userIds = createJSONStorage/*:: <null, Array<UserID>>*/(
        createFileStorage(join(config.dir, 'userIds.json')), toArray(toUserID)
      );
      return {
        users,
        userIds,
      };
    }
    case 's3-json': {
      const users = createJSONStorage/*:: <UserID, User>*/(
        transformKey(createS3Storage(config.creds, config.bucketName), key => `users/${key}`), toUser
      );
      const userIds = createJSONStorage/*:: <null, Array<UserID>>*/(
        fixKey(createS3Storage(config.creds, config.bucketName), 'userIds'), toArray(toUserID)
      );
      return {
        users,
        userIds,
      };
    }
    default:
      throw new Error('Didnt do this yet lol');
  }
};

module.exports = {
  createStorage,
};