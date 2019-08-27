// @flow
const { receiveRoute, respondRoute } = require('../events/routeEvents');
/*::
import typeof { createRESTRoute as CreateRESTRouteFunction } from '@lukekaalim/server';
import type { EventLogger } from '../services/log.2';
*/

const enhanceRouteWithMiddleware = (
  logger/*: EventLogger*/,
  createRESTRoute/*: CreateRESTRouteFunction*/,
)/*: CreateRESTRouteFunction*/ => (
  method, path, handler
) => {
  const handlerWithMiddleware = async (query, headers, body) => {
    logger.log(receiveRoute(path, method));
    const result = await handler(query, headers, body);
    logger.log(respondRoute(path, method));
    return result;
  };
  const result = createRESTRoute(method, path, handlerWithMiddleware);
  return result;
};

module.exports = {
  enhanceRouteWithMiddleware,
};
