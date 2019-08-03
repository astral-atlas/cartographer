// @flow
const { readFile } = require('fs').promises;

const { toConfig } = require('./models/config');
const { toTuples, toObjectFromTuples } = require('./lib/tuple');
const { createCartographer } = require('./cartographer');

const init = async (configPath) => {
  try {
    const config = toConfig(JSON.parse(await readFile(configPath, 'utf-8')));
    const cartographer = await createCartographer(config);
  } catch (error) {
    console.log(error);
    process.exitCode = 1;
    return null;
  }
};

if (require.main === module) {
  const args = toObjectFromTuples(toTuples(process.argv));
  init(args['-c'] || args['-config'] || './local.cartographer.json');
}
