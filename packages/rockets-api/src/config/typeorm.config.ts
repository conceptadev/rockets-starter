/**
 * !!!!! You MUST run build for changes in this   !!!!!!
 * !!!!! file to take effect for all CLI commands !!!!!!
 */

import { DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';
import { UserEntity } from '../entities/user.entity';
import { OrgEntity } from '../entities/org.entity';
import { FederatedEntity } from '../entities/federated-entity';
import { RoleEntity } from '../entities/role.entity';
import { UserRoleEntity } from '../entities/user-role.entity';
import { UserOtpEntity } from '../entities/user-otp.entity';

export const ormConfigFactory = (): DataSourceOptions => {
  // return the configuration
  return {
    type: 'postgres',
    url:
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@rockets-starter-postgres:5432/rockets-starter',
    entities: [
      UserEntity,
      OrgEntity,
      FederatedEntity,
      RoleEntity,
      UserRoleEntity,
      UserOtpEntity,
    ],
    subscribers: [__dirname + '/../**/*.subscriber.js'],
    migrations: [__dirname + '/../migrations/*.js'],
    extra: {
      ssl:
        process.env?.DATABASE_SSL === 'true'
          ? {
              rejectUnauthorized: false,
            }
          : false,
    },
  };
};

// import this into your Nest app
export const ormConfig = registerAs('TYPEORM_MODULE_CONFIG', ormConfigFactory);
