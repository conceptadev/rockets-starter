import { Module } from '@nestjs/common';
import { RocketsModule, defineTypeOrmRepository } from '@bitwild/rockets';
import { AccessControlModule } from '@concepta/nestjs-access-control';
import { defineMicrosoftAuth } from './auth-microsoft';
import { getDatabaseConfig } from './config/database.config';
import {
  UserMetadataCreateDto,
  UserMetadataEntity,
  UserMetadataUpdateDto,
} from './modules/user-metadata';
import { workflowsResource } from './modules/workflows/workflows.resource';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { appAcl } from './app.acl';
import { AppAccessControlService } from './access-control.service';

@Module({
  imports: [
    WorkflowsModule,
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
    AccessControlModule.forRoot({
      settings: { rules: appAcl },
      service: new AppAccessControlService(),
    }),
  ],
})
export class AppModule {}
