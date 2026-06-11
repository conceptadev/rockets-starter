import {
  type AccountInfo,
  type IPublicClientApplication,
  createStandardPublicClientApplication,
} from "@azure/msal-browser";

const LOGIN_SCOPES = ["openid", "profile", "email"];

let msalInstance: IPublicClientApplication | undefined;

export async function getMsal(): Promise<IPublicClientApplication> {
  msalInstance ??= await createStandardPublicClientApplication({
    auth: {
      clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID!,
      authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID}`,
      redirectUri: typeof window === "undefined" ? "/" : window.location.origin,
    },
    cache: { cacheLocation: "localStorage" },
  });

  return msalInstance;
}

export function getActiveAccount(msal: IPublicClientApplication): AccountInfo | null {
  return msal.getActiveAccount() ?? msal.getAllAccounts()[0] ?? null;
}

// Processes the redirect response (if we just came back from Entra ID) and
// returns the signed-in account, if any. Safe to call on every page load.
export async function initAuth(): Promise<AccountInfo | null> {
  const msal = await getMsal();
  const result = await msal.handleRedirectPromise();

  if (result) {
    msal.setActiveAccount(result.account);
    return result.account;
  }

  return getActiveAccount(msal);
}

export async function signIn(): Promise<void> {
  const msal = await getMsal();
  await msal.loginRedirect({ scopes: LOGIN_SCOPES });
}

export async function signOut(): Promise<void> {
  const msal = await getMsal();
  const account = getActiveAccount(msal);
  await msal.logoutRedirect({
    ...(account ? { account } : {}),
    postLogoutRedirectUri: `${window.location.origin}/login`,
  });
}

// The API verifies the Entra ID token (aud = client id), so that is what we
// send as the Bearer token — not the Graph access token.
export async function getIdToken(): Promise<string | null> {
  const msal = await getMsal();
  const account = getActiveAccount(msal);

  if (!account) {
    return null;
  }

  const result = await msal.acquireTokenSilent({
    scopes: LOGIN_SCOPES,
    account,
    forceRefresh: account.idTokenClaims?.exp
      ? account.idTokenClaims.exp * 1000 < Date.now()
      : false,
  });

  return result.idToken;
}
