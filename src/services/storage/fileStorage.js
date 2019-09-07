// @flow strict
/*::
import type { Result } from '../../lib/result';
*/
const { readFile, writeFile, open } = require('fs').promises;
const { succeed, fail } = require('../../lib/result');

/*::
type InternalErrorFailure = {
  type: 'internal-error',
  error: Error,
};
*/
/*::
type PResult<TSuccess, TFailure> = Promise<Result<TSuccess, TFailure>>;

type FileStorageService = {
  read: () => PResult<string, InternalErrorFailure>,
  write: (value: string) => PResult<void, InternalErrorFailure>,
}
*/

const createFileStore = (
  filePath/*: string*/,
)/*: FileStorageService*/ => {
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