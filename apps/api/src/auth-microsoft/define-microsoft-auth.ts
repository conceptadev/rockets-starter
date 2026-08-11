import type { AuthBootstrap } from '@concepta/rockets';
import { MICROSOFT_AUTH_SETTINGS_TOKEN } from './microsoft-auth.constants';
import { microsoftAuthSettingsFactory } from './microsoft-auth.settings';
import { MicrosoftAuthAdapter } from './microsoft-auth.adapter';
import { MicrosoftTokenVerifierService } from './microsoft-token-verifier.service';

export function defineMicrosoftAuth(): AuthBootstrap<MicrosoftAuthAdapter> {
  return {
    adapter: MicrosoftAuthAdapter,
    forRoot: () => ({
      module: class MicrosoftAuthHostModule {},
      providers: [
        {
          provide: MICROSOFT_AUTH_SETTINGS_TOKEN,
          useFactory: microsoftAuthSettingsFactory,
        },
        MicrosoftTokenVerifierService,
        MicrosoftAuthAdapter,
      ],
      exports: [MicrosoftAuthAdapter],
    }),
  };
}
