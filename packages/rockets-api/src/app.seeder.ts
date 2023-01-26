import { Seeder } from '@concepta/typeorm-seeding';
import {
  OrgFactory,
  OrgOwnerFactory,
  OrgSeeder,
} from '@concepta/nestjs-org/dist/seeding';
import { OrgEntity } from './entities/org.entity';
import { UserFactory, UserSeeder } from '@concepta/nestjs-user/dist/seeding';
import { UserEntity } from './entities/user.entity';

const foo = `hello`;
console.log(foo);

export class AppSeeder extends Seeder {
  async run() {
    const userSeeder = new UserSeeder({
      factories: [
        new UserFactory({
          entity: UserEntity,
        }),
      ],
    });
    const orgSeeder = new OrgSeeder({
      factories: [
        new UserFactory({
          entity: UserEntity,
          override: OrgOwnerFactory,
        }),
        new OrgFactory({ entity: OrgEntity }),
      ],
    });
    // TODO implement roles
    await this.call([userSeeder, orgSeeder]);
  }
}
