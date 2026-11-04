// Base API helper. Every other service uses this to talk to the backend.
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { clearToken, getToken } from "@/lib/auth-token";

// NEXT_PUBLIC_ prefix is required for the value to be available in the browser.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Error thrown by every helper below, so callers only need to handle one shape.
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

// Common headers for every request. Content-Type is left to axios so JSON
// bodies get application/json and FormData gets multipart/form-data.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    // Token is missing/expired: drop it so proxy.ts sends the user back to login.
    if (status === 401) clearToken();

    // NestJS returns validation errors as an array of messages.
    const serverMessage = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
    const message =
      serverMessage ||
      (status === 0 ? "Unable to reach the server. Please try again." : error.message);

    return Promise.reject(new ApiError(message, status, data));
  },
);

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<T>(url, body, config);
  return response.data;
}

export async function put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<T>(url, body, config);
  return response.data;
}

export async function patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.patch<T>(url, body, config);
  return response.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}
