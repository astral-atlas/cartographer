// @flow
import type { HTTPMethod } from '../types';
import type { ScribeRouteHandler, ScribeRoute } from '../routes';
import type { Logger } from '../services/logger';
import { buildBody, buildCORSHeaders, setHeaders, simpleMatch, buildCORSPreflightRoute } from './utils';
import { handleRouteErrorResponse } from './routeErrors';
import { ScribeRouteError } from '../routes';

function ResponseSerializationError(routeName: string, errMessage: string) {
  return new ScribeRouteError(
    routeName,
    `There was an issue serializing the response to a JSON string `+
    `and writing it to the response stream.\n${errMessage}`
  );
}

export type APIHandler = (info: RequestInfo) => Promise<mixed>;

export type RequestInfo = {
  path: string,
  queries: Map<string, string>,
  headers: Map<string, string>,
  getBody: <T>() => Promise<T>,
};

export type APIRoute = {
  name: string,
  url: string,
  method: HTTPMethod,
  handler: APIHandler,
  usesCredentials?: boolean,
};

export const buildHandlerForApiRoute = (
  route: APIRoute,
  logger: Logger<Error>
): ScribeRouteHandler => (inc, res) => {
  (async () => {
    try {
      const [path, queryString] = inc.url.split('?');

      const queries = new Map((queryString || '')
        .split('&')
        .map(querySet => querySet.split('='))
        .map<[string, string]>(queryElements => ([queryElements[0], queryElements[1]]))
      );

      const headers = new Map(inc.rawHeaders
        .filter((_, index) => index % 2 === 0)
        .map<[string, string]>((headerName, index) => ([headerName.toLowerCase(), inc.rawHeaders[(index * 2) + 1]]))
      );

      const requestInfo: RequestInfo = {
        path,
        queries,
        headers,
        getBody: async () => JSON.parse(await buildBody(inc)),
      };

      setHeaders(buildCORSHeaders([route.method], route.usesCredentials), res);
      const response = await route.handler(requestInfo);
      res.statusCode = 200;
      try {
        const stringifiedResponse = JSON.stringify(response);
        res.write(stringifiedResponse);
      } catch (serializationErr) {
        throw new ResponseSerializationError(route.name, serializationErr.message);
      }
    } catch(err) {
      logger.log(err);
      handleRouteErrorResponse(res, err);
    }
    res.end();
  })();
};

const makeUrlAPIRouteMap = (routes: Array<APIRoute>): Map<string, Array<APIRoute>> => {
  const urlAPIRouteMap = new Map();
  routes.forEach(route => {
    const routeArray = urlAPIRouteMap.get(route.url);
    if(!routeArray) {
      return urlAPIRouteMap.set(route.url, [route]);
    }
    return urlAPIRouteMap.set(route.url, [...routeArray, route]);
  });
  return urlAPIRouteMap;
};

export const buildAPIRoutes = (
  routes: Array<APIRoute>,
  logger: Logger<Error>,
): Array<ScribeRoute> => {
  const urlAPIRouteMap = makeUrlAPIRouteMap(routes);

  const urlScribeRouteMap = Array.from(urlAPIRouteMap, ([url, urlRoutes]) => {
    const methods = urlRoutes.map(route => route.method);
    const useCredentials = !!urlRoutes.find(route => route.usesCredentials);
    const preflightRoute = buildCORSPreflightRoute(
      `${url} CORS Preflight Route`,
      url,
      methods,
      useCredentials
    );
    return [
      preflightRoute,
      ...urlRoutes.map(route => ({
        name: route.name,
        test: simpleMatch(route.url, route.method),
        handler: buildHandlerForApiRoute(route, logger),
      }))
    ];
  });

  return urlScribeRouteMap.reduce((acc, curr) => ([ ...acc, ...curr]), []);
};
