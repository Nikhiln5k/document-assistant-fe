// Shapes of the auth data we send to and receive from the backend.
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  c_at: string;
  u_at: string;
}

// Matches the fields collected by LoginForm.
export interface LoginRequest {
  username: string;
  password: string;
}

// Matches the fields collected by RegisterForm.
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  data: {
    accessToken: string;
    user: User;
  };
  message: string;
}
