// @flow
const { expectAll, emojiReporter, booleanReporter } = require('@lukekaalim/test');

const { queueLogExpectations } = require('./src/services/log/queueLog.test');
const { expectMiddleware } = require('./src/routes/routeMiddleware.test');

const test = async () => {
  const expectation = expectAll('Cartographer', [queueLogExpectations, expectMiddleware]);
  const assertion = await expectation.test();
  console.log(emojiReporter(assertion));
  process.exitCode = booleanReporter(assertion) ? 0 : 1;
};

if (module === require.main) {
  test();
}
