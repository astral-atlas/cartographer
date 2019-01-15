// @flow
import { InternalServiceError } from '.';

export class KeyNotFoundError extends InternalServiceError {
  constructor(message: string) {
    super('Storage Service', message);
  }
}

export class KeyAlreadyExists extends InternalServiceError {
  constructor(message: string) {
    super('Storage Service', message);
  }
}

export type StorageService<TKey, TValue> = {
  create: (key: TKey, value: TValue) => Promise<void>,
  read: (key: TKey) => Promise<TValue>,
  update: (key: TKey, value: TValue) => Promise<void>,
  delete: (key: TKey) => Promise<void>,
};
