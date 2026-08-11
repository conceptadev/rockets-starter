import { Module } from '@nestjs/common';
import { RocketsModule, defineTypeOrmRepository } from '@concepta/rockets';
import { defineMicrosoftAuth } from './auth-microsoft';
import { getDatabaseConfig } from './config/database.config';
import {
  UserMetadataCreateDto,
  UserMetadataEntity,
  UserMetadataUpdateDto,
} from './modules/user-metadata';
import { workflowsResource } from './modules/workflows/workflows.resource';

@Module({
  imports: [
    RocketsModule.forRoot({
      auth: defineMicrosoftAuth(),
      userMetadata: {
        entity: UserMetadataEntity,
        createDto: UserMetadataCreateDto,
        updateDto: UserMetadataUpdateDto,
      },
      repository: defineTypeOrmRepository(getDatabaseConfig()),
      resources: [workflowsResource],
      enableGlobalGuard: true,
    }),
  ],
})
export class AppModule {}
