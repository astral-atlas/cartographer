// @flow strict
const { toObject, toString, toNumber } = require('@lukekaalim/to');

/*::
type AWSCreds = {
  accessKey: string,
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
  accessKey: toString,
  secretAccessKey: toString,
  region: toString,
});

const toS3JsonStorage = toObject({
  type: ()/*: 's3-json'*/ => 's3-json',
  bucketName: toString,
  creds: toAwsCreds,
});

const toLocalJsonStorage = toObject({
  type: ()/*: 'local-json'*/ => 'local-json',
  dir: toString,
});

class UnknownStorageTypeError extends Error {
  constructor(storageType) {
    super(`Did not understand storage type: "${storageType}"`);
  }
}

const toStorage = (value/*: mixed*/) => {
  const { type } = toObject({ type: toString })(value);
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