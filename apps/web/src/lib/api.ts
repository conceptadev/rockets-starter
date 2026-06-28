import { getIdToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let token: string | null;

  try {
    token = await getIdToken();
  } catch (error) {
    throw new Error(authErrorMessage(error));
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

function authErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const code =
    error && typeof error === "object" && "errorCode" in error
      ? String((error as { errorCode?: unknown }).errorCode)
      : "";

  if (code === "timed_out" || message.includes("timed_out")) {
    return "Authentication timed out. Refresh the page and try again.";
  }

  if (code === "interaction_in_progress" || message.includes("interaction_in_progress")) {
    return "Authentication is already in progress. Complete the current sign-in flow or refresh the page.";
  }

  return message;
}
