export interface User {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterDetails extends LoginCredentials {
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  /** Seconds until the access token expires. */
  expiresIn: number;
  user: User;
}

export interface AuthSession {
  accessToken: string;
  /** Unix timestamp in milliseconds. */
  expiresAt: number;
  user: User;
}
