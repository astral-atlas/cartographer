// @flow strict

declare module "aws-sdk" {
  declare type S3Response<T> = {
    promise: () => Promise<T>,
  };
  declare export class S3 {
    constructor({ region: string, accessKeyId: string, secretAccessKey: string }): S3;
    getObject({
      Bucket: string,
      Key: string,
    }): S3Response<{ Body: Buffer }>,
    putObject({
      Body: string,
      Bucket: string,
      Key: string,
    }): S3Response<{}>,
    headObject({
      Bucket: string,
      Key: string,
    }): S3Response<{}>,
  }
}