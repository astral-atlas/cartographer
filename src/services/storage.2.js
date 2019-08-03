// @flow
/*::
import type { StorageConfig } from '../models/config';
import type { UserID, User } from '../models/user';
import type { EncounterID, Encounter } from '../models/encounter';
*/
const { join } = require('path');
const { toArray } = require('@lukekaalim/to');
const { toUser, toUserID } = require('../models/user');
const { toEncounter, toEncounterID } = require('../models/encounter');
const { createDirectoryStorage, createFileStorage } = require('./storage/fsStorage');
const { createS3Storage } = require('./storage/s3Storage');

const DEFAULT_FROM_VALUE = value => JSON.stringify(value, null, 2) || '';

/*::
export type Storage<TKey, TValue> = {
  read: (key: TKey) => Promise<TValue>,
  write: (key: TKey, value: TValue) => Promise<void>,
  has: (key: TKey) => Promise<boolean>,
};
*/

/**
 * This function accepts a backing storage, and attempts
 * to convert (using JSON.parse and JSON.stringify) to
 * and from serialized representations of an object
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
  const has = backingStorage.has;

  return {
    read,
    write,
    has,
  };
};
module.exports.createJSONStorage = createJSONStorage;

const transformKey = /*:: <TKey, TNewKey, TValue>*/(
  storage/*: Storage<TNewKey, TValue>*/,
  transKey/*: TKey => TNewKey*/,
)/*: Storage<TKey, TValue>*/ => ({
  read: (k) => storage.read(transKey(k)),
  write: (k, v) => storage.write(transKey(k), v),
  has: (k) => storage.has(transKey(k))
});

const fixKey = /*:: <TKey, TValue>*/(
  storage/*: Storage<TKey, TValue>*/,
  key/*: TKey*/,
)/*: Storage<null, TValue>*/ => ({
  read: () => storage.read(key),
  write: (_, v) => storage.write(key, v),
  has: (_) => storage.has(key)
});

const createLocalJsonStorage = async config => {
  const users = createJSONStorage/*:: <UserID, User>*/(
    transformKey(await createDirectoryStorage(join(config.dir, 'users'), 'json'), toUserID), toUser
  );
  const encounters = createJSONStorage/*:: <EncounterID, Encounter>*/(
    transformKey(await createDirectoryStorage(join(config.dir, 'encounters'), 'json'), toEncounterID), toEncounter
  );
  const userIdsFileStorage = createFileStorage(join(config.dir, 'userIds.json'));
  if (!await userIdsFileStorage.has(null)) {
    await userIdsFileStorage.write(null, JSON.stringify([]));
  }

  const userIds = createJSONStorage/*:: <null, Array<UserID>>*/(userIdsFileStorage, toArray(toUserID));
  return {
    encounters,
    users,
    userIds,
  };
};


const createS3JsonStorage = async config => {
  const s3UsersStorage = createS3Storage(config.creds, config.bucketName);
  if (!await s3UsersStorage.has('userIds')) {
    await s3UsersStorage.write('userIds', JSON.stringify([]));
  }
  const encounters = createJSONStorage/*:: <EncounterID, Encounter>*/(
    transformKey(s3UsersStorage, key => `encounters/${key}`), toEncounter
  );
  const users = createJSONStorage/*:: <UserID, User>*/(
    transformKey(s3UsersStorage, key => `users/${key}`), toUser
  );
  const userIds = createJSONStorage/*:: <null, Array<UserID>>*/(
    fixKey(s3UsersStorage, 'userIds'), toArray(toUserID)
  );
  return {
    encounters,
    users,
    userIds,
  };
};

const createStorage = async (config/*: StorageConfig*/) => {
  switch (config.type) {
    case 'local-json':
      return createLocalJsonStorage(config);
    case 's3-json':
      return await createS3JsonStorage(config)
    default:
      throw new Error('Didnt do this yet lol');
  }
};

module.exports.createStorage = createStorage;