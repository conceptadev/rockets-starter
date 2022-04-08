import { Module } from '@nestjs/common';
import { AuthJwtModule } from '@rockts-org/nestjs-auth-jwt';
import { AuthLocalModule } from '@rockts-org/nestjs-auth-local';
import { AuthRefreshModule } from '@rockts-org/nestjs-auth-refresh';
import { AuthenticationModule } from '@rockts-org/nestjs-authentication';
import { CrudModule } from '@rockts-org/nestjs-crud';
import { JwtModule } from '@rockts-org/nestjs-jwt';
import { PasswordModule } from '@rockts-org/nestjs-password';
import { TypeOrmExtModule } from '@rockts-org/nestjs-typeorm-ext';
import { UserModule } from '@rockts-org/nestjs-user';

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
    AuthLocalModule.register(),
    AuthJwtModule.register(),
    AuthRefreshModule.register(),
    AuthenticationModule.register(),
    JwtModule.register(),
    PasswordModule.register(),
    CrudModule.register(),
    UserModule.register(),
  ],
})
export class AppModule {}
