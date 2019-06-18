// @flow
import { promises } from 'fs';
import { loadConfig } from './lib/config';
import { createCartographer } from './cartographer';

const { readdir } = promises;

const init = async () => {
  try {
    // read from environment variable
    const configPathEnv = process.env['CONFIG_PATH'] || '';
    // or the first file to end with '.cartographer.json';
    const configLocalFile = (await readdir(process.cwd())).find(fileName => fileName.endsWith('.cartographer.json'));
    const configPath = configPathEnv || configLocalFile;
    if (configPath === undefined || configPath === null) {
      throw new Error('No config path provided;Cannot start Atlas');
    }
    const configResult = await loadConfig(configPath);
    if (configResult.type === 'failure') {
      throw new Error(configResult.value.message);
    }
    const cartographer = await createCartographer(configResult.value);
    await cartographer.start()
  } catch (err) {
    console.error(err);
  }
};

if (require.main === module) {
  init();
}

export { createCartographer };