import { Logger, Module } from '@nestjs/common';
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
import { EmailSendOptionsInterface } from '@concepta/ts-common/dist/email/interfaces/email-send-options.interface';
import {
  InvitationAcceptedEventAsync,
  InvitationModule,
} from '@concepta/nestjs-invitation';
import { EventModule } from '@concepta/nestjs-event';

import { ormConfig } from './config/typeorm.config';
import { UserEntity } from './entities/user.entity';
import { OrgEntity } from './entities/org.entity';
import { FederatedEntity } from './entities/federated-entity';
import { RoleEntity } from './entities/role.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { UserOtpEntity } from './entities/user-otp.entity';
import { InvitationEntity } from './entities/invitation.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    EventModule.forRoot({}),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
    }),
    SwaggerUiModule.register({}),
    TypeOrmExtModule.forRootAsync({
      inject: [ormConfig.KEY],
      useFactory: async (config: ConfigType<typeof ormConfig>) => config,
    }),
    AuthLocalModule.registerAsync({ ...createUserOpts() }),
    AuthJwtModule.registerAsync({ ...createUserOpts() }),
    AuthRefreshModule.registerAsync({ ...createUserOpts() }),
    AuthenticationModule.register({}),
    JwtModule.forRoot({}),
    PasswordModule.forRoot({}),
    CrudModule.forRoot({}),
    //TODO OrgModule will only work if imported before UserModule
    OrgModule.registerAsync({
      inject: [UserLookupService],
      useFactory: (userLookupService: UserLookupService) => ({
        ownerLookupService: userLookupService,
      }),
      entities: {
        org: { entity: OrgEntity },
      },
    }),
    //TODO FederatedModule will only work if imported before UserModule
    FederatedModule.forRootAsync({
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
    AuthGithubModule.register({}),
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
    EmailModule.forRoot({
      mailerService: {
        sendMail(sendMailOptions: EmailSendOptionsInterface): Promise<void> {
          Logger.debug('email sent', sendMailOptions);

          return Promise.resolve();
        },
      },
    }),
    InvitationModule.registerAsync({
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
      entities: {
        invitation: {
          entity: InvitationEntity,
        },
      },
    }),
    OtpModule.forRoot({
      entities: {
        'user-otp': {
          entity: UserOtpEntity,
        },
      },
    }),
    UserModule.forRoot({
      settings: {
        invitationRequestEvent: InvitationAcceptedEventAsync,
      },
      entities: {
        user: { entity: UserEntity },
      },
    }),
  ],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule { }

function createUserOpts() {
  return {
    inject: [UserLookupService],
    useFactory: (userLookupService: UserLookupService) => ({
      userLookupService,
    }),
  };
}
