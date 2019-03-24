// @flow
import { InternalServiceError } from '.';

export class KeyNotFoundError extends InternalServiceError {
  constructor(storageSubtype: string, message: string) {
    super(`${storageSubtype} (Storage)`, `KeyNotFoundError: The key was not found\n${message}`);
  }
}

export class KeyAlreadyExistsError extends InternalServiceError {
  constructor(storageSubtype: string, message: string) {
    super(`${storageSubtype} (Storage)`, `KeyAlreadyExistsError: There was a key collision\n${message}`);
  }
}

export type StorageService<TKey: string, TValue> = {
  create: (key: TKey, value: TValue) => Promise<void>,
  read: (key: TKey) => Promise<TValue>,
  update: (key: TKey, updater: (value: TValue) => TValue) => Promise<void>,
  delete: (key: TKey) => Promise<void>,
};
