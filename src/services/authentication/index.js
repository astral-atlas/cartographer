// @flow
import type { User } from '../../lib/authentication';
import { InternalServiceError } from '../../services';

export class UserAuthenticationError extends InternalServiceError {
  constructor(message: string) {
    super(
      'Authentication',
      `We failed to authenticate the User\n${message}`,
    );
  }
}

export type Authentication = {
  getUser: (name: string, token: string) => Promise<User>,
};
