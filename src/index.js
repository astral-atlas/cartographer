// @flow
import { createServer } from 'http';
import { getConfig } from './config';
import { buildListener } from './listener';

const main = async (environment: string) => {
  const config = getConfig(environment);
  console.log(`Initializing Atlas Scribe in configuration ${environment}`);
  const listener = await buildListener();
  const server = createServer(listener);
  server.listen(config.port, () => console.log(`Server is now listening on port ${config.port}`));
};

// flowlint-next-line sketchy-null-string:off
main(process.env.NODE_ENV || 'local');
