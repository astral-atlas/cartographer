// @flow
import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const pReadFile = promisify(readFile);
const pWriteFile = promisify(writeFile);

/*::
type FileService = {
  write: (value: string) => Promise<void>,
  read: () => Promise<string>,
}
*/
 
export const createFileService = (
  filePath/*: string*/
)/*: FileService*/ => {
  const write = async (value) => {
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
/*::
type DirService = {
  write: (key: string, value: string) => Promise<void>,
  read: (key: string) => Promise<string>,
}
*/
 
export const createDirService = (
  directoryPath/*: string*/,
  fileType/*: string*/ = '',
)/*: DirService*/ => {
  const createFileName = (key) => join(directoryPath, key + fileType);

  const write = async (key, value) => {
    await pWriteFile(createFileName(key), value);
  };
  const read = async (key) => {
    return await pReadFile(createFileName(key));
  };

  return {
    write,
    read,
  };
}