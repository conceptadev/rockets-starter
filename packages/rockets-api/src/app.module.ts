import { AuthJwtModule } from '@concepta/nestjs-auth-jwt';
import { AuthLocalModule } from '@concepta/nestjs-auth-local';
import { AuthRefreshModule } from '@concepta/nestjs-auth-refresh';
import { AuthenticationModule } from '@concepta/nestjs-authentication';
import { CrudModule } from '@concepta/nestjs-crud';
import { JwtModule } from '@concepta/nestjs-jwt';
import { Module } from '@nestjs/common';
import { PasswordModule } from '@concepta/nestjs-password';
import { SwaggerUiModule } from '@concepta/nestjs-swagger-ui';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { UserLookupService, UserModule } from '@concepta/nestjs-user';
import { OrgModule } from '@concepta/nestjs-org';
import { default as ormconfig } from './ormconfig';
import { UserEntity } from './entities/user.entity';
import { OrgEntity } from './entities/org.entity';

@Module({
  imports: [
    SwaggerUiModule.register(),
    TypeOrmExtModule.registerAsync({
      useFactory: async () => ormconfig,
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
