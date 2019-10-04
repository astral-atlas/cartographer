// @flow strict
/*::
import type { Route } from '@lukekaalim/server';
import type { EventLogger } from '../../services/log.2';
*/
const { respondRoute, receiveRoute } = require('../../events/routeEvents');

const logEventsMiddleware = (logger/*: EventLogger*/) => (route/*: Route*/)/*: Route*/ => {
  const handlerWithLogging = async (req) => {
    logger.log(receiveRoute(route.path, route.method));
    const response = await route.handler(req);
    logger.log(respondRoute(route.path, route.method, response.status));
    return response;
  };
  return {
    ...route,
    handler: handlerWithLogging,
  }
};

module.exports = {
  logEventsMiddleware
};