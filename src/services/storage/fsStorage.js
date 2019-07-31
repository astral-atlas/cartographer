// @flow
/*::
import type { Storage } from '../storage.2';
*/
const { readFile, writeFile, stat } = require('fs').promises;
const { join } = require('path');
const storage = require('../storage.2');
const { toArray, toString } = require('@lukekaalim/to');


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
    try {
      return !!(await stat(filePath)).isFile;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      }
      throw err;
    }
  }
  return {
    write,
    read,
    has,
  };
};
 
const createDirectoryStorage = async (
  directoryPath/*: string*/,
  fileExtension/*: string*/ = 'txt',
  indexPath/*: string*/ = join(directoryPath, 'index.json'),
)/*: Promise<Storage<string, string> & { index: Storage<null, Array<string>> }>*/ => {

  const write = async (key, value) => {
    await writeFile(join(directoryPath, `${key}.${fileExtension}`), value);
    await index.write(null, [ ...new Set([...await index.read(null), key])]);
  };
  const read = async (key) => {
    return await readFile(join(directoryPath, `${key}.${fileExtension}`));
  };
  const has = async (key) => {
    return (await index.read(null)).includes(key);
  }
  const index = storage.createJSONStorage(createFileStorage(indexPath), toArray(toString));
  if (!await index.has(null)) {
    await index.write(null, []);
  }

  return {
    index,
    write,
    read,
    has,
  };
};

module.exports = {
  createFileStorage,
  createDirectoryStorage,
};