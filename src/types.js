// @flow strict

export type SerializableValue =
  | string
  | number
  | boolean
  | Array<SerializableValue>
  | { [key: SerializableValue]: SerializableValue };
