import type { DataSourceOptions } from 'typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AnnouncementEntity } from '../modules/announcement/infrastructure/announcement.entity';
import { CategoryEntity } from '../modules/category/infrastructure/category.entity';
import { TaskEntity } from '../modules/task/infrastructure/task.entity';
import { UserEntity } from '../modules/user';
import { UserMetadataEntity } from '../modules/user-metadata/infrastructure/user-metadata.entity';

const ENTITIES = [
  UserEntity,
  UserMetadataEntity,
  AnnouncementEntity,
  CategoryEntity,
  TaskEntity,
];

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
