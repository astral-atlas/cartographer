// @flow
import type { Services } from '../services';
import { buildNewEmptyChapter } from '../lib/chapters';
import { buildHandler, testGetUrl, testPostUrl, enhanceRoute } from '../responseUtils';

export const buildChapterRoutes = ({ scribe: { chapters } }: Services) => [
  ...enhanceRoute({
    name: 'List Active Chapter Ids',
    test: testGetUrl('/chapter/getActiveIds'),
    handler: buildHandler(async () => {
      const activeChapterIds = await chapters.getActiveChapterIds();
      return activeChapterIds;
    }),
  }),
  ...enhanceRoute({
    name: 'Create New Chapter',
    test: testPostUrl('/chapter/addNewChapter'),
    handler: buildHandler(async (body) => {
      const newChapter = buildNewEmptyChapter();
      await chapters.addChapter(newChapter);
      return newChapter;
    }),
  })
];
