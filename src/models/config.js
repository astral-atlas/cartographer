// @flow strict
const { toObject, toAString, toNumber, toDisjointUnion } = require('@lukekaalim/to');
const { toUserID } = require('./user');

/*::
import type { UserID } from './user';

export type AWSCreds = {
  accessKeyId: string,
  secretAccessKey: string,
  region: string
};

export type StorageConfig =
  | { type: 'local-json', dir: string }
  | { type: 's3-json', bucketName: string, creds: AWSCreds }

export type FixedAuthenticationConfig = {
  type: 'fixed',
  name: string,
  pass: string,
  userId: UserID,
};

type AuthenticationConfig =
  | FixedAuthenticationConfig;

export type Config = {
  storage: StorageConfig,
  authentication: AuthenticationConfig,
  port: number,
};
*/

const toFixedAuth = toObject({
  type: ()/*: 'fixed'*/ => 'fixed',
  name: toAString,
  pass: toAString,
  userId: toUserID,
});

const toAuthentication = toDisjointUnion('type', {
  'fixed': toFixedAuth,
});

const toAwsCreds = toObject({
  accessKeyId: toAString,
  secretAccessKey: toAString,
  region: toAString,
});

const toS3JsonStorage = toObject({
  type: ()/*: 's3-json'*/ => 's3-json',
  bucketName: toAString,
  creds: toAwsCreds,
});

const toLocalJsonStorage = toObject({
  type: ()/*: 'local-json'*/ => 'local-json',
  dir: toAString,
});

const toStorage = toDisjointUnion('type', {
  's3-json': toS3JsonStorage,
  'local-json': toLocalJsonStorage,
});

const toConfig/*: mixed => Config*/ = toObject({
  authentication: toAuthentication,
  storage: toStorage,
  port: toNumber,
});

module.exports = {
  toConfig,
};