// @flow
import type { HTTPMethod, RouteHandler, RouteTest, Route } from './http';
import type { Readable } from 'stream';
import { buildQueries, buildHeaders } from './http';
import { buildCORSHeaderTuples } from './header';
import { toObjectFromTuples } from './object';
import { isUnique, flatten } from './array';
import { StringStream } from './stream';

/**
 * Custom Object describing an incoming message ala IncomingMessage from 'http'
 */
export type APIRouteIncomingMessage = {
  path: string,
  queries: Map<string, string>,
  headers: Map<string, string>,
  requestBody: Readable,
};

export type APIRouteServerResponse = {
  status: number,
  headers: Array<[string, string]>,
  responseBody: Readable,
};

export type APIRouteRequestHandler = (inc: APIRouteIncomingMessage) => Promise<APIRouteServerResponse>;

export type APIRoute = {
  path: string,
  handler: APIRouteRequestHandler,
  method: HTTPMethod,
  allowAuthorization: boolean,
};

const buildHandlerForApiRoute = (route: APIRoute): RouteHandler => async (incomingMessage, serverResponse) => {
  const { rawHeaders, url } = incomingMessage;
  const [path = '', queryString = ''] = url.split('?');

  const requestInfo = {
    path,
    queries: buildQueries(queryString),
    headers: buildHeaders(rawHeaders),
    requestBody: incomingMessage,
  };

  const response = await route.handler(requestInfo);
  const headers = [
    ...buildCORSHeaderTuples([route.method], route.allowAuthorization, '*'),
    ...response.headers,
  ];

  serverResponse.writeHead(response.status, toObjectFromTuples(headers));
  response.responseBody.pipe(serverResponse);
};

const buildTestForApiRoute = (route: APIRoute): RouteTest => (incomingMessage) => {
  const { url } = incomingMessage;
  const [path] = url.split('?');

  return route.path === path;
};

const buildOptionsRoute = (
  url: string,
  methods?: Array<HTTPMethod> = ['GET'],
  usesCredentials?: boolean = false,
  origin?: string = '*',
): Route => ({
  test: inc => inc.url === url && inc.method === 'OPTIONS',
  handler: (inc, res) => {
    const headers = buildCORSHeaderTuples(methods, usesCredentials, origin);
    res.writeHead(200, toObjectFromTuples(headers));
    res.end();
  }
});

const toRouteFromApiRoute = (route: APIRoute): Route => ({
  test: buildTestForApiRoute(route),
  handler: buildHandlerForApiRoute(route),
});

const collectRoutesByUrl = (routes: Array<APIRoute>): Array<[string, Array<APIRoute>]> => (
  routes
    .map(route => route.path)
    .filter(isUnique)
    .map(path => [path, routes.filter(route => route.path === path)])
);

export const buildApiRoutes = (
  apiRoutes: Array<APIRoute>,
): Array<Route> => (
  collectRoutesByUrl(apiRoutes)
    .map(([url, collectedApiRoutes]) => {
      const preflightRoute = buildOptionsRoute(url, collectedApiRoutes.map(route => route.method), !!collectedApiRoutes.find(route => route.allowAuthorization));
      const convertedRoutes = collectedApiRoutes.map(toRouteFromApiRoute);
      return [preflightRoute, ...convertedRoutes];
    })
    .reduce(flatten, [])
);

export const ok = (response: mixed): APIRouteServerResponse => {
  const responseBody = new StringStream(JSON.stringify(response));
  const status = 200;
  const headers = [
    ['Content-Type', 'application/json'],
    ['Content-Length', responseBody.getLength().toString(10)],
  ];
  return {
    responseBody,
    status,
    headers,
  };
};
