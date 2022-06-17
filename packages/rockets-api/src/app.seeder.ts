import { Connection } from 'typeorm';
import { Factory, Seeder } from '@jorgebodega/typeorm-seeding';
import { UserFactory, UserSeeder } from '@concepta/nestjs-user/dist/seeding';
import { RoleSeeder } from '@concepta/nestjs-role/dist/seeding';
import { OrgSeeder } from '@concepta/nestjs-org/dist/seeding';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { OrgEntity } from './entities/org.entity';

export class RootSeeder extends Seeder {
  async run(connection: Connection) {
    UserSeeder.entity = UserEntity;
    OrgSeeder.entity = OrgEntity;
    OrgSeeder.ownerFactory = OwnerFactory;
    // TODO RoleSeeder.entity not works, it will return this error: error: null value in column "description" of relation "role" violates not-null constraint
    // RoleSeeder.entity = RoleEntity;
    await this.call(connection, [UserSeeder, OrgSeeder]);
  }
}

class OwnerFactory extends Factory<UserEntity> {
  protected async definition(): Promise<UserEntity> {
    const user = new UserEntity();
    //TODO temporary, change to faker later;
    user.username = 'me';
    user.email = 'me@mail.com';

    return user;
  }
}
