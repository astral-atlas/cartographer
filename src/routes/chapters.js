// @flow
import type { ChapterService } from '../services/atlas/chapters';
import type { ChapterEventService } from '../services/atlas/chapterEvents';
import type { UserService } from '../services/user';
import type { LogService } from '../services/log';

import {
  createStdRouteFromApiRoute,
  createStdRouteFromOptionsRoute,
} from '../lib/route';
import { ok, notAuthorized, notFound, internalServerError, badInput } from '../lib/routeHandlerOutput';

import { POSTInputError, URLQueryError } from './routeErrors';
import { InsufficientPermissionsError, ChapterNotFoundError } from '../services/atlas/chapters';
import { toChapterId } from '../models/atlas/chapter';
import { readStream } from '../lib/stream';
import { toString, toObject, fromJsonString } from '../lib/serialization';

import { createChapterEventRoute } from './events';

class ChapterPostRequestDecodeError extends POSTInputError {
  constructor(message: string) {
    super(`There was an error decoding the POST body\n${message}`);
  }
}

const corsOptions = {
  origin: 'http://localhost:5000',
  allowedMethods: ['GET', 'POST'],
  exposedHeaders: ['ETag'],
  allowedHeaders: ['user-id'],
};

const toPostChapter = (requestBody: string) => {
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
  case error instanceof URLQueryError:
  case error instanceof POSTInputError:
    logService.log(error.stack, 'info');
    return badInput();
  case error instanceof InsufficientPermissionsError:
    logService.log(error.stack, 'info');
    return notAuthorized();
  case error instanceof ChapterNotFoundError:
    logService.log(error.stack, 'warn');
    return notFound();
  default:
    logService.log(error.stack, 'error');
    return internalServerError();
  }
};

export const createChapterRoutes = (
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
        const chapterId = toChapterId(inc.queries.get('id'));
        const [chapter, events] = await Promise.all([
          chapterService.getChapter(user.id, chapterId),
          chapterEventService.getEvents(user.id, chapterId),
        ]);
        return ok({
          chapter,
          events,
        });
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
    corsOptions,
  };

  const postChapterHandler = async (inc) => {
    try {
      const [user, requestBody] = await Promise.all([
        userService.getUser(inc),
        readStream(inc.requestBody),
      ]);
      const { chapterName } = toPostChapter(requestBody);
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
    corsOptions,
  };

  const chapterOptionsRoute = {
    path: '/chapters',
    corsOptions,
  };

  const chapterEventsOptionsRoute = {
    path: '/chapters/events',
    corsOptions,
  };

  return [
    createStdRouteFromApiRoute(getChapterRoute),
    createStdRouteFromApiRoute(postChapterRoute),
    createStdRouteFromOptionsRoute(chapterOptionsRoute),
    createStdRouteFromOptionsRoute(chapterEventsOptionsRoute),
    ...createChapterEventRoute(chapterEventService, userService),
  ];
};
