// @flow
import type { IncomingMessage, ServerResponse } from 'http';
import { buildAppRoutes } from './app';
import { AtlasScribeError } from './errors';

function UnhandledRouteError(unhandledRouteUrl) {
  return new AtlasScribeError(
    'Unhandled Route Error\nThe server could not handle an incoming'+
    `request at:\n${unhandledRouteUrl}`
  );
}

export const buildListener = async () => {
  const routes = await buildAppRoutes();

  return (inc: IncomingMessage, res: ServerResponse) => {
    try {
      const activeRoute = routes.find(route => route.test(inc));
      if (activeRoute) {
        activeRoute.handler(inc, res);
      } else {
        throw new UnhandledRouteError(inc.url);
      }
    } catch (err) {
      console.error(err);  // eslint-disable-line no-console
      res.end();
    }
  };
};
