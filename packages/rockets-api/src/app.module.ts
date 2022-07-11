import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AuthJwtModule } from '@concepta/nestjs-auth-jwt';
import { AuthLocalModule } from '@concepta/nestjs-auth-local';
import { AuthRefreshModule } from '@concepta/nestjs-auth-refresh';
import { AuthenticationModule } from '@concepta/nestjs-authentication';
import { CrudModule } from '@concepta/nestjs-crud';
import { JwtModule } from '@concepta/nestjs-jwt';
import { PasswordModule } from '@concepta/nestjs-password';
import { SwaggerUiModule } from '@concepta/nestjs-swagger-ui';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import {
  UserLookupService,
  UserModule,
  UserMutateService,
} from '@concepta/nestjs-user';
import { OrgModule } from '@concepta/nestjs-org';
import { AuthGithubModule } from '@concepta/nestjs-auth-github';
import { FederatedModule } from '@concepta/nestjs-federated';
import { RoleModule } from '@concepta/nestjs-role';
import { AuthRecoveryModule } from '@concepta/nestjs-auth-recovery';
import { OtpModule, OtpService } from '@concepta/nestjs-otp';
import { EmailModule, EmailService } from '@concepta/nestjs-email';

import { ormConfig } from './config/typeorm.config';
import { UserEntity } from './entities/user.entity';
import { OrgEntity } from './entities/org.entity';
import { FederatedEntity } from './entities/federated-entity';
import { RoleEntity } from './entities/role.entity';
import { UserRoleEntity } from './entities/user-role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
    }),
    SwaggerUiModule.register(),
    TypeOrmExtModule.registerAsync({
      inject: [ormConfig.KEY],
      useFactory: async (config: ConfigType<typeof ormConfig>) => config,
    }),
    AuthLocalModule.registerAsync({ ...createUserOpts() }),
    AuthJwtModule.registerAsync({ ...createUserOpts() }),
    AuthRefreshModule.registerAsync({ ...createUserOpts() }),
    AuthenticationModule.register(),
    JwtModule.register(),
    PasswordModule.register(),
    CrudModule.register(),
    //TODO OrgModule will only work if imported before UserModule
    OrgModule.registerAsync({
      imports: [UserModule.deferred()],
      inject: [UserLookupService],
      useFactory: (userLookupService: UserLookupService) => ({
        ownerLookupService: userLookupService,
      }),
      entities: {
        org: { entity: OrgEntity },
      },
    }),
    //TODO FederatedModule will only work if imported before UserModule
    FederatedModule.registerAsync({
      imports: [UserModule.deferred()],
      inject: [UserLookupService, UserMutateService],
      useFactory: (userLookupService, userMutateService) => ({
        userLookupService,
        userMutateService,
      }),
      entities: {
        federated: {
          entity: FederatedEntity,
          // connection: ormConfig
        },
      },
    }),
    AuthGithubModule.register(),
    RoleModule.register({
      settings: {
        assignments: {
          user: { entityKey: 'userRole' },
        },
      },
      entities: {
        role: {
          entity: RoleEntity,
        },
        userRole: {
          entity: UserRoleEntity,
        },
      },
    }),
    //TODO FederatedModule will only work if imported before UserModule and Email modules
    AuthRecoveryModule.registerAsync({
      imports: [
        UserModule.deferred(),
        OtpModule.deferred(),
        EmailModule.deferred(),
      ],
      inject: [UserLookupService, UserMutateService, OtpService, EmailService],
      useFactory: (
        userLookupService,
        userMutateService,
        otpService,
        emailService,
      ) => ({
        userLookupService,
        userMutateService,
        otpService,
        emailService,
      }),
    }),
    // To use a real a service, override the email env vars and replace this for 'EmailModule.register()'.
    EmailModule.register({
      mailerService: {
        sendMail(): Promise<void> {
          console.log('email sent');

          return Promise.resolve();
        },
      },
    }),
    OtpModule.register({
      entities: {
        userOtp: {
          entity: UserEntity,
        },
      },
    }),
    UserModule.register({
      entities: {
        user: { entity: UserEntity },
      },
    }),
  ],
})
export class AppModule {}

function createUserOpts() {
  return {
    imports: [UserModule.deferred()],
    inject: [UserLookupService],
    useFactory: (userLookupService: UserLookupService) => ({
      userLookupService,
    }),
  };
}
