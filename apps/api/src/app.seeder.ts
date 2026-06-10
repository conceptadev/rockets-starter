import { Seeder } from '@concepta/typeorm-seeding';
import { FAKE_AUTH_USER_ID } from './auth/fake-auth.constants';
import { AppUserRole } from './shared/domain/user-role.enum';
import { UserEntity } from './modules/user';
import { UserMetadataEntity } from './modules/user-metadata/infrastructure/user-metadata.entity';

export class AppSeeder extends Seeder {
  async run(): Promise<void> {
    const userRepository = this.repository(UserEntity);
    const userMetadataRepository = this.repository(UserMetadataEntity);

    let devUser = await userRepository.findOne({
      where: { id: FAKE_AUTH_USER_ID },
    });

    if (!devUser) {
      devUser = userRepository.create({
        id: FAKE_AUTH_USER_ID,
        email: 'dev@rockets-starter.local',
        password: 'not-used',
        name: 'Dev User',
        role: AppUserRole.ADMIN,
      });
      await userRepository.save(devUser);

      await userMetadataRepository.save(
        userMetadataRepository.create({
          userId: devUser.id,
          firstName: 'Dev',
          lastName: 'User',
        }),
      );
    }
  }
}
