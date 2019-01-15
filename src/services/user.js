// @flow
import type { APIRouteIncomingMessage } from '../lib/apiRoute';
import type { User } from '../lib/user';

export type UserService = {
  getUser: (inc: APIRouteIncomingMessage) => Promise<User>,
};
