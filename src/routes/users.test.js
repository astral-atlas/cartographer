// @flow
const { expect, expectAll, assert } = require('@lukekaalim/test');
const { createUserRoutes } = require('./users.2');

const createMockLogger = () => ({
  log: () => {},
});

const expectUserDelete = expect(async () => {
  const routes = createUserRoutes(createMockLogger(), createMockUserService());
});

const expectUsersRoute = expectAll('Users routes should allow management of users', [
  expectUserDelete,
]);

module.exports = {
  expectUsersRoute,
}