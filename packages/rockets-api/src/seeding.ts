import { SeedingSource } from '@concepta/typeorm-seeding';

export default new SeedingSource({
  defaultSeeders: 'AppSeeder',
  seeders: ['./dist/**/*.seeder.js'],
});
