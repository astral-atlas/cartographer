// @flow strict
const { contentLengthMiddleware } = require('./middleware/contentLength');
const { crossOriginMiddleware } = require('./middleware/crossOrigin');
const { contentTypeMiddleware } = require('./middleware/contentType');
const { catchErrorMiddleware } = require('./middleware/catchError');
const { logEventsMiddleware } = require('./middleware/logEvents');
/*::
import type { Route } from '@lukekaalim/server';
import type { EventLogger } from '../services/log.2';
import type { Config } from '../models/config';
*/

/*::
export type RouteEnhancer = Route => Route;
*/

const createSTDMiddlewareEnhancer = (
  logger/*: EventLogger*/,
  config/*: Config*/,
)/*: RouteEnhancer*/ => (route) => {
  const middleware = [
    catchErrorMiddleware(logger),
    contentLengthMiddleware(),
    contentTypeMiddleware(),
    logEventsMiddleware(logger),
    crossOriginMiddleware(config),
  ];
  const enhancedRoute = middleware.reduce((currentRoute, enhancer) => enhancer(currentRoute), route);
  return enhancedRoute;
};

module.exports = {
  createSTDMiddlewareEnhancer,
};
