// @flow
const { expectAll, emojiReporter, booleanReporter } = require('@lukekaalim/test');

const { queueLogExpectations } = require('./src/services/log/queueLog.test');
const { expectDirStorage } = require('./src/services/storage/fsStorage2.test');
const { expectMiddleware } = require('./src/routes/routeMiddleware.test');

const test = async () => {
  const expectation = expectAll('Cartographer', [
    queueLogExpectations,
    expectMiddleware,
    expectDirStorage
  ]);
  const assertion = await expectation.test();
  console.log(emojiReporter(assertion));
  process.exitCode = booleanReporter(assertion) ? 0 : 1;
};

if (module === require.main) {
  test();
}
