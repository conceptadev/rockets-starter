import {
  BrowserAuthErrorCodes,
  type AccountInfo,
  type IPublicClientApplication,
  createStandardPublicClientApplication,
} from "@azure/msal-browser";

const LOGIN_SCOPES = ["openid", "profile", "email"];

let msalInstance: IPublicClientApplication | undefined;
let redirectPromise: Promise<AccountInfo | null> | undefined;

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
  if (redirectPromise) {
    return redirectPromise;
  }

  redirectPromise = handleRedirect();

  try {
    return await redirectPromise;
  } finally {
    redirectPromise = undefined;
  }
}

async function handleRedirect(): Promise<AccountInfo | null> {
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
  const account = await initAuth();

  if (account) {
    return;
  }

  const msal = await getMsal();

  try {
    await msal.loginRedirect({ scopes: LOGIN_SCOPES });
  } catch (error) {
    if (isMsalError(error, BrowserAuthErrorCodes.interactionInProgress)) {
      return;
    }

    throw error;
  }
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

  try {
    const result = await msal.acquireTokenSilent({
      scopes: LOGIN_SCOPES,
      account,
      forceRefresh: account.idTokenClaims?.exp
        ? account.idTokenClaims.exp * 1000 < Date.now()
        : false,
    });

    return result.idToken;
  } catch (error) {
    // Silent renewal can time out (e.g. blocked third-party cookies on the
    // hidden iframe, or a slow/misconfigured authority). Degrade gracefully:
    // return null so the request proceeds tokenless. A guarded API will answer
    // 401 (meaning "log in"); a dev API with the guard off still loads.
    console.warn("getIdToken: silent token acquisition failed", error);
    return null;
  }
}

function isMsalError(error: unknown, code: string): boolean {
  return (
    error !== null &&
    typeof error === "object" &&
    "errorCode" in error &&
    (error as { errorCode?: unknown }).errorCode === code
  );
}
