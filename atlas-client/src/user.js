// @flow
import type { Serializer } from './serialization';
import { toObject, toString, withProperty, succeed } from './serialization';
export opaque type UserID: string = string;

export type User = {
  id: UserID,
  displayName: string,
};

export const toUser: Serializer<mixed, User> = (
  toObject(
    withProperty('id', toString(succeed),
      withProperty('displayName', toString(succeed), succeed)
    )
  )
);
q