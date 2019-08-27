#!/usr/bin/env node
// @flow
const { readFile } = require('fs').promises;

const { toConfig } = require('./models/config');
const { toTuples, toObjectFromTuples } = require('./lib/tuple');
const { createCartographer } = require('./cartographer');

const init = async (configPath/*: string*/) => {
  try {
    const config = toConfig(JSON.parse(await readFile(configPath, 'utf-8')));
    const cartographer = await createCartographer(config);
    const shutdown = (signal) => {
      cartographer.stop();
    };
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
};

if (require.main === module) {
  const args = toObjectFromTuples(toTuples(process.argv));
  init(args['-c'] || args['-config'] || process.env['CARTOGRAPHER_CONFIG_PATH'] || './local.cartographer.json');
}
