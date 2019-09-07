// @flow strict

declare module "aws-sdk" {
  declare type S3Response<T> = {
    promise: () => Promise<T>,
  };
  declare export class S3 {
    constructor({ region: string, accessKeyId?: string, secretAccessKey?: string }): S3;
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
};

declare module "@aws-sdk/client-s3-node" {
  import type { PutObjectCommand }  from '@aws-sdk/client-s3-node/commands/PutObjectCommand';
  import type { GetObjectCommand }  from '@aws-sdk/client-s3-node/commands/GetObjectCommand';
  declare type ClientParams = {
    region?: string,
    accessKeyId?: string,
    secretAccessKey?: string,
  };
  declare export class S3Client {
    constructor(ClientParams): S3Client;
    send(PutObjectCommand): Promise<void>;
    send(GetObjectCommand): Promise<{ Body: Buffer }>;
    send(HeadObjectCommand): Promise<void>;
  }
}

declare module "@aws-sdk/client-s3-node/commands/PutObjectCommand" {
  declare type Params = {
    Body: string | Buffer,
    Bucket: string,
    Key: string,
  };
  declare export class PutObjectCommand {
    constructor(Params): PutObjectCommand;
  }
}
declare module "@aws-sdk/client-s3-node/commands/GetObjectCommand" {
  declare type Params = {
    Bucket: string,
    Key: string,
  }
  declare export class GetObjectCommand {
    constructor(Params): GetObjectCommand;
  }
}
declare module "@aws-sdk/client-s3-node/commands/HeadObjectCommand" {
  declare type Params = {
    Bucket: string,
    Key: string,
  }
  declare export class HeadObjectCommand {
    constructor(Params): HeadObjectCommand;
  }
}