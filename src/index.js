// @flow
import { createServer } from 'http';
import { buildListener } from './listener';

const main = async () => {
  const listener = await buildListener();
  const server = createServer(listener);
  server.listen(8888);
};

main();
