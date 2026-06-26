import type { DataSourceOptions } from 'typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BudgetSnapshotEntity } from '../modules/budget/infrastructure/budget-snapshot.entity';
import { FeatureEstimateEntity } from '../modules/budget/infrastructure/feature-estimate.entity';
import { ZohoTaskEntity } from '../modules/budget/infrastructure/zoho-task.entity';
import { UserMetadataEntity } from '../modules/user-metadata/infrastructure/user-metadata.entity';

const ENTITIES = [
  UserMetadataEntity,
  BudgetSnapshotEntity,
  FeatureEstimateEntity,
  ZohoTaskEntity,
];

export function getSqliteDatabasePath(): string {
  return process.env.DATABASE_PATH ?? 'rockets-starter.sqlite';
}

export function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'sqlite',
    database: getSqliteDatabasePath(),
    entities: ENTITIES,
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
