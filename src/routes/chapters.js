// @flow
import type { ChapterService } from '../services/atlas/chapters';
import type { ChapterEventService } from '../services/atlas/chapterEvents';
import type { UserService } from '../services/user';
import type { LogService } from '../services/log';

import { POSTInputError } from './routeErrors';
import { InsufficientPermissionsError, ChapterNotFoundError } from '../services/atlas/chapters';
import { buildApiRoutes, ok, notAuthorized, notFound, internalServerError, badInput } from '../lib/apiRoute';
import { toChapterId } from '../models/atlas/chapter';
import { readStream } from '../lib/stream';
import { toString, toObject, fromJsonString } from '../lib/serialization';

class ChapterPostRequestDecodeError extends POSTInputError {
  constructor(message: string) {
    super(`There was an error decoding the POST body\n${message}`);
  }
}

const toPostChapterRequest = (requestBody: string) => {
  try {
    return toObject(fromJsonString(requestBody), object => ({
      chapterName: toString(object.chapterName),
    }));
  } catch (error) {
    throw new ChapterPostRequestDecodeError(error.message);
  }
};

const buildRouteErrorHandler = (logService) => (error: Error) => {
  switch (true) {
  case error instanceof POSTInputError:
    logService.log(error.message, 'info');
    return badInput();
  case error instanceof InsufficientPermissionsError:
    logService.log(error.message, 'info');
    return notAuthorized();
  case error instanceof ChapterNotFoundError:
    logService.log(error.message, 'warn');
    return notFound();
  default:
    logService.log(error.message, 'error');
    return internalServerError();
  }
};

export const buildChaptersRoutes = (
  chapterService: ChapterService,
  chapterEventService: ChapterEventService,
  userService: UserService,
  errorLoggingService: LogService<string>,
) => {
  const errorHandler = buildRouteErrorHandler(errorLoggingService);

  const getChapterHandler = async (inc) => {
    try {
      const user = await userService.getUser(inc);
      if (inc.queries.has('id')) {
        const chapter = await chapterService.getChapter(user.id, toChapterId(inc.queries.get('id')));
        return ok(chapter);
      } else {
        const chapters = await chapterService.getAllChapters(user.id);
        return ok(chapters);
      }
    } catch (error) {
      return errorHandler(error);
    }
  };
  const getChapterRoute = {
    path: '/chapters',
    handler: getChapterHandler,
    method: 'GET',
    allowAuthorization: true,
  };

  const postChapterHandler = async (inc) => {
    try {
      const [user, requestBody] = await Promise.all([
        userService.getUser(inc),
        readStream(inc.requestBody),
      ]);
      const { chapterName } = toPostChapterRequest(requestBody);
      const newChapter = await chapterService.addNewChapter(user.id, chapterName);
      return ok(newChapter);
    } catch (error) {
      return errorHandler(error);
    }
  };
  const postChapterRoute = {
    path: '/chapters',
    handler: postChapterHandler,
    method: 'POST',
    allowAuthorization: true,
  };

  return buildApiRoutes([getChapterRoute, postChapterRoute]);
};
