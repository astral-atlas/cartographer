// @flow
import type { HTTPMethod } from './http';
import type { ServerResponse } from 'http';

export const CORS_ORIGIN = 'Access-Control-Allow-Origin';
export const CORS_METHODS = 'Access-Control-Allow-Methods';
export const CORS_CREDENTIALS = 'Access-Control-Allow-Credentials';
export const CORS_HEADERS = 'Access-Control-Allow-Headers';
export const CORE_EXP_HEADERS = 'Access-Control-Expose-Headers';

export type CORSOptions = {|
  origin: string,
  allowedMethods?: Array<HTTPMethod>,
  useCredentials?: boolean,
  allowedHeaders?: Array<string>,
  exposedHeaders?: Array<string>,
|};

export const writeCorsHeadersToHead = (
  res: ServerResponse,
  {
    origin,
    allowedMethods = [],
    allowedHeaders = [],
    exposedHeaders = [],
    useCredentials = false,
  }: CORSOptions
) => {
  res.setHeader(CORS_ORIGIN, origin);
  res.setHeader(CORS_METHODS, allowedMethods.join(', '));
  if (allowedHeaders.length > 0) {
    res.setHeader(CORS_HEADERS, allowedHeaders.join(', '));
  }
  if (exposedHeaders.length > 0) {
    res.setHeader(CORE_EXP_HEADERS, exposedHeaders.join(', '));
  }
  if (useCredentials) {
    res.setHeader(CORS_CREDENTIALS, 'true');
  }
};
