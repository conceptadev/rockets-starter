import { S3ClientConfig } from '@aws-sdk/client-s3';

export interface AwsConfigInterface extends S3ClientConfig {
  bucketName: string;
}
