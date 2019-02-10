// @flow
import type { ChapterService } from '../services/atlas/chapters';
import type { ChapterEventService } from '../services/atlas/chapterEvents';
import type { UserService } from '../services/user';
import type { LogService } from '../services/log';

import { POSTInputError, URLQueryError } from './routeErrors';
import { InsufficientPermissionsError, ChapterNotFoundError } from '../services/atlas/chapters';
import { buildApiRoutes, ok, notAuthorized, notFound, internalServerError, badInput } from '../lib/apiRoute';
import { toChapterId } from '../models/atlas/chapter';
import { readStream } from '../lib/stream';
import { toString, toObject, fromJsonString, DeserializationError } from '../lib/serialization';

class ChapterPostRequestDecodeError extends POSTInputError {
  constructor(message: string) {
    super(`There was an error decoding the POST body\n${message}`);
  }
}

class ChapterEventMissingQueryParameter extends URLQueryError {
  constructor(parameterName: string) {
    super(`Request was missing query parameter "${parameterName}" in URL`);
  }
}

const toPostChapter = (requestBody: string) => {
  try {
    return toObject(fromJsonString(requestBody), object => ({
      chapterName: toString(object.chapterName),
    }));
  } catch (error) {
    throw new ChapterPostRequestDecodeError(error.message);
  }
};

const toPostChapterEvent = (requestBody: string) => {
  try {
    return toObject<{ type: 'narrate', narration: string }>(fromJsonString(requestBody), object => {
      const type = toString(object.type);
      switch (type) {
      case 'narrate':
        return {
          type,
          narration: toString(object.narration),
        };
      default:
        throw new DeserializationError('Chapter Event Type', type, type);
      }
    });
  } catch (error) {
    throw new ChapterPostRequestDecodeError(error.message);
  }
};

const buildRouteErrorHandler = (logService) => (error: Error) => {
  switch (true) {
  case error instanceof URLQueryError:
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
    allowAuthorization: true,
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
    allowAuthorization: true,
  };

  const postEventHandler = async (inc) => {
    try {
      if (!inc.queries.has('chapterId')) {
        throw new ChapterEventMissingQueryParameter('chapterId');
      }
      const chapterId = toChapterId(inc.queries.get('chapterId'));
      const [user, requestBody] = await Promise.all([
        userService.getUser(inc),
        readStream(inc.requestBody),
      ]);
      const chapterEvent = toPostChapterEvent(requestBody);
      switch (chapterEvent.type) {
      case 'narrate':
        return ok(chapterEventService.addNarrateEvent(user.id, chapterId, chapterEvent.narration));
      default:
        throw new Error('Unknown Event Type');
      }
    } catch (error) {
      return errorHandler(error);
    }
  };
  const postEventRoute = {
    path: '/chapters/events',
    handler: postEventHandler,
    method: 'POST',
    allowAuthorization: true,
  };

  return buildApiRoutes([getChapterRoute, postChapterRoute, postEventRoute]);
};
