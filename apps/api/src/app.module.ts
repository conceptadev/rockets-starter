import { Module } from '@nestjs/common';
import { RocketsModule, defineTypeOrmRepository } from '@bitwild/rockets';
import { defineMicrosoftAuth } from './auth-microsoft';
import { getDatabaseConfig } from './config/database.config';
import { BudgetModule, budgetResource } from './modules/budget';
import {
  UserMetadataCreateDto,
  UserMetadataEntity,
  UserMetadataUpdateDto,
} from './modules/user-metadata';
import { workflowsResource } from './modules/workflows/workflows.resource';

@Module({
  imports: [
    BudgetModule,
    RocketsModule.forRoot({
      auth: defineMicrosoftAuth(),
      userMetadata: {
        entity: UserMetadataEntity,
        createDto: UserMetadataCreateDto,
        updateDto: UserMetadataUpdateDto,
      },
      repository: defineTypeOrmRepository(getDatabaseConfig()),
      resources: [budgetResource, workflowsResource],
      enableGlobalGuard: true,
    }),
  ],
})
export class AppModule {}
