/**
 * !!!!! You MUST run build for changes in this   !!!!!!
 * !!!!! file to take effect for all CLI commands !!!!!!
 */

import { DataSource } from 'typeorm';
import { ormConfigFactory } from './config/typeorm.config';

const options = {
  ...ormConfigFactory(),
  cli: {
    migrationsDir: './dist/migrations',
  },
};

export default new DataSource(options);
