// @flow
const { readFile } = require('fs').promises;
const { join } = require('path');
const { contractModel, withContractClient } = require('@lukekaalim/contract');
const { expect, assert, expectAll } = require('@lukekaalim/test');
const { createServer } = require('http');
const { createListener, notFound } = require('@lukekaalim/server');

const { createUser } = require('../models/user');
const { createSession } = require('../models/session');

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

const expectGetSessionContract = (topographPath) => expect(async () => {
  const contractFile = await readFile(join(topographPath, 'session', 'getSession.json'), 'utf-8');
  const contract = resultOrThrow(contractModel.from(JSON.parse(contractFile)));

  const config = {
    authentication: { type: 'none' },
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

  return assert('Sessions should fulfil the getSession contract', contractResult.type === 'success');
});

const expectDeleteSessionContract = (topographPath) => expect(async () => {
  const contractFile = await readFile(join(topographPath, 'session', 'deleteSession.json'), 'utf-8');
  const contract = resultOrThrow(contractModel.from(JSON.parse(contractFile)));

  const config = {
    authentication: { type: 'none' },
    cors: { origins: [] },
    port: 0,
    storage: { type: 'memory' }
  };
  const memoryMap = createMemoryMapStore();
  const logger = createMockLogger();
  const session = createSession('The End', 100);
  session.id = '123';
  memoryMap.write(session.id, session);
  const userService = createSessionService(memoryMap);
  const listener = createListener(createSessionRoutes(logger, config, userService), () => notFound());

  const serverResult = await withHttpServer(listener, ({ port }) => {
    return withContractClient(contract, `http://localhost:${port}`, client => {
      return client.execute();
    });
  });
  if (serverResult.type === 'failure') return assert(serverResult.failure.message, false);
  const contractResult = await serverResult.success;
  if (contractResult.type === 'failure') return assert(contractResult.failure.message, false);

  return assert('Sessions should fulfil the deleteSession contract', contractResult.type === 'success');
});

const expectSessionContract = (topographPath/*: string*/) => expectAll('Sessions should fulfil contracts from topograph', [
  expectDeleteSessionContract(topographPath),
  expectGetSessionContract(topographPath)
]);

module.exports = {
  expectSessionContract,
}
