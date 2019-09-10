// @flow strict
/*::
import type { STDMapStore } from '../storage';
import type { Session, SessionID } from '../../models/session';
import type { Result } from '@lukekaalim/result';
*/
const { succeed, fail, handle, chain } = require('@lukekaalim/result');
const { createSession } = require('../../models/session');

/*::
export type SessionService = {
  addNewSession: (title: string, startTime: number) => Promise<Result<Session, Error>>,
  deleteSession: (sessionId: SessionID) => Promise<Result<void, Error>>,
  getNextSession: (currentTime: number) => Promise<Result<null | Session, Error>>,
  listSessions: () => Promise<Result<Array<Session>, Error>>,
};
*/

const createSessionService = (
  store/*: STDMapStore<SessionID, Session>*/,
)/*: SessionService*/ => {
  const addNewSession = async (title, startTime) => {
    const session = createSession(title, startTime);
    return handle(await store.write(session.id, session),
      () => succeed(session),
      failure => fail(new Error(failure.error.message))
    );
  };
  const deleteSession = async (sessionId) => {
    return handle(await store.destroy(sessionId),
      () => succeed(),
      failure => fail(new Error(''))
    );
  };
  const getNextSession = async (currentTime) => {
    return chain(await listSessions())
      .then(sessions => succeed(sessions.reduce((closestSessionSoFar, currentSession) => {
        if (currentSession.startTime < currentTime) {
          return closestSessionSoFar;
        }
        if (!closestSessionSoFar) {
          return currentSession;
        }
        if (closestSessionSoFar.startTime - currentTime > currentSession.startTime - currentTime) {
          return currentSession;
        }
        return closestSessionSoFar;
      }, null)))
      .result();
  };
  const listSessions = async () => {
    return handle(await store.list(),
      async (sessionIds) => {
        const sessionsResults = await Promise.all(sessionIds.map(sessionId => store.read(sessionId)));
        const sessions = [];
        for (const sessionResult of sessionsResults) {
          if (sessionResult.type === 'failure') {
            return fail(new Error())
          }
          sessions.push(sessionResult.success);
        }
        return succeed(sessions);
      },
      () => fail(new Error())
    );
  };

  return {
    addNewSession,
    deleteSession,
    getNextSession,
    listSessions,
  }
};

module.exports = {
  createSessionService
}