import type { DataSourceOptions } from 'typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserMetadataEntity } from '../modules/user-metadata/infrastructure/user-metadata.entity';

const ENTITIES = [UserMetadataEntity];

export function getSqliteDatabasePath(): string {
  return process.env.DATABASE_PATH ?? 'rockets-starter.sqlite';
}

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'sqlite',
    database: getSqliteDatabasePath(),
    synchronize: true,
  };
}

export function ormSettingsFactory(): DataSourceOptions {
  return {
    type: 'sqlite',
    database: getSqliteDatabasePath(),
    logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : false,
    entities: ENTITIES,
    migrations: [__dirname + '/../migrations/*.js'],
    synchronize: false,
  };
}
