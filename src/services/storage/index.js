// @flow
import type { SerializableValue } from '../../types';
import type { LocalStorageServiceConfig } from './localStorage';

export type StorageService = {
  save: (key: string, contents: SerializableValue) => Promise<void>,
  load: (key: string) => Promise<SerializableValue>,
};

export type StorageServiceConfig = {
  localStorage: LocalStorageServiceConfig,
};
