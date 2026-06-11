import { Inject, Injectable } from '@nestjs/common';
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';
import { MICROSOFT_AUTH_SETTINGS_TOKEN } from './microsoft-auth.constants';
import type { MicrosoftAuthSettings } from './microsoft-auth.settings';

@Injectable()
export class MicrosoftTokenVerifierService {
  private jwks?: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    @Inject(MICROSOFT_AUTH_SETTINGS_TOKEN)
    private readonly settings: MicrosoftAuthSettings,
  ) {}

  isMicrosoftToken(token: string): boolean {
    try {
      return decodeJwt(token).iss === this.settings.issuer;
    } catch {
      return false;
    }
  }

  async verify(token: string): Promise<JWTPayload> {
    this.jwks ??= createRemoteJWKSet(new URL(this.settings.jwksUri));

    const { payload } = await jwtVerify(token, this.jwks, {
      issuer: this.settings.issuer,
      audience: this.settings.audience,
    });

    return payload;
  }
}
