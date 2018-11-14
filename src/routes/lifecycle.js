// @flow
import type { Services } from '../services';
import type { IncomingMessage, ServerResponse } from 'http';

export const buildLifecycleRoutes = (services: Services) => [
  {
    name: '404 Not Found',
    test: () => true,
    handler: (inc: IncomingMessage, res: ServerResponse) => {
      services.logging.logWarn(`Served URL\n${inc.url}\n${inc.method}\nwith 404 - Resource Not Found`);
      res.statusCode = 404;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.write('404 - Resource Not Found');
      res.end();
    }
  }
];