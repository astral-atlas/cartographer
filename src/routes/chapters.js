// @flow
import type { ChapterService } from '../services/scribe/chapters4';
import type { UserService } from '../services/user';
import { buildApiRoutes, ok } from '../lib/apiRoute';
import { toChapterId } from '../lib/chapter';

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

  return buildApiRoutes([getChapterRoute]);
};

/*
buildAPIRoutes([
  {
    name: 'List Chapters',
    url: '/chapters',
    method: 'GET',
    usesCredentials: true,
    handler: async ({ queries, headers }) => {
      try {
        const user = await getCurrentOrGlobalUser(headers, getUser);
        const chapterId = queries.get('id');
        if (chapterId !== undefined) {
          try {
            return await chapters.getChapter(
              toChapterId(chapterId),
              user.userId,
            );
          } catch (err) {
            if (err instanceof CantRetrieveChapter) {
              throw new NotFoundError('Can\'t find any chapters with that id.');
            }
          }
        } else {
          return await chapters.getChapterIds(user.userId);
        }
      } catch (err) {
        if (err instanceof UserAuthenticationError) {
          throw new NotAuthorizedError('Your username or password is invalid');
        }
        throw err;
      }
    },
  },
  {
    name: 'Create New Chapter',
    url: '/chapters',
    method: 'POST',
    usesCredentials: true,
    handler: async ({ getBody, headers }) => {
      try {
        const user = await getCurrentOrGlobalUser(headers, getUser);
        const rawBody = await getBody();
        const newChapter = buildNewEmptyChapter(
          'Untitled Chapter',
          user.userId,
        );
        await chapters.addChapter(newChapter, user.userId);
        return newChapter;
      } catch (err) {
        if (err instanceof UserAuthenticationError) {
          throw new NotAuthorizedError('Your username or password is invalid');
        }
        throw err;
      }
    },
  }
], logger);
*/
