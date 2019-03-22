// @flow
import { createHash } from 'crypto';

type ETag = string;

export const createETag = (response: Buffer | string): ETag => {
  // Creates a 256 bit hash (32 bytes)
  const hash = createHash('sha256');
  hash.update(response);
  // And returns it as hexadecimal string, which is one byte per 2 characters
  // so the length of the string should be 64
  return hash.digest('hex');
};
