// @flow
const { expectAll, colorReporter, booleanReporter } = require('@lukekaalim/test');

const { queueLogExpectations } = require('./src/services/log/queueLog.test');

const test = async () => {
  const expectation = expectAll('Cartographer', [queueLogExpectations]);
  const assertion = await expectation.test();
  console.log(colorReporter(assertion));
  process.exitCode = booleanReporter(assertion) ? 0 : 1;
};

if (module === require.main) {
  test();
}
