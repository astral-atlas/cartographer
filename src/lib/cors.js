// @flow strict
/*::
import type { HTTPMethod } from '@lukekaalim/server';
*/

const CORS_ORIGIN =       'Access-Control-Allow-Origin';
const CORS_METHODS =      'Access-Control-Allow-Methods';
const CORS_CREDENTIALS =  'Access-Control-Allow-Credentials';
const CORS_HEADERS =      'Access-Control-Allow-Headers';
const CORE_EXP_HEADERS =  'Access-Control-Expose-Headers';

/*::
export type CORSOptions = {
  origin: string,
  allowedMethods: Array<HTTPMethod>,
  useCredentials: boolean,
  allowedHeaders: Array<string>,
  exposedHeaders: Array<string>,
};
*/