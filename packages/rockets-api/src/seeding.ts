import { config } from 'dotenv';
import { SeedingSource } from '@concepta/typeorm-seeding';
import { AppSeeder } from './app.seeder';
import { default as dataSource } from './ormconfig';

config();

export default new SeedingSource({
  dataSource,
  seeders: [AppSeeder],
  defaultSeeders: [AppSeeder],
});
