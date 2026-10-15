import api from "../../../lib/axios";
import type { ApiResponse } from "../../../lib/api-response";
import type { AuthResponse, LoginCredentials, RegisterDetails } from "../types";

export async function loginRequest(credentials: LoginCredentials) {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
  return response.data.data;
}

export async function registerRequest(details: RegisterDetails) {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", details);
  return response.data.data;
}
