/**
 * !!!!! You MUST run build for changes in this   !!!!!!
 * !!!!! file to take effect for all CLI commands !!!!!!
 */

import { registerAs } from '@nestjs/config';
import { ConnectionOptions } from '@jorgebodega/typeorm-seeding';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { OrgEntity } from './entities/org.entity';
import { FederatedEntity } from './entities/federated-entity';
import { RoleEntity } from './entities/role.entity';
import { UserRoleEntity } from './entities/user-role.entity';

export const ormDefaultConfig = (): TypeOrmModuleOptions &
  Partial<ConnectionOptions> => {
  // return the configuration
  return {
    type: 'postgres',
    url:
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/rockets-starter',
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE) ?? false,
    entities: [
      UserEntity,
      OrgEntity,
      FederatedEntity,
      RoleEntity,
      UserRoleEntity,
    ],
    subscribers: [__dirname + '/**/*.subscriber.js'],
    seeders: [__dirname + '/**/*.seeder.js'],
    defaultSeeder: 'RootSeeder',
    migrations: [__dirname + '/migrations/*.js'],
    cli: {
      migrationsDir: './src/migrations',
    },
    extra: {
      ssl:
        process.env?.DATABASE_SSL === 'true'
          ? {
              rejectUnauthorized: false,
            }
          : false,
    },
    logging: 'all',
  };
};

// import this into your Nest app
export const ormConfig = registerAs('TYPEORM_MODULE_CONFIG', ormDefaultConfig);

const defaultConfig = ormDefaultConfig();

// this is used by the CLI tools
export default defaultConfig;
