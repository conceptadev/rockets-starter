import { Module } from '@nestjs/common';
import {
  RocketsModule,
  defineTypeOrmRepository,
} from '@bitwild/rockets';
import { defineMicrosoftAuth } from './auth-microsoft';
import { getDatabaseConfig } from './config/database.config';
import {
  UserMetadataCreateDto,
  UserMetadataEntity,
  UserMetadataUpdateDto,
} from './modules/user-metadata';

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
      resources: [],
      enableGlobalGuard: true,
    }),
  ],
})
export class AppModule {}
