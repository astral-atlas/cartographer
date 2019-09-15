// @flow
const { expect, assert, expectAll } = require('@lukekaalim/test');

const expectEachRouteMiddlewareToBeCalled = expect(() => {
  return assert('It works', true);
});

const expectMiddleware = expectAll('Expect the middleware to enhance routes passed to it with shared functionality', [
  expectEachRouteMiddlewareToBeCalled,
]);

module.exports = {
  expectMiddleware
};