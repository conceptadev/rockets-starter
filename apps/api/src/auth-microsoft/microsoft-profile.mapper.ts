import type { AuthorizedUser } from '@bitwild/rockets';
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

  const roles = Array.isArray(payload.roles)
    ? payload.roles.filter((r): r is string => typeof r === 'string' && APP_ROLES.has(r))
    : [];

  console.log(`[MicrosoftAuth] ${email ?? oid} → roles: ${roles.length ? roles.join(', ') : 'none'}`);

  return {
    id: oid,
    sub: payload.sub ?? oid,
    email,
    userRoles: roles.map((name) => ({ role: { name } })),
    claims: payload as Record<string, unknown>,
  };
}
