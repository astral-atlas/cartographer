// @flow
import type { HTTPMethod } from './http';

export const buildCORSHeaderTuples = (methods: Array<HTTPMethod>, useCredentials: boolean, origin: string): Array<[string, string]> => [
  ['Access-Control-Allow-Origin', origin],
  ['Access-Control-Allow-Methods', methods.join(' ')],
  useCredentials ? ['Access-Control-Allow-Credentials','true'] : null,
  useCredentials ? ['Access-Control-Allow-Headers', 'Authorization'] : null
].filter(Boolean);
