import { AuthJwtModule } from '@concepta/nestjs-auth-jwt';
import { AuthLocalModule } from '@concepta/nestjs-auth-local';
import { AuthRefreshModule } from '@concepta/nestjs-auth-refresh';
import { AuthenticationModule } from '@concepta/nestjs-authentication';
import { CrudModule } from '@concepta/nestjs-crud';
import { JwtModule } from '@concepta/nestjs-jwt';
import { Module } from '@nestjs/common';
import { PasswordModule } from '@concepta/nestjs-password';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { UserLookupService, UserModule } from '@concepta/nestjs-user';

@Module({
  imports: [
    TypeOrmExtModule.registerAsync({
      useFactory: async () => {
        return {
          type: 'postgres',
          url: 'postgresql://postgres:postgres@rockets-starter-postgres:5432/postgres',
        };
      },
    }),
    AuthLocalModule.registerAsync({ ...createUserOpts() }),
    AuthJwtModule.registerAsync({ ...createUserOpts() }),
    AuthRefreshModule.registerAsync({ ...createUserOpts() }),
    AuthenticationModule.register(),
    JwtModule.register(),
    PasswordModule.register(),
    CrudModule.register(),
    UserModule.register(),
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
