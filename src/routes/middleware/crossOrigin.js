// @flow strict
/*::
import type { Route } from '@lukekaalim/server';
import type { Config } from '../../models/config';
*/

const crossOriginMiddleware = (config/*: Config*/) => (route/*: Route*/)/*: Route*/ => {
  const handlerWithContentType = async (req) => {
    const origin = req.headers.get('origin')
    const response = await route.handler(req);
    if (config.cors.origins.includes(origin)) {
      return {
        ...response,
        headers: {
          ...response.headers,
          'Access-Control-Allow-Origin': origin,
        },
      };
    } else {
      return response;
    }
  };
  return {
    ...route,
    handler: handlerWithContentType,
  }
};

module.exports = {
  crossOriginMiddleware,
};