// @flow
import type { IncomingMessage, ServerResponse } from 'http';
import type { STDRoute } from './route';
import { AtlasScribeError } from '../errors';

export type ServerListener = {
  listener: (inc: IncomingMessage, res: ServerResponse) => mixed,
};

export class UnhandledRouteError extends AtlasScribeError {
  constructor(unhandledRouteUrl: string) {
    super(
      'Unhandled Route Error\nThe server could not handle an incoming' +
      `request at:\n${unhandledRouteUrl}`
    );
  }
}

export const createServerListenerFromStdRoutes = (stdRoutes: Array<STDRoute>): ServerListener => {
  const listener = (inc, res) => {
    const route = stdRoutes.find(route => route.test(inc));
    if (!route) {
      throw new Error('Unhandled Route Exception');
    }
    route.handler(inc, res);
  };

  return {
    listener,
  };
};
