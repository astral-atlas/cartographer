// @flow
import { readFile } from 'fs';
import { promisify } from 'util';
import { toString, toNumber, toObject, TypingError } from './typing';
import { succeed, fail } from './result';

/*::
import type { Result } from './result';

type S3StorageConfig = {
  type: 's3-json',
  bucketName: string,
  bucketKey: string,
  accessKey: string,
  secretAccessKey: string,
  region: string
};
type FSStorageConfig = {
  type: 'local-json',
  storageRootDir: string
};

export type Config = {
  name: string,
  port: number,
  logging: 'stdout',
  storage: FSStorageConfig | S3StorageConfig,
};
*/
const pReadFile = promisify(readFile);

const toLoggingType = (value/*:string*/)/*: 'stdout'*/ => {
  switch (value) {
    case 'stdout':
      return value;
    default:
      throw new TypingError('stdout', value);
  }
};

const toStorageType = (value/*:string*/)/*: 'local-json' | 's3-json'*/ => {
  switch (value) {
    case 'local-json':
    case 's3-json':
      return value;
    default:
      throw new TypingError('local-json | s3-json', value);
  }
};

const toS3StorageConfig = (value/*:mixed*/)/*: S3StorageConfig*/ => {
  const storageObject = toObject(value);
  return {
    type: 's3-json',
    bucketName: toString(storageObject.bucketName),
    bucketKey: toString(storageObject.bucketKey),
    accessKey: toString(storageObject.accessKey),
    secretAccessKey: toString(storageObject.secretAccessKey),
    region: toString(storageObject.region),
  };
};
const toFsStorageConfig = (value/*:mixed*/)/*: FSStorageConfig*/ => {
  const storageObject = toObject(value);
  return {
    type: 'local-json',
    storageRootDir: toString(storageObject.storageRootDir)
  };
};

const toStorageConfig = (value/*:mixed*/)/*: FSStorageConfig | S3StorageConfig*/ => {
  try {
    const storageObject = toObject(value, "storage");
    const type = toStorageType(toString(storageObject.type));
    switch (type) {
      case 'local-json':
        return toFsStorageConfig(storageObject);
      case 's3-json':
        return toS3StorageConfig(storageObject);
      default:
        return (type/*: empty*/);
    }
  } catch (error) {
    throw new Error(`There was an error parsing the storage config:\n${error.message}`);
  }
};

const toConfig = (value/*:mixed */)/*: Result<Config, Error>*/ => {
  try {
    const configObject = toObject(value);
    const config = {
      port: toNumber(configObject.port, 'port'),
      name: toString(configObject.name, 'name'),
      logging: toLoggingType(toString(configObject.logging, 'logging')),
      storage: toStorageConfig(configObject.storage),
    };
    return succeed(config);
  } catch (error) {
    return fail(new Error(`There was an error parsing the config:\n${error.message}`));
  }
};

export const loadConfig = async (configPath/*:string */)/*: Promise<Result<Config, Error>> */ => {
  const fileContent = await pReadFile(configPath);
  const jsonFileContents = JSON.parse(fileContent);
  return toConfig(jsonFileContents);
};
