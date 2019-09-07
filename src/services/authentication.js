// @flow strict
/*::
import type { Config } from '../models/config';
import type { Result } from '../lib/result';
import type { UserID } from '../models/user';
*/
const { succeed, fail } = require('../lib/result');

/*::
type AuthenticationService = {
  getUserId: (token: string) => Promise<Result<UserID, Error>>,
};
*/

const createFixedAuth = ({ name, password, userId }) => {
  const successfulToken = name + password;
  const getUserId = async (token) => {
    if (token === successfulToken) {
      return succeed(userId);
    } else {
      return fail(new Error('Token did not match'));
    }
  };
  return { getUserId };
};


const createAuthService = (config/*: Config*/)/*: AuthenticationService*/ => {
  switch (config.authentication.type) {
    default:
      return createFixedAuth(config.authentication);
  }
};

module.exports = {
  createAuthService,
};
