// @flow
import type { ChapterService } from '../services/atlas/chapters';
import type { UserService } from '../services/user';
import { InsufficientPermissionsError, ChapterNotFoundError } from '../services/atlas/chapters';
import { buildApiRoutes, ok, notAuthorized, notFound, internalServerError, handleApiRouteErr } from '../lib/apiRoute';
import { toChapterId } from '../models/atlas/chapter';
import { readStream } from '../lib/stream';
import { async } from '../lib/promise';
import { toString, toObject, fromJsonString } from '../lib/serialization';

const toPostChapterRequest = (requestBody: string) => toObject(fromJsonString(requestBody), object => ({
  chapterName: toString(object.chapterName),
}));

const errorHandlers = [
  [InsufficientPermissionsError, async(notAuthorized)],
  [ChapterNotFoundError, async(notFound)],
  [Error, async(internalServerError)],
];

const enhanceChapterHandler = (chapterHandler) => (
  handleApiRouteErr(chapterHandler, errorHandlers)
);

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
    handler: enhanceChapterHandler(getChapterHandler),
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
    handler: enhanceChapterHandler(postChapterHandler),
    method: 'POST',
    allowAuthorization: true,
  };

  return buildApiRoutes([getChapterRoute, postChapterRoute]);
};
