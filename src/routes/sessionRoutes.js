// @flow
const { createRESTRoute, createRESTResponse } = require('@lukekaalim/server');
const { handle } = require('@lukekaalim/result');

const { toUserID } = require('../models/user');
const { enhanceRouteWithMiddleware } = require('./routeMiddleware');
const { errorRoute } = require('../events/routeEvents');
const { createOPTIONSRoute } = require('../lib/route');
/*::
import type { SessionService } from '../services/atlas/sessionService';
import type { EventLogger } from '../services/log.2';
*/

const ok =                  body => createRESTResponse(200, body);
const invalidRequest =      body => createRESTResponse(400, body);
const notFound =            body => createRESTResponse(404, body);
const internalServerError = body => createRESTResponse(500, body);

const corsSettings = {
  originAllowed: true,
  allowCredentials: false,
  exposedHeadersAllowed: [],
  headersAllowed: [],
  maxAgeSeconds: 60,
  methodsAllowed: ['GET', 'POST', 'DELETE', 'OPTIONS'],
};

const createSessionRoutes = (logger/*: EventLogger*/, service/*: SessionService*/) => {
  const createEnhancedRoute = enhanceRouteWithMiddleware(logger, createRESTRoute, new Map([['localhost', corsSettings]]));

  const headSessions = createOPTIONSRoute('/sessions', new Map([['localhost', corsSettings]]));

  const listRoute = createEnhancedRoute('GET', '/sessions', async () => {
    return handle(await service.listSessions(),
      sessions => ok(JSON.stringify(sessions)),
      failure => internalServerError(failure.message),
    );
  });

  return [
    listRoute,
  ];
};

module.exports = {
  createSessionRoutes,
};
