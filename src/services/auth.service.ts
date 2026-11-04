// Auth API calls: login, register, logout.
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/auth";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { clearToken, setToken } from "@/lib/auth-token";
import { get, post } from "./api";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await post<AuthResponse>(API_ENDPOINTS.login, data);
  setToken(response?.data?.accessToken, response?.data?.expiresIn);
  return response;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await post<AuthResponse>(API_ENDPOINTS.register, data);
  if (response?.data?.accessToken) setToken(response.data.accessToken, response.data.expiresIn);
  return response;
}

export async function logout(): Promise<void> {
  clearToken();
}

export async function getCurrentUser(): Promise<User> {
  return get<User>(API_ENDPOINTS.me);
}
