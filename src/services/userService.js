// @flow
/*::
import type { Config } from '../models/config';
import type { Result } from '../lib/result';
import type { User, UserID } from '../models/user';

import type { EventLogger } from './log.2';
*/
const { join } = require('path');
const { toUser, createUser } = require('../models/user');
const { succeed, fail, handleResult } = require('../lib/result');
const { createDirectoryMapStore } = require('./storage');

/*::
export type UserService = {
  getAllUsers: () => Promise<Result<Array<User>, Error>>,
  addUser: () => Promise<Result<User, Error>>,
  getUser: (userId: UserID) => Promise<Result<User, Error>>,
  deleteUser: (userId: UserID) => Promise<Result<void, Error>>,
};
*/

const createUserServiceFromLocalJson = async (
  logger,
  baseStorageDir,
)/*: Promise<UserService>*/ => {
  const store = createDirectoryMapStore(join(baseStorageDir, 'users'));

  const getAllUsers = async () => {
    const withIds = async userIds => {
      const users/*: Array<User>*/ = [];
      for (const id of userIds) {
        const userResult = await store.read(id);
        if (userResult.type === 'failure') {
          return fail(new Error());
        }
        users.push(toUser(JSON.parse(userResult.success)));
      };
      return succeed(users);
    };
    return handleResult(await store.list(), withIds, () => fail(new Error()));
  };
  const addUser = async () => {
    const newUser = createUser();
    return handleResult(await store.write(newUser.id, JSON.stringify(newUser)),
      () => succeed(newUser),
      () => fail(new Error()),
    );
  };
  const deleteUser = async (id) => handleResult(
    await store.destroy(id),
    () => succeed(),
    () => fail(new Error()),
  );
  const getUser = async (id) => handleResult(await store.read(id),
    user => succeed(toUser(JSON.parse(user))),
    () => fail(new Error())
  );

  return {
    getAllUsers,
    addUser,
    deleteUser,
    getUser,
  }
};

class UnimplmenementedError extends Error {
  constructor(unimplementedFeature/*: string*/) {
    super(`Did not implmenent ${unimplementedFeature}`);
  }
}

const createUserService = (logger/*: EventLogger*/, config/*: Config*/) => {
  switch (config.storage.type) {
    case 'local-json':
      return createUserServiceFromLocalJson(logger, config.storage.dir);
    default:
      throw new UnimplmenementedError(`"${config.storage.type}" storage type for the user service`);
  }
};

module.exports = {
  createUserService,
}