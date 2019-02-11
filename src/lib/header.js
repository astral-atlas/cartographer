// @flow
import type { HTTPMethod } from './http';

export const buildCORSHeaderTuples = (methods: Array<HTTPMethod>, useCredentials: boolean, origin: string): Array<[string, string]> => [
  ['Access-Control-Allow-Origin', origin],
  ['Access-Control-Allow-Methods', methods.join(' ')],
  useCredentials ? ['Access-Control-Allow-Credentials','true'] : null,
  ['Access-Control-Allow-Headers', [useCredentials && 'Authorization', 'User'].filter(Boolean).join(',')]
].filter(Boolean);
