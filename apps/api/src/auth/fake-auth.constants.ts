import type { AuthorizedUser } from '@bitwild/rockets';
import { AppUserRole } from '../interfaces/user.interface';

export const FAKE_AUTH_USER_ID = '00000000-0000-0000-0000-000000000001';

export const FAKE_AUTH_USER: AuthorizedUser = {
  id: FAKE_AUTH_USER_ID,
  sub: FAKE_AUTH_USER_ID,
  email: 'dev@rockets-starter.local',
  userRoles: [{ role: { name: AppUserRole.ADMIN } }],
  claims: {
    email: 'dev@rockets-starter.local',
    name: 'Dev User',
    role: AppUserRole.ADMIN,
  },
};
