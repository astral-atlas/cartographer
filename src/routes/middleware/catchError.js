// @flow strict
/*::
import type { Route } from '@lukekaalim/server';
import type { EventLogger } from '../../services/log.2';
*/
const { errorRoute } = require('../../events/routeEvents');
const { internalServerError } = require('@lukekaalim/server');

const catchErrorMiddleware = (logger/*: EventLogger*/) => (route/*: Route*/)/*: Route*/ => {
  const handlerWithErrorCatching = async (req) => {
    try {
      return await route.handler(req);
    } catch (err) {
      logger.log(errorRoute(err));
      return internalServerError('Unexpected internal server error');
    }
  };
  return {
    ...route,
    handler: handlerWithErrorCatching,
  }
};

module.exports = {
  catchErrorMiddleware
};