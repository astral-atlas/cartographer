// @flow
/*::
import type { Storage } from './storage.2';
*/
const { readFile, writeFile } = require('fs').promises;
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
    await writeFile(join(directoryPath, `${key}.${fileExtension}`), value);
  };
  const read = async (key) => {
    return await readFile(join(directoryPath, `${key}.${fileExtension}`));
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