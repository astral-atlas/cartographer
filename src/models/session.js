// @flow strict
/*::
import type { Model } from '@lukekaalim/model';
*/
const { nameModel, modelObject, stringModel, numberModel } = require('@lukekaalim/model');
const { generateUUID } = require('./uuid');

/*::
export type SessionID = string;

export type Session = {
  id: SessionID,
  title: string,
  startTime: number,
};
*/

const createSessionId = ()/*: SessionID*/ => generateUUID();
const createSession = (title/*: string*/, startTime/*: number*/)/*: Session*/ => ({
  id: createSessionId(),
  title,
  startTime,
});

const sessionIdModel/*: Model<SessionID>*/ = nameModel('SessionID', stringModel);

const sessionModel/*: Model<Session>*/ = nameModel('Session', modelObject({
  id: sessionIdModel,
  title: stringModel,
  startTime: numberModel,
}));

module.exports = {
  createSessionId,
  createSession,
  sessionIdModel,
  sessionModel,
};
