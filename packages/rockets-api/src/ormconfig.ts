/**
 * !!!!! Some or all of these can be overridden by the Nest module              !!!!!!
 * !!!!! Changing these values is unlikely to have an effect on the running app !!!!!!
 */

import { TypeOrmExtOptions } from '@concepta/nestjs-typeorm-ext';
import { UserEntity } from './entities/user.entity';
import { OrgEntity } from './entities/org.entity';

const dbSSL =
  'string' === typeof process.env.DATABASE_SSL
    ? process.env.DATABASE_SSL === 'true'
    : process.env.DATABASE_SSL || false;

export default {
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/postgres',
  synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE) || false,
  entities: [UserEntity, OrgEntity],
  subscribers: [__dirname + '/**/*.subscriber.js'],
  seeders: [__dirname + '/**/*.seeder.js'],
  defaultSeeder: 'RootSeeder',
  migrations: [__dirname + '/migrations/*.js'],
  cli: {
    migrationsDir: './src/migrations',
  },
  extra: {
    ssl: dbSSL
      ? {
          rejectUnauthorized: false,
        }
      : false,
  },
  logging: 'all',
} as TypeOrmExtOptions;
