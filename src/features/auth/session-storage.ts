import type { AuthResponse, AuthSession } from "./types";

const STORAGE_KEY = "document-assistant.session";

export function createSession({ accessToken, expiresIn, user }: AuthResponse): AuthSession {
  return {
    accessToken,
    expiresAt: Date.now() + expiresIn * 1000,
    user,
  };
}

export function isSessionExpired(session: AuthSession) {
  return session.expiresAt <= Date.now();
}

export function readStoredSession(): AuthSession | null {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    const session = JSON.parse(storedValue) as AuthSession;
    return isSessionExpired(session) ? null : session;
  } catch {
    // Storage can be unavailable (private mode) or hold malformed data.
    return null;
  }
}

export function storeSession(session: AuthSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // The session still works in memory for this tab.
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up.
  }
}
