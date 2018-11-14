// @flow strict

export type SerializableValue =
  // $FlowFixMe
  | any
  | string
  | number
  | boolean
  | Array<SerializableValue>
  | { [key: SerializableValue]: SerializableValue };


// Runtime type saftey?
export type SerializationType =
  | 'string' | 'number' | 'boolean'
  | { type: 'object', keys: Array<{ keyName: string, valueType: SerializationType }> }
  | { type: 'array', elementType: SerializationType };
