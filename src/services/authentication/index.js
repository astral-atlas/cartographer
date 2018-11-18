// @flow
import type { User } from '../../lib/authentication';
import { InternalServiceError } from '../../services';

export function UserAuthenticationError(message: string) {
  throw new InternalServiceError(
    'Authentication',
    `We failed to authenticate the User\n${message}`,
  );
}

export type Authentication = {
  getUser: (name: string, token: string) => Promise<User>,
};
