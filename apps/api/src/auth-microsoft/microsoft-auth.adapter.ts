import { Injectable, UnauthorizedException } from '@nestjs/common';
import { extractBearerToken } from '@concepta/rockets';
import type {
  AuthAdapterInterface,
  AuthAttemptResult,
  AuthRequest,
} from '@concepta/rockets';
import { mapMicrosoftProfile } from './microsoft-profile.mapper';
import { MicrosoftTokenVerifierService } from './microsoft-token-verifier.service';

@Injectable()
export class MicrosoftAuthAdapter implements AuthAdapterInterface {
  constructor(private readonly verifier: MicrosoftTokenVerifierService) {}

  async authenticate(request: AuthRequest): Promise<AuthAttemptResult> {
    const token = extractBearerToken(request);

    if (!token || !this.verifier.isMicrosoftToken(token)) {
      return { matched: false };
    }

    try {
      const payload = await this.verifier.verify(token);
      return { matched: true, user: mapMicrosoftProfile(payload) };
    } catch {
      return {
        matched: true,
        error: new UnauthorizedException('Invalid Microsoft token'),
      };
    }
  }
}
