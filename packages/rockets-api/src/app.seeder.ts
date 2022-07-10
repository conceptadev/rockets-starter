import { DataSource } from 'typeorm';
import { Seeder } from '@concepta/typeorm-seeding';
import { OrgFactory, OrgSeeder } from '@concepta/nestjs-org/dist/seeding';
import { OrgEntity } from './entities/org.entity';
import { UserFactory, UserSeeder } from '@concepta/nestjs-user/dist/seeding';
import { UserEntity } from './entities/user.entity';

export class AppSeeder extends Seeder {
  async run(dataSource: DataSource) {
    const userSeeder = new UserSeeder({
      factories: {
        user: new UserFactory({
          entity: UserEntity,
        }),
      },
    });
    const orgSeeder = new OrgSeeder({
      factories: {
        owner: new UserFactory({
          entity: UserEntity,
        }),
        org: new OrgFactory({ entity: OrgEntity }),
      },
    });
    // TODO implement roles
    await this.call(dataSource, [userSeeder, orgSeeder]);
  }
}
