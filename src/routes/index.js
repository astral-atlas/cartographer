// @flow
import type { IncomingMessage, ServerResponse } from 'http';
import type { ScribeConfig } from '../config';

import { buildServices } from '../services';
import { buildChapterRoutes } from './chapters';
import { buildLifecycleRoutes } from './lifecycle';

export type ScribeRoute = {
  name: string,
  test: (inc: IncomingMessage) => boolean,
  handler: (inc: IncomingMessage, res: ServerResponse) => void,
};

export const buildRoutes = async (conf: ScribeConfig): Promise<Array<ScribeRoute>> => {
  const services = await buildServices(conf);

  return [
    ...buildChapterRoutes(services),
    ...buildLifecycleRoutes(services),
  ];
};