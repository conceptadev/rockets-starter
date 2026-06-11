import { MICROSOFT_LOGIN_BASE_URL } from './microsoft-auth.constants';

export interface MicrosoftAuthSettings {
  tenantId: string;
  clientId: string;
  issuer: string;
  jwksUri: string;
  audience: string[];
}

export function microsoftAuthSettingsFactory(): MicrosoftAuthSettings {
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID;

  if (!tenantId || !clientId) {
    throw new Error(
      'Microsoft auth is enabled but MICROSOFT_TENANT_ID and/or MICROSOFT_CLIENT_ID are not set',
    );
  }

  return {
    tenantId,
    clientId,
    issuer: `${MICROSOFT_LOGIN_BASE_URL}/${tenantId}/v2.0`,
    jwksUri: `${MICROSOFT_LOGIN_BASE_URL}/${tenantId}/discovery/v2.0/keys`,
    // v2.0 tokens carry the client id GUID as `aud`; access tokens for an
    // exposed API may carry the `api://` Application ID URI instead
    audience: [clientId, `api://${clientId}`],
  };
}
