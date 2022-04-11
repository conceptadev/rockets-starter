import { UserSeeder } from '@concepta/nestjs-user/dist/seeding';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { Connection } from 'typeorm';

export class RootSeeder extends Seeder {
  async run(connection: Connection) {
    await this.call(connection, [UserSeeder]);
  }
}
