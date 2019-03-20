// @flow
import type { IncomingMessage, ServerResponse } from 'http';
import type { HTTPMethod } from './http';
import type { RouteHandler } from './routeHandler';
import type { CORSOptions } from './cors';

import {
  createRouteHandlerInput,
  writeRouteServerResponseToHead,
  writeRouteServerResponseToBody,
} from './routeHandler';
import { writeCorsHeadersToHead } from './cors';


export type STDRoute = {
  test: (inc: IncomingMessage) => boolean,
  handler: (inc: IncomingMessage, res: ServerResponse) => mixed,
};

export type APIRoute = {
  path: string,
  method: HTTPMethod,
  handler: RouteHandler,
  corsOptions: CORSOptions,
};

export const createStdRouteFromApiRoute = (apiRoute: APIRoute): STDRoute => {
  const test = (inc) => {
    // split across ? to ignore queries
    const pathMatch = inc.url.split('?')[0] === apiRoute.path;
    const methodMatch = inc.method === apiRoute.method;
    return pathMatch && methodMatch;
  };
  const handler = async (inc, res) => {
    const input = createRouteHandlerInput(inc);
    const output = await apiRoute.handler(input);
    writeRouteServerResponseToHead(res, output);
    writeCorsHeadersToHead(res, apiRoute.corsOptions);
    writeRouteServerResponseToBody(res, output);
  };

  return {
    test,
    handler,
  };
};

export type OptionsRoute = {
  path: string,
  corsOptions: CORSOptions,
};

export const createStdRouteFromOptionsRoute = (optionsRoute: OptionsRoute): STDRoute => {
  const test = (inc) => {
    // split across ? to ignore queries
    const pathMatch = inc.url.split('?')[0] === optionsRoute.path;
    const methodMatch = inc.method === 'OPTIONS';
    return pathMatch && methodMatch;
  };
  const handler = async (inc, res) => {
    res.statusCode = 200;
    writeCorsHeadersToHead(res, optionsRoute.corsOptions);
    res.end();
  };

  return {
    test,
    handler,
  };
};
