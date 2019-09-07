// @flow
/*::
import type { Result } from '../../lib/result';
import type { EventLogger } from '../log.2';
declare function mkdir(path: string, options: { recursive: boolean }): Promise<void>;
*/
// $FlowFixMe
const { readFile, writeFile, readdir, open, unlink, mkdir } = require('fs').promises;
const { succeed, fail, handleResult } = require('../../lib/result');
const { join, extname } = require('path');

/*::
type NotCreatedFailure = {
  type: 'not-created',
};
type AlreadyCreatedFailure = {
  type: 'already-created',
}
type InternalErrorFailure = {
  type: 'internal-error',
  error: Error,
};
*/

/*::
export type DirStore = {
  list: () =>                             Promise<Result<Array<string>, InternalErrorFailure>>,
  create: (key: string, value: string) => Promise<Result<void, AlreadyCreatedFailure | InternalErrorFailure>>,
  read: (key: string) =>                  Promise<Result<string, NotCreatedFailure | InternalErrorFailure>>,
  update: (key: string, value: string) => Promise<Result<void, NotCreatedFailure | InternalErrorFailure>>,
  destroy: (key: string) =>               Promise<Result<void, NotCreatedFailure | InternalErrorFailure>>,
};
*/

/*::
export type FileStore = {
  read: () =>                Promise<Result<string, NotCreatedFailure | InternalErrorFailure>>,
  update: (value: string) => Promise<Result<void, NotCreatedFailure | InternalErrorFailure>>,
}
*/

const createDirStore = async (
  baseDirectory/*: string*/,
  logger/*: EventLogger*/,
  extension /*: string*/ = 'txt',
)/*: Promise<DirStore>*/ => {
  await mkdir(baseDirectory, { recursive: true });

  const list = async () => {
    try {
      const filenames = await readdir(baseDirectory, { encoding: 'utf8' });
      const filenamesWithoutExtensions = filenames.map(filename => filename.slice(0, filename.length - extname(filename).length));
      return succeed(filenamesWithoutExtensions);
    } catch (error) {
      return fail({ type: 'internal-error', error });
    }
  };
  const create = async (key, value) => {
    try {
      const path = join(baseDirectory, key + '.' + extension);
      await writeFile(path, value, { encoding: 'utf8', flag: 'wx' });
      return succeed();
    } catch (error) {
      if (error.code === 'EEXIST') {
        return fail({ type: 'already-created' });
      }
      return fail({ type: 'internal-error', error });
    }
  };
  const read = async (key) => {
    try {
      const path = join(baseDirectory, key + '.' +  extension);
      const value = await readFile(path, 'utf8');
      return succeed(value);
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ENOENT') {
        return fail({ type: 'not-created' });
      }
      return fail({ type: 'internal-error', error });
    }
  };
  const update = async (key, value) => {
    try {
      const path = join(baseDirectory, key + '.' +  extension);
      const fileHandler = await open(path, 'r+');
      try {
        await fileHandler.writeFile(value, { encoding: 'utf8' });
        return succeed();
      } finally {
        fileHandler.close();
      }
    } catch (error) {
      if (error.code === 'EEXIST' || error.code === 'ENOENT') {
        return fail({ type: 'not-created' });
      }
      return fail({ type: 'internal-error', error });
    }
  };
  const destroy = async (key) => {
    try {
      const path = join(baseDirectory, key + '.' +  extension);
      await unlink(path)
      return succeed();
    } catch (error) {
      if (error.code === 'EEXIST' || error.code === 'ENOENT') {
        return fail({ type: 'not-created' });
      }
      return fail({ type: 'internal-error', error });
    }
  };
  return {
    list,
    create,
    read,
    update,
    destroy,
  };
};

module.exports = {
  createDirStore,
};
