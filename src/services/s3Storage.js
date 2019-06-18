// @flow
import { Credentials, S3 } from 'aws-sdk';

/*::
type S3Service = {
  read: (key: string) => Promise<string>, 
  write: (key: string, value: string) => Promise<void>, 
};
*/

const apiVersion = '2006-03-01';
 
export const createS3Service = (
  region/*: string*/,
  accessKey/*: string*/,
  secretAccessKey/*: string*/,
  bucketName/*: string*/,
)/*: S3Service*/ => {
  // Set credentials and region
  const credentials = new Credentials(accessKey, secretAccessKey);
  const { getObject, putObject } = new S3({ apiVersion, region, credentials });
  
  const write = async (key, value) => {
    const putConfig = {
      Bucket: bucketName,
      Key: key,
      Body: value,
    };
    await putObject(putConfig).promise();
  };
  const read = async (key) => {
    const getConfig = {
      Bucket: bucketName,
      Key: key,
    };
    return await getObject(getConfig).promise();
  };
  return {
    write,
    read,
  };
};
