// @flow
import { createHash } from 'crypto';

type ETag = string;

export const createETag = (response: Buffer | string): ETag => {
  const hash = createHash('sha256');
  hash.update(response);
  return hash.digest('base64');
};
