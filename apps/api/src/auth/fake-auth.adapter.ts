import { Injectable } from '@nestjs/common';
import type {
  AuthAdapterInterface,
  AuthAttemptResult,
  AuthRequest,
} from '@bitwild/rockets';
import { FAKE_AUTH_USER } from './fake-auth.constants';

@Injectable()
export class FakeAuthAdapter implements AuthAdapterInterface {
  async authenticate(_request: AuthRequest): Promise<AuthAttemptResult> {
    return { matched: true, user: FAKE_AUTH_USER };
  }
}
