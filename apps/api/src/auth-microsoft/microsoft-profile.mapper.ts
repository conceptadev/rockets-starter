import type { AuthorizedUser } from '@concepta/rockets';
import type { JWTPayload } from 'jose';
import { AppUserRole } from '../shared/domain/user-role.enum';

const APP_ROLES = new Set<string>(Object.values(AppUserRole));

export function mapMicrosoftProfile(payload: JWTPayload): AuthorizedUser {
  const oid = typeof payload.oid === 'string' ? payload.oid : payload.sub;

  if (!oid) {
    throw new Error('Microsoft token has no oid or sub claim');
  }

  const email = [payload.preferred_username, payload.email, payload.upn].find(
    (value): value is string => typeof value === 'string',
  );

  const tokenRoles = Array.isArray(payload.roles)
    ? payload.roles.filter(
        (role): role is string =>
          typeof role === 'string' && APP_ROLES.has(role),
      )
    : [];

  const roles = tokenRoles.length > 0 ? tokenRoles : [AppUserRole.USER];

  return {
    id: oid,
    sub: payload.sub ?? oid,
    email,
    userRoles: roles.map((name) => ({ role: { name } })),
    claims: payload as Record<string, unknown>,
  };
}
