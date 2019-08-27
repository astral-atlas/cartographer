// @flow
const { receiveRoute, respondRoute } = require('../events/routeEvents');
/*::
import typeof { createRESTRoute as CreateRESTRouteFunction } from '@lukekaalim/server';
import type { EventLogger } from '../services/log.2';
*/

/*::
type Middleware = CreateRESTRouteFunction => CreateRESTRouteFunction;
*/

const composeMiddleware = (middlewares/*: Array<Middleware>*/, createRestRoute) => {
  return middlewares.reduce((acc, curr) => curr(acc), createRestRoute);
};

const loggerMiddleware = (logger) => (createRestRoute) => (method, path, handler) => {
  const handlerWithLogging = async (query, headers, body) => {
    logger.log(receiveRoute(path, method));
    const result = await handler(query, headers, body);
    logger.log(respondRoute(path, method, result.status));
    return result;
  };
  return createRestRoute(method, path, handlerWithLogging);
};

const contentLengthMiddleware = () => (createRestRoute) => (method, path, handler) => {
  const handlerWithContentLength = async (query, headers, body) => {
    const result = await handler(query, headers, body);
    return {
      ...result,
      headers: [...result.headers, ['Content-Length', Buffer.from(result.body).length.toString()]],
    };
  };
  return createRestRoute(method, path, handlerWithContentLength);
};

const contentTypeMiddleware = (contentType = 'application/json') => (createRestRoute) => (method, path, handler) => {
  const handlerWithContentType = async (query, headers, body) => {
    const result = await handler(query, headers, body);
    return {
      ...result,
      headers: [...result.headers, ['Content-Type', contentType]],
    };
  };
  return createRestRoute(method, path, handlerWithContentType);
};

const enhanceRouteWithMiddleware = (
  logger/*: EventLogger*/,
  createRESTRoute/*: CreateRESTRouteFunction*/,
)/*: CreateRESTRouteFunction*/ => (
  method, path, handler
) => {
  const middleware = [
    loggerMiddleware(logger),
    contentLengthMiddleware(),
    contentTypeMiddleware('application/json'),
  ];
  const handlerWithMiddleware2 = composeMiddleware(middleware, createRESTRoute)
  const result = handlerWithMiddleware2(method, path, handler);
  return result;
};

module.exports = {
  enhanceRouteWithMiddleware,
};
