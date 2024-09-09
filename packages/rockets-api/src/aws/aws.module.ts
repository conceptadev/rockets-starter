import { Global, Module } from '@nestjs/common';
import { AwsStorageService } from './aws-storage.service';
import { AwsController } from './aws.controller';
import { FileModule } from '@concepta/nestjs-file';
import { FileEntity } from '../entities/file.entity';

@Global()
@Module({
  imports: [
    FileModule.registerAsync({
      inject: [AwsStorageService],
      useFactory: (awsStorageService: AwsStorageService) => ({
        storageServices: [awsStorageService],
      }),
      entities: {
        file: {
          entity: FileEntity,
        },
      },
    }),
  ],
  providers: [AwsStorageService],
  exports: [AwsStorageService],
  controllers: [AwsController],
})
export class AwsModule {}
