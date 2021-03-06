#!/usr/bin/env node
// @flow
const { readFile } = require('fs').promises;

const { toConfig } = require('./src/models/config');
const { toTuples, toObjectFromTuples } = require('./src/lib/tuple');
const { createCartographer } = require('./src/cartographer');

const init = async () => {
  try {
    const args = toObjectFromTuples(toTuples(process.argv));
    const configPath = args['-c'] || args['-config'] || process.env['CARTOGRAPHER_CONFIG_PATH'] || './local.cartographer.json';
    const config = toConfig(JSON.parse(await readFile(configPath, 'utf-8')));
    const cartographer = await createCartographer(config);
    await cartographer.open();
    const shutdown = (signal) => {
      cartographer.stop('Signal Interrupt Detected (Typically caused by Control-C)');
    };
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
};

if (require.main === module) {
  init();
}
