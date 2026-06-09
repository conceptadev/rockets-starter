import { Module } from '@nestjs/common';
import {
  RocketsModule,
  defineTypeOrmRepository,
} from '@bitwild/rockets';
import { defineFakeAuth } from './auth';
import {
  UserMetadataCreateDto,
  UserMetadataUpdateDto,
} from './entities/user-metadata.dto';
import { UserMetadataEntity } from './entities/user-metadata.entity';
import { getDatabaseConfig } from './config/database.config';
import { reportFeature } from './features/report';
import { announcementResource } from './resources/announcement';
import { categoryResource } from './resources/category';
import { taskResource } from './resources/task';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    RocketsModule.forRoot({
      auth: defineFakeAuth(),
      userMetadata: {
        entity: UserMetadataEntity,
        createDto: UserMetadataCreateDto,
        updateDto: UserMetadataUpdateDto,
      },
      repository: defineTypeOrmRepository(getDatabaseConfig()),
      resources: [
        announcementResource,
        categoryResource,
        taskResource,
        reportFeature,
      ],
      enableGlobalGuard: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
