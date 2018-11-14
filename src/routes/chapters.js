// @flow
import type { Services } from '../services';
import { buildHandler, testGetUrl, testPostUrl, enhanceRoute } from '../responseUtils';

export const buildChapterRoutes = ({ storage: { save, load }}: Services) => [
  ...enhanceRoute({
    name: 'List Chapter Ids',
    test: testGetUrl('/chapter/getActiveIds'),
    handler: buildHandler(async () => {
      const chapterIds = await load('active-chapter-id-list');
      return chapterIds;
    }),
  }),
  ...enhanceRoute({
    name: 'Create New Chapter',
    test: testPostUrl('/chapter/addNewChapter'),
    handler: buildHandler(async (body) => {
      const newChapterOptions = JSON.parse(body);
      const chapterIds = await load('active-chapter-id-list');
      if (!Array.isArray(chapterIds)) {
        throw new Error('Unexpected File Response');
      }
      const newChapterIds = [...chapterIds, { id: 'newChapter' }];
      await save('active-chapter-id-list', newChapterIds);
      return newChapterOptions;
    }),
  })
];
