// @flow
import type { Services } from '../services';
import { buildSimpleHandler, testGetUrl, testPostUrl } from '../responseUtils';

export const buildChapterRoutes = (services: Services) => [
  {
    name: 'List Chapter Ids',
    test: testGetUrl('/chapter/getActiveIds'),
    handler: buildSimpleHandler(async () => {
      try {
        const chapterIds = await services.storage.load('active-chapter-id-list');
        return chapterIds;
      } catch {
        return [];
      }
    }),
  },
  {
    name: 'Create New Chapter',
    test: testPostUrl('/chapter/addNewChapter'),
    handler: buildSimpleHandler(async () => {
      return 'no';
    }),
  }
];
