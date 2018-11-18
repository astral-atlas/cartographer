// @flow
import type { Scribe } from '../services/scribe';
import type { Logger } from '../services/logger';
import type { Authentication } from '../services/authentication';
import { getCurrentOrGlobalUser } from '../lib/authentication';
import { NotFoundError, NotAuthorizedError } from './routeErrors';
import { buildNewEmptyChapter, toChapterId } from '../lib/chapters';
import { toString } from '../lib/serialization';
import { CantRetrieveChapter } from '../services/scribe/chapters';
import { UserAuthenticationError } from '../services/authentication';
import { buildAPIRoutes } from './apiRoute';

export const buildChapterRoutes = (
  { chapters }: Scribe,
  logger: Logger<Error>,
  { getUser }: Authentication,
) => buildAPIRoutes([
  {
    name: 'List Chapters',
    url: '/chapters',
    method: 'GET',
    usesCredentials: true,
    handler: async ({ queries, headers }) => {
      try {
        const user = await getCurrentOrGlobalUser(headers, getUser);
        const chapterId = queries.get('id');
        if (chapterId !== null) {
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
