// @flow
import type { Storage } from '../storage';
import { KeyNotFoundError } from '../storage';
import { InternalServiceError } from '../../services';

import { join } from 'path';
import { createHash } from 'crypto';
import { writeToFile, readFromFile } from '../../lib/fs';

function FailedToSaveFile(path, message) {
  return new InternalServiceError('Local Storage', `Failed to save the file:\n${path}\n${message}`);
}
function FailedToLoadFile(path, message) {
  return new KeyNotFoundError('Local Storage', path, `Failed to load the file:\n${path}\n${message}`);
}

export const buildLocalStorage = (storageRootDirectory: string): Storage<string> => {
  const put = async (key, contents) => {
    const encodedKey = createHash('sha1').update(key).digest('hex').toString();
    const path = join(storageRootDirectory, encodedKey);
    try {
      await writeToFile(path, contents);
    } catch (err) {
      throw new FailedToSaveFile(path, err.message);
    }
  };
  const get = async (key) => {
    const encodedKey = createHash('sha1').update(key).digest('hex').toString();
    const path = join(storageRootDirectory, encodedKey);
    try {
      return await readFromFile(path);
    } catch (err) {
      throw new FailedToLoadFile(path, err.message);
    }
  };

  return {
    put,
    get,
  };
};
