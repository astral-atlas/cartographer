// @flow
import type { User } from './user';

export type AtlasEventClient = {
  addUserListener: ((users: Array<User>) => mixed) => () => void,
};

export const createAtlasEventClient = () => {
  
};