import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { setAccessToken, setUnauthorizedHandler } from "../../lib/axios";
import { loginRequest, registerRequest } from "../../features/auth/api/auth.api";
import {
  clearStoredSession,
  createSession,
  readStoredSession,
  storeSession,
} from "../../features/auth/session-storage";
import type { AuthResponse, AuthSession, LoginCredentials, RegisterDetails } from "../../features/auth/types";
import { AuthContext, type AuthContextValue } from "./auth-context";

const MAX_TIMEOUT_MS = 2_147_483_647;

// Runs once, before any child renders, so the very first API request already carries the token.
function restoreSession() {
  const session = readStoredSession();
  setAccessToken(session?.accessToken ?? null);
  return session;
}

function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(restoreSession);

  const startSession = useCallback((response: AuthResponse) => {
    const newSession = createSession(response);
    setAccessToken(newSession.accessToken);
    storeSession(newSession);
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    clearStoredSession();
    setSession(null);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => startSession(await loginRequest(credentials)),
    [startSession],
  );

  const register = useCallback(
    async (details: RegisterDetails) => startSession(await registerRequest(details)),
    [startSession],
  );

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Sign out automatically when the token expires while the app is open.
  useEffect(() => {
    if (!session) {
      return;
    }

    // Longer delays overflow setTimeout and fire at once; the 401 handler covers those sessions.
    const msUntilExpiry = session.expiresAt - Date.now();
    if (msUntilExpiry > MAX_TIMEOUT_MS) {
      return;
    }

    const timeoutId = window.setTimeout(logout, msUntilExpiry);
    return () => window.clearTimeout(timeoutId);
  }, [session, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      login,
      register,
      logout,
    }),
    [session, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
