// @flow
import type { User } from './user';
import type { Response } from './serialization';

import { fromJson, toArray, toPathZero } from './serialize3';
import { toUser } from './user';

export type AtlasScribeConnection = {
  username: string,
  password: string,
  endpoint: string,
};

export type AtlasImperativeClient = {
  getUsers: () => Promise<Response<Array<User>>>,
};

const toUsersArray = fromJson(toArray(toUser, toPathZero));

const mapToObject = map => [...map.entries].reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

const findGetImplementation = () => {
  if (window.fetch) {
    return (url, headers) => window.fetch(url, { headers: mapToObject(headers) });
  }
  throw new Error('No \'get()\' Implementation provided, and we couldn\'t find window.fetch');
};

export const createAtlasImperativeClient = (
  connection: AtlasScribeConnection,
  get: (url: string, headers: Map<string, string>) => Promise<string> = findGetImplementation(),
): AtlasImperativeClient => {
  const userRoute = connection.endpoint + '/user-list';

  const authenticationHeader = ['authorization', connection.username + ':' + connection.password];

  const getUsers = async () => toUsersArray(await get(userRoute, new Map([authenticationHeader])));

  return {
    getUsers,
  };
};
