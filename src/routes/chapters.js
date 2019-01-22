// @flow
import type { ChapterService } from '../services/atlas/chapters';
import type { UserService } from '../services/user';
import { buildApiRoutes, ok } from '../lib/apiRoute';
import { toChapterId } from '../lib/chapter';
import { readStream } from '../lib/stream';
import { toString, toObject, fromJsonString } from '../lib/serialization';

const toPostChapterRequest = (requestBody: string) => toObject(fromJsonString(requestBody), object => ({
  chapterName: toString(object.chapterName),
}));

export const buildChaptersRoutes = (
  chapterService: ChapterService,
  userService: UserService,
) => {
  const getChapterHandler = async (inc) => {
    const user = await userService.getUser(inc);
    if (inc.queries.has('id')) {
      const chapter = await chapterService.getChapter(user.id, toChapterId(inc.queries.get('id')));
      return ok(chapter);
    } else {
      const chapters = await chapterService.getAllChapters(user.id);
      return ok(chapters);
    }
  };
  const getChapterRoute = {
    path: '/chapters',
    handler: getChapterHandler,
    method: 'GET',
    allowAuthorization: true,
  };

  const postChapterHandler = async (inc) => {
    const [user, requestBody] = await Promise.all([
      userService.getUser(inc),
      readStream(inc.requestBody),
    ]);
    const { chapterName } = toPostChapterRequest(requestBody);
    const newChapter = await chapterService.addNewChapter(user.id, chapterName);
    return ok(newChapter);
  };
  const postChapterRoute = {
    path: '/chapters',
    handler: postChapterHandler,
    method: 'POST',
    allowAuthorization: true,
  };

  return buildApiRoutes([getChapterRoute, postChapterRoute]);
};
