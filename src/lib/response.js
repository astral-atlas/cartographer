// @flow
/*::
import type { Readable } from 'stream';
*/

export const createStringBody = (content/*: string*/) => ({ type: 'string', content });
export const createBufferBody = (content/*: Buffer*/) => ({ type: 'buffer', content });
export const createStreamBody = (stream/*: Readable*/) => ({ type: 'stream', stream });

export const ok = (bodyObject/*: mixed*/, headers/*: Array<[string, string]>*/ = []) => {
  const bodyBuffer = Buffer.from(JSON.stringify(bodyObject) || "");

  return {
    body: createBufferBody(bodyBuffer),
    headers: [...headers, ['Content-Length', bodyBuffer.length.toString()], ['Content-Type', 'application/json; charset=utf-8']],
    statusCode: 200,
  };
};

export const internalServerError = (body/*: mixed*/, headers/*: Array<[string, string]>*/ = []) => ({
  body: createStringBody(JSON.stringify(body) || ""),
  headers,
  statusCode: 500,
});