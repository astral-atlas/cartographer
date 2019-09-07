// @flow strict
const { join } = require('path');
const { handleResult } = require('../../lib/result');
const { rmdir, mkdtemp, readdir, unlink, writeFile } = require('fs').promises;
const { tmpdir } = require('os');
const { expect, expectAll, assert } = require('@lukekaalim/test');
const { createFileStore } = require('./fileStorage');

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

const withFile = async (path, handle) => {
  try {
    await writeFile(path, '', 'utf8');
    return await handle(path);
  } finally {
    await unlink(path);
  }
};

const withExampleFile = (handle) => withDirectory(dir => withFile(join(dir, 'example.txt'), handle));

const expectPersistance = expect(() => withExampleFile(async (filepath) => {
  const store = await createFileStore(filepath);

  const writeAssertion = handleResult(await store.write('Example Text'),
    () => assert('Should write string without failure', true),
    error => assert('Should not return failure', false),
  );
  const readAssertion = handleResult(await store.read(),
    value => assert('Should restore what was written', value === 'Example Text'),
    error => assert('Should not return failure', false),
  );

  return assert('Should persist values between reads and writes', [
    writeAssertion,
    readAssertion,
  ]);
}));

const expectDefaultOnNoFile = expect(() => withDirectory(async (dir) => {
  const store = await createFileStore(join(dir, 'this-file-does-not-exist.txt'), 'default-value');

  return handleResult(await store.read(),
    value => assert('Should return the default value if the file does not exist when trying to read it', value === 'default-value'),
    error => assert('Should not return failure', false),
  );
}));

const fileStorageExpectation = expectAll('File Storage Service', [
  expectDefaultOnNoFile,
  expectPersistance,
]);

module.exports = {
  fileStorageExpectation,
};
