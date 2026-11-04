// Saves the auth token in a cookie so both the browser (API calls) and proxy.ts (route guard) can read it.
export const TOKEN_COOKIE = "token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TOKEN_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

// expiresIn (seconds) comes from the backend; the cookie expires with the token, so the user is signed out when it does.
export function setToken(token: string, expiresIn?: number): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const maxAge = expiresIn && expiresIn > 0 ? Math.floor(expiresIn) : TOKEN_MAX_AGE;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function clearToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
