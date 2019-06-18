// @flow
import { toString, toObject } from '../lib/typing';
import createUuid from 'uuid/v4';
/*::
export opaque type UserID: string = string;

export type User = {
  id: UserID,
  name: string,
}
*/

export const toUserID = (value/*:mixed*/)/*:UserID*/ => toString(value);

export const toUser = (value/*:mixed*/)/*: User*/ => {
  const userObject = toObject(value);
  return {
    id: toUserID(toString(userObject.id)),
    name: toString(userObject.name),
  };
}

export const createUser = (name/*: string*/)/*: User*/ => ({
  id: createUuid(),
  name,
});