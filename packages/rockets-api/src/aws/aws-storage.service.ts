import {
  FileCreateDto,
  FileStorageServiceInterface,
} from '@concepta/nestjs-file';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject } from '@nestjs/common';
import { awsConfig } from '../config/aws.config';
import { ConfigType } from '@nestjs/config';

export class AwsStorageService implements FileStorageServiceInterface {
  KEY = 'aws-storage';

  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    @Inject(awsConfig.KEY)
    private config: ConfigType<typeof awsConfig>,
  ) {
    this.s3Client = new S3Client(config);
    this.bucketName = config.bucketName;
  }

  async getUploadUrl(file: FileCreateDto): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: file.fileName,
      ContentType: file.contentType,
    });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
  }

  async getDownloadUrl(file: FileCreateDto): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: file.fileName,
    });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    }); // URL expires in 1 hour
  }
}
