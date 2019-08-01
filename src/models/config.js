// @flow strict
const { toObject, toAString, toNumber } = require('@lukekaalim/to');

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

class UnknownStorageTypeError extends Error {
  constructor(storageType) {
    super(`Did not understand storage type: "${storageType}"`);
  }
}

const toStorage = (value/*: mixed*/) => {
  const { type } = toObject({ type: toAString })(value);
  switch (type) {
    case 's3-json':
      return toS3JsonStorage(value);
    case 'local-json':
      return toLocalJsonStorage(value);
    default:
      throw new UnknownStorageTypeError(type);
  }
};

const toConfig = toObject({
  storage: toStorage,
  port: toNumber,
});

module.exports = {
  toConfig,
};