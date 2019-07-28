// @flow
import { toTuples, toObjectFromTuples } from './lib/tuple';
import { loadConfig } from './lib/config';
import { createCartographer } from './cartographer';

const init = async (configPath) => {
  const configResult = await loadConfig(configPath);
  if (configResult.type === 'failure') {
    console.error(configResult.failure.message);
    process.exitCode = 1;
  } else {
    try {
      await createCartographer(configResult.success);
    } catch (error) {
      console.error(error);
    }
  }
};

if (require.main === module) {
  const args = toObjectFromTuples(toTuples(process.argv));
  init(args['-c'] || args['-config'] || './local.cartographer.json');
}
