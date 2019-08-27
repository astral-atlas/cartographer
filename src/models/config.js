// @flow strict
const { toObject, toAString, toNumber, toDisjointUnion } = require('@lukekaalim/to');

/*::
export type AWSCreds = {
  accessKeyId: string,
  secretAccessKey: string,
  region: string
};

export type StorageConfig =
  | { type: 'local-json', dir: string }
  | { type: 's3-json', bucketName: string, creds: AWSCreds }

export type Config = {
  storage: StorageConfig,
  port: number,
};
*/

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
  storage: toStorage,
  port: toNumber,
});

module.exports = {
  toConfig,
};