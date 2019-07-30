// @flow
/*::
import type { Storage } from '../storage.2';
import type { AWSCreds } from '../../models/config';
*/
const { S3 } = require("aws-sdk");

const createS3Storage = (
  { accessKeyId, secretAccessKey, region } /*: AWSCreds*/,
  bucketName/*: string*/,
)/*: Storage<string, string>*/ => {
  const client = new S3({ region, accessKeyId, secretAccessKey });

  const read = async (key) => {
    const data = await client.getObject({
      Bucket: bucketName,
      Key: key,
    }).promise();
    return data.Body.toString('utf-8');
  };

  const write = async (key, value) => {
    const data = await client.putObject({
      Body: value,
      Bucket: bucketName,
      Key: key,
    }).promise();
  };

  return {
    read,
    write,
  };
};

module.exports = {
  createS3Storage
};