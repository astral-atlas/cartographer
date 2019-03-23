// @flow
import type { HandlerOutput } from './routeHandler';
import { StringStream, NullStream } from './stream';
import { createETag } from './etag';

export const addHeaders = (out: HandlerOutput, newHeaders: Map<string, string>): HandlerOutput => ({
  ...out,
  headers: new Map([...out.headers, ...newHeaders]),
});

export const ok = (response: mixed = null): HandlerOutput => {
  const stringifiedResponse = JSON.stringify(response);
  if (stringifiedResponse === undefined) {
    throw new Error('Cannot serialized undefined to String Stream');
  }
  const responseBody = new StringStream(stringifiedResponse);
  const status = 200;
  const headers = new Map([
    ['Content-Type', 'application/json'],
    ['Content-Length', responseBody.getLength().toString(10)],
    ['ETag', createETag(stringifiedResponse)],
  ]);
  return {
    responseBody,
    status,
    headers,
  };
};

export const notAuthorized = (): HandlerOutput => ({
  responseBody: new NullStream(),
  status: 401,
  headers: new Map([['Content-Length', '0']]),
});

export const notFound = (): HandlerOutput => ({
  responseBody: new NullStream(),
  status: 404,
  headers: new Map([['Content-Length', '0']]),
});

export const internalServerError = (): HandlerOutput => ({
  responseBody: new NullStream(),
  status: 500,
  headers: new Map([['Content-Length', '0']]),
});

export const badInput = (): HandlerOutput => ({
  responseBody: new NullStream(),
  status: 400,
  headers: new Map([['Content-Length', '0']]),
});
