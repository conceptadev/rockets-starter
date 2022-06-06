import { Connection } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { UserSeeder } from '@concepta/nestjs-user/dist/seeding';
import { UserEntity } from './entities/user.entity';

export class RootSeeder extends Seeder {
  async run(connection: Connection) {
    UserSeeder.entity = UserEntity;
    await this.call(connection, [UserSeeder]);
  }
}
