import type { DataSourceOptions } from 'typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserMetadataEntity } from '../modules/user-metadata';
import { ArtifactRecordEntity } from '../modules/workflows/infrastructure/artifact-record.entity';

const ENTITIES = [UserMetadataEntity, ArtifactRecordEntity];

export function getSqliteDatabasePath(): string {
  return process.env.DATABASE_PATH ?? 'rockets-starter.sqlite';
}

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'sqlite',
    database: getSqliteDatabasePath(),
    entities: ENTITIES,
    // Rockets forRoot merges entities from defineModuleResource; ENTITIES here
    // is also used by the TypeORM CLI (migrations).
    autoLoadEntities: true,
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
