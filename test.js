// @flow
const { performance } = require('perf_hooks');
const { expectAll, emojiReporter } = require('@lukekaalim/test');

const { queueLogExpectations } = require('./src/services/log/queueLog.test');
const { expectDirStorage } = require('./src/services/storage/fsStorage2.test');
const { fileStorageExpectation } = require('./src/services/storage/fileStorage.test');
const { expectMiddleware } = require('./src/routes/routeMiddleware.test');

const strMult = (multiplier, string) => {
  let result = '';
  for (let i = 0; i < multiplier; i++) {
    result += string;
  }
  return result;
};

const summaryReporter = (assertion) => {
  return assertion.childAssertions.map(summaryReporter).reduce((a, c) => a + c, 0) + 1;
}

const cartographerReporter = (assertion, level = 0) => {
  const report = assertion.validatesExpectation ? ' (Pass)' : ' (Fail)';
  const description = strMult(level, ' ') + assertion.description;
  if (assertion.childAssertions.length < 1) {
    return description + report;
  }
  if (level > 1) {
    const childSummary = ` ( ...hiding ${summaryReporter(assertion)} children)`;
    return description + report + childSummary;
  }
  const childLines = assertion.childAssertions.map(assertion => {
    return cartographerReporter(assertion, level + 1);
  });
  return description + report + '\n' + childLines.join('\n');
};


const test = async () => {
  const startTime = performance.now();
  const expectation = expectAll('Cartographer', [
    queueLogExpectations,
    expectMiddleware,
    expectDirStorage,
    fileStorageExpectation,
  ]);
  const assertion = await expectation.test();
  const endTime = performance.now();
  console.log('Duration:', Math.ceil(endTime - startTime), 'ms');
  console.log(cartographerReporter(assertion));
  process.exitCode = assertion.validatesExpectation ? 0 : 1;
};

if (module === require.main) {
  test();
}
