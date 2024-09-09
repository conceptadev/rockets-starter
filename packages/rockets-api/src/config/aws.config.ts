import { registerAs } from '@nestjs/config';
import { AwsConfigInterface } from '../aws/interfaces/aws.config.interface';

export const awsConfig = registerAs(
  'AWS_MODULE_CONFIG',
  (): AwsConfigInterface => {
    return {
      region: process.env?.BUCKETEER_AWS_REGION ?? '',
      credentials: {
        accessKeyId: process.env?.BUCKETEER_AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env?.BUCKETEER_AWS_SECRET_ACCESS_KEY ?? '',
      },
      bucketName: process.env?.BUCKETEER_BUCKET_NAME ?? '',
    };
  },
);
