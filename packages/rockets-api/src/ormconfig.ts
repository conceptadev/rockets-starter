/**
 * !!!!! You MUST run build for changes in this   !!!!!!
 * !!!!! file to take effect for all CLI commands !!!!!!
 */

import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { ormConfigFactory } from './config/typeorm.config';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! This config() call is for CLI ONLY         !!!
// !!! DO NOT MOVE THIS TO THE ormConfigFactory() !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
config();

const options = {
  ...ormConfigFactory(),
  cli: {
    migrationsDir: './dist/migrations',
  },
};

export default new DataSource(options);
