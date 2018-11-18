// @flow
import type { IncomingMessage, ServerResponse } from 'http';
import type { ScribeConfig } from '../config';

import { AtlasScribeError } from '../errors';
import { buildChapterRoutes } from './chapters';

export type ScribeRouteHandler = (inc: IncomingMessage, res: ServerResponse) => void;
export type ScribeRouteTest = (inc: IncomingMessage) => boolean;

export type ScribeRoute = {
  name: string,
  test: ScribeRouteTest,
  handler: ScribeRouteHandler,
};

export function ScribeRouteError (routeName: string, message: string) {
  return new AtlasScribeError(`The current route is ${routeName}\n${message}`);
}
