// @flow
import { createServer } from 'http';
import { buildListener } from './listener';
import { LOCAL_CONFIG } from './config';

const main = async () => {
  const listener = await buildListener(LOCAL_CONFIG);
  const server = createServer(listener);
  server.listen(8888);
};

main();
