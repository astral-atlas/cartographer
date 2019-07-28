// @flow strict

declare module "uuid/v4" {
  declare function generateUUID(): string;

  declare module.exports: typeof generateUUID;
}