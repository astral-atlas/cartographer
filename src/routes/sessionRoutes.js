// @flow
const { ok, createRoute, internalServerError, badRequest } = require('@lukekaalim/server');
const { handle } = require('@lukekaalim/result');
const { nameModel, modelObject, stringModel, numberModel } = require('@lukekaalim/model');

const { sessionIdModel } = require('../models/session');
const { createSTDMiddlewareEnhancer } = require('./routeMiddleware');
const { errorRoute } = require('../events/routeEvents');
/*::
import type { SessionService } from '../services/atlas/sessionService';
import type { EventLogger } from '../services/log.2';
import type { Config } from '../models/config';
import type { Route } from '@lukekaalim/server';
*/

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

const createSessionRoutes = (
  logger/*: EventLogger*/,
  config/*: Config*/,
  service/*: SessionService*/
)/*: Array<Route>*/ => {
  const enhanceRoute = createSTDMiddlewareEnhancer(logger, config);

  const listSessionsRoute = createRoute('/sessions', 'GET', async () => {
    const listResult = await service.listSessions();
    if (listResult.type === 'failure')
      return internalServerError('There was an issue with the Session Service');
    return ok(JSON.stringify(listResult.success));
  });

  const addSessionRoute = createRoute('/sessions', 'POST', async (request) => {
    if (!request.body)
      return badRequest('Missing request BODY, must be JSON formatted input');
    const bodyParseResult = addSessionBody.from(JSON.parse(request.body));
    if (bodyParseResult.type === 'failure')
      return badRequest(bodyParseResult.failure.message);
    const body = bodyParseResult.success;
    const addSessionResult = await service.addNewSession(body.title, body.startTime);
    if (addSessionResult.type === 'failure')
      return internalServerError('There was an issue with the Session Service');
    const session = addSessionResult.success;
    return ok(JSON.stringify(session));
  });

  const deleteSessionRoute = createRoute('/sessions', 'DELETE', async (request) => {
    const sessionIdQuery = request.query.get('id');
    if (!sessionIdQuery)
      return badRequest('Missing ?id=${sessionID}');
    const sessionIdResult = sessionIdModel.from(sessionIdQuery);
    if (sessionIdResult.type === 'failure')
      return badRequest(sessionIdResult.failure.message);
    const deleteSessionResult = await service.deleteSession(sessionIdResult.success);
    if (deleteSessionResult.type === 'failure')
      return internalServerError('There was an issue with the Session Service');
    return ok();
  });

  const getLatestSessionRoute = createRoute('/sessions/latest', 'GET', async (request) => {
    const currentTime = parseInt(request.query.get('currentTime'));
    if (!currentTime) {
      return badRequest('Missing ?currentTime=${number}');
    }
    const getNextSessionResult = await service.getNextSession(currentTime);
    if (getNextSessionResult.type === 'failure')
      return internalServerError('There was an issue with the Session Service');
    return ok(JSON.stringify(getNextSessionResult.success));
  });

  return [
    listSessionsRoute,
    addSessionRoute,
    deleteSessionRoute,
    getLatestSessionRoute,
  ].map(route => enhanceRoute(route));
};

module.exports = {
  createSessionRoutes,
};
