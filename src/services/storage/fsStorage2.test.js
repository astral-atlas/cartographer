// @flow
const { createDirStore } = require('./fsStorage2');
const { handleResult } = require('../../lib/result');
const { rmdir, mkdtemp, readdir, unlink } = require('fs').promises;
const { tmpdir } = require('os');
const { join } = require('path');
const { expect, expectAll, assert } = require('@lukekaalim/test');

const createMockLogger = () => {
  const logs = [];
  const log = log => void logs.push(log);
  return { log, logs };
};

const withDirectory = async (handleDirectory) => {
  const dir = await mkdtemp(join(tmpdir(), 'dirStore'), { encoding: 'utf8' });
  try {
    return await handleDirectory(dir);
  } finally {
    for (const file of (await readdir(dir))) {
      await unlink(join(dir, file));
    }
    await rmdir(dir);
  }
};

const expectCRUDStorage = expect(() => withDirectory(async (tempdir) => {
  const store = await createDirStore(tempdir, createMockLogger());

  const key = 'example';
  const createdValue = '123456789';

  const createAssertion = handleResult(await store.create(key, createdValue),
    () => assert('Can create Key @ Value without failing', true),
    () => assert('Cant create key @ value without failing', false)
  );
  
  const readValueResult = await store.read(key);

  const readAssertion = handleResult(readValueResult,
    readValue => assert('Can retrieve a value that you created', readValue === createdValue),
    failure => assert('Can\'t retrieve created value due to failure:\n' + JSON.stringify(failure), false)
  );

  const updatedValue = '987654321';
  await store.update(key, updatedValue);

  const updateAssertion = handleResult(await store.read(key),
    readValue => assert('Can retrieve a value that you updated', readValue === updatedValue),
    failure => assert('Can\'t retrieve updated value due to failure:\n' + JSON.stringify(failure), false)
  );

  const deleteAssertion = handleResult(await store.destroy(key),
    () => assert('Can delete Key @ Value without failing', true),
    () => assert('Cant delete key @ value without failing', false),
  );

  return assert('Can perform CRUD operations', [
    createAssertion,
    readAssertion,
    updateAssertion,
    deleteAssertion,
  ]);
}));

const expectListKeys = expect(() => withDirectory(async (tempdir) => {
  const store = await createDirStore(tempdir, createMockLogger());

  [
    await store.create('a', 'content'),
    await store.create('b', 'content'),
    await store.create('c', 'content')
  ]
  .map(result => handleResult(result, () => {}, (error) => { throw error; }));

  return handleResult(await store.list(), 
    list => assert('Can correctly list an array with only the inserted keys', [
      assert('Has "a" key', list.includes('a')),
      assert('Has "b" key', list.includes('b')),
      assert('Has "c" key', list.includes('c')),
      assert('List is 3 elements long', list.length === 3),
    ]),
    error => assert('Cant list without throwing', false),
  );
}));

const expectPersistance = expect(() => withDirectory(async (tempdir) => {
  const store1 = await createDirStore(tempdir, createMockLogger());

  await store1.create('alpha', 'value');
  const store2 = await createDirStore(tempdir, createMockLogger());

  return handleResult(await store2.read('alpha'),
    readValue => assert('Can retain state over instances if directory matches', readValue === 'value'),
    error => assert('Cant retrieve value', false)
  );
}));

const expectDoubleKeyCreateFailure = expect(() => withDirectory(async tempdir => {
  const store = await createDirStore(tempdir, createMockLogger());

  await store.create('key', 'value');
  return handleResult(await store.create('key', 'value'),
    () => assert('Can allow two duplicate volumes', false),
    failure => assert('Can fail when trying to create a key that already exists', failure.type === 'already-created'),
  );
}));

const expectNonExistentReadFailure = expect(() => withDirectory(async tempdir => {
  const store = await createDirStore(tempdir, createMockLogger());

  const nonExistentReadFailAssertion = handleResult(await store.read('key'),
    () => assert('Can allow two duplicate volumes', false),
    failure => assert('Can fail when trying to read a key that doesn\'t exists', failure.type === 'not-created'),
  );
  const nonExistentUpdateAssertion = handleResult(await store.update('key', 'value'),
    () => assert('Can allow two duplicate volumes', false),
    failure => assert('Can fail when trying to update a key that doesn\'t exists', failure.type === 'not-created'),
  );

  return assert('Can properly return failures when performing incorrect operations', [
    nonExistentReadFailAssertion,
    nonExistentUpdateAssertion,
  ]);
}));

const expectDirStorage = expectAll('Dir Storage', [
  expectCRUDStorage,
  expectListKeys,
  expectPersistance,
  expectDoubleKeyCreateFailure,
  expectNonExistentReadFailure,
]);

module.exports = {
  expectDirStorage,
};