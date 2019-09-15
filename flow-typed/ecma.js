// @flow strict
declare class Object {
  static entries<T>({ [string]: T }): Array<[string, T]>;
  static freeze<T>(T): T;
}