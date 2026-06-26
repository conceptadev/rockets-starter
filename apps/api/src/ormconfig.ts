/**
 * !!!!! You MUST run build for changes in this   !!!!!!
 * !!!!! file to take effect for all CLI commands !!!!!!
 */

import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { ormSettingsFactory } from './config/database.config';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! This config() call is for CLI ONLY         !!!
// !!! DO NOT MOVE THIS TO THE ormSettingsFactory() !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
config();

const options = {
  ...ormSettingsFactory(),
  cli: {
    migrationsDir: './dist/migrations',
  },
};

export default new DataSource(options);
