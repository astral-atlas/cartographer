// @flow
export const AUTHORIZATION_HEADER_NAME = 'authorization';

export type AuthorizationType =
  | 'Basic';

export const toAuthorizationType = (type: string): AuthorizationType => {
  switch (type) {
  case 'Basic':
    return type;
  default:
    throw new Error('Unknown Authorization Type');
  }
};

export const getCredentials = (headers: Map<string, string>): { type: AuthorizationType, credentials: string } => {
  const authHeader = headers.get(AUTHORIZATION_HEADER_NAME);
  if (typeof authHeader !== 'string') {
    throw new Error('No Authorization Header');
  }
  const [type, ...credentials] = Buffer.from(authHeader, 'base64')
    .toString()
    .split(' ');
  return {
    type: toAuthorizationType(type),
    credentials: credentials.join(' '),
  };
};

/*
export const getBasicAuth = (
  headers: Map<string, string>,
): ?{ name: string, token: string } => {
  const authHeader = headers.get('authorization');
  if (typeof authHeader !== 'string') {
    return null;
  }
  const [authType, credentials] = Buffer.from(authHeader, 'base64')
    .toString()
    .split(' ');
  if (authType !== 'Basic') {
    return null;
  }
  const [name, token] = credentials.split(':');
  if (!name || !token) {
    return null;
  }
  return { name, token };
};

export const getCurrentOrGlobalUser = async (
  headers: Map<string, string>,
  getUser: (name: string, token: string) => Promise<User>,
): Promise<User> => {
  const userAuth = getUserAuth(headers);
  if (userAuth) {
    const { name, token } = userAuth;
    return await getUser(name, token);
  }
  return GLOBAL_USER;
};
*/
