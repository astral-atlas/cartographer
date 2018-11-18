// @flow
import type { Logger } from '../logger';

export const stubLogger: Logger<mixed> = ({
  log: () => { /*this logger does nothing*/ },
});
