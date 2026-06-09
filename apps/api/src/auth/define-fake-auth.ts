import type { AuthBootstrap } from '@bitwild/rockets';
import { FakeAuthAdapter } from './fake-auth.adapter';

export function defineFakeAuth(): AuthBootstrap<FakeAuthAdapter> {
  return {
    adapter: FakeAuthAdapter,
    forRoot: () => ({
      module: class FakeAuthHostModule {},
      providers: [FakeAuthAdapter],
      exports: [FakeAuthAdapter],
    }),
  };
}
