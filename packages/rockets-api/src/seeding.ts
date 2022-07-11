import { config } from 'dotenv';
import { SeedingSource } from '@concepta/typeorm-seeding';

config();

export default new SeedingSource({
  defaultSeeders: 'AppSeeder',
  seeders: ['./dist/**/*.seeder.js'],
});
