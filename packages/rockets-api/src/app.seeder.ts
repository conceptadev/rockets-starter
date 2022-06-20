import { Connection } from 'typeorm';
import { Factory, Seeder } from '@jorgebodega/typeorm-seeding';
import { OrgSeeder } from '@concepta/nestjs-org/dist/seeding';
import { OrgEntity } from './entities/org.entity';
import { UserFactory, UserSeeder } from '@concepta/nestjs-user/dist/seeding';
import { UserEntity } from './entities/user.entity';
import { RoleSeeder } from '@concepta/nestjs-role/dist/seeding';
import { RoleEntity } from './entities/role.entity';

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
    const userFactory = new UserFactory(UserEntity);
    return userFactory.create();
  }
}
