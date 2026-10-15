import axios from "axios";
import { env } from "../config";

// The API authenticates with bearer tokens, not cookies, so credentials stay off.
// Sending them would also be rejected by the backend's wildcard CORS origin.
export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000,
});

let accessToken: string | null = null;
let handleUnauthorized: (() => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  handleUnauthorized = handler;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 on an authenticated request means the session is no longer valid.
    if (axios.isAxiosError(error) && error.response?.status === 401 && accessToken) {
      handleUnauthorized?.();
    }

    return Promise.reject(error);
  },
);

export default api;
