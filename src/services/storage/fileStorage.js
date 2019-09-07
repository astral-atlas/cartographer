// @flow strict
/*::
import type { Result } from '../../lib/result';
*/
const { readFile, writeFile, stat } = require('fs').promises;
const { succeed, fail } = require('../../lib/result');

/*::
type InternalErrorFailure = {
  type: 'internal-error',
  error: Error,
};
*/
/*::
type FileStorageService = {
  read: () => Promise<Result<string, InternalErrorFailure>>,
  write: (value: string) => Promise<Result<void, InternalErrorFailure>>,
}
*/

const createFileStore = async (
  filePath/*: string*/,
  defaultValue/*: string*/ = '',
)/*: Promise<FileStorageService>*/ => {
  try {
    await readFile(filePath, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOENT') {
      await writeFile(filePath, defaultValue, 'utf8');
    }
  }
  const read = async () => {
    try {
      return succeed(await readFile(filePath, 'utf8'));
    } catch (error) {
      return fail({ type: 'internal-error', error });
    }
  };
  const write = async (value) => {
    try {
      return succeed(await writeFile(filePath, value, 'utf8'));
    } catch (error) {
      return fail({ type: 'internal-error', error });
    }
  };
  return {
    read,
    write,
  };
};

module.exports = {
  createFileStore,
};