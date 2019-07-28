// @flow
/*::
import type { Storage } from './storage.2';
*/
import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const pReadFile = promisify(readFile);
const pWriteFile = promisify(writeFile);
 
const createFileStorage = (
  filePath/*: string*/
)/*: Storage<null, string> */ => {
  const write = async (key, value) => {
    await pWriteFile(filePath, value);
  };
  const read = async () => {
    return await pReadFile(filePath);
  };
  return {
    write,
    read,
  };
};
 
const createDirectoryStorage = (
  directoryPath/*: string*/,
  fileExtension/*: string*/ = 'txt',
)/*: Storage<string, string>*/ => {
  const write = async (key, value) => {
    await pWriteFile(join(directoryPath, `${key}.${fileExtension}`), value);
  };
  const read = async (key) => {
    return await pReadFile(join(directoryPath, `${key}.${fileExtension}`));
  };

  return {
    write,
    read,
  };
}

module.exports = {
  createFileStorage,
  createDirectoryStorage,
};