// @flow
const { readFile } = require('fs').promises;
const { join } = require('path');
const { contractModel, withContractClient } = require('@lukekaalim/contract');
const { expect, assert } = require('@lukekaalim/test');
const { createServer } = require('http');
const { createListener, notFound } = require('@lukekaalim/server');

const { createUser } = require('../models/user');

const { createCartographer } = require('../cartographer');
const { createSessionRoutes } = require('./sessionRoutes');
const { createSessionService } = require('../services/atlas/sessionService');
const { createMemoryMapStore } = require('../services/storage');

const resultOrThrow = result => {
  if (result.type === 'failure')
    throw new Error(result);
  return result.success;
}

const createMockLogger = () => ({
  log: () => {},
});

const withHttpServer = async (listener, serverHandler) => {
  const server = createServer(listener);
  await new Promise(resolve => server.listen(0, () => resolve()));
  try {
    return await serverHandler(server.address());
  } finally {
    await new Promise(resolve => server.close(() => resolve()));
  }
};

const expectSessionContract = (topographPath/*: string*/) => expect(async () => {
  const contractFile = await readFile(join(topographPath, 'session', 'getSession.json'), 'utf-8');
  const contract = resultOrThrow(contractModel.from(JSON.parse(contractFile)));

  const config = {
    authentication: { type: 'fixed', name: 'luke', pass: '123', userId: createUser().id },
    cors: { origins: [] },
    port: 0,
    storage: { type: 'memory' }
  };
  const logger = createMockLogger();
  const userService = createSessionService(createMemoryMapStore());
  await userService.addNewSession('The end is Night', Date.now());
  const listener = createListener(createSessionRoutes(logger, config, userService), () => notFound());

  const serverResult = await withHttpServer(listener, ({ port }) => {
    return withContractClient(contract, `http://localhost:${port}`, client => {
      return client.execute();
    });
  });
  if (serverResult.type === 'failure') return assert(serverResult.failure.message, false);
  const contractResult = await serverResult.success;
  if (contractResult.type === 'failure') return assert(contractResult.failure.message, false);

  return assert('It worked?', contractResult.type === 'success');
});

module.exports = {
  expectSessionContract,
}
