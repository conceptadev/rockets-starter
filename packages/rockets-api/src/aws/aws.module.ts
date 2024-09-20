import { Global, Module } from '@nestjs/common';
import { AwsStorageService } from './aws-storage.service';
import { AwsController } from './aws.controller';

@Global()
@Module({
  providers: [AwsStorageService],
  exports: [AwsStorageService],
  controllers: [AwsController],
})
export class AwsModule {}
