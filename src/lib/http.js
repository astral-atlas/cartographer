// @flow
import type { IncomingMessage, ServerResponse } from 'http';

export type RouteHandler = (inc: IncomingMessage, res: ServerResponse) => mixed;
export type RouteTest = (inc: IncomingMessage) => boolean;

export type Route = {
  test: (inc: IncomingMessage) => boolean,
  handler: (inc: IncomingMessage, res: ServerResponse) => mixed,
};

export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'OPTIONS'
  | 'HEAD'
  | 'PUT'
  | 'DELETE'


export const buildQueries = (queryString: string): Map<string, string> => (
  new Map(queryString
    .split('&')
    .map(querySet => querySet.split('='))
    .map(queryElements => [queryElements[0], queryElements[1]])
  )
);

export const buildHeaders = (rawHeaders: Array<string>): Map<string, string> => (
  new Map(rawHeaders
    .filter((_, index) => index % 2 === 0)
    .map((headerName, index) => ([headerName.toLowerCase(), rawHeaders[(index * 2) + 1]]))
  )
);
