import { Module } from '@nestjs/common';
import {
  RocketsModule,
  defineTypeOrmRepository,
} from '@bitwild/rockets';
import { defineFakeAuth } from './auth';
import { getDatabaseConfig } from './config/database.config';
import { announcementResource } from './modules/announcement';
import { categoryResource } from './modules/category';
import { reportFeature } from './modules/report';
import { taskResource } from './modules/task';
import {
  UserMetadataCreateDto,
  UserMetadataEntity,
  UserMetadataUpdateDto,
} from './modules/user-metadata';
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
