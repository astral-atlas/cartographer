// @flow
/*::
import type { Storage } from '../storage.2';
*/
const { readFile, writeFile, stat } = require('fs').promises;
const { join } = require('path');
 
const createFileStorage = (
  filePath/*: string*/
)/*: Storage<null, string> */ => {
  const write = async (key, value) => {
    await writeFile(filePath, value);
  };
  const read = async () => {
    return await readFile(filePath);
  };
  const has = async () => {
    return !!(await stat(filePath)).isFile;
  }
  return {
    write,
    read,
    has,
  };
};
 
const createDirectoryStorage = (
  directoryPath/*: string*/,
  fileExtension/*: string*/ = 'txt',
)/*: Storage<string, string>*/ => {
  const write = async (key, value) => {
    await writeFile(join(directoryPath, `${key}.${fileExtension}`), value);
  };
  const read = async (key) => {
    return await readFile(join(directoryPath, `${key}.${fileExtension}`));
  };
  const has = async (key) => {
    return !!(await stat(join(directoryPath, `${key}.${fileExtension}`))).isFile;
  }

  return {
    write,
    read,
    has,
  };
}

module.exports = {
  createFileStorage,
  createDirectoryStorage,
};