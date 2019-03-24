// @flow
import type { HandlerOutput } from './routeHandler';
import { StringStream, NullStream } from './stream';
import { createETag } from './etag';
import { TypedMap } from './typedMap';

export const addHeaders = (out: HandlerOutput, newHeaders: Map<string, string>): HandlerOutput => ({
  ...out,
  headers: new TypedMap([...out.headers.entries(), ...newHeaders]),
});

export const ok = (response: mixed = null): HandlerOutput => {
  const stringifiedResponse = JSON.stringify(response);
  if (stringifiedResponse === undefined) {
    throw new Error('Cannot serialized undefined to String Stream');
  }
  const responseBody = new StringStream(stringifiedResponse);
  const status = 200;
  const headers = new TypedMap([
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
  headers: new TypedMap([['Content-Length', '0']]),
});

export const notFound = (): HandlerOutput => ({
  responseBody: new NullStream(),
  status: 404,
  headers: new TypedMap([['Content-Length', '0']]),
});

export const internalServerError = (): HandlerOutput => ({
  responseBody: new NullStream(),
  status: 500,
  headers: new TypedMap([['Content-Length', '0']]),
});

export const badInput = (): HandlerOutput => ({
  responseBody: new NullStream(),
  status: 400,
  headers: new TypedMap([['Content-Length', '0']]),
});
