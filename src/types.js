// @flow strict

export type SerializableValue =
  | string
  | number
  | boolean
  | Array<SerializableValue>
  | { [key: SerializableValue]: SerializableValue };

export type SerializationType =
  | 'string' | 'number' | 'boolean'
  | { type: 'object', keys: Array<{ keyName: string, valueType: SerializationType }> }
  | { type: 'array', elementType: SerializationType };
