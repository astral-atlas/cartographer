// @flow
import type { Readable } from 'stream';
import type { IncomingMessage, ServerResponse } from 'http';

import { reduceArray, toGroupsOf } from './reduce';
import { toArity2 } from './tuple';

// routeHandler.js is a simple abstraction over
// request/response that http.createServer() uses as its handler

export type HandlerInput = {
  path: string,
  queries: Map<string, string>,
  headers: Map<string, string>,
  requestBody: Readable,
};

export type HandlerOutput = {
  status: number,
  headers: Map<string, string>,
  responseBody: Readable,
};

// It allows us to define a route handler as a async function that accepts the incoming message
// and will resolve to a response.
export type RouteHandler = (inc: HandlerInput) => Promise<HandlerOutput>;

export const createRouteHandlerInput = (inc: IncomingMessage): HandlerInput => {
  const { url, statusCode, rawHeaders } = inc;
  const [path = '', queryString = ''] = url.split('?');
  const headers = new Map(
    // rawHeaders is an array of header name and values mixed together like:
    // ['header1Name', 'header1Value', 'header2Name', 'header2Value']
    // so we map them to:
    //[['header1Name', 'header1Value'], ['header2Name', 'header2Value']]
    reduceArray(rawHeaders, toGroupsOf(2), [])
      .map(toArity2)
  );
  const queries = new Map(
    queryString
      .split('&')
      .map(querySet => querySet.split('='))
      .map(toArity2)
  );
  
  return {
    path,
    queries,
    status: statusCode,
    headers,
    requestBody: inc,
  };
};

export const writeRouteServerResponseToHead = (res: ServerResponse, out: HandlerOutput) => {
  res.statusCode = out.status;
  [...out.headers].forEach(([headerName, headerValue]) => {
    res.setHeader(headerName, headerValue);
  });
};

export const writeRouteServerResponseToBody = (res: ServerResponse, out: HandlerOutput) => {
  out.responseBody.pipe(res);
};
