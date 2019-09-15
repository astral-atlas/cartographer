// @flow strict
/*:: import type { Route } from '@lukekaalim/server'; */

const contentLengthMiddleware = () => (route/*: Route*/)/*: Route*/ => {
  const handlerWithContentLength = async (req) => {
    const response = await route.handler(req);
    return {
      ...response,
      headers: {
        ...response.headers,
        'Content-Length': Buffer.from(response.body).length.toString(),
      },
    };
  };
  return {
    ...route,
    handler: handlerWithContentLength,
  }
};

module.exports = {
  contentLengthMiddleware,
};