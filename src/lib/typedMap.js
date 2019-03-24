// @flow

class InvalidKeyError extends Error {
  constructor() {
    super(
      'Attempted to get Key for TypedMap that was not present.' +
      '\nDid you forget to call typedMap.has(key) to ensure to key exists before calling?'
    );
  }
}
/*
  Typed Map is a wrapper around the Map constructor.
  The only difference is that instead of returning TValue | undefined
  when calling Get, it always throws and error if value is undefined,
  so we can safely say the type is just TValue.

  Also I can type it as an iterable for some reason
*/
export class TypedMap<TKey, TValue> {
  internalMap: Map<TKey, TValue>;

  constructor(iterable?: Iterable<[TKey, TValue]>) {
    this.internalMap = new Map(iterable);
  }

  clear(): void {
    this.internalMap.clear();
  }

  delete(key: TKey): void {
    this.internalMap.delete(key);
  }

  get(key: TKey): TValue {
    if (!this.internalMap.has(key)) {
      throw new InvalidKeyError();
    }
    // $FlowFixMe
    return this.internalMap.get(key); 
  }

  set(key: TKey, value: TValue): void {
    this.internalMap.set(key, value);
  }

  has(key: TKey): boolean {
    return this.internalMap.has(key);
  }

  entries(): Iterable<[TKey, TValue]> {
    return this.internalMap.entries();
  }

  values(): Iterable<TValue> {
    return this.internalMap.values();
  }

  keys(): Iterable<TKey> {
    return this.internalMap.keys();
  }
}
