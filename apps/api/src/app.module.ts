import { Module } from '@nestjs/common';
import { RocketsModule, defineTypeOrmRepository } from '@bitwild/rockets';
import { defineMicrosoftAuth } from './auth-microsoft';
import { getDatabaseConfig } from './config/database.config';
import { userMetadata } from './modules/user-metadata';
import { workflowsResource } from './modules/workflows/workflows.resource';
import { appAcl } from './app.acl';
import { AppAccessControlService } from './access-control.service';

@Module({
  imports: [
    RocketsModule.forRoot({
      auth: defineMicrosoftAuth(),
      userMetadata,
      repository: defineTypeOrmRepository(getDatabaseConfig()),
      resources: [workflowsResource],
      enableGlobalGuard: true,
      accessControl: {
        settings: { rules: appAcl },
        service: new AppAccessControlService(),
      },
    }),
  ],
})
export class AppModule {}
