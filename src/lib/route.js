// @flow
/*::
import type { HTTPMethod } from '@lukekaalim/server';
import type { RouteMiddleware } from '../routes/routeMiddleware';
import type { EventLogger } from '../services/log.2';
*/
const { createRoute, createRESTRoute, createRESTResponse } = require('@lukekaalim/server');
const { toTuples } = require('./tuple');
const { noOrigin, unknownOrigin } = require('../events/routeEvents');

/*::
export type CORSSettings = {
  originAllowed: boolean,
  methodsAllowed: Array<HTTPMethod>,
  headersAllowed: Array<string>,
  exposedHeadersAllowed: Array<string>,
  allowCredentials: boolean,
  maxAgeSeconds: number,
};
*/

const corsMiddleware = (logger/*: EventLogger*/, originsCORSSettingsMap/*: Map<string, CORSSettings>*/)/*: RouteMiddleware*/ => (createRoute) => (method, path, handler) => {
  const handlerWithCORS = async (query, headers, body) => {
    const response = await handler(query, headers, body);
    const origin = headers.get('Origin');
    const corsDisallowedResponse = {
      ...response,
      headers: [
        ...response.headers,
        ['Vary', 'origin']
      ],
    };
    if (!origin) {
      logger.log(noOrigin(path, method));
      return corsDisallowedResponse;
    }
    const corsSettings = originsCORSSettingsMap.get(origin);
    if (!corsSettings) {
      logger.log(unknownOrigin(path, method));
      return corsDisallowedResponse;
    }
    const { originAllowed } = corsSettings;
    return {
      ...response,
      headers: [
        ...response.headers,
        ['Vary', 'origin'],
        originAllowed ? ['Access-Control-Allow-Origin', origin] : null
      ].filter(Boolean),
    }
  };
  return createRoute(method, path, handlerWithCORS);
};

const createOPTIONSRoute = (path/*: string*/, originsCORSSettingsMap/*: Map<string, CORSSettings>*/) => {
  return createRESTRoute('OPTIONS', path, (_, requestHeaders) => {
    const origin = requestHeaders.get('origin')
    if (!origin) {
      return createRESTResponse(200, '', [['Vary', 'origin']]);
    }
    const originCORSSettings = originsCORSSettingsMap.get(origin);
    if (!originCORSSettings) {
      return createRESTResponse(200, '', [['Vary', 'origin']]);
    }
    const {
      originAllowed, methodsAllowed, headersAllowed,
      maxAgeSeconds, allowCredentials, exposedHeadersAllowed
    } = originCORSSettings;
    const responseHeaders = [
      ['Vary', 'Origin'],
      originAllowed ? ['Access-Control-Allow-Origin', origin] : null,
      ['Access-Control-Allow-Methods', methodsAllowed.join(', ')],
      ['Access-Control-Allow-Headers', headersAllowed.join(', ')],
      allowCredentials ? ['Access-Control-Allow-Credentials', 'true'] : null,
      ['Access-Control-Max-Age', maxAgeSeconds.toString()],
      ['Access-Control-Expose-Headers', exposedHeadersAllowed.join(', ')]
    ].filter(Boolean);
    return createRESTResponse(200, '', responseHeaders);
  });
};

module.exports = {
  createOPTIONSRoute,
  corsMiddleware,
};