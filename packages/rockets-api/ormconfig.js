/**
 * !!!!! Some or all of these can be overridden by the Nest module              !!!!!!
 * !!!!! Changing these values is unlikely to have an effect on the running app !!!!!!
 */

const dbSSL =
  'string' === typeof process.env.DATABASE_SSL
    ? process.env.DATABASE_SSL === 'true'
    : process.env.DATABASE_SSL || false;

module.exports = {
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@rockets-starter-postgres:5432/postgres',
  synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE) || false,
  entities: [
    '../../node_modules/@concepta/nestjs-user/dist/entities/user.entity.js',
  ],
  subscribers: ['dist/**/*.subscriber.js'],
  seeders: ['dist/**/*.seeder.js'],
  defaultSeeder: 'RootSeeder',
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  extra: {
    ssl: dbSSL
      ? {
          rejectUnauthorized: false,
        }
      : false,
  },
  logging: 'all',
};
