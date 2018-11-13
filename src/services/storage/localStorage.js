// @flow
import type { StorageService } from '../storage';
import type { SerializableValue } from '../../types';
import { InternalServiceError, tryBuildService } from '../../services';

import { join } from 'path';
import { writeToFile, readFromFile } from '../../lib/fs';

export type LocalStorageServiceConfig = {
  storageRootDirectory: string,
};
function FailedToSaveFile(path, message) {
  return new InternalServiceError('Local Storage', `${message}\nFailed to save the file:\n${path}`);
}
function FailedToLoadFile(path, message) {
  return new InternalServiceError('Local Storage', `${message}\nFailed to load the file:\n${path}`);
}

export const buildLocalStorageService = (conf: LocalStorageServiceConfig) => tryBuildService<StorageService>('Local Storage Service', () => {
  const save = async (key: string, contents: SerializableValue): Promise<void> => {
    const path = join(conf.storageRootDirectory, key);
    try { await writeToFile(path, JSON.stringify(contents)); }
    catch (err) { throw new FailedToSaveFile(path, err.message); }
  };
  const load = async (key): Promise<SerializableValue> => {
    const path = join(conf.storageRootDirectory, key);
    try { return JSON.parse(await readFromFile(path)); }
    catch (err) { throw new FailedToLoadFile(path, err.message); }
  };

  return {
    save,
    load,
  };
});
