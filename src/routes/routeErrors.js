// @flow
import type { ServerResponse } from 'http';
import { AtlasScribeError } from '../errors';

/**
 * A generic error for a route. These routes are inherently uninfomrmative,
 * and are used to send a message back to the client. They should not expose any
 * private or important information, only generic top level description of what
 * happened
 */
export class RouteError extends AtlasScribeError {
  constructor(message: string) {
    super(message);
  }
}

export class POSTInputError extends AtlasScribeError {
  constructor(message: string) {
    super(message);
  }
}
