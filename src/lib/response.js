// @flow
/*::
import type { Readable } from 'stream';
*/

const createStringBody = (content/*: string*/) => ({ type: 'string', content });
const createBufferBody = (content/*: Buffer*/) => ({ type: 'buffer', content });
const createStreamBody = (stream/*: Readable*/) => ({ type: 'stream', stream });

const createHeaders = (headers, contentLength) => [
  ...headers,
  ['Content-Length', contentLength.toString()],
  ['Content-Type', 'application/json; charset=utf-8']
];

const createResponse = (statusCode, body, headers) => ({
  statusCode,
  body: createStringBody(body),
  headers: createHeaders(headers, body.length),
});

const ok = (
  body/*: string*/,
  headers/*: Array<[string, string]>*/ = [],
) => createResponse(200, body, headers);

const notFound = (
  body/*: string*/ = '',
  headers/*: Array<[string, string]>*/ = [],
) => createResponse(404, body, headers);

const internalServerError = (
  body/*: string*/ = '',
  headers/*: Array<[string, string]>*/ = [],
) => createResponse(500, body, headers);

const badInput = (
  body/*: string*/ = '',
  headers/*: Array<[string, string]>*/ = [],
) => createResponse(400, body, headers);

module.exports = {
  ok,
  notFound,
  internalServerError,
  badInput,
};