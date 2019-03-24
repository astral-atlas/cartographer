// @flow
import type { IncomingMessage, ServerResponse } from 'http';
import { buildAppRoutes } from './app';
import { createServerListenerFromStdRoutes } from './lib/server';


export const buildListener = async () => {
  const routes = await buildAppRoutes();

  const { listener } = createServerListenerFromStdRoutes(routes);

  return (inc: IncomingMessage, res: ServerResponse) => {
    try {
      listener(inc, res);
    } catch (err) {
      console.error(err);  // eslint-disable-line no-console
      res.end();
    }
  };
};
