// @flow strict
/*:: import type { Route } from '@lukekaalim/server'; */

const contentTypeMiddleware = (contentType/*: string*/ = 'application/json') => (route/*: Route*/)/*: Route*/ => {
  const handlerWithContentType = async (req) => {
    const response = await route.handler(req);
    return {
      ...response,
      headers: {
        ...response.headers,
        'Content-Type': contentType,
      },
    };
  };
  return {
    ...route,
    handler: handlerWithContentType,
  }
};

module.exports = {
  contentTypeMiddleware,
};