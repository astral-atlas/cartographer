// @flow
import type { Route } from './lib/http';

import { buildChaptersRoutes } from './routes/chapters';

export const buildAppRoutes = async (): Promise<Array<Route>> => {

  return buildChaptersRoutes(chapterService, userService)
};
