// @flow
const { createRESTRoute, createRESTResponse } = require('@lukekaalim/server');
const { handle } = require('@lukekaalim/result');
const { nameModel, modelObject, stringModel, numberModel } = require('@lukekaalim/model');

const { sessionIdModel } = require('../models/session');
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

const addSessionBody = nameModel('Add Session Body', modelObject({
  title: stringModel,
  startTime: numberModel,
}));

const createSessionRoutes = (logger/*: EventLogger*/, service/*: SessionService*/) => {
  const createEnhancedRoute = enhanceRouteWithMiddleware(logger, createRESTRoute, new Map([['localhost', corsSettings]]));

  const headSessions = createOPTIONSRoute('/sessions', new Map([['localhost', corsSettings]]));

  const listRoute = createEnhancedRoute('GET', '/sessions', async () => {
    return handle(await service.listSessions(),
      sessions => ok(JSON.stringify(sessions)),
      failure => internalServerError(failure.message),
    );
  });

  const addRoute = createRESTRoute('POST', '/sessions', async (q, h, rawBody) => {
    if (!rawBody) {
      return invalidRequest('Missing Body');
    }
    return handle(addSessionBody.from(JSON.parse(rawBody)),
      async (body) => handle(await service.addNewSession(body.title, body.startTime),
        session => ok(JSON.stringify(session)),
        failure => internalServerError(failure.message),
      ),
      failure => invalidRequest(failure.message)
    );
  });

  const removeRoute = createRESTRoute('DELETE', '/sessions', async (query) => {
    const sessionId = query.get('sessionId');
    if (!sessionId) {
      return invalidRequest('Missing ?sessionId=${sessionID}');
    }
    return handle(sessionIdModel.from(sessionId),
      async sessionId => handle(await service.deleteSession(sessionId),
        () => ok(),
        failure => invalidRequest(failure.message),
      ),
      failure => invalidRequest(failure.message),
    );
  });

  const getLatest = createRESTRoute('GET', '/sessions/latest', async (query) => {
    const currentTime = parseInt(query.get('currentTime'));
    if (!currentTime) {
      return invalidRequest('Missing ?currentTime=${number}');
    }
    return handle(await service.getNextSession(currentTime),
      session => ok(JSON.stringify(session)),
      failure => invalidRequest(failure.message), 
    );
  });

  return [
    addRoute,
    listRoute,
    getLatest,
    removeRoute,
  ];
};

module.exports = {
  createSessionRoutes,
};
