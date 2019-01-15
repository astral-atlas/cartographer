// @flow
import type { IncomingMessage, ServerResponse } from 'http';
import type { Logger } from '../services/logger';

export const buildFallbackRoute = ({ log }: Logger<string>) => [
  {
    name: '404: Not Found',
    test: () => true,
    handler: (inc: IncomingMessage, res: ServerResponse) => {
      log(
        `Served URL\n${inc.url}\n${inc.method}\nwith 404 - Resource Not `+
        'Found\n This is because the fallback route responded'
      );
      res.statusCode = 404;
      res.write('404 - Resource Not Found');
      res.end();
    }
  }
];
