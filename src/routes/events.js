// @flow
import type { ChapterEventService } from '../services/atlas/chapterEvents';
import type { UserService } from '../services/user';

import {
  createStdRouteFromApiRoute,
  createStdRouteFromOptionsRoute,
} from '../lib/route';
import { ok, internalServerError } from '../lib/routeHandlerOutput';
import { toString, toObject, fromJsonString } from '../lib/serialization';
import { readStream } from '../lib/stream';

import { toChapterId } from '../models/atlas/chapter';

const corsOptions = {
  origin: 'http://localhost:5000',
  allowedMethods: ['GET', 'POST'],
  exposedHeaders: ['ETag'],
  allowedHeaders: ['user-id'],
};

type ChapterRouteEventRequest =
  | { type: 'narrate', narration: string };

const toChapterRouteEventRequest = (input: string): ChapterRouteEventRequest => toObject(
  fromJsonString(input),
  object => {
    const type = toString(object.type);
    switch (type) {
    case 'narrate':
      return { type, narration: toString(object.narration) };
    default:
      throw new Error();
    }
  });

export const createChapterEventRoute = (
  chapterEventService: ChapterEventService,
  userService: UserService,
) => {
  const postEventForChapterRoute = async (inc) => {
    try {
      const user = await userService.getUser(inc);
      const chapterId = toChapterId(inc.queries.get('chapterId'));
      const request = toChapterRouteEventRequest(await readStream(inc.requestBody));
      switch (request.type) {
      case 'narrate':
        return ok(await chapterEventService.addNarrateEvent(user.id, chapterId, request.narration));
      default:
        throw new Error();
      }
    } catch (err) {
      return internalServerError();
    }
  };

  const getEventsForChapterRoute = async (inc) => {
    try {
      const user = await userService.getUser(inc);
      const chapterId = toChapterId(inc.queries.get('chapterId'));
      return ok(await chapterEventService.getEvents(user.id, chapterId));
    } catch (err) {
      return internalServerError();
    }
  };

  return [
    createStdRouteFromApiRoute({
      path: '/chapters/events',
      handler: getEventsForChapterRoute,
      method: 'GET',
      corsOptions,
    }),
    createStdRouteFromApiRoute({
      path: '/chapters/events',
      handler: postEventForChapterRoute,
      method: 'POST',
      corsOptions,
    }),
    createStdRouteFromOptionsRoute({
      path: '/chapters/events',
      corsOptions,
    }),
  ];
};
