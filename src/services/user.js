// @flow
import type { HandlerInput } from '../lib/routeHandler';
import type { User } from '../lib/user';

export type UserService = {
  getUser: (inc: HandlerInput) => Promise<User>,
  getAllUsers: () => Promise<Array<User>>,
};
