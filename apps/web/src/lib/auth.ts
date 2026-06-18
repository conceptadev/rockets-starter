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

// Processes the redirect response from Entra ID. Call this ONLY on the
// redirect URI page (the root page) — calling handleRedirectPromise on other
// pages lets MSAL trigger full-page navigations that fight the Next router.
export async function initAuth(): Promise<AccountInfo | null> {
  const msal = await getMsal();
  const result = await msal.handleRedirectPromise({
    navigateToLoginRequestUrl: false,
  });

  if (result) {
    msal.setActiveAccount(result.account);
    return result.account;
  }

  return getActiveAccount(msal);
}

// Cheap account lookup for auth guards on regular pages.
export async function getAccount(): Promise<AccountInfo | null> {
  const msal = await getMsal();
  return getActiveAccount(msal);
}

export async function signIn(): Promise<void> {
  const msal = await getMsal();
  await msal.loginRedirect({ scopes: LOGIN_SCOPES });
}

export async function signOut(): Promise<void> {
  const msal = await getMsal();
  const account = getActiveAccount(msal);
  // Only the origin is registered as a redirect URI; the root page routes
  // signed-out visitors to /login.
  await msal.logoutRedirect({
    ...(account ? { account } : {}),
    postLogoutRedirectUri: window.location.origin,
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
