import { UnauthorizedException } from '@nestjs/common';
import type { AuthRequest } from '@bitwild/rockets';
import { MicrosoftAuthAdapter } from './microsoft-auth.adapter';
import { MicrosoftTokenVerifierService } from './microsoft-token-verifier.service';
import { mapMicrosoftProfile } from './microsoft-profile.mapper';
import type { MicrosoftAuthSettings } from './microsoft-auth.settings';
import { MICROSOFT_LOGIN_BASE_URL } from './microsoft-auth.constants';
import { AppUserRole } from '../shared/domain/user-role.enum';

const TENANT_ID = '11111111-1111-1111-1111-111111111111';
const CLIENT_ID = '22222222-2222-2222-2222-222222222222';

const settings: MicrosoftAuthSettings = {
  tenantId: TENANT_ID,
  clientId: CLIENT_ID,
  issuer: `${MICROSOFT_LOGIN_BASE_URL}/${TENANT_ID}/v2.0`,
  jwksUri: `${MICROSOFT_LOGIN_BASE_URL}/${TENANT_ID}/discovery/v2.0/keys`,
  audience: [CLIENT_ID, `api://${CLIENT_ID}`],
};

function fakeJwt(payload: Record<string, unknown>): string {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode(payload)}.signature`;
}

function requestWithToken(token?: string): AuthRequest {
  return {
    headers: token ? { authorization: `Bearer ${token}` } : {},
    query: {},
    raw: {},
  };
}

describe('MicrosoftAuthAdapter', () => {
  let verifier: MicrosoftTokenVerifierService;
  let adapter: MicrosoftAuthAdapter;

  beforeEach(() => {
    verifier = new MicrosoftTokenVerifierService(settings);
    adapter = new MicrosoftAuthAdapter(verifier);
  });

  it('returns matched: false when there is no bearer token', async () => {
    const result = await adapter.authenticate(requestWithToken());

    expect(result).toEqual({ matched: false });
  });

  it('returns matched: false for a token from another issuer', async () => {
    const token = fakeJwt({ iss: 'https://accounts.google.com' });

    const result = await adapter.authenticate(requestWithToken(token));

    expect(result).toEqual({ matched: false });
  });

  it('returns the mapped user when verification succeeds', async () => {
    const payload = {
      iss: settings.issuer,
      oid: 'user-oid',
      sub: 'pairwise-sub',
      preferred_username: 'jane@company.com',
    };
    jest.spyOn(verifier, 'verify').mockResolvedValue(payload);

    const result = await adapter.authenticate(
      requestWithToken(fakeJwt(payload)),
    );

    expect(result).toEqual({
      matched: true,
      user: {
        id: 'user-oid',
        sub: 'pairwise-sub',
        email: 'jane@company.com',
        userRoles: [{ role: { name: AppUserRole.USER } }],
        claims: payload,
      },
    });
  });

  it('returns an UnauthorizedException result when verification fails', async () => {
    jest
      .spyOn(verifier, 'verify')
      .mockRejectedValue(new Error('signature verification failed'));
    const token = fakeJwt({ iss: settings.issuer });

    const result = await adapter.authenticate(requestWithToken(token));

    expect(result.matched).toBe(true);
    expect(result).toHaveProperty('error');
    if (result.matched && 'error' in result) {
      expect(result.error).toBeInstanceOf(UnauthorizedException);
    }
  });
});

describe('mapMicrosoftProfile', () => {
  it('maps Entra app roles that match app roles', () => {
    const user = mapMicrosoftProfile({
      oid: 'user-oid',
      sub: 'sub',
      roles: [AppUserRole.ADMIN, 'unknown-role'],
    });

    expect(user.userRoles).toEqual([{ role: { name: AppUserRole.ADMIN } }]);
  });

  it('defaults to the user role when the token has no app roles', () => {
    const user = mapMicrosoftProfile({ oid: 'user-oid', sub: 'sub' });

    expect(user.userRoles).toEqual([{ role: { name: AppUserRole.USER } }]);
  });

  it('falls back to sub when oid is missing', () => {
    const user = mapMicrosoftProfile({ sub: 'sub-only' });

    expect(user.id).toBe('sub-only');
  });

  it('prefers preferred_username over email and upn', () => {
    const user = mapMicrosoftProfile({
      oid: 'user-oid',
      preferred_username: 'preferred@company.com',
      email: 'email@company.com',
      upn: 'upn@company.com',
    });

    expect(user.email).toBe('preferred@company.com');
  });

  it('throws when the token has neither oid nor sub', () => {
    expect(() => mapMicrosoftProfile({})).toThrow();
  });
});
